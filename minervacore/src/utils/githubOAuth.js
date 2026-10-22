// Login via GitHub (OAuth Web Flow de um GitHub App)
//
// Fluxo:
//   1. beginLogin()    -> manda o usuário para o GitHub autorizar
//   2. GitHub volta para /editor?code=...&state=...
//   3. completeLogin() -> valida o state e pede o token ao Worker
//
// O client_secret nunca aparece aqui: quem faz a troca é o auth-worker.

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

const SESSION_KEY = 'mc_gh_session';        // sessão OAuth (JSON)
const LEGACY_TOKEN_KEY = 'mc_gh_token';     // token PAT do login antigo
const STATE_KEY = 'mc_oauth_state';         // proteção CSRF
const REMEMBER_KEY = 'mc_oauth_remember';   // preferência antes do redirect

// Renova o token 5 min antes de expirar, para não estourar no meio de uma edição
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

// ============================================================================
// Helpers
// ============================================================================

function randomState() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// A URL de retorno é a própria página do editor (sem query string)
export function getRedirectUri() {
    return `${window.location.origin}${window.location.pathname}`;
}

function toSession(data) {
    const now = Date.now();
    return {
        kind: 'oauth',
        accessToken: data.access_token,
        refreshToken: data.refresh_token || null,
        expiresAt: data.expires_in ? now + data.expires_in * 1000 : null,
        refreshExpiresAt: data.refresh_token_expires_in ? now + data.refresh_token_expires_in * 1000 : null,
    };
}

async function callWorker(workerUrl, path, payload) {
    if (!workerUrl) {
        throw new Error('Serviço de autenticação não configurado neste ambiente.');
    }

    let res;
    try {
        res = await fetch(`${workerUrl.replace(/\/$/, '')}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        throw new Error('Não foi possível falar com o serviço de autenticação. Tente o login por token.');
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || `Falha na autenticação (${res.status}).`);
    }

    return toSession(data);
}

// ============================================================================
// Armazenamento da sessão
// ============================================================================

export function saveSession(session, remember) {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    store.setItem(SESSION_KEY, JSON.stringify(session));
    other.removeItem(SESSION_KEY);
}

export function loadSession() {
    // Sessão OAuth tem prioridade
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

    if (raw) {
        try {
            const session = JSON.parse(raw);
            if (session?.accessToken) return session;
        } catch (e) {
            // JSON corrompido: ignora e cai no fluxo de login
        }
    }

    // Compatibilidade com quem já estava logado pelo token pessoal
    const legacy = localStorage.getItem(LEGACY_TOKEN_KEY) || sessionStorage.getItem(LEGACY_TOKEN_KEY);
    if (legacy) return { kind: 'pat', accessToken: legacy, refreshToken: null, expiresAt: null };

    return null;
}

export function clearSession() {
    [localStorage, sessionStorage].forEach((store) => {
        store.removeItem(SESSION_KEY);
        store.removeItem(LEGACY_TOKEN_KEY);
    });
}

function isRemembered() {
    return Boolean(localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY));
}

// ============================================================================
// Fluxo de login
// ============================================================================

export function beginLogin({ clientId, remember }) {
    if (!clientId) {
        throw new Error('Login via GitHub não está configurado neste ambiente.');
    }

    const state = randomState();
    sessionStorage.setItem(STATE_KEY, state);
    sessionStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: getRedirectUri(),
        state,
    });

    window.location.assign(`${AUTHORIZE_URL}?${params.toString()}`);
}

// Detecta se a página foi aberta como retorno do GitHub
export function hasCallbackParams() {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.has('code') || params.has('error');
}

export async function completeLogin({ workerUrl }) {
    const params = new URLSearchParams(window.location.search);

    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');

    const expectedState = sessionStorage.getItem(STATE_KEY);
    const remember = sessionStorage.getItem(REMEMBER_KEY) === '1';

    sessionStorage.removeItem(STATE_KEY);
    sessionStorage.removeItem(REMEMBER_KEY);

    // Limpa ?code=... da barra de endereços para não deixar rastro no histórico
    window.history.replaceState({}, '', window.location.pathname);

    if (error) {
        throw new Error(params.get('error_description') || 'Autorização cancelada no GitHub.');
    }

    if (!code) {
        throw new Error('O GitHub não devolveu o código de autorização.');
    }

    if (!state || state !== expectedState) {
        throw new Error('Falha na verificação de segurança do login. Tente novamente.');
    }

    const session = await callWorker(workerUrl, '/exchange', {
        code,
        redirect_uri: getRedirectUri(),
    });

    saveSession(session, remember);
    return session;
}

// Renova a sessão se estiver perto de expirar. Devolve a sessão válida
// (a mesma, se ainda der) ou lança se não houver como renovar.
export async function ensureFreshSession({ workerUrl, session }) {
    if (!session || session.kind !== 'oauth' || !session.expiresAt) return session;

    if (Date.now() < session.expiresAt - REFRESH_MARGIN_MS) return session;

    if (!session.refreshToken || (session.refreshExpiresAt && Date.now() >= session.refreshExpiresAt)) {
        throw new Error('Sua sessão expirou. Entre novamente.');
    }

    const renewed = await callWorker(workerUrl, '/refresh', { refresh_token: session.refreshToken });

    // Mantém o refresh token antigo se o GitHub não mandar um novo
    const merged = { ...renewed, refreshToken: renewed.refreshToken || session.refreshToken };
    saveSession(merged, isRemembered());

    return merged;
}

// Quanto falta para a renovação (ms), ou null se não há o que agendar
export function msUntilRefresh(session) {
    if (!session || session.kind !== 'oauth' || !session.expiresAt || !session.refreshToken) return null;
    return Math.max(0, session.expiresAt - REFRESH_MARGIN_MS - Date.now());
}

// ============================================================================
// Verificação de permissão no repositório
// ============================================================================

// Vale para os dois tipos de token (OAuth e PAT): o campo `permissions` do
// repositório reflete o acesso efetivo de quem fez a chamada.
export async function verifyRepoAccess(token) {
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
    };

    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) {
        throw new Error('Token inválido ou expirado.');
    }
    const user = await userRes.json();

    const repoRes = await fetch('https://api.github.com/repos/MinervaBots/MinervaCore', { headers });
    if (!repoRes.ok) {
        throw new Error('Autenticado, mas sem acesso ao repositório MinervaCore. Peça acesso à coordenação de programação.');
    }
    const repo = await repoRes.json();

    if (!repo.permissions?.push) {
        throw new Error('Você tem apenas permissão de LEITURA no repositório. Peça acesso de escrita à coordenação de programação.');
    }

    return { login: user.login, name: user.name, avatarUrl: user.avatar_url };
}
