import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { getFolders, getFileContent, createPullRequest } from '../../utils/githubApi';
import IconPicker from './IconPicker';
import LinkPicker from './LinkPicker';

// ÍCONES SVG
const UiIcons = {
    moveUp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
    moveDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    folder: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
    link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    back: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
};

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

    // Procure (### Texto) opcionalmente, seguido de quebra de linha e <TopicGrid>
    const sectionRegex = /(?:###\s+(.*)\n\s*)?<TopicGrid>([\s\S]*?)<\/TopicGrid>/g;
    
    const sections = [];
    let match;
    let lastIndex = 0;
    let firstMatchIndex = -1;

    // Loop para encontrar todas as seções de Grid
    while ((match = sectionRegex.exec(body)) !== null) {
        if (firstMatchIndex === -1) firstMatchIndex = match.index;

        // match[1] é o título (pode ser undefined se não tiver ###)
        // match[2] é o conteúdo do grid
        const title = match[1] ? match[1].trim() : ''; 
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

    // Separar Intro e Footer
    // Intro é tudo antes do primeiro grid achado
    const introContent = firstMatchIndex > 0 ? body.substring(0, firstMatchIndex).trim() : '';
    
    // Footer é tudo depois do último grid
    // Se não achou grid nenhum, o footer é vazio e tudo vira intro (ou vice versa, mas aqui assumimos grids)
    const footerContent = lastIndex < body.length ? body.substring(lastIndex).trim() : '';

    return { metadata, introContent, sections, footerContent };
}

function buildIndexMdx(data) {
    let mdx = `---\nsidebar_position: ${data.metadata.pos}\ntitle: ${data.metadata.title}\ndescription: ${data.metadata.description}\nhide_table_of_contents: true\n---\n\n`;

    if (data.introContent) mdx += `${data.introContent}\n\n`;

    data.sections.forEach(sec => {
        if (sec.title && sec.title.trim() !== '') {
            mdx += `### ${sec.title}\n\n`;
        }
        
        mdx += `<TopicGrid>\n\n`;
        sec.cards.forEach(c => {
            mdx += `    <TopicCard \n    title="${c.title}" \n    description="${c.description}" \n    link="${c.link}" \n    icon="${c.icon}"\n    />\n\n`;
        });
        mdx += `</TopicGrid>\n\n`;
    });

    if (data.footerContent) mdx += `${data.footerContent}\n`;
    return mdx;
}

// =============================================================================
//                          COMPONENTE VISUAL DE CARD
// =============================================================================

const TopicCardRow = ({ card, index, totalItems, onUpdate, onDelete, onMove, onOpenPicker, onOpenLinkPicker }) => {
    
    // Validação Visual
    const isTitleInvalid = !card.title || card.title.trim() === '';
    const isLinkInvalid = !card.link || card.link.trim() === '';

    return (
        <div className="card padding--sm margin-bottom--sm" style={{
            border: '1px solid var(--ifm-color-emphasis-200)', 
            backgroundColor: 'var(--ifm-background-surface-color)',
            borderLeft: (isTitleInvalid || isLinkInvalid) ? '3px solid red' : '1px solid var(--ifm-color-emphasis-200)'
        }}>
            <div className="row" style={{alignItems: 'center'}}>
                {/* Ícone */}
                <div className="col col--1 text--center pointer" onClick={() => onOpenPicker('icon')} title="Alterar ícone">
                     <img 
                        src={useBaseUrl(card.icon)} 
                        style={{width: '40px', height: '40px', objectFit: 'contain', filter: 'invert(1)'}} 
                        onError={(e)=>e.target.style.display='none'} 
                     />
                </div>
                
                {/* Inputs */}
                <div className="col col--10">
                    <div className="row" style={{marginBottom: '5px'}}>
                        <div className="col col--4">
                            <input 
                                type="text" 
                                className="button button--outline button--secondary button--block button--sm" 
                                placeholder="Título"
                                value={card.title} 
                                onChange={e => onUpdate('title', e.target.value)} 
                                style={{textAlign:'left', borderColor: isTitleInvalid ? 'red' : ''}} 
                            />
                        </div>
                        <div className="col col--4">
                            <div style={{display: 'flex', gap: '5px'}}>
                                <input 
                                    type="text" 
                                    className="button button--outline button--secondary button--block button--sm" 
                                    placeholder="Link (/docs/...)"
                                    value={card.link} 
                                    onChange={e => onUpdate('link', e.target.value)} 
                                    style={{textAlign:'left', flex: 1, borderColor: isLinkInvalid ? 'red' : ''}} 
                                />
                                <button className="button button--sm button--secondary" onClick={() => onOpenLinkPicker('link')} title="Selecionar Página">
                                    {UiIcons.link}
                                </button>
                            </div>
                        </div>
                        <div className="col col--4" style={{display:'flex', gap:'5px'}}>
                             <input 
                                type="text" 
                                className="button button--outline button--secondary button--block button--sm" 
                                placeholder="Ícone"
                                value={card.icon} 
                                disabled 
                                style={{textAlign:'left', opacity: 0.7, flex: 1}} 
                             />
                             <button className="button button--sm button--secondary" onClick={() => onOpenPicker('icon')} title="Galeria">
                                {UiIcons.folder}
                             </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col--12">
                            <input 
                                type="text" 
                                className="button button--outline button--secondary button--block button--sm" 
                                placeholder="Descrição curta..."
                                value={card.description} 
                                onChange={e => onUpdate('description', e.target.value)} 
                                style={{textAlign:'left'}} 
                            />
                        </div>
                    </div>
                </div>

                {/* Ações (Move + Delete) */}
                <div className="col col--1" style={{display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center'}}>
                    <div className="button-group" style={{display:'flex', gap:'2px'}}>
                        <button 
                            className="button button--outline button--secondary" 
                            disabled={index === 0}
                            onClick={() => onMove(-1)}
                            style={{padding: '2px 4px', lineHeight: 0, height: '24px', opacity: index===0 ? 0.3 : 1}}
                        >
                            {UiIcons.moveUp}
                        </button>
                        <button 
                            className="button button--outline button--secondary" 
                            disabled={index === totalItems - 1}
                            onClick={() => onMove(1)}
                            style={{padding: '2px 4px', lineHeight: 0, height: '24px', opacity: index===totalItems-1 ? 0.3 : 1}}
                        >
                            {UiIcons.moveDown}
                        </button>
                    </div>
                    <button 
                        className="button button--danger button--outline" 
                        style={{padding: '2px', lineHeight: 0, height: '24px', width: '100%', marginTop: '3px', display:'flex', alignItems:'center', justifyContent:'center'}} 
                        onClick={onDelete}
                    >
                        {UiIcons.trash}
                    </button>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
//                           EDITOR PRINCIPAL
// =============================================================================

export default function TopicEditor({ onBack, userToken }) {
    const [step, setStep] = useState(1); 
    const [area, setArea] = useState('programacao');
    const [folders, setFolders] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    
    // Dados
    const [loading, setLoading] = useState(false);
    const [mdxData, setMdxData] = useState(null);
    const [status, setStatus] = useState({type:'', msg:''});

    // Pickers
    const [pickerType, setPickerType] = useState(null); // 'icon' ou 'link'
    const [pickerTarget, setPickerTarget] = useState(null); // { secIdx, cardIdx }

    // Carregar pastas
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

    // Carregar index.mdx
    const handleLoadTopic = async (topicName) => {
        setLoading(true);
        setSelectedTopic(topicName);
        try {
            const path = `minervacore/docs/${area}/${topicName}/index.mdx`;
            const file = await getFileContent(path, userToken);
            const parsed = parseIndexMdx(file.content);
            setMdxData(parsed);
            setStep(2);
        } catch (e) {
            alert("Erro: index.mdx não encontrado nesta pasta.");
        } finally {
            setLoading(false);
        }
    };

    // Criação de novo tópico
    const handleNewTopic = () => {
        const name = prompt("Digite o nome da nova pasta (sem espaços, ex: machine-learning):");
        if (!name) return;

        // Limpa o nome para virar formato de URL/Pasta padrão
        const cleanName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        if (folders.includes(cleanName)) {
            alert("Já existe uma pasta com esse nome nesta área!");
            return;
        }

        setSelectedTopic(cleanName);
        
        // Inicializa com um template base para um novo tópico
        setMdxData({
            metadata: {
                title: 'Novo Tópico',
                description: 'Descrição do tópico para o Google (SEO)',
                pos: '1'
            },
            introContent: `# Bem-vindo ao Tópico de ${cleanName}\n\nSelecione um dos itens abaixo para iniciar seus estudos.`,
            sections: [
                {
                    title: 'Início e Teoria',
                    cards: []
                }
            ],
            footerContent: '### Material Extra\n\nAdicione links e playlists aqui.'
        });

        setStep(2); // Pula para edição do index.mdx
    };

    // Validação
    const isFormValid = () => {
        if (!mdxData) return false;
        // Metadados básicos
        if (!mdxData.metadata.title) return false;
        
        // Cards
        for (const sec of mdxData.sections) {
            for (const card of sec.cards) {
                if (!card.title || !card.link) return false;
            }
        }
        return true;
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

    // Handlers
    const updateMeta = (key, val) => setMdxData({...mdxData, metadata: {...mdxData.metadata, [key]: val}});
    
    const updateSectionTitle = (secIdx, val) => {
        const newData = {...mdxData};
        newData.sections[secIdx].title = val;
        setMdxData(newData);
    };

    const updateCard = (secIdx, cardIdx, field, val) => {
        const newData = {...mdxData};
        newData.sections[secIdx].cards[cardIdx][field] = val;
        setMdxData(newData);
    };

    const moveCard = (secIdx, cardIdx, direction) => {
        const newData = {...mdxData};
        const cards = newData.sections[secIdx].cards;
        const temp = cards[cardIdx];
        cards[cardIdx] = cards[cardIdx + direction];
        cards[cardIdx + direction] = temp;
        setMdxData(newData);
    };

    const addCard = (secIdx) => {
        const newData = {...mdxData};
        newData.sections[secIdx].cards.push({
            title: 'Novo', description: '...', link: '/docs/...', icon: '/img/icons/code.svg'
        });
        setMdxData(newData);
    };

    const removeCard = (secIdx, cardIdx) => {
        if(!confirm("Apagar card?")) return;
        const newData = {...mdxData};
        newData.sections[secIdx].cards.splice(cardIdx, 1);
        setMdxData(newData);
    };

    const addSection = () => {
        const newData = {...mdxData};
        newData.sections.push({ title: 'Nova Seção', cards: [] });
        setMdxData(newData);
    };

    const removeSection = (secIdx) => {
        if(!confirm("Apagar seção inteira?")) return;
        const newData = {...mdxData};
        newData.sections.splice(secIdx, 1);
        setMdxData(newData);
    };

    const moveSection = (secIdx, direction) => {
        const newData = {...mdxData};
        const sections = newData.sections;
        const temp = sections[secIdx];
        sections[secIdx] = sections[secIdx + direction];
        sections[secIdx + direction] = temp;
        setMdxData(newData);
    };

    // Picker Handlers
    const openPicker = (type, secIdx, cardIdx) => {
        setPickerType(type);
        setPickerTarget({ secIdx, cardIdx });
    };

    const handlePickerSelect = (val) => {
        if (pickerTarget) {
            const field = pickerType === 'icon' ? 'icon' : 'link';
            updateCard(pickerTarget.secIdx, pickerTarget.cardIdx, field, val);
        }
        setPickerType(null);
    };

    // RENDER
    if (loading) return <div className="container text--center margin-vert--xl"><h2>⏳ Carregando...</h2></div>;

    // SELECTOR
    if (step === 1) return (
        <div className="container margin-vert--md">
            <button className="button button--link" style={{display:'flex', gap:'5px', alignItems:'center'}} onClick={onBack}>
                {UiIcons.back} Voltar
            </button>
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
                
                {/* Card de Novo Tópico */}
                <div className="col col--3 margin-bottom--md">
                     <div className="card padding--md pointer" onClick={handleNewTopic} style={{border: '2px dashed var(--ifm-color-primary)', textAlign:'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
                        <h3 style={{margin:0}}>+ Novo Tópico</h3>
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

    const isValid = isFormValid();

    return (
        <div className="container margin-vert--md">
            
            {pickerType === 'icon' && <IconPicker userToken={userToken} onClose={()=>setPickerType(null)} onSelect={handlePickerSelect} />}
            {pickerType === 'link' && <LinkPicker userToken={userToken} onClose={()=>setPickerType(null)} onSelect={handlePickerSelect} />}

            {/* STICKY HEADER */}
            <div style={{
                position: 'sticky', top: '60px', zIndex: 100, 
                backgroundColor: 'var(--ifm-background-color)', 
                padding: '15px 0', borderBottom: '1px solid var(--ifm-color-emphasis-200)', marginBottom: '20px',
                display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
                <button className="button button--link" style={{display:'flex', gap:'5px', alignItems:'center'}} onClick={() => setStep(1)}>
                    {UiIcons.back} Voltar
                </button>
                <h2 style={{margin:0}}>Editando: {selectedTopic}</h2>
                <div>
                    {!isValid && <span style={{color:'red', marginRight:'10px', fontSize:'0.8rem'}}>⚠️ Preencha os campos obrigatórios</span>}
                    <button className="button button--success" onClick={handleSave} disabled={!isValid} style={{opacity: isValid ? 1 : 0.5}}>
                        Salvar Alterações
                    </button>
                </div>
            </div>

            {status.msg && <div className={`alert alert--${status.type}`}>{status.msg}</div>}

            {/* METADADOS */}
            <div className="card padding--md margin-bottom--lg" style={{backgroundColor: '#1b1b1d'}}>
                <h4 style={{display:'flex', alignItems:'center', gap:'10px'}}>{UiIcons.settings} Configurações</h4>
                <div className="row">
                    <div className="col col--6">
                        <small>Título (H1)</small>
                        <input className="button button--block button--outline button--secondary" value={mdxData.metadata.title} onChange={e=>updateMeta('title', e.target.value)} style={{textAlign:'left'}} />
                    </div>
                    <div className="col col--2">
                        <small>Posição (Sidebar)</small>
                        <input className="button button--block button--outline button--secondary" type="number" value={mdxData.metadata.pos} onChange={e=>updateMeta('pos', e.target.value)} style={{textAlign:'left'}} />
                    </div>
                    <div className="col col--12 margin-top--sm">
                        <small>Descrição (SEO)</small>
                        <input className="button button--block button--outline button--secondary" value={mdxData.metadata.description} onChange={e=>updateMeta('description', e.target.value)} style={{textAlign:'left'}} />
                    </div>
                </div>
                <div className="margin-top--md">
                     <small>Introdução (Texto antes dos cards)</small>
                     <textarea className="button button--block button--outline button--secondary" rows={3} value={mdxData.introContent} onChange={e=>setMdxData({...mdxData, introContent: e.target.value})} style={{textAlign:'left', fontFamily:'monospace'}} />
                </div>
            </div>

            {/* GRIDS (SEÇÕES) */}
            <h3 className="margin-bottom--md">Trilhas (Grids)</h3>
            {mdxData.sections.map((sec, secIdx) => (
                <div key={secIdx} className="card padding--md margin-bottom--lg" style={{border: '1px solid var(--ifm-color-primary)'}}>
                    <div className="row margin-bottom--md" style={{alignItems:'center'}}>
                        <div className="col col--8">
                            <small>Título da Seção (Opcional)</small>
                            <input 
                                className="button button--block button--outline button--secondary" 
                                value={sec.title} 
                                onChange={e=>updateSectionTitle(secIdx, e.target.value)} 
                                placeholder="(Deixe vazio para sem título)"
                                style={{textAlign:'left', fontWeight:'bold'}} 
                            />
                        </div>
                        <div className="col col--4 text--right" style={{display:'flex', gap:'5px', justifyContent:'flex-end'}}>
                            {/* REORDENAÇÃO DE SEÇÃO */}
                            <button className="button button--sm button--secondary button--outline" disabled={secIdx === 0} onClick={() => moveSection(secIdx, -1)}>{UiIcons.moveUp}</button>
                            <button className="button button--sm button--secondary button--outline" disabled={secIdx === mdxData.sections.length - 1} onClick={() => moveSection(secIdx, 1)}>{UiIcons.moveDown}</button>
                            <button className="button button--sm button--danger button--outline" onClick={()=>removeSection(secIdx)}>{UiIcons.trash}</button>
                        </div>
                    </div>
                    
                    {sec.cards.map((card, cardIdx) => (
                        <TopicCardRow 
                            key={cardIdx}
                            index={cardIdx}
                            totalItems={sec.cards.length}
                            card={card} 
                            onUpdate={(f, v) => updateCard(secIdx, cardIdx, f, v)}
                            onDelete={() => removeCard(secIdx, cardIdx)}
                            onMove={(dir) => moveCard(secIdx, cardIdx, dir)}
                            onOpenPicker={(type) => openPicker(type, secIdx, cardIdx)}
                            onOpenLinkPicker={(type) => openPicker(type, secIdx, cardIdx)}
                        />
                    ))}

                    <button className="button button--block button--secondary button--outline button--sm margin-top--sm" onClick={()=>addCard(secIdx)}>
                        + Adicionar Card
                    </button>
                </div>
            ))}
            
            <div className="text--center">
                <button className="button button--primary" onClick={addSection}>+ Nova Seção de Grid</button>
            </div>

            {/* FOOTER */}
            <div className="card padding--md margin-top--xl">
                <h4>📝 Conteúdo Extra (Markdown)</h4>
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