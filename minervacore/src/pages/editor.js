// Arquivo principal da página de editor
// Login via GitHub (OAuth) com fallback para senha da equipe + token pessoal

import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Importando componentes modularizados
import DashboardMenu from '../components/editor/DashboardMenu';
import HomeEditor from '../components/editor/HomeEditor';
import TopicEditor from '../components/editor/TopicEditor';
import PageEditor from '../components/editor/PageEditor';
import { Icons, RawIcons } from '../components/Icons';

import {
    beginLogin,
    completeLogin,
    hasCallbackParams,
    loadSession,
    saveSession,
    clearSession,
    ensureFreshSession,
    msUntilRefresh,
    verifyRepoAccess,
} from '../utils/githubOAuth';

const GitHubMark = () => (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
);

const LoginScreen = ({ onLogin, adminPass, clientId, workerUrl, initialError }) => {
    const [pass, setPass] = useState('');
    const [token, setToken] = useState('');
    const [remember, setRemember] = useState(false); // Estado para lembrar o login
    const [error, setError] = useState(initialError || '');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showFallback, setShowFallback] = useState(false); // Login antigo, escondido por padrão

    const oauthEnabled = Boolean(clientId && workerUrl);

    // URL para gerar um novo token no GitHub já preenchido com as permissões necessárias
    const generateTokenUrl = "https://github.com/settings/tokens/new?description=MinervaCore+Editor+Access&scopes=repo";

    // Redireciona para o GitHub. A volta é tratada no componente Editor.
    const handleGitHubLogin = () => {
        setError('');
        try {
            beginLogin({ clientId, remember });
        } catch (e) {
            setError(e.message);
        }
    };

    // Login antigo: senha da equipe + token pessoal
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validação da senha
        if (pass !== adminPass) {
            setError('Senha da equipe incorreta.');
            setLoading(false);
            return;
        }

        // Validação básica de formato do token
        if (!token || token.length < 10) {
            setError('O Token parece inválido ou está vazio.');
            setLoading(false);
            return;
        }

        try {
            // Verifica a identidade e permissão no GitHub
            const user = await verifyRepoAccess(token);

            // Se passar por aqui sem erro, o cara é brabo. Pode entrar.
            onLogin({ kind: 'pat', accessToken: token, refreshToken: null, expiresAt: null }, remember, user);
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    // Fica junto do botão principal quando o OAuth está ligado, e dentro do
    // formulário quando não está — nos dois casos colado na ação que ele afeta.
    const rememberRow = (
        <label className="login-remember">
            <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
            />
            Manter-me conectado neste navegador
        </label>
    );

    return (
        <div className="login-shell">
            <div className="card shadow--lg login-card">

                {/* Cabeçalho */}
                <div className="text--center margin-bottom--lg">
                    <img
                        src={useBaseUrl('img/minervacore-logo-transp.png')}
                        alt="Logo"
                        width="100"
                        style={{marginBottom: '1rem'}}
                    />
                    <h1 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Acesso Restrito</h1>
                    <p style={{opacity: 0.7, fontSize: '0.9rem'}}>Autenticação de Membros MinervaBots</p>
                </div>

                {/* Erros (vale para os dois métodos de login) */}
                {error && (
                    <div className="alert alert--danger margin-bottom--md" role="alert">
                        {error}
                    </div>
                )}

                {/* Login via GitHub (principal) */}
                {oauthEnabled && (
                    <>
                        <button
                            type="button"
                            onClick={handleGitHubLogin}
                            className="button button--primary button--block button--lg"
                            style={{
                                fontWeight: 'bold', letterSpacing: '0.5px', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}
                        >
                            <GitHubMark />
                            ENTRAR COM GITHUB
                        </button>

                        <small style={{fontSize: '0.75rem', opacity: 0.6, marginTop: '10px', display: 'block', textAlign: 'center'}}>
                            Você será redirecionado ao GitHub
                        </small>

                        {rememberRow}

                        <div className="login-divider"><span>ou</span></div>

                        <button
                            type="button"
                            onClick={() => setShowFallback(!showFallback)}
                            className="button button--link button--block button--sm"
                            style={{opacity: 0.7}}
                        >
                            {showFallback ? 'Ocultar login por token' : 'Entrar com token pessoal'}
                        </button>
                    </>
                )}

                {/* Login antigo: senha da equipe + Personal Access Token */}
                {(!oauthEnabled || showFallback) && (
                    <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                        className={oauthEnabled ? 'margin-top--md login-reveal' : 'margin-top--md'}
                    >

                        <div className="margin-bottom--md">
                            <label htmlFor="mc_access_key_field" style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>
                                Senha da Equipe
                            </label>
                            <div style={{position: 'relative'}}>
                                <input
                                    id="mc_access_key_field"
                                    name="mc_access_key_no_autofill"
                                    type={showPass ? "text" : "password"}
                                    className="button button--block button--outline button--secondary"
                                    style={{textAlign: 'left', cursor: 'text', paddingRight: '45px'}}
                                    placeholder="••••••••"
                                    value={pass}
                                    onChange={e => setPass(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.6)',
                                        padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ifm-color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                                    title={showPass ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPass ? (
                                        // Ícone: Olho fechado
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        // Ícone: Olho aberto
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Token do GitHub */}
                        <div className="margin-bottom--md">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                                <label htmlFor="mc_gh_token_field" style={{fontWeight: 'bold'}}>GitHub Personal Token</label>
                                <a href={generateTokenUrl} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    Gerar Token {Icons.externalLink}
                                </a>
                            </div>

                            <input
                                id="mc_gh_token_field"
                                name="mc_gh_token_no_autofill"
                                type="password"
                                className="button button--block button--outline button--secondary"
                                style={{textAlign: 'left', cursor: 'text', fontFamily: 'monospace'}}
                                placeholder="ghp_..."
                                value={token}
                                onChange={e => setToken(e.target.value)}
                                autoComplete="new-password"
                            />
                            <small style={{fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', display: 'block'}}>
                                Verificaremos sua permissão na organização da equipe.
                            </small>
                        </div>

                        {/* Sem OAuth, este formulário é o login principal e carrega o "manter conectado" */}
                        {!oauthEnabled && (
                            <div className="margin-bottom--md">{rememberRow}</div>
                        )}

                        {/* Botão de Ação */}
                        <button
                            type="submit"
                            className={`button button--block button--lg ${oauthEnabled ? 'button--secondary button--outline' : 'button--primary'}`}
                            style={{fontWeight: 'bold', letterSpacing: '0.5px', marginTop: oauthEnabled ? '0.5rem' : 0}}
                            disabled={loading}
                        >
                            {loading ? 'Verificando GitHub...' : 'ACESSAR PAINEL'}
                        </button>

                    </form>
                )}

                <div className="text--center margin-top--lg" style={{opacity: 0.5, fontSize: '0.8rem'}}>
                    MinervaBots &copy; {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

export default function Editor() {
    const { siteConfig } = useDocusaurusContext();
    const ADMIN_PASS = siteConfig.customFields?.adminPass || '';
    const CLIENT_ID = siteConfig.customFields?.githubClientId || '';
    const WORKER_URL = siteConfig.customFields?.authWorkerUrl || '';

    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('menu');
    const [isChecking, setIsChecking] = useState(true);
    const [authError, setAuthError] = useState('');

    const refreshTimer = useRef(null);
    const userToken = session?.accessToken || '';

    // Ao abrir a página: ou estamos voltando do GitHub, ou já existe sessão salva
    useEffect(() => {
        let cancelled = false;

        const boot = async () => {
            try {
                if (hasCallbackParams()) {
                    // Retorno do GitHub: troca o code por token no Worker
                    const fresh = await completeLogin({ workerUrl: WORKER_URL });
                    const profile = await verifyRepoAccess(fresh.accessToken);

                    if (!cancelled) {
                        setSession(fresh);
                        setUser(profile);
                    }
                } else {
                    const stored = loadSession();

                    if (stored) {
                        // Renova se estiver perto de expirar e confere se o token ainda vale
                        const valid = await ensureFreshSession({ workerUrl: WORKER_URL, session: stored });
                        const profile = await verifyRepoAccess(valid.accessToken);

                        if (!cancelled) {
                            setSession(valid);
                            setUser(profile);
                        }
                    }
                }
            } catch (e) {
                // Qualquer falha aqui derruba a sessão e volta para o login com o motivo
                clearSession();
                if (!cancelled) {
                    setSession(null);
                    setUser(null);
                    setAuthError(e.message);
                }
            } finally {
                if (!cancelled) setIsChecking(false);
            }
        };

        boot();
        return () => { cancelled = true; };
    }, [WORKER_URL]);

    // Agenda a renovação do token para não expirar no meio de uma edição
    useEffect(() => {
        if (refreshTimer.current) clearTimeout(refreshTimer.current);

        const delay = msUntilRefresh(session);
        if (delay === null) return undefined;

        refreshTimer.current = setTimeout(async () => {
            try {
                const renewed = await ensureFreshSession({ workerUrl: WORKER_URL, session });
                setSession(renewed);
            } catch (e) {
                clearSession();
                setSession(null);
                setUser(null);
                setAuthError(e.message);
            }
        }, delay);

        return () => clearTimeout(refreshTimer.current);
    }, [session, WORKER_URL]);

    const handleLogin = (newSession, remember, profile) => {
        saveSession(newSession, remember);
        setSession(newSession);
        setUser(profile || null);
        setAuthError('');
    };

    const handleLogout = () => {
        if (confirm("Deseja realmente sair?")) {
            clearSession();
            setSession(null);
            setUser(null);
            setAuthError('');
            setCurrentView('menu');
        }
    };

    // Enquanto verifica o storage, mostra loading simples para não piscar a tela de login
    if (isChecking) {
        return (
            <Layout>
                <div className="container margin-vert--xl text--center">
                    {hasCallbackParams() ? 'Concluindo login com o GitHub...' : 'Carregando...'}
                </div>
            </Layout>
        );
    }

    // Se não tiver sessão, mostra Login
    if (!userToken) {
        return (
            <Layout title="Login Editor" noFooter>
                <LoginScreen
                    onLogin={handleLogin}
                    adminPass={ADMIN_PASS}
                    clientId={CLIENT_ID}
                    workerUrl={WORKER_URL}
                    initialError={authError}
                />
            </Layout>
        );
    }

    // Se tiver logado, mostra o Painel
    return (
        <Layout title="Editor">
            <div className="container margin-vert--md">
                {/* Barra Superior do Editor (Logout e Info) */}
                <div className="row margin-bottom--md" style={{alignItems: 'center', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px'}}>
                    <div className="col col--6" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span className="badge badge--primary">Modo Administrador</span>
                        {user && (
                            <span style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', opacity: 0.8}}>
                                {user.avatarUrl && (
                                    <img src={user.avatarUrl} alt="" width="20" height="20" style={{borderRadius: '50%'}} />
                                )}
                                @{user.login}
                            </span>
                        )}
                    </div>
                    <div className="col col--6 text--right">
                        <button className="button button--sm button--link" onClick={handleLogout} style={{color: 'var(--ifm-color-danger)'}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px', verticalAlign: 'middle'}}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Sair / Logout
                        </button>
                    </div>
                </div>

                {currentView === 'home' ? <HomeEditor userToken={userToken} onBack={() => setCurrentView('menu')} /> :
                 currentView === 'topics' ? <TopicEditor userToken={userToken} onBack={() => setCurrentView('menu')} /> :
                 currentView === 'pages' ? <PageEditor userToken={userToken} onBack={() => setCurrentView('menu')} /> :
                 <DashboardMenu onSelectOption={setCurrentView} />}
            </div>
        </Layout>
    );
}
