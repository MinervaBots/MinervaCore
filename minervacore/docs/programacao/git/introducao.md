---
sidebar_position: 0
title: 0. Conceitos Fundamentais & Configuração
---

## Conceitos básicos

Vamos entender um pouco da filosofia da ferramenta Git e o intuito de usar ela.

### O que é Versionamento?

Vamos imaginar o seguinte, estamos escrevendo um livro da equipe juntos:
- Dia 1: Eu (Fróes) escrevo o capítulo "História da MinervaBots"
- Dia 2: O Cerqueira revisa e muda o final do seu capítulo
- Dia 3: A mc olha a mudança do Cerqueira e acha ruim, então quer voltar para a versão que eu fiz

Se a gente não tiver versionamento, a gente vai ter vários arquivos, correto? Por exemplo: `livro_capitulo1`, `livro_novocapitulo1`, `livro_agoravai`, etc.
Isso tudo fica muito bagunçado.

O versionamento resolve esse problema. Ele cria versões do nosso livro no histórico do projeto, você vai poder voltar e avançar em versões.

Um exemplo que usamos, é o Google Docs, ele tem um sistema de versionamento próprio dentro do site:

![versao-google](https://imgur.com/1FPc8DN.png)

Aqui podemos ver que temos versões dentro do mesmo dia ou de outros dias em horários diferentes, tudo uma parte de escrita dentro do documento.

Mas agora, como fazemos esse estilo de versionamento com qualquer tipo de arquivo (códigos, fotos, CADs, placas, etc.)? 
A resposta é USANDO GIT! A ferramenta consegue criar versionamento em qualquer tipo de arquivo.

### O que é Git?

Bom, como falamos, o Git cria versionamento em qualquer tipo de arquivo, resumindo, o Git é a ferramenta que controla o histórico de versões dos nossos arquivos, permitindo desfazer erros e trabalhar em equipe simultaneamente.

![git](https://imgur.com/yz1S58D.png)

O Git é um ferramenta instalada no seu computador, ele funciona inclusive sem internet e é essa ferramenta que faz o controle de versão. Porém, o Git é uma ferramenta de terminal, para quem não sabe o que é, são aquelas linhas de comando do computador.
Isso acaba afastando um pouco as pessoas do uso direto da ferramenta, por ser bem complicado visualizar o que você está fazendo apenas com textos.
Mas não se preocupe, esse problema já é resolvido, existem diversas interfaces para o Git que facilitam o seu uso no dia a dia e já já falamos um pouco mais delas.

### Por que Git?

- O git torna nossa vida muito fácil e ajuda a descomplicar muitos problemas que temos ao longo do tempo. Infelizmente o processo de desenvolvimento de um software não é trivial nem algo que segue exatamente uma linha do início ao fim, ele sofre alterações, bugs, adições, etc, ao longo do tempo. E quando isso acontece com a participação de diversos times e pessoas, que estão fazendo coisas diferentes e alterações que muitas das vezes não se complementam ou não se parecem, podem surgir conflitos e problemas na hora de juntar todas as alterações a linha principal de desenvolvimento.
- O git traz facilidade a essas questões. Ele consegue tornar o ato de mesclar/ramificar muito mais simples do que seria em outras ferramentas como CVS/Subversion. A fusão( ou ramificação) são conceitos bastantes chatos e que acabam se tornando massivos para muitos. O git consegue trazer uma simplicidade a isso.

## Nuvem

O conceito de nuvem já é bem conhecido no dia a dia, é um local onde nós iremos colocar arquivos ou pastas que ficarão armazenados no servidor da empresa responsável pelo programa de nuvem que estamos usando e não em nossas memórias locais.
Um que muita gente conhece é o Google Drive que tem exatamente essa funcionalidade.

Existem alguns programas de nuvem que possuem integração com a versões do Git e eles são essenciais para trabalharmos com o versionamento que queremos, algo que não tem no Google Drive, por exemplo.

- `GitHub`: Essa é provavelmente uma das mais conhecidas, ele é um serviço de nuvem que hospeda repositórios (já vamos falar disso). O GitHub também funciona como uma "rede social" para usuários de Git e principalmente programadores. Lá existem códigos open source (que qualquer um pode editar, como o VSCode, Linux e até o próprio Git) e tem uma comunidade ativa muito forte, além de servir como portfólio para pessoas mostrarem seus projetos no mercado de trabalho.
- `GitLab`: Um pouco parecido com o GitHub, porém mais focado no trabalho em equipe, ele também é um servido de nuvem para repositórios e o que utilizamos na equipe hoje.
- Existem outros serviços de nuvens para repositórios, principalmente focados na integração de ferramentas específicas e no mundo empresarial.

!(hospedagem)[https://imgur.com/mMWjZbo.png]

## Repositórios

Repositório é o local onde guardamos o nosso projeto. Voltando ao exemplo do livro: imaginem que vocês precisam guardar o livro de vocês em um local onde sempre que vocês quiserem mexer nele, vocês só precisam ir até lá e fazer. Essa é a ideia do Repositório, é como se fosse uma pasta onde você guarda o seu projeto para controle e fazer alterações sempre que quiser.

- Existem **repositórios locais**, que é quando criamos uma pasta e guardamos o nosso projeto no nosso computador - isso é feito por meio de clonar o repositório e trazer até sua máquina. O projeto está no seu computador e as alterações que você fizer só estará lá disponível para você até que você dê um **push** para "*empurrar*" as atualizações para o repositório em Nuvem.

![image](https://imgur.com/sux3eqS.png)

-  E também existem os **repositórios da nuvem** que é quando o projeto está em uma plataforma externa (GitLab, GitHub, etc) e todas as alterações que fizermos estará disponível para todo mundo que tem acesso.

![image](https://i.imgur.com/hifLqZp.png)

## Instalação do Git

Para instalar a >>ferramenta<< do Git no seu computador, acesse este site: [Git Download](https://git-scm.com/install/windows)

- Após acessar o site, instale a última versão (A imagem é para instalação em Windows, se você usa Linux ou macOS, altere a versão de instalação)
![git-download](https://imgur.com/hIUAMId.png)

- Após clicar ali, você irá baixar um arquivo executável, abra ele no seu computador
![executavel](https://imgur.com/R3tCSad.png)

- Por fim, na janela do instalador aberta, clica em `Install`
![install](https://imgur.com/LXSoBXU.png)

> Um bônus aqui: Se você não tem nenhuma interface de Git baixada ainda, você vai precisar fazer uma configuração inicial pelo terminal, se você for usar alguma interface, é possível fazer a configuração por ela, então procure a documentação aqui no MinervaCore da interface que está usando.

### Configuração Inicial pelo Terminal
Agora que você instalou o Git, precisa se identificar. Isso é crucial porque cada alteração no código leva uma "assinatura". Se o código quebrar, precisamos saber quem fez para... pedir ajuda (e não para culpar!).

- Abra seu terminal (ou Git Bash no Windows) pelo navegador de programas
![terminal](https://imgur.com/uytsncj.png)

Rode os comandos abaixo, substituindo pelos seus dados:

#### 1. Definindo nome

```bash
git config --global user.name "Seu Nome Completo"
```

#### 2. Definindo e-mail

> Atenção: Use o mesmo e-mail da sua conta do GitHub/GitLab.

```bash
git config --global user.email "seu_email@exemplo.com"
```

#### Verificando

```bash
git config --list
```

Se der tudo certo, pronto, seu Git está configurado!
