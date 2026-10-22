# MinervaCore Auth Worker

Worker do Cloudflare que faz a única parte do login via GitHub que não pode rodar no
navegador: trocar o `code` do OAuth por um `access_token`, usando o `client_secret`
do GitHub App.

O site continua 100% estático no GitHub Pages. Este Worker não guarda nada, não tem
banco e não sabe quem é o usuário — ele só repassa a chamada para o GitHub com o
segredo anexado, e só aceita requisições vindas das origens configuradas.

```
minervacore.dev/editor  ──(1) redirect──>  github.com/login/oauth/authorize
                        <──(2) ?code=...──
                        ──(3) POST /exchange {code}──>  este Worker
                                                        ──(4) code + secret──> github.com
                        <──(5) access_token────────────
```

## Setup

### 1. Criar o GitHub App

Em `https://github.com/organizations/MinervaBots/settings/apps/new`:

| Campo | Valor |
|---|---|
| GitHub App name | `MinervaCore Editor` |
| Homepage URL | `https://minervacore.dev` |
| Callback URL | `https://minervacore.dev/editor` |
| Callback URL (2ª linha) | `http://localhost:3000/editor` |
| Expire user authorization tokens | ✅ marcado |
| Request user authorization (OAuth) during installation | ✅ marcado |
| Webhook > Active | ❌ desmarcado |

**Permissions > Repository permissions:**

- `Contents`: Read and write
- `Pull requests`: Read and write
- `Metadata`: Read-only (vem junto automaticamente)

**Where can this GitHub App be installed?** → *Only on this account*

Depois de criar: gere um **Client secret** e anote junto com o **Client ID**.

### 2. Instalar o App no repositório

Na página do App → *Install App* → organização MinervaBots → **Only select
repositories** → `MinervaCore`.

Sem esse passo o token sai válido mas sem acesso nenhum ao repositório.

### 3. Subir o Worker

```bash
cd auth-worker
npm install
npx wrangler login
```

Preencha `GH_CLIENT_ID` no `wrangler.toml`, depois:

```bash
npx wrangler secret put GH_CLIENT_SECRET   # cola o secret quando pedir
npx wrangler deploy
```

O deploy imprime a URL final (`https://minervacore-auth.<subdominio>.workers.dev`).
Para usar um domínio próprio (`auth.minervacore.dev`), o DNS do `minervacore.dev`
precisa estar na Cloudflare; aí é só adicionar uma rota no painel do Worker.

Teste rápido:

```bash
curl https://minervacore-auth.<subdominio>.workers.dev/health
```

Deve responder `{"ok":true,"configured":true}`.

### 4. Configurar o site

Em *Settings > Secrets and variables > Actions > Variables* do repositório
MinervaCore (aba **Variables**, não Secrets — nenhum dos dois é segredo):

- `GH_OAUTH_CLIENT_ID` = Client ID do App
- `AUTH_WORKER_URL` = URL do Worker, sem barra no final

## Desenvolvimento local

```bash
# terminal 1
cd auth-worker
cp .dev.vars.example .dev.vars   # e preencha o secret
npx wrangler dev                 # sobe em http://localhost:8787

# terminal 2
cd minervacore
GH_OAUTH_CLIENT_ID=Iv1.xxxx AUTH_WORKER_URL=http://localhost:8787 npm start
```

No Windows (PowerShell), use `$env:GH_OAUTH_CLIENT_ID="Iv1.xxxx"` antes do `npm start`.

`http://localhost:3000` já está em `ALLOWED_ORIGINS`. Se o site subir em outra porta,
ajuste a variável no `wrangler.toml`.

## Notas de segurança

- O `client_secret` só existe como secret do Worker. Nunca vai para o bundle do site.
- `ALLOWED_ORIGINS` limita quem consegue chamar `/exchange` e `/refresh`. Mantenha
  a lista curta.
- O `access_token` chega ao navegador e fica no storage — inerente a um editor
  client-side. O que reduz o risco é ele expirar em 8h e valer só para o
  MinervaCore, ao contrário do PAT com escopo `repo` do login antigo.
- Endurecimento futuro possível: guardar o refresh token num cookie `HttpOnly`
  emitido pelo Worker. Exige o Worker num subdomínio de `minervacore.dev`.
