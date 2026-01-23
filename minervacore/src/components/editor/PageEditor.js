import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getFolders, getFiles, getFileContent, createBranch, commitFile, openPullRequest } from '../../utils/githubApi';

const TEMPLATES = {
    tutorial: `---
sidebar_position: 1
title: Novo Tutorial
---

# Introdução

Escreva aqui uma breve introdução sobre o que será ensinado.

## Pré-requisitos

* Conhecimento básico de...
* Software X instalado.

## Passo a Passo

1.  Primeiro passo...
2.  Segundo passo...

:::tip Dica
Lembre-se de salvar seu progresso!
:::
`,
    conceito: `---
sidebar_position: 1
title: Novo Conceito
---

# O que é?

Explicação teórica do conceito.

## Principais Características

* **Característica 1:** Explicação.
* **Característica 2:** Explicação.

## Exemplo Prático

\`\`\`cpp
// Código de exemplo
int main() {
    return 0;
}
\`\`\`
`,
    exercicio: `---
sidebar_position: 1
title: Exercício Prático
---

# Enunciado

Descreva o problema que deve ser resolvido.

## Entradas e Saídas

| Entrada | Saída Esperada |
| :--- | :--- |
| 10 | 20 |
| 5 | 10 |

:::info Importante
Não use bibliotecas externas.
:::
`
};

// ICONES SVG DA TOOLBAR
const ToolbarIcons = {
    bold: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>,
    italic: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>,
    code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    video: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
    tip: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
    h2: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18l-4-4 2-2-2-2 4-4"/></svg> // Simplificado para Header
};

