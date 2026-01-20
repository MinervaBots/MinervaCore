import React, { useState, useEffect } from 'react';
import { getFolders, getFiles, getFileContent, createPullRequest } from '../../utils/githubApi';

// =============================================================================
//                          PARSER E BUILDER DE MARKDOWN
// =============================================================================

function parseMarkdown(content) {
    // Extrair Frontmatter
    const fmRegex = /^---\n([\s\S]*?)\n---/;
    const fmMatch = content.match(fmRegex);
    const frontmatter = fmMatch ? fmMatch[1] : '';
    
    const getFmValue = (key) => {
        const match = frontmatter.match(new RegExp(`${key}:\\s*(.*)`));
        return match ? match[1].trim() : '';
    };

    let rawTitle = getFmValue('title').replace(/^['"]|['"]$/g, ''); // Remove aspas se tiver
    let pos = getFmValue('sidebar_position');
    
    // LÓGICA DE LIMPEZA: Se o título for "1. Algo", remove o "1. " para edição
    // Regex: Começa com numero, ponto, espaço e pega o resto
    const titleMatch = rawTitle.match(/^\d+\.\s+(.*)/);
    const cleanTitle = titleMatch ? titleMatch[1] : rawTitle;

    // O Conteúdo Real
    const body = content.replace(fmRegex, '').trim();

    return {
        metadata: {
            title: cleanTitle, // Título limpo (sem número)
            pos: pos || '0',   // Posição
        },
        body: body
    };
}

function buildMarkdown(data) {
    // junta Posição + Título
    // Ex: pos=2, title=Setup -> "2. Setup"
    // Se a posição for vazia, mantemos só o título sem número
    const finalTitle = (data.metadata.pos && data.metadata.pos !== ' ') 
        ? `${data.metadata.pos}. ${data.metadata.title}`
        : data.metadata.title;

    return `---
sidebar_position: ${data.metadata.pos}
title: ${finalTitle}
---

${data.body}
`;
}

// =============================================================================
//                              EDITOR PRINCIPAL
// =============================================================================

export default function PageEditor({ onBack, userToken }) {
    const [step, setStep] = useState(1);
    
    // Seleções
    const [area, setArea] = useState('programacao');
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(''); // Nome do arquivo .md

    // Dados da Página
    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState({ metadata: { title: '', pos: '' }, body: '' });
    const [isNewFile, setIsNewFile] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // CARREGAMENTOS

    // Load Folders
    useEffect(() => {
        async function loadFolders() {
            setLoading(true);
            try {
                const items = await getFolders(`minervacore/docs/${area}`, userToken);
                setFolders(items.map(i => i.name));
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
        }
        loadFolders();
    }, [area, userToken]);

    // Load Files
    const handleSelectFolder = async (folderName) => {
        setLoading(true);
        setSelectedFolder(folderName);
        try {
            const items = await getFiles(`minervacore/docs/${area}/${folderName}`, userToken);
            setFiles(items);
            setStep(2);
        } catch (e) {
            alert("Erro ao ler arquivos desta pasta.");
        } finally {
            setLoading(false);
        }
    };

    // Load File Content
    const handleSelectFile = async (fileName) => {
        setLoading(true);
        setSelectedFile(fileName);
        setIsNewFile(false);
        try {
            const path = `minervacore/docs/${area}/${selectedFolder}/${fileName}`;
            const file = await getFileContent(path, userToken);
            const parsed = parseMarkdown(file.content);
            setPageData(parsed);
            setStep(3);
        } catch (e) {
            alert("Erro ao ler o arquivo.");
        } finally {
            setLoading(false);
        }
    };

    // Criar Novo Arquivo
    const handleNewFile = () => {
        const name = prompt("Nome do arquivo (sem espaços e tudo minúsculo, ex: ponteiros-avancados):");
        if (!name) return;
        
        // Adiciona .md se o usuário esqueceu
        const finalName = name.endsWith('.md') ? name : `${name}.md`;
        
        setSelectedFile(finalName);
        setIsNewFile(true);
        // Template padrão
        setPageData({
            metadata: { title: 'Novo Título', pos: '1' },
            body: '# Título Principal\n\nEscreva seu conteúdo aqui...'
        });
        setStep(3);
    };

    // SALVAR

    const handleSave = async () => {
        if (!pageData.metadata.title) { alert("O título é obrigatório!"); return; }
        
        setLoading(true);
        setStatus({ type: 'info', msg: 'Gerando Pull Request...' });

        try {
            const newContent = buildMarkdown(pageData);
            const path = `minervacore/docs/${area}/${selectedFolder}/${selectedFile}`;
            
            const link = await createPullRequest({
                token: userToken,
                filePath: path,
                newContent: newContent,
                prTitle: `${isNewFile ? 'Create' : 'Update'} Page: ${pageData.metadata.title}`,
                prBody: `Edição de conteúdo via Painel Administrativo.\nArquivo: ${path}`
            });
            setStatus({ type: 'success', msg: link });
        } catch (e) {
            setStatus({ type: 'danger', msg: e.message });
        } finally {
            setLoading(false);
        }
    };

    // RENDER

    if (loading) return <div className="container text--center margin-vert--xl"><h2>⏳ Carregando...</h2></div>;

    // TELA DE SUCESSO
    if (status.type === 'success') return (
        <div className="container text--center margin-vert--xl">
           <div className="alert alert--success">
               <h3>✅ Pull Request Criado!</h3>
               <a href={status.msg} target="_blank" className="button button--primary">Ver PR</a>
               <button className="button button--link margin-left--md" onClick={() => setStatus({type:'', msg:''})}>Continuar Editando</button>
           </div>
       </div>
   );

    // SELECIONAR TÓPICO (PASTA)
    if (step === 1) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={onBack}>← Voltar ao Menu</button>
            <h2>📂 Passo 1: Escolha o Tópico</h2>
            
            <div className="tabs tabs--block margin-bottom--md">
                {['programacao', 'arquitetura', 'eletronica'].map(t => (
                    <li key={t} className={`tabs__item ${area === t ? 'tabs__item--active' : ''}`} onClick={() => setArea(t)}>
                        {t.toUpperCase()}
                    </li>
                ))}
            </div>

            <div className="row">
                {folders.map(f => (
                    <div key={f} className="col col--3 margin-bottom--md">
                        <div className="card padding--md pointer" onClick={() => handleSelectFolder(f)} style={{border: '1px solid #444', textAlign:'center'}}>
                            <h3>📁 {f}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // SELECIONAR ARQUIVO
    if (step === 2) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={() => setStep(1)}>← Voltar para Pastas</button>
            <h2>📄 Escolha ou crie uma Página ({selectedFolder})</h2>
            
            <div className="row">
                {/* Botão Novo Arquivo */}
                <div className="col col--3 margin-bottom--md">
                    <div className="card padding--md pointer" onClick={handleNewFile} style={{border: '2px dashed var(--ifm-color-primary)', textAlign:'center', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
                        <h3>+ Nova Página</h3>
                    </div>
                </div>

                {/* Lista de Arquivos */}
                {files.map(f => (
                    <div key={f.sha} className="col col--3 margin-bottom--md">
                        <div className="card padding--md pointer" onClick={() => handleSelectFile(f.name)} style={{border: '1px solid #444', textAlign:'center'}}>
                            <h4 style={{wordBreak: 'break-all'}}>{f.name}</h4>
                            <small>Editar Markdown</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // EDITOR
    return (
        <div className="container margin-vert--md">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <button className="button button--link" onClick={() => setStep(2)}>← Voltar para Arquivos</button>
                <h2>Editando: {selectedFile}</h2>
                <button className="button button--success" onClick={handleSave}>Salvar Alterações</button>
            </div>

            {status.msg && <div className={`alert alert--${status.type}`}>{status.msg}</div>}

            {/* BARRA DE METADADOS */}
            <div className="card padding--md margin-bottom--lg" style={{backgroundColor: '#1b1b1d', borderLeft: '5px solid var(--ifm-color-primary)'}}>
                <div className="row">
                    <div className="col col--2">
                        <small style={{fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}># Posição (Sidebar)</small>
                        <input 
                            type="number" 
                            className="button button--block button--outline button--secondary" 
                            value={pageData.metadata.pos} 
                            onChange={e => setPageData({...pageData, metadata: {...pageData.metadata, pos: e.target.value}})} 
                            style={{textAlign:'left', fontWeight: 'bold'}} 
                        />
                    </div>
                    <div className="col col--10">
                        <small style={{fontWeight: 'bold', color: 'var(--ifm-color-primary)'}}>Título da Página</small>
                        <input 
                            type="text" 
                            className="button button--block button--outline button--secondary" 
                            value={pageData.metadata.title} 
                            onChange={e => setPageData({...pageData, metadata: {...pageData.metadata, title: e.target.value}})} 
                            style={{textAlign:'left'}} 
                            placeholder="Ex: Comentários e Sintaxe (Sem número)"
                        />
                        <small style={{opacity: 0.6}}>O sistema salvará automaticamente como: <strong>{pageData.metadata.pos}. {pageData.metadata.title}</strong></small>
                    </div>
                </div>
            </div>

            {/* ÁREA DE TEXTO */}
            <div className="card padding--md">
                <h4 className="margin-bottom--md">Conteúdo (Markdown)</h4>
                
                {/* Toolbar Simples */}
                <div className="margin-bottom--sm" style={{display: 'flex', gap: '5px'}}>
                    <button className="button button--sm button--secondary" onClick={() => setPageData({...pageData, body: pageData.body + '\n```cpp\n// Seu código aqui\n```'})}>+ Código C++</button>
                    <button className="button button--sm button--secondary" onClick={() => setPageData({...pageData, body: pageData.body + '\n:::tip Dica\nEscreva sua dica aqui.\n:::'})}>+ Dica</button>
                    <button className="button button--sm button--secondary" onClick={() => setPageData({...pageData, body: pageData.body + '\n<Video id="ID_DO_VIDEO" title="Titulo" />'})}>+ Vídeo</button>
                </div>

                <textarea 
                    className="button button--block button--outline button--secondary" 
                    rows={25} 
                    value={pageData.body} 
                    onChange={e => setPageData({...pageData, body: e.target.value})} 
                    style={{
                        textAlign:'left', 
                        fontFamily:'monospace', 
                        minHeight: '400px', 
                        fontSize: '14px', 
                        lineHeight: '1.5'
                    }} 
                />
            </div>
        </div>
    );
}