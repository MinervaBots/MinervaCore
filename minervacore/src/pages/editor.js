// Arquivo principal da página de editor

import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Importando componentes modularizados
import DashboardMenu from '../components/editor/DashboardMenu';
import HomeEditor from '../components/editor/HomeEditor';
import TopicEditor from '../components/editor/TopicEditor';

// @todo Placeholders para futuros editores
const PageEditor = ({onBack}) => <div className="container"><button onClick={onBack}>Voltar</button><p>Em breve...</p></div>;

const LoginScreen = ({ onLogin, adminPass }) => {
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (pass !== adminPass) { setError('Senha incorreta.'); return; }
    if (!token) { setError('Token obrigatório.'); return; }
    onLogin(token);
  };

  return (
    <div style={{maxWidth: '400px', margin: '80px auto', padding: '20px', textAlign: 'center'}}>
      <img src={useBaseUrl('img/minervacore-logo-transp.png')} width="120" />
      <h1>Acesso Restrito</h1>
      <div className="card padding--lg">
        <input type="password" placeholder="Senha da Equipe" value={pass} onChange={e=>setPass(e.target.value)} className="button button--block margin-bottom--sm" />
        <input type="password" placeholder="GitHub Token" value={token} onChange={e=>setToken(e.target.value)} className="button button--block margin-bottom--sm" />
        {error && <div className="alert alert--danger margin-bottom--sm">{error}</div>}
        <button className="button button--primary button--block" onClick={handleSubmit}>Entrar</button>
      </div>
    </div>
  );
};

export default function Editor() {
  const { siteConfig } = useDocusaurusContext();
  const ADMIN_PASS = siteConfig.customFields?.adminPass || '';
  const [userToken, setUserToken] = useState('');
  const [currentView, setCurrentView] = useState('menu');

  useEffect(() => {
    const saved = sessionStorage.getItem('mc_gh_token');
    if (saved) setUserToken(saved);
  }, []);

  const handleLogin = (token) => {
    setUserToken(token);
    sessionStorage.setItem('mc_gh_token', token);
  };

  if (!userToken) return <Layout><LoginScreen onLogin={handleLogin} adminPass={ADMIN_PASS} /></Layout>;

  return (
    <Layout title="Editor">
      <div className="margin-vert--md">
        {currentView === 'home' ? <HomeEditor userToken={userToken} onBack={() => setCurrentView('menu')} /> :
         currentView === 'topics' ? <TopicEditor userToken={userToken} onBack={() => setCurrentView('menu')} /> :
         currentView === 'pages' ? <PageEditor onBack={() => setCurrentView('menu')} /> :
         <DashboardMenu onSelectOption={setCurrentView} />}
      </div>
    </Layout>
  );
}