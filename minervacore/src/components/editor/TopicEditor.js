import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { getFolders, getFileContent, createPullRequest } from '../../utils/githubApi';
import IconPicker from './IconPicker';

// =============================================================================
//                          PARSER E BUILDER DE MDX
// =============================================================================

function parseIndexMdx(content) {
    // Extrair Frontmatter
    const fmRegex = /^---\n([\s\S]*?)\n---/;
    const fmMatch = content.match(fmRegex);
    const frontmatter = fmMatch ? fmMatch[1] : '';
    
    // Parsear valores simples do frontmatter
    const getFmValue = (key) => {
        const match = frontmatter.match(new RegExp(`${key}:\\s*(.*)`));
        return match ? match[1].trim() : '';
    };

    const metadata = {
        title: getFmValue('title'),
        description: getFmValue('description'),
        pos: getFmValue('sidebar_position')
    };

    // Separar o conteúdo após o Frontmatter
    let body = content.replace(fmRegex, '').trim();

    // Tentar identificar as Seções de Grid (### Titulo ... <TopicGrid>...</TopicGrid>)
    // Esta regex procura: ### Titulo [qualquer coisa] <TopicGrid> [conteudo] </TopicGrid>
    const sectionRegex = /###\s+(.*?)\s*<TopicGrid>([\s\S]*?)<\/TopicGrid>/g;
    
    const sections = [];
    let match;
    let lastIndex = 0;

    // Loop para encontrar todas as seções de Grid
    while ((match = sectionRegex.exec(body)) !== null) {
        const title = match[1].trim();
        const gridContent = match[2];
        const cards = [];

        // Extrair Cards dentro do Grid
        const cardRegex = /<TopicCard\s+([\s\S]*?)\/>/g;
        let cardMatch;
        while ((cardMatch = cardRegex.exec(gridContent)) !== null) {
            const propsStr = cardMatch[1];
            // Função auxiliar para pegar props (title="Val" ou title='Val')
            const getProp = (key) => {
                const pMatch = propsStr.match(new RegExp(`${key}=["'](.*?)["']`));
                return pMatch ? pMatch[1] : '';
            };
            cards.push({
                title: getProp('title'),
                description: getProp('description'),
                link: getProp('link'),
                icon: getProp('icon')
            });
        }

        sections.push({ title, cards });
        lastIndex = match.index + match[0].length;
    }

    // O resto do conteúdo (Intro + Material Extra no final)
    // Para simplificar, o texto antes do primeiro grid é "Intro"
    // E o texto depois do último grid é "Footer"
    
    const footerContent = body.substring(lastIndex).trim();
    
    const firstSectionIdx = body.search(/###\s+(.*?)\s*<TopicGrid>/);
    const introContent = firstSectionIdx > 0 ? body.substring(0, firstSectionIdx).trim() : '';

    return { metadata, introContent, sections, footerContent };
}

function buildIndexMdx(data) {
    let mdx = `---\nsidebar_position: ${data.metadata.pos}\ntitle: ${data.metadata.title}\ndescription: ${data.metadata.description}\nhide_table_of_contents: true\n---\n\n`;

    mdx += `${data.introContent}\n\n`;

    data.sections.forEach(sec => {
        mdx += `### ${sec.title}\n\n<TopicGrid>\n\n`;
        sec.cards.forEach(c => {
            mdx += `    <TopicCard \n    title="${c.title}" \n    description="${c.description}" \n    link="${c.link}" \n    icon="${c.icon}"\n    />\n\n`;
        });
        mdx += `</TopicGrid>\n\n`;
    });

    mdx += `${data.footerContent}\n`;
    return mdx;
}


// =============================================================================
//                          COMPONENTE VISUAL DE CARD
// =============================================================================

const TopicCardRow = ({ card, onUpdate, onDelete, onOpenPicker }) => {
    return (
        <div className="card padding--sm margin-bottom--sm" style={{border: '1px solid var(--ifm-color-emphasis-200)', backgroundColor: 'var(--ifm-background-surface-color)'}}>
            <div className="row" style={{alignItems: 'center'}}>
                {/* Ícone */}
                <div className="col col--1 text--center pointer" onClick={onOpenPicker}>
                     <img src={useBaseUrl(card.icon)} style={{width: '30px', filter: 'invert(1)'}} onError={(e)=>e.target.style.display='none'} />
                </div>
                
                {/* Inputs */}
                <div className="col col--10">
                    <div className="row" style={{marginBottom: '5px'}}>
                        <div className="col col--4">
                            <input type="text" className="button button--outline button--secondary button--block button--sm" placeholder="Título"
                                value={card.title} onChange={e => onUpdate('title', e.target.value)} style={{textAlign:'left'}} />
                        </div>
                        <div className="col col--4">
                            <input type="text" className="button button--outline button--secondary button--block button--sm" placeholder="Link (/docs/...)"
                                value={card.link} onChange={e => onUpdate('link', e.target.value)} style={{textAlign:'left'}} />
                        </div>
                        <div className="col col--4" style={{display:'flex', gap:'5px'}}>
                             <input type="text" className="button button--outline button--secondary button--block button--sm" placeholder="Ícone"
                                value={card.icon} disabled style={{textAlign:'left', opacity: 0.7}} />
                             <button className="button button--sm button--primary" onClick={onOpenPicker}>📂</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col--12">
                            <input type="text" className="button button--outline button--secondary button--block button--sm" placeholder="Descrição curta..."
                                value={card.description} onChange={e => onUpdate('description', e.target.value)} style={{textAlign:'left'}} />
                        </div>
                    </div>
                </div>

                {/* Delete */}
                <div className="col col--1 text--right">
                    <button className="button button--sm button--danger" onClick={onDelete}>✕</button>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
//                             EDITOR PRINCIPAL
// =============================================================================

export default function TopicEditor({ onBack, userToken }) {
    const [step, setStep] = useState(1); // 1: Seleção, 2: Edição
    const [area, setArea] = useState('programacao');
    const [folders, setFolders] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    
    // Dados do Arquivo
    const [loading, setLoading] = useState(false);
    const [mdxData, setMdxData] = useState(null);
    const [status, setStatus] = useState({type:'', msg:''});

    // Picker
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState(null); // { secIdx, cardIdx }

    // Carregar pastas ao mudar área
    useEffect(() => {
        async function loadFolders() {
            setLoading(true);
            try {
                const items = await getFolders(`minervacore/docs/${area}`, userToken);
                setFolders(items.map(i => i.name));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadFolders();
    }, [area, userToken]);

    // Carregar arquivo index.mdx
    const handleLoadTopic = async (topicName) => {
        setLoading(true);
        setSelectedTopic(topicName);
        try {
            const path = `minervacore/docs/${area}/${topicName}/index.mdx`;
            const file = await getFileContent(path, userToken);
            const parsed = parseIndexMdx(file.content);
            setMdxData(parsed);
            setStep(2); // Vai para edição
        } catch (e) {
            alert("Erro: Não foi possível encontrar o arquivo index.mdx nesta pasta.\nCertifique-se que a pasta tem a estrutura correta.");
        } finally {
            setLoading(false);
        }
    };

    // Salvar
    const handleSave = async () => {
        setLoading(true);
        setStatus({type:'info', msg:'Gerando Pull Request...'});
        try {
            const newContent = buildIndexMdx(mdxData);
            const path = `minervacore/docs/${area}/${selectedTopic}/index.mdx`;
            
            const link = await createPullRequest({
                token: userToken,
                filePath: path,
                newContent: newContent,
                prTitle: `Update Topic: ${selectedTopic}`,
                prBody: `Atualização da página principal do tópico ${selectedTopic} via Editor.`
            });
            setStatus({type:'success', msg: link});
        } catch(e) {
            setStatus({type:'danger', msg: e.message});
        } finally {
            setLoading(false);
        }
    };

    // MANIPULADORES DE ESTADO
    
    const updateMeta = (key, val) => {
        setMdxData({...mdxData, metadata: {...mdxData.metadata, [key]: val}});
    };

    const updateCard = (secIdx, cardIdx, field, val) => {
        const newData = {...mdxData};
        newData.sections[secIdx].cards[cardIdx][field] = val;
        setMdxData(newData);
    };

    const addCard = (secIdx) => {
        const newData = {...mdxData};
        newData.sections[secIdx].cards.push({
            title: 'Novo Tópico', description: 'Descrição...', link: '/docs/...', icon: '/img/icons/code.svg'
        });
        setMdxData(newData);
    };

    const removeCard = (secIdx, cardIdx) => {
        const newData = {...mdxData};
        newData.sections[secIdx].cards.splice(cardIdx, 1);
        setMdxData(newData);
    };

    // RENDER

    if (loading) return <div className="container text--center margin-vert--xl"><h2>⏳ Carregando...</h2></div>;

    // SELECIONAR TÓPICO
    if (step === 1) return (
        <div className="container margin-vert--md">
            <button className="button button--link" onClick={onBack}>← Voltar</button>
            <h2>📂 Selecione um Tópico</h2>
            
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
                        <div className="card padding--md pointer" onClick={() => handleLoadTopic(f)} style={{border: '1px solid #444', textAlign:'center'}}>
                            <h3>📁 {f}</h3>
                            <small>Editar index.mdx</small>
                        </div>
                    </div>
                ))}
                {/* Botão para criar novo tópico (Placeholder) */}
                <div className="col col--3 margin-bottom--md">
                     <div className="card padding--md pointer" style={{border: '2px dashed #666', opacity: 0.7, textAlign:'center'}}>
                        <h3>+ Novo</h3>
                        <small>Criar Pasta</small>
                    </div>
                </div>
            </div>
        </div>
    );

    // EDITOR
    if (status.type === 'success') return (
         <div className="container text--center margin-vert--xl">
            <div className="alert alert--success">
                <h3>✅ Pull Request Criado!</h3>
                <a href={status.msg} target="_blank" className="button button--primary">Ver PR</a>
                <button className="button button--link margin-left--md" onClick={() => setStatus({type:'', msg:''})}>Continuar Editando</button>
            </div>
        </div>
    );

    return (
        <div className="container margin-vert--md">
            {showPicker && <IconPicker userToken={userToken} onClose={()=>setShowPicker(false)} onSelect={(path) => {
                updateCard(pickerTarget.secIdx, pickerTarget.cardIdx, 'icon', path);
                setShowPicker(false);
            }} />}

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <button className="button button--link" onClick={() => setStep(1)}>← Voltar para Pastas</button>
                <h2>Editando: {selectedTopic}</h2>
                <button className="button button--success" onClick={handleSave}>Salvar Alterações</button>
            </div>

            {status.msg && <div className={`alert alert--${status.type}`}>{status.msg}</div>}

            {/* METADADOS */}
            <div className="card padding--md margin-bottom--lg" style={{backgroundColor: '#1b1b1d'}}>
                <h4>⚙️ Configurações da Página</h4>
                <div className="row">
                    <div className="col col--6">
                        <small>Título (H1)</small>
                        <input className="button button--block button--outline button--secondary" value={mdxData.metadata.title} onChange={e=>updateMeta('title', e.target.value)} style={{textAlign:'left'}} />
                    </div>
                    <div className="col col--2">
                        <small>Posição (Sidebar)</small>
                        <input className="button button--block button--outline button--secondary" value={mdxData.metadata.pos} onChange={e=>updateMeta('pos', e.target.value)} style={{textAlign:'left'}} />
                    </div>
                    <div className="col col--12 margin-top--sm">
                        <small>Descrição (SEO)</small>
                        <input className="button button--block button--outline button--secondary" value={mdxData.metadata.description} onChange={e=>updateMeta('description', e.target.value)} style={{textAlign:'left'}} />
                    </div>
                </div>
                <div className="margin-top--md">
                     <small>Introdução (Texto antes dos grids)</small>
                     <textarea className="button button--block button--outline button--secondary" rows={3} value={mdxData.introContent} onChange={e=>setMdxData({...mdxData, introContent: e.target.value})} style={{textAlign:'left', fontFamily:'monospace'}} />
                </div>
            </div>

            {/* SEÇÕES DE GRID */}
            <h3 className="margin-bottom--md">Trilhas de Aprendizado (Grids)</h3>
            {mdxData.sections.map((sec, secIdx) => (
                <div key={secIdx} className="card padding--md margin-bottom--lg" style={{border: '1px solid var(--ifm-color-primary)'}}>
                    <div className="row margin-bottom--md">
                        <div className="col col--8">
                            <h3 style={{margin:0}}>Seção: {sec.title}</h3>
                        </div>
                    </div>
                    
                    {sec.cards.map((card, cardIdx) => (
                        <TopicCardRow 
                            key={cardIdx} 
                            card={card} 
                            onUpdate={(f, v) => updateCard(secIdx, cardIdx, f, v)}
                            onDelete={() => removeCard(secIdx, cardIdx)}
                            onOpenPicker={() => { setPickerTarget({secIdx, cardIdx}); setShowPicker(true); }}
                        />
                    ))}

                    <button className="button button--block button--secondary button--outline button--sm margin-top--sm" onClick={()=>addCard(secIdx)}>
                        + Adicionar Card em "{sec.title}"
                    </button>
                </div>
            ))}

            {/* FOOTER (MATERIAL EXTRA) */}
            <div className="card padding--md margin-top--xl">
                <h4>Conteúdo Extra</h4>
                <p style={{fontSize:'0.8rem'}}>Edite aqui as playlists, vídeos e textos que ficam no final da página.</p>
                <textarea 
                    className="button button--block button--outline button--secondary" 
                    rows={10} 
                    value={mdxData.footerContent} 
                    onChange={e=>setMdxData({...mdxData, footerContent: e.target.value})} 
                    style={{textAlign:'left', fontFamily:'monospace', minHeight: '200px'}} 
                />
            </div>
        </div>
    );
}