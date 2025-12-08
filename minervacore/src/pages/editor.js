/*
    Página do formulário de criação de uma nova página em Markdown
*/

import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const REPO_OWNER = 'MinervaBots';
const REPO_NAME = 'MinervaCore';
const DOCS_PATH = 'minervacore/docs';

export default function Editor() {
  const { siteConfig } = useDocusaurusContext();
  
  // Estados para controle da interface
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  
  // Estados do Formulário
  const [folders, setFolders] = useState([]); // Pastas disponíveis
  const [folder, setFolder] = useState('');
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('');
  const [content, setContent] = useState('# Escreva aqui...');

  // Autenticação
  const [userToken, setUserToken] = useState(''); // Token do GitHub do usuário
  const [status, setStatus] = useState('');

  // Busca as pastas do repositório ao carregar a página
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DOCS_PATH}`
        );

        const data = await res.json();

        // Filtrar apenas pastas
        const onlyDirs = data
          .filter(item => item.type === 'dir')
          .map(item => item.path);

        setFolders(onlyDirs);

        if (onlyDirs.length > 0) {
          setFolder(onlyDirs[0]); // Define a primeira pasta como default
        }
      } catch (e) {
        console.error('Erro ao buscar pastas:', e);
      }
    };

    fetchFolders();
  }, []);

  // Senha para acessar o editor
  const handleUnlock = () => {
    if (password === 'nikkiMinerva2025') { // Senha
      setIsUnlocked(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  // Função que gera o arquivo Markdown
  const generateFileContent = () => {
    // Se a posição estiver vazia, não coloca no frontmatter (joga pro final)
    const positionLine = position ? `sidebar_position: ${position}` : '';
    
    return `---
title: ${title}
${positionLine}
---

${content}`;
  };

  // Função que envia para o GitHub
  const handleSave = async () => {
    if (!title || !userToken) {
      alert('Preencha o título e seu Token de acesso!');
      return;
    }

    setStatus('Salvando...');

    const fileContent = generateFileContent();
    // Codifica para Base64
    const contentEncoded = btoa(unescape(encodeURIComponent(fileContent)));
    
    // Cria um nome de arquivo baseado no título (slugify)
    const filename = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '.md';
    const path = `${folder}/${filename}`;

    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `ADD: Cria página ${title} via editor web`,
          content: contentEncoded,
        }),
      });

      if (response.ok) {
        setStatus('Sucesso! Página criada.');
        setTitle('');
        setContent('');
      } else {
        const error = await response.json();
        setStatus('Erro: ' + error.message);
      }
    } catch (e) {
      setStatus('Erro de conexão: ' + e.message);
    }
  };

  return (
    <Layout title="Editor" description="Criar nova página">
      <div className="container margin-vert--lg">

        {!isUnlocked ? (
          /* TELA DE LOGIN */
          <div style={{maxWidth: '400px', margin: '0 auto', textAlign: 'center'}}>
            <h1>Acesso Restrito</h1>
            <input 
              type="password"
              className="button button--outline button--secondary button--block"
              style={{marginBottom: '10px', background: 'transparent', color: 'white'}}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha da Equipe"
            />
            <button className="button button--primary button--block" onClick={handleUnlock}>
              Entrar
            </button>
          </div>
        ) : (
          
          /* TELA DO EDITOR */
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Criar Nova Página</h1>

              <div className="margin-bottom--md">
                <label><strong>1. Onde salvar?</strong></label>

                {folders.length === 0 ? (
                  <p>Carregando pastas...</p>
                ) : (
                  <select 
                    className="button button--outline button--secondary button--block"
                    style={{textAlign: 'left', background: '#1b1b1d'}}
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                  >
                    {folders.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Título e Posição */}
              <div className="row margin-bottom--md">
                <div className="col col--8">
                  <label><strong>2. Título da Página</strong></label>
                  <input 
                    type="text" 
                    className="button button--outline button--secondary button--block"
                    style={{textAlign: 'left', cursor: 'text', background: '#1b1b1d'}}
                    placeholder="Ex: Ponteiros Avançados"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col col--4">
                  <label><strong>Posição (Opcional)</strong></label>
                  <input 
                    type="number" 
                    className="button button--outline button--secondary button--block"
                    style={{textAlign: 'left', cursor: 'text', background: '#1b1b1d'}}
                    placeholder="Ex: 5"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              </div>

              {/* Conteúdo Markdown */}
              <div className="margin-bottom--md">
                <label><strong>3. Conteúdo (Markdown)</strong></label>
                <textarea 
                  rows="15"
                  className="button button--outline button--secondary button--block"
                  style={{textAlign: 'left', cursor: 'text', background: '#1b1b1d', fontFamily: 'monospace'}}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Autenticação e Salvar */}
              <div className="card padding--md" style={{border: '1px solid #9e1f22'}}>
                <h3>Finalizar</h3>
                <p style={{fontSize: '0.8rem'}}>
                  Para salvar, insira seu GitHub/GitLab Personal Access Token. 
                  (Isso garante que é você commitando).
                </p>
                <input 
                  type="password" 
                  className="button button--outline button--secondary button--block margin-bottom--sm"
                  style={{textAlign: 'left', cursor: 'text', background: '#1b1b1d'}}
                  placeholder="Seu Personal Access Token (ghp_...)"
                  value={userToken}
                  onChange={(e) => setUserToken(e.target.value)}
                />
                
                <button 
                  className="button button--primary button--block" 
                  onClick={handleSave}
                  disabled={status === 'Salvando...'}
                >
                  {status === 'Salvando...' ? 'Enviando...' : 'Criar Página'}
                </button>
                
                {status && <p className="margin-top--sm" style={{fontWeight: 'bold'}}>{status}</p>}
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}