// =============================================================================
//                            COMPONENTE DE PREVIEW
// =============================================================================
const MarkdownPreview = ({ content }) => {
    // Pré-processamento para simular componentes do Docusaurus no Preview
    // (React-Markdown não entende :::tip nativamente, então ele é transformado em HTML)
    const processedContent = content
        .replace(/:::tip\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--success"><strong>💡 $1</strong><br/>$2</div>')
        .replace(/:::info\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--info"><strong>ℹ️ $1</strong><br/>$2</div>')
        .replace(/:::warning\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--warning"><strong>⚠️ $1</strong><br/>$2</div>')
        .replace(/:::danger\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--danger"><strong>🔥 $1</strong><br/>$2</div>')
        .replace(/<Video id="(.*?)" title="(.*?)" \/>/g, '<div style="background:#222; color:#fff; padding:10px; border-radius:5px; text-align:center">🎬 Vídeo: $2</div>');

    return (
        <div className="markdown-body" style={{ padding: '20px', backgroundColor: 'var(--ifm-background-color)', height: '100%', overflowY: 'auto' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

// =============================================================================
//                            PARSERS E BUILDERS
// =============================================================================
function parseMarkdown(content) {
    const fmRegex = /^---\n([\s\S]*?)\n---/;
    const fmMatch = content.match(fmRegex);
    const frontmatter = fmMatch ? fmMatch[1] : '';
    const getFmValue = (key) => { const match = frontmatter.match(new RegExp(`${key}:\\s*(.*)`)); return match ? match[1].trim() : ''; };
    
    let rawTitle = getFmValue('title').replace(/^['"]|['"]$/g, '');
    let pos = getFmValue('sidebar_position');
    const titleMatch = rawTitle.match(/^\d+\.\s+(.*)/);
    const cleanTitle = titleMatch ? titleMatch[1] : rawTitle;

    return { metadata: { title: cleanTitle, pos: pos || '0' }, body: content.replace(fmRegex, '').trim() };
}

function buildMarkdown(data) {
    const finalTitle = (data.metadata.pos && data.metadata.pos !== '0') ? `${data.metadata.pos}. ${data.metadata.title}` : data.metadata.title;
    return `---\nsidebar_position: ${data.metadata.pos}\ntitle: ${finalTitle}\n---\n\n${data.body}\n`;
}

// =============================================================================
//                            EDITOR PRINCIPAL
// =============================================================================
export default function PageEditor({ onBack, userToken }) {
    const [step, setStep] = useState(1);
    const [area, setArea] = useState('programacao');
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    
    // Estados do Editor
    const [pageData, setPageData] = useState({ metadata: { title: '', pos: '' }, body: '' });
    const [viewMode, setViewMode] = useState('split');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isNewFile, setIsNewFile] = useState(false);
    
    // FILA DE IMAGENS (Para upload no final)
    const [pendingImages, setPendingImages] = useState([]); // [{ file, base64, path }]

    const textAreaRef = useRef(null);

    // CARREGAMENTOS
    useEffect(() => {
        async function loadFolders() {
            setLoading(true);
            try {
                const items = await getFolders(`minervacore/docs/${area}`, userToken);
                setFolders(items.map(i => i.name));
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        loadFolders();
    }, [area, userToken]);

    const handleSelectFolder = async (folderName) => {
        setLoading(true); setSelectedFolder(folderName);
        try {
            const items = await getFiles(`minervacore/docs/${area}/${folderName}`, userToken);
            setFiles(items); setStep(2);
        } catch (e) { alert("Erro ao ler arquivos."); } finally { setLoading(false); }
    };

    const handleSelectFile = async (fileName) => {
        setLoading(true); setSelectedFile(fileName); setIsNewFile(false);
        setPendingImages([]); // Limpa fila anterior
        try {
            const path = `minervacore/docs/${area}/${selectedFolder}/${fileName}`;
            const file = await getFileContent(path, userToken);
            setPageData(parseMarkdown(file.content));
            setStep(3);
        } catch (e) { alert("Erro ao ler arquivo."); } finally { setLoading(false); }
    };

    const handleNewFile = () => {
        const name = prompt("Nome do arquivo (ex: ponteiros):");
        if (!name) return;
        const finalName = name.endsWith('.md') ? name : `${name}.md`;
        setSelectedFile(finalName);
        setIsNewFile(true);
        setPageData({ metadata: { title: 'Novo Título', pos: '1' }, body: '# Título Principal\n\n' });
        setStep(3);
    };

    // INSERIR ONDE ESTÁ O CURSOR
    const insertAtCursor = (textToInsert) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = pageData.body;
        
        // Insere o texto
        const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end);
        
        // Atualiza estado
        setPageData({ ...pageData, body: newText });

        // Restaura foco e posição do cursor (após a inserção)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        }, 0);
    };

    // TOOLBAR HANDLERS
    const handleToolbar = (type) => {
        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selection = pageData.body.substring(start, end);

        switch (type) {
            case 'bold': insertAtCursor(`**${selection || 'texto negrito'}**`); break;
            case 'italic': insertAtCursor(`*${selection || 'texto itálico'}*`); break;
            case 'h2': insertAtCursor(`\n## ${selection || 'Subtítulo'}\n`); break;
            case 'link': insertAtCursor(`[${selection || 'Texto do Link'}](url)`); break;
            case 'code': insertAtCursor(`\n\`\`\`cpp\n${selection || '// Seu código aqui'}\n\`\`\`\n`); break;
            case 'tip': insertAtCursor(`\n:::tip Dica\n${selection || 'Escreva sua dica aqui.'}\n:::\n`); break;
            case 'video': insertAtCursor(`\n<Video id="ID_DO_VIDEO" title="${selection || 'Título'}" />\n`); break;
            default: break;
        }
    };

    // PROCESSAR IMAGEM (Drag, Drop & Paste)
    const processImageFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;

        // Gera nome único e caminho futuro
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
        const futurePath = `/img/uploads/${timestamp}-${cleanName}`;

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1];
            
            // Adiciona à fila de upload
            setPendingImages(prev => [...prev, { 
                file, 
                base64, 
                serverPath: `minervacore/static${futurePath}` // Caminho real no repo
            }]);

            // Insere o Markdown no cursor IMEDIATAMENTE
            insertAtCursor(`\n![${cleanName}](${futurePath})\n`);
        };
        reader.readAsDataURL(file);
    };

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                e.preventDefault(); // Impede colar o binário direto
                const file = items[i].getAsFile();
                processImageFile(file);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        processImageFile(file);
    };

    // SALVAMENTO UNIFICADO (BATCH)
    const handleSave = async () => {
        if (!pageData.metadata.title) { alert("Título obrigatório!"); return; }
        setLoading(true);
        setStatus({ type: 'info', msg: 'Preparando pacote de atualizações...' });

        try {
            // Cria uma Branch Única
            const branchName = `content-update-${Date.now()}`;
            await createBranch(userToken, branchName);

            // Sobe todas as imagens pendentes para essa branch
            if (pendingImages.length > 0) {
                setStatus({ type: 'info', msg: `Enviando ${pendingImages.length} imagens...` });
                for (const img of pendingImages) {
                    await commitFile({
                        token: userToken,
                        branch: branchName,
                        path: img.serverPath,
                        contentBase64: img.base64,
                        message: `Upload image: ${img.file.name}`
                    });
                }
            }

            // Sobe o arquivo Markdown para a mesma branch
            setStatus({ type: 'info', msg: 'Salvando texto...' });
            const mdContent = btoa(unescape(encodeURIComponent(buildMarkdown(pageData))));
            const mdPath = `minervacore/docs/${area}/${selectedFolder}/${selectedFile}`;
            
            await commitFile({
                token: userToken,
                branch: branchName,
                path: mdPath,
                contentBase64: mdContent,
                message: `${isNewFile ? 'Create' : 'Update'} ${pageData.metadata.title}`
            });

            // Cria UM ÚNICO Pull Request
            setStatus({ type: 'info', msg: 'Gerando Pull Request...' });
            const prLink = await openPullRequest({
                token: userToken,
                branch: branchName,
                title: `Update: ${pageData.metadata.title} (+${pendingImages.length} imgs)`,
                body: `Atualização de conteúdo via CMS.\n\n**Arquivos:**\n- ${selectedFile}\n- ${pendingImages.length} imagens novas.`
            });

            // Limpa fila e sucesso
            setPendingImages([]);
            setStatus({ type: 'success', msg: prLink });

        } catch (e) {
            setStatus({ type: 'danger', msg: `Erro: ${e.message}` });
        } finally {
            setLoading(false);
        }
    };

    // RENDER
    if (loading) return <div className="container text--center margin-vert--xl"><h2>⏳ Processando...</h2></div>;

    if (step === 1) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={onBack}>← Menu</button>
            <h2>📂 Passo 1: Área</h2>
            <div className="tabs tabs--block margin-bottom--md">
                {['programacao', 'arquitetura', 'eletronica'].map(t => (
                    <li key={t} className={`tabs__item ${area===t?'tabs__item--active':''}`} onClick={()=>setArea(t)}>{t.toUpperCase()}</li>
                ))}
            </div>
            <div className="row">
                {folders.map(f => <div key={f} className="col col--3 margin-bottom--md"><div className="card padding--md pointer" onClick={()=>handleSelectFolder(f)} style={{border:'1px solid #444', textAlign:'center'}}>📁 {f}</div></div>)}
            </div>
        </div>
    );

    if (step === 2) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={()=>setStep(1)}>← Voltar</button>
            <h2>📄 Arquivos em {selectedFolder}</h2>
            <div className="row">
                <div className="col col--3 margin-bottom--md"><div className="card padding--md pointer" onClick={handleNewFile} style={{border:'2px dashed var(--ifm-color-primary)', textAlign:'center'}}><h3>+ Nova Página</h3></div></div>
                {files.map(f => <div key={f.sha} className="col col--3 margin-bottom--md"><div className="card padding--md pointer" onClick={()=>handleSelectFile(f.name)} style={{border:'1px solid #444', textAlign:'center'}}>{f.name}</div></div>)}
            </div>
        </div>
    );

    if (status.type === 'success') return (
        <div className="container text--center margin-vert--xl">
           <div className="alert alert--success">
               <h3>✅ Pull Request Criado!</h3>
               <p>Texto e imagens foram enviados juntos.</p>
               <a href={status.msg} target="_blank" className="button button--primary">Ver PR</a>
               <button className="button button--link margin-left--md" onClick={() => setStatus({type:'', msg:''})}>Voltar</button>
           </div>
       </div>
    );

    // EDITOR COM TOOLBAR E PREVIEW
    return (
        <div className="container margin-vert--md" style={{maxWidth: '98%'}}>
            
            {/* Header Fixo */}
            <div style={{
                display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', 
                borderBottom:'1px solid #444', paddingBottom:'10px',
                position: 'sticky', top: '60px', zIndex: 100, backgroundColor: 'var(--ifm-background-color)', padding: '15px 0'
            }}>
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <button className="button button--sm button--secondary" onClick={() => setStep(2)}>← Voltar</button>
                    <h3 style={{margin:0}}>{selectedFile} {pendingImages.length > 0 && <span className="badge badge--warning">{pendingImages.length} imgs na fila</span>}</h3>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                    <div className="button-group">
                        <button className={`button button--sm ${viewMode==='edit'?'button--primary':'button--secondary'}`} onClick={()=>setViewMode('edit')}>Editor</button>
                        <button className={`button button--sm ${viewMode==='split'?'button--primary':'button--secondary'}`} onClick={()=>setViewMode('split')}>Split</button>
                    </div>
                    <button className="button button--success button--sm" onClick={handleSave}>Salvar Tudo</button>
                </div>
            </div>

            {status.msg && <div className={`alert alert--${status.type}`}>{status.msg}</div>}

            {/* Metadados */}
            <div className="row margin-bottom--md" style={{backgroundColor: 'var(--ifm-color-emphasis-100)', padding:'10px', borderRadius:'8px', margin:'0 0 15px 0'}}>
                <div className="col col--2">
                    <small><strong>Posição</strong></small>
                    <input type="number" className="button button--block button--outline button--secondary button--sm" value={pageData.metadata.pos} onChange={e => setPageData({...pageData, metadata: {...pageData.metadata, pos: e.target.value}})} style={{textAlign:'left'}} />
                </div>
                <div className="col col--10">
                    <small><strong>Título</strong></small>
                    <input type="text" className="button button--block button--outline button--secondary button--sm" value={pageData.metadata.title} onChange={e => setPageData({...pageData, metadata: {...pageData.metadata, title: e.target.value}})} style={{textAlign:'left'}} />
                </div>
            </div>

            {/* ÁREA PRINCIPAL */}
            <div className="row" style={{height: '75vh'}}> 
                
                {/* ESQUERDA: EDITOR */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                    <div className={`col ${viewMode === 'split' ? 'col--6' : 'col--12'}`} style={{height: '100%', display:'flex', flexDirection:'column'}}>
                        
                        {/* TOOLBAR */}
                        <div style={{marginBottom:'5px', display:'flex', gap:'5px', flexWrap:'wrap', padding:'5px', background:'rgba(255,255,255,0.05)', borderRadius:'4px'}}>
                            <button className="button button--sm button--icon button--link" title="Negrito" onClick={()=>handleToolbar('bold')}>{ToolbarIcons.bold}</button>
                            <button className="button button--sm button--icon button--link" title="Itálico" onClick={()=>handleToolbar('italic')}>{ToolbarIcons.italic}</button>
                            <button className="button button--sm button--icon button--link" title="Cabeçalho 2" onClick={()=>handleToolbar('h2')}>{ToolbarIcons.h2}</button>
                            <span style={{borderRight:'1px solid #555', margin:'0 5px'}}></span>
                            <button className="button button--sm button--icon button--link" title="Link" onClick={()=>handleToolbar('link')}>{ToolbarIcons.link}</button>
                            <button className="button button--sm button--icon button--link" title="Código C++" onClick={()=>handleToolbar('code')}>{ToolbarIcons.code}</button>
                            <button className="button button--sm button--icon button--link" title="Dica" onClick={()=>handleToolbar('tip')}>{ToolbarIcons.tip}</button>
                            <button className="button button--sm button--icon button--link" title="Vídeo" onClick={()=>handleToolbar('video')}>{ToolbarIcons.video}</button>
                            <span style={{flex:1}}></span>
                            <small style={{opacity:0.5, alignSelf:'center', fontSize:'0.75rem'}}>Cole ou arraste imagens</small>
                        </div>

                        <textarea 
                            ref={textAreaRef}
                            className="button button--block button--outline button--secondary" 
                            style={{
                                flex: 1, resize: 'none', textAlign: 'left', 
                                fontFamily: 'Fira Code, monospace', fontSize: '14px', lineHeight: '1.6',
                                cursor: 'text'
                            }}
                            value={pageData.body}
                            onChange={e => setPageData({...pageData, body: e.target.value})}
                            onDrop={handleDrop}
                            onPaste={handlePaste}
                            onDragOver={e => e.preventDefault()}
                            placeholder="Escreva seu conteúdo aqui..."
                        />
                    </div>
                )}

                {/* DIREITA: PREVIEW */}
                {(viewMode === 'split') && (
                    <div className="col col--6" style={{height: '100%', display:'flex', flexDirection:'column'}}>
                        <div style={{marginBottom:'5px', padding:'5px'}}><small>Preview</small></div>
                        <div style={{flex: 1, border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px', overflow: 'hidden'}}>
                            <MarkdownPreview content={pageData.body} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}