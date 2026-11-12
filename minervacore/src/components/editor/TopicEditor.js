import React, { useState, useEffect, useRef } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { getFolders, getFileContent, createPullRequest } from '../../utils/githubApi';
import { splitFrontmatter, buildDocument, slugify } from '../../utils/markdownFormat';
import { parseTopicIndex, buildTopicBody, topicFrontmatter } from '../../utils/topicFormat';
import { loadRepoPaths, createSiteIndex } from '../../utils/siteIndex';
import { validateDocument } from '../../utils/contentValidation';
import IconPicker from './IconPicker';
import LinkPicker from './LinkPicker';
import ValidationPanel from './ValidationPanel';
import { Icons, RawIcons } from '../Icons';

// A leitura e a escrita do index.mdx ficam em utils/topicFormat.js: o
// frontmatter é escrito pelo js-yaml e os atributos dos cards são escapados,
// então aspas, dois-pontos e # nos textos não quebram mais o build.

// =============================================================================
//                          COMPONENTE VISUAL DE CARD
// =============================================================================

const TopicCardRow = ({ card, index, totalItems, onUpdate, onDelete, onMove, onOpenPicker, onOpenLinkPicker }) => {
    
    // Validação Visual (link vazio é permitido: vira um card "Em breve")
    const isTitleInvalid = !card.title || card.title.trim() === '';
    const isLinkInvalid = false;

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
                                    placeholder="Link (vazio = Em breve)"
                                    value={card.link} 
                                    onChange={e => onUpdate('link', e.target.value)} 
                                    style={{textAlign:'left', flex: 1, borderColor: isLinkInvalid ? 'red' : ''}} 
                                />
                                <button className="button button--sm button--secondary" onClick={() => onOpenLinkPicker('link')} title="Selecionar Página">
                                    {Icons.link}
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
                                {Icons.folder}
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
                            {Icons.moveUp}
                        </button>
                        <button 
                            className="button button--outline button--secondary" 
                            disabled={index === totalItems - 1}
                            onClick={() => onMove(1)}
                            style={{padding: '2px 4px', lineHeight: 0, height: '24px', opacity: index===totalItems-1 ? 0.3 : 1}}
                        >
                            {Icons.moveDown}
                        </button>
                    </div>
                    <button 
                        className="button button--danger button--outline" 
                        style={{padding: '2px', lineHeight: 0, height: '24px', width: '100%', marginTop: '3px', display:'flex', alignItems:'center', justifyContent:'center'}} 
                        onClick={onDelete}
                    >
                        {Icons.trash}
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
    const [originalBody, setOriginalBody] = useState(''); // para separar problemas novos dos que já existiam
    const [validation, setValidation] = useState(null);   // painel de verificação antes do PR
    const busyRef = useRef(false);

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
            setMdxData(parseTopicIndex(file.content));
            setOriginalBody(splitFrontmatter(file.content).body);
            setStep(2);
        } catch (e) {
            alert(/Not Found/i.test(e.message) ? "Erro: index.mdx não encontrado nesta pasta." : `Erro ao ler index.mdx: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Criação de novo tópico
    const handleNewTopic = () => {
        const name = prompt("Digite o nome da nova pasta (sem espaços, ex: machine-learning):");
        if (!name) return;

        // Limpa o nome para virar formato de URL/Pasta padrão ("Eletrônica" -> "eletronica")
        const cleanName = slugify(name);
        if (!cleanName) {
            alert("Nome inválido. Use letras e números.");
            return;
        }

        // Sem diferenciar maiúsculas: "espressif" e "Espressif" colidem no Windows
        if (folders.some((f) => f.toLowerCase() === cleanName)) {
            alert("Já existe uma pasta com esse nome nesta área!");
            return;
        }

        setSelectedTopic(cleanName);
        setOriginalBody('');

        // Inicializa com um template base para um novo tópico
        setMdxData({
            metadata: {
                title: 'Novo Tópico',
                description: 'Descrição do tópico para o Google (SEO)',
                pos: '1'
            },
            extraFrontmatter: {},
            introContent: `# Bem-vindo ao Tópico de ${cleanName}\n\nSelecione um dos itens abaixo para iniciar seus estudos.`,
            sections: [
                {
                    title: 'Início e Teoria',
                    cards: [],
                    after: ''
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
        
        // Cards (link vazio é permitido: vira "Em breve")
        for (const sec of mdxData.sections) {
            for (const card of sec.cards) {
                if (!card.title) return false;
            }
        }
        return true;
    };

    // Verificação antes do PR: mesma checagem do PageEditor, aplicada ao
    // index.mdx gerado. `locate` traduz a linha do erro para o card/campo.
    const startValidation = async (mode) => {
        if (busyRef.current) return;
        busyRef.current = true;
        setValidation({ mode, running: true });

        try {
            const filePath = `minervacore/docs/${area}/${selectedTopic}/index.mdx`;
            const { body, locate } = buildTopicBody(mdxData);
            const paths = await loadRepoPaths(userToken);
            const index = createSiteIndex(paths, { extraFiles: [filePath] });

            const result = await validateDocument({
                filePath,
                frontmatter: topicFrontmatter(mdxData),
                body,
                originalBody,
                index,
                locate,
            });

            if (mode === 'save' && result.errors.length === 0 && result.warnings.length === 0) {
                setValidation(null);
                await submitPullRequest();
            } else {
                setValidation({ mode, running: false, result });
            }
        } catch (e) {
            setValidation({ mode, running: false, error: `Não foi possível verificar o conteúdo: ${e.message}` });
        } finally {
            busyRef.current = false;
        }
    };

    const handleSave = () => startValidation('save');

    const confirmSave = async () => {
        if (busyRef.current) return;
        busyRef.current = true;
        setValidation(null);
        try {
            await submitPullRequest();
        } finally {
            busyRef.current = false;
        }
    };

    // Salvar
    const submitPullRequest = async () => {
        setLoading(true);
        setStatus({type:'info', msg:'Gerando Pull Request...'});
        try {
            const newContent = buildDocument(topicFrontmatter(mdxData), buildTopicBody(mdxData).body);
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
        // Começa sem link (= "Em breve"); antes o padrão "/docs/..." virava link quebrado
        newData.sections[secIdx].cards.push({
            title: 'Novo', description: '', link: '', icon: '/img/icons/code.svg'
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
        newData.sections.push({ title: 'Nova Seção', cards: [], after: '' });
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
    if (loading) {
        return (
            <div className="container text--center margin-vert--xl" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'}}>
                {Icons.loading}
                <h2 style={{margin: 0}}>Processando...</h2>
            </div>
        );
    }

    // SELECTOR
    if (step === 1) return (
        <div className="container margin-vert--md">
            <button className="button button--link" style={{display:'flex', gap:'5px', alignItems:'center'}} onClick={onBack}>
                {Icons.back} Voltar
            </button>
            <h2 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>{Icons.folder} Selecione um Tópico</h2>
            
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
                        <div className="card padding--md pointer" onClick={() => handleLoadTopic(f)} style={{border: '1px solid #444', textAlign:'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                            {Icons.folder}
                            <h3 style={{margin: 0}}>{f}</h3>
                            <small style={{margin: 0}}>Editar index.mdx</small>
                        </div>
                    </div>
                ))}
                
                {/* Card de Novo Tópico */}
                <div className="col col--3 margin-bottom--md">
                     <div className="card padding--md pointer" onClick={handleNewTopic} style={{border: '2px dashed var(--ifm-color-primary)', textAlign:'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '100%'}}>
                        {Icons.plus}
                        <h3 style={{margin:0}}>Novo Tópico</h3>
                    </div>
                </div>
            </div>
        </div>
    );

    // EDITOR
    if (status.type === 'success') return (
        <div className="container text--center margin-vert--xl">
            <div className="alert alert--success" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '30px'}}>
                {Icons.success}
                <h3 style={{margin: 0}}>Pull Request Criado!</h3>
                <p style={{margin: 0}}>A página do tópico foi enviada para revisão.</p>
                <small style={{opacity: 0.8}}>O GitHub ainda roda o build completo no PR. Se aparecer um X vermelho por lá, alguma coisa precisa de ajuste.</small>
                <div>
                    <a href={status.msg} target="_blank" rel="noreferrer" className="button button--primary">Ver PR</a>
                    <button className="button button--link margin-left--md" onClick={() => setStatus({type:'', msg:''})}>Voltar</button>
                </div>
            </div>
        </div>
    );

    const isValid = isFormValid();

    return (
        <div className="container margin-vert--md">
            
            {pickerType === 'icon' && <IconPicker userToken={userToken} onClose={()=>setPickerType(null)} onSelect={handlePickerSelect} />}
            {pickerType === 'link' && <LinkPicker userToken={userToken} onClose={()=>setPickerType(null)} onSelect={handlePickerSelect} />}

            <ValidationPanel
                state={validation}
                onClose={() => setValidation(null)}
                onConfirm={confirmSave}
                onRetry={() => startValidation(validation?.mode || 'check')}
            />

            {/* STICKY HEADER */}
            <div style={{
                position: 'sticky', top: '60px', zIndex: 100, 
                backgroundColor: 'var(--ifm-background-color)', 
                padding: '15px 0', borderBottom: '1px solid var(--ifm-color-emphasis-200)', marginBottom: '20px',
                display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
                <button className="button button--link" style={{display:'flex', gap:'5px', alignItems:'center'}} onClick={() => setStep(1)}>
                    {Icons.back} Voltar
                </button>
                <h2 style={{margin:0}}>Editando: {selectedTopic}</h2>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {!isValid && (
                        <span style={{color:'red', marginRight:'15px', fontSize:'0.85rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500'}}>
                            {Icons.warning} Preencha os campos obrigatórios
                        </span>
                    )}
                    <button className="button button--secondary margin-right--sm" onClick={() => startValidation('check')} title="Confere sintaxe, links e ícones sem enviar nada">
                        Verificar
                    </button>
                    <button className="button button--success" onClick={handleSave} disabled={!isValid}
                            style={{opacity: isValid ? 1 : 0.5, color: 'white'}}>
                        Salvar Alterações
                    </button>
                </div>
            </div>

            {status.msg && <div className={`alert alert--${status.type}`}>{status.msg}</div>}

            {/* METADADOS */}
            <div className="card padding--md margin-bottom--lg" style={{backgroundColor: '#1b1b1d'}}>
                <h4 style={{display:'flex', alignItems:'center', gap:'10px'}}>{Icons.settings} Configurações</h4>
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
                            <button className="button button--sm button--secondary button--outline" disabled={secIdx === 0} onClick={() => moveSection(secIdx, -1)}>{Icons.moveUp}</button>
                            <button className="button button--sm button--secondary button--outline" disabled={secIdx === mdxData.sections.length - 1} onClick={() => moveSection(secIdx, 1)}>{Icons.moveDown}</button>
                            <button className="button button--sm button--danger button--outline" onClick={()=>removeSection(secIdx)}>{Icons.trash}</button>
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
                <h4 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {Icons.edit} Conteúdo Extra (Markdown)
                </h4>
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