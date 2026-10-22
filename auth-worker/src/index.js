/**
 * MinervaCore Auth Worker
 *
 * Única peça server-side do login via GitHub. Existe por um motivo só:
 * a troca do "code" por um "access_token" exige o client_secret do App,
 * que não pode viver num site estático servido pelo GitHub Pages.
 *
 * Rotas:
 *   POST /exchange  { code, redirect_uri }  -> { access_token, expires_in, refresh_token, ... }
 *   POST /refresh   { refresh_token }       -> idem
 *   GET  /health                            -> { ok: true }
 *
 * Variáveis (wrangler.toml):
 *   ALLOWED_ORIGINS  - origens permitidas, separadas por vírgula
 *   GH_CLIENT_ID     - Client ID do GitHub App (não é segredo)
 * Secret (wrangler secret put):
 *   GH_CLIENT_SECRET - Client Secret do GitHub App
 */

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

const allowedOrigins = (env) =>
  (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...(origin ? corsHeaders(origin) : {}),
    },
  });

// Chama o endpoint de token do GitHub e normaliza a resposta.
// O GitHub responde 200 mesmo em erro, com { error, error_description }.
async function requestToken(params) {
  const res = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'MinervaCore-Auth-Worker',
    },
    body: JSON.stringify(params),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.error || !data.access_token) {
    return { ok: false, error: data.error_description || data.error || 'Falha ao obter token do GitHub.' };
  }

  return { ok: true, data };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const isAllowed = allowedOrigins(env).includes(origin);

    if (url.pathname === '/health') {
      return json({ ok: true, configured: Boolean(env.GH_CLIENT_ID && env.GH_CLIENT_SECRET) }, 200, null);
    }

    // Preflight
    if (request.method === 'OPTIONS') {
      if (!isAllowed) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // O Worker só responde para o site do MinervaCore
    if (!isAllowed) {
      return json({ error: 'Origem não autorizada.' }, 403, null);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Método não permitido.' }, 405, origin);
    }

    if (!env.GH_CLIENT_ID || !env.GH_CLIENT_SECRET) {
      return json({ error: 'Worker sem credenciais do GitHub App configuradas.' }, 500, origin);
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return json({ error: 'Corpo da requisição inválido.' }, 400, origin);
    }

    if (url.pathname === '/exchange') {
      const { code, redirect_uri: redirectUri } = body;

      if (!code || typeof code !== 'string') {
        return json({ error: 'Código de autorização ausente.' }, 400, origin);
      }

      // redirect_uri é opcional para o GitHub, mas se vier tem que apontar para o próprio site
      if (redirectUri && !allowedOrigins(env).some((allowed) => redirectUri.startsWith(`${allowed}/`))) {
        return json({ error: 'redirect_uri não autorizado.' }, 400, origin);
      }

      const result = await requestToken({
        client_id: env.GH_CLIENT_ID,
        client_secret: env.GH_CLIENT_SECRET,
        code,
        ...(redirectUri ? { redirect_uri: redirectUri } : {}),
      });

      return result.ok ? json(result.data, 200, origin) : json({ error: result.error }, 400, origin);
    }

    if (url.pathname === '/refresh') {
      const { refresh_token: refreshToken } = body;

      if (!refreshToken || typeof refreshToken !== 'string') {
        return json({ error: 'Refresh token ausente.' }, 400, origin);
      }

      const result = await requestToken({
        client_id: env.GH_CLIENT_ID,
        client_secret: env.GH_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      return result.ok ? json(result.data, 200, origin) : json({ error: result.error }, 401, origin);
    }

    return json({ error: 'Rota não encontrada.' }, 404, origin);
  },
};
