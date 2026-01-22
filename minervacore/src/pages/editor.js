// Arquivo principal da página de editor
// Local onde o usuário irá preencher o token e senha para acessar as funcionalidades de edição

import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Importando componentes modularizados
import DashboardMenu from '../components/editor/DashboardMenu';
import HomeEditor from '../components/editor/HomeEditor';
import TopicEditor from '../components/editor/TopicEditor';
import PageEditor from '../components/editor/PageEditor';

const LoginScreen = ({ onLogin, adminPass }) => {
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');
  const [remember, setRemember] = useState(false); // Estado para lembrar o token
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  // URL para gerar um novo token no GitHub já preenchido com as permissões necessárias
  const generateTokenUrl = "https://github.com/settings/tokens/new?description=MinervaCore+Editor+Access&scopes=repo";

  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o reload da página pelo form
    setError('');

    if (pass !== adminPass) {
      setError('Senha da equipe incorreta.');
      return;
    }
    
    // Validação básica de formato do token
    if (!token || token.length < 10) {
      setError('O Token parece inválido ou está vazio.');
      return;
    }

    onLogin(token, remember);
  };

  return (
    <div style={{
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(158, 31, 34, 0.1) 0%, transparent 70%)' // Efeito de fundo sutil
    }}>
      <div className="card shadow--lg" style={{maxWidth: '450px', width: '100%', padding: '2rem', border: '1px solid var(--ifm-color-emphasis-200)'}}>
        
        {/* Cabeçalho */}
        <div className="text--center margin-bottom--lg">
          <img 
            src={useBaseUrl('img/minervacore-logo-transp.png')} 
            alt="Logo" 
            width="100" 
            style={{marginBottom: '1rem'}} 
          />
          <h1 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Acesso Restrito</h1>
          <p style={{opacity: 0.7, fontSize: '0.9rem'}}>Área administrativa para gestão de conteúdo</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
            
            {/* Senha da Equipe */}
            <div className="margin-bottom--md">
                <label htmlFor="team-pass" style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>
                    Senha da Equipe
                </label>
                <div style={{position: 'relative'}}>
                    <input 
                        id="mc_access_key_field"
                        name="mc_access_key_no_autofill"
                        type={showPass ? "text" : "password"} 
                        className="button button--block button--outline button--secondary" 
                        style={{textAlign: 'left', cursor: 'text', paddingRight: '40px'}}
                        placeholder="••••••••"
                        value={pass} 
                        onChange={e => setPass(e.target.value)} 
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: 0.6,
                            padding: '5px'
                        }}
                        title={showPass ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPass ? "🙈" : "👁️"}
                    </button>
                </div>
            </div>

            {/* Token do GitHub */}
            <div className="margin-bottom--md">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                    <label htmlFor="gh-token" style={{fontWeight: 'bold'}}>GitHub Personal Token</label>
                    <a href={generateTokenUrl} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.8rem', fontWeight: 'bold'}}>
                        Gerar Token ↗
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
                    Necessário permissão de <code>repo</code> para editar arquivos.
                </small>
            </div>

            <div className="margin-bottom--lg" style={{display: 'flex', alignItems: 'center'}}>
                <input 
                    type="checkbox" 
                    id="remember" 
                    checked={remember} 
                    onChange={e => setRemember(e.target.checked)}
                    style={{marginRight: '8px', cursor: 'pointer'}}
                />
                <label htmlFor="remember" style={{cursor: 'pointer', fontSize: '0.9rem'}}>
                    Manter-me conectado neste navegador
                </label>
            </div>

            {/* Erros */}
            {error && (
                <div className="alert alert--danger margin-bottom--md" role="alert">
                    {error}
                </div>
            )}

            {/* Botão de Ação */}
            <button 
                type="submit" 
                className="button button--primary button--block button--lg"
                style={{fontWeight: 'bold', letterSpacing: '0.5px'}}
            >
                ACESSAR PAINEL
            </button>

        </form>
        
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
  
  const [userToken, setUserToken] = useState('');
  const [currentView, setCurrentView] = useState('menu');
  const [isChecking, setIsChecking] = useState(true);

  // Verifica se já existe login salvo ao abrir a página
  useEffect(() => {
    // Tenta pegar do LocalStorage (Persistente)
    const localToken = localStorage.getItem('mc_gh_token');
    // Tenta pegar do SessionStorage (Aba atual)
    const sessionToken = sessionStorage.getItem('mc_gh_token');

    if (localToken) {
        setUserToken(localToken);
    } else if (sessionToken) {
        setUserToken(sessionToken);
    }
    
    setIsChecking(false);
  }, []);

  const handleLogin = (token, remember) => {
    setUserToken(token);
    
    if (remember) {
        localStorage.setItem('mc_gh_token', token); // Salva pra sempre (até limpar cache)
    } else {
        sessionStorage.setItem('mc_gh_token', token); // Salva só nessa aba
    }
  };

  const handleLogout = () => {
      if(confirm("Deseja realmente sair?")) {
          setUserToken('');
          localStorage.removeItem('mc_gh_token');
          sessionStorage.removeItem('mc_gh_token');
          setCurrentView('menu');
      }
  };

  // Enquanto verifica o storage, mostra loading simples para não piscar a tela de login
  if (isChecking) return <Layout><div className="container margin-vert--xl text--center">Carregando...</div></Layout>;

  // Se não tiver token, mostra Login
  if (!userToken) {
      return (
        <Layout title="Login Editor" noFooter>
            <LoginScreen onLogin={handleLogin} adminPass={ADMIN_PASS} />
        </Layout>
      );
  }

  // Se tiver logado, mostra o Painel
  return (
    <Layout title="Editor">
      <div className="container margin-vert--md">
        
        {/* Barra Superior do Editor (Logout e Info) */}
        <div className="row margin-bottom--md" style={{alignItems: 'center', borderBottom: '1px solid var(--ifm-color-emphasis-200)', paddingBottom: '10px'}}>
            <div className="col col--6">
                <span className="badge badge--primary">Modo Administrador</span>
            </div>
            <div className="col col--6 text--right">
                <button className="button button--sm button--link" onClick={handleLogout} style={{color: 'var(--ifm-color-danger)'}}>
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