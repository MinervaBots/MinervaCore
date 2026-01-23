import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getFolders, getFiles, getFileContent, createPullRequest, uploadImage } from '../../utils/githubApi';

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

// =============================================================================
//                            COMPONENTE DE PREVIEW
// =============================================================================
const MarkdownPreview = ({ content }) => {
    // Pré-processamento para simular componentes do Docusaurus no Preview
    // (React-Markdown não entende :::tip nativamente, então ele é transformado em HTML)
    const processedContent = content
        .replace(/:::tip\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--success" style="margin: 10px 0;"><strong>💡 $1</strong><br/>$2</div>')
        .replace(/:::info\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--info" style="margin: 10px 0;"><strong>ℹ️ $1</strong><br/>$2</div>')
        .replace(/:::warning\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--warning" style="margin: 10px 0;"><strong>⚠️ $1</strong><br/>$2</div>')
        .replace(/:::danger\s?(.*?)\n([\s\S]*?):::/g, '<div class="alert alert--danger" style="margin: 10px 0;"><strong>🔥 $1</strong><br/>$2</div>')
        .replace(/<Video id="(.*?)" title="(.*?)" \/>/g, '<div style="background:#000; color:#fff; padding:20px; text-align:center; border-radius:8px;">🎬 Vídeo: $2 ($1)</div>');

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
    const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', 'split'
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [validationErrors, setValidationErrors] = useState([]);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isNewFile, setIsNewFile] = useState(false);

    // Auto-Save Key
    const autoSaveKey = `mc_autosave_${selectedFolder}_${selectedFile}`;

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
        
        // Verifica Auto-Save antes de carregar
        const saved = localStorage.getItem(`mc_autosave_${selectedFolder}_${fileName}`);
        
        try {
            const path = `minervacore/docs/${area}/${selectedFolder}/${fileName}`;
            const file = await getFileContent(path, userToken);
            
            if (saved && confirm("⚠️ Encontramos um rascunho não salvo deste arquivo. Deseja restaurá-lo?")) {
                setPageData(JSON.parse(saved));
            } else {
                setPageData(parseMarkdown(file.content));
            }
            setStep(3);
        } catch (e) { alert("Erro ao ler arquivo."); } finally { setLoading(false); }
    };

    const initNewFile = (templateType) => {
        const name = prompt("Nome do arquivo (sem espaços, ex: ponteiros):");
        if (!name) return;
        const finalName = name.endsWith('.md') ? name : `${name}.md`;
        
        setSelectedFile(finalName);
        setIsNewFile(true);
        
        const templateContent = TEMPLATES[templateType] || TEMPLATES['conceito'];
        setPageData(parseMarkdown(templateContent));
        
        setShowTemplateModal(false);
        setStep(3);
    };

    // AUTO SAVE & VALIDAÇÃO
    useEffect(() => {
        if (step === 3 && pageData.body) {
            const timer = setTimeout(() => {
                localStorage.setItem(autoSaveKey, JSON.stringify(pageData));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [pageData, step]);

    const validate = () => {
        const errors = [];
        if (!pageData.metadata.title) errors.push("Título é obrigatório.");
        
        // Link Quebrado (Check simples)
        const linkRegex = /\[.*?\]\((.*?)\)/g;
        let match;
        while ((match = linkRegex.exec(pageData.body)) !== null) {
            const url = match[1];
            if (url.startsWith('/docs/') && (url.includes('prog/') || url.includes('pyton'))) {
                errors.push(`Link suspeito: ${url}. Verifique erros de digitação.`);
            }
        }
        setValidationErrors(errors);
        return errors.length === 0;
    };

    // DRAG & DROP DE IMAGEM
    const handleImageDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        if (!confirm(`Deseja fazer upload de "${file.name}"?`)) return;

        setLoading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Content = reader.result.split(',')[1];
            try {
                const result = await uploadImage({ token: userToken, file, contentBase64: base64Content });
                
                // Insere o markdown da imagem onde está o cursor (ou no final)
                const imgMarkdown = `\n![${file.name}](${result.path})\n`;
                setPageData(prev => ({ ...prev, body: prev.body + imgMarkdown }));
                alert("Imagem enviada! Link adicionado ao texto.");
            } catch (err) {
                alert("Erro no upload: " + err.message);
            } finally {
                setLoading(false);
            }
        };
    };

    // SALVAR
    const handleSave = async () => {
        validate();
        if (validationErrors.length > 0 && !confirm("Existem alertas. Salvar mesmo assim?")) return;

        setLoading(true);
        setStatus({ type: 'info', msg: 'Enviando PR...' });

        try {
            const newContent = buildMarkdown(pageData);
            const path = `minervacore/docs/${area}/${selectedFolder}/${selectedFile}`;
            const link = await createPullRequest({
                token: userToken,
                filePath: path,
                newContent: newContent,
                prTitle: `${isNewFile ? 'Create' : 'Update'} ${pageData.metadata.title}`,
                prBody: `Edit via CMS. ${isNewFile ? 'Novo arquivo criado.' : 'Atualização de conteúdo.'}`
            });
            
            localStorage.removeItem(autoSaveKey); // Limpa rascunho
            setStatus({ type: 'success', msg: link });
        } catch (e) {
            setStatus({ type: 'danger', msg: e.message });
        } finally {
            setLoading(false);
        }
    };

    // RENDER
    if (loading) return <div className="container text--center margin-vert--xl"><h2>⏳ Processando...</h2></div>;

    if (status.type === 'success') return (
        <div className="container text--center margin-vert--xl">
           <div className="alert alert--success">
               <h3>✅ Pull Request Criado!</h3>
               <a href={status.msg} target="_blank" className="button button--primary">Ver PR</a>
               <button className="button button--link margin-left--md" onClick={() => setStatus({type:'', msg:''})}>Continuar Editando</button>
           </div>
       </div>
    );

    if (step === 1) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={onBack}>← Menu Principal</button>
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

    if (step === 2) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={() => setStep(1)}>← Voltar para Pastas</button>
            <h2>📄 Páginas em {selectedFolder}</h2>
            
            <div className="row">
                <div className="col col--3 margin-bottom--md">
                    <div className="card padding--md pointer" onClick={()=>setShowTemplateModal(true)} style={{border: '2px dashed var(--ifm-color-primary)', textAlign:'center', height: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
                        <h3>+ Nova Página</h3>
                    </div>
                </div>

                {files.map(f => (
                    <div key={f.sha} className="col col--3 margin-bottom--md">
                        <div className="card padding--md pointer" onClick={() => handleSelectFile(f.name)} style={{border: '1px solid #444', textAlign:'center'}}>
                            <h4 style={{wordBreak: 'break-all'}}>{f.name}</h4>
                            <small>Editar Markdown</small>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE TEMPLATES */}
            {showTemplateModal && (
                <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div className="card padding--lg" style={{width:'400px', backgroundColor: 'var(--ifm-background-surface-color)'}}>
                        <h3>Escolha um Template</h3>
                        <div className="button-group-vertical" style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                            <button className="button button--secondary" onClick={()=>initNewFile('tutorial')}>📚 Tutorial</button>
                            <button className="button button--secondary" onClick={()=>initNewFile('conceito')}>💡 Conceito Teórico</button>
                            <button className="button button--secondary" onClick={()=>initNewFile('exercicio')}>🏋️ Exercício</button>
                            <button className="button button--link" onClick={()=>setShowTemplateModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="container margin-vert--md" style={{maxWidth: '98%'}}>
            
            {/* HEADER */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', borderBottom:'1px solid #444', paddingBottom:'10px'}}>
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <button className="button button--sm button--secondary" onClick={() => setStep(2)}>← Voltar</button>
                    <h3 style={{margin:0}}>{selectedFile} {isNewFile && '(Novo)'}</h3>
                </div>
                
                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                    <div className="button-group">
                        <button className={`button button--sm ${viewMode==='edit'?'button--primary':'button--secondary'}`} onClick={()=>setViewMode('edit')}>Editor</button>
                        <button className={`button button--sm ${viewMode==='split'?'button--primary':'button--secondary'}`} onClick={()=>setViewMode('split')}>Split</button>
                        <button className={`button button--sm ${viewMode==='preview'?'button--primary':'button--secondary'}`} onClick={()=>setViewMode('preview')}>Preview</button>
                    </div>
                    <button className="button button--success button--sm" onClick={handleSave}>Salvar</button>
                </div>
            </div>

            {/* ERROR BANNER */}
            {validationErrors.length > 0 && (
                <div className="alert alert--warning margin-bottom--md">
                    <strong>⚠️ Alertas:</strong> {validationErrors.join(' | ')}
                </div>
            )}

            {/* METADATA BAR */}
            <div className="row margin-bottom--md" style={{backgroundColor: 'var(--ifm-color-emphasis-100)', padding:'10px', borderRadius:'8px', margin:'0 0 15px 0'}}>
                <div className="col col--2">
                    <small><strong>Posição</strong></small>
                    <input type="number" className="button button--block button--outline button--secondary button--sm" value={pageData.metadata.pos} onChange={e => setPageData({...pageData, metadata: {...pageData.metadata, pos: e.target.value}})} style={{textAlign:'left'}} />
                </div>
                <div className="col col--10">
                    <small><strong>Título da Página</strong></small>
                    <input type="text" className="button button--block button--outline button--secondary button--sm" value={pageData.metadata.title} onChange={e => setPageData({...pageData, metadata: {...pageData.metadata, title: e.target.value}})} style={{textAlign:'left'}} />
                </div>
            </div>

            {/* ÁREA PRINCIPAL (EDITOR + PREVIEW) */}
            <div className="row" style={{height: '75vh'}}> 
                
                {/* COLUNA DA ESQUERDA: EDITOR */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                    <div className={`col ${viewMode === 'split' ? 'col--6' : 'col--12'}`} style={{height: '100%', display:'flex', flexDirection:'column'}}>
                        <div style={{marginBottom:'5px', display:'flex', justifyContent:'space-between'}}>
                            <small>Markdown (Arraste imagens aqui)</small>
                            <small style={{opacity:0.5}}>Auto-save ativo</small>
                        </div>
                        <textarea 
                            className="button button--block button--outline button--secondary" 
                            style={{
                                flex: 1, resize: 'none', textAlign: 'left', 
                                fontFamily: 'Fira Code, monospace', fontSize: '14px', lineHeight: '1.6',
                                cursor: 'text'
                            }}
                            value={pageData.body}
                            onChange={e => setPageData({...pageData, body: e.target.value})}
                            onDrop={handleImageDrop}
                            onDragOver={e => e.preventDefault()}
                            placeholder="Escreva seu conteúdo aqui..."
                        />
                    </div>
                )}

                {/* COLUNA DA DIREITA: PREVIEW */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className={`col ${viewMode === 'split' ? 'col--6' : 'col--12'}`} style={{height: '100%', display:'flex', flexDirection:'column'}}>
                        <div style={{marginBottom:'5px'}}><small>Preview (Aproximado)</small></div>
                        <div style={{
                            flex: 1, border: '1px solid var(--ifm-color-emphasis-300)', 
                            borderRadius: '8px', overflow: 'hidden'
                        }}>
                            <MarkdownPreview content={pageData.body} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}