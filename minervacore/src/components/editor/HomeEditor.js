import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { githubFetch, createPullRequest } from '../../utils/githubApi';
import IconPicker from './IconPicker';
import LinkPicker from './LinkPicker';

// ÍCONES SVG
const UiIcons = {
    moveUp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
    moveDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    folder: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
    link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
};

const HomeItemRow = ({ item, index, totalItems, onUpdate, onDelete, onMove, onOpenIconPicker, onOpenLinkPicker }) => {
  const fullIconPath = useBaseUrl(item.iconSrc);
  const isTitleInvalid = !item.title || item.title.trim() === '';
  const isLinkInvalid = !item.link || item.link.trim() === '';

  return (
    <div className="row margin-top--sm" style={{
        backgroundColor: 'var(--ifm-color-emphasis-100)', 
        padding: '12px 5px', 
        borderRadius: '6px', 
        alignItems: 'center', 
        borderLeft: (isTitleInvalid || isLinkInvalid) ? '3px solid red' : '3px solid transparent'
    }}>
        
        {/* Ícone Preview */}
        <div className="col col--1 text--center" style={{cursor: 'pointer'}} onClick={onOpenIconPicker} title="Clique para alterar">
           <img 
             src={fullIconPath} 
             style={{width:'40px', height:'40px', filter:'invert(1)', objectFit: 'contain'}} 
             onError={(e)=>e.target.style.display='none'} 
             alt="icon"
           />
        </div>

        {/* Título */}
        <div className="col col--3">
           <small style={{fontWeight:600, opacity:0.8}}>Título</small>
           <input 
              type="text" 
              className="button button--outline button--secondary button--block" 
              style={{textAlign:'left', padding:'8px', cursor: 'text', borderColor: isTitleInvalid ? 'red' : ''}}
              value={item.title} 
              onChange={e => onUpdate('title', e.target.value)} 
           />
        </div>

        {/* Link com Botão */}
        <div className="col col--4">
           <small style={{fontWeight:600, opacity:0.8}}>Link</small>
           <div style={{display: 'flex', gap: '5px'}}>
               <input 
                  type="text" 
                  className="button button--outline button--secondary button--block" 
                  style={{textAlign:'left', padding:'8px', cursor: 'text', flex: 1, borderColor: isLinkInvalid ? 'red' : ''}}
                  value={item.link} 
                  onChange={e => onUpdate('link', e.target.value)} 
               />
               <button className="button button--sm button--secondary" onClick={onOpenLinkPicker} title="Selecionar Página" style={{padding:'0 10px'}}>
                   {UiIcons.link}
               </button>
           </div>
        </div>

        {/* Ícone Path com Botão */}
        <div className="col col--3">
           <small style={{fontWeight:600, opacity:0.8}}>Caminho Ícone</small>
           <div style={{display: 'flex', gap: '5px'}}>
               <input 
                  type="text" 
                  disabled
                  className="button button--outline button--secondary" 
                  style={{textAlign:'left', padding:'8px', cursor: 'default', flex: 1, fontSize: '0.7rem', opacity: 0.6}}
                  value={item.iconSrc} 
               />
               <button className="button button--sm button--secondary" onClick={onOpenIconPicker} title="Abrir Galeria" style={{padding:'0 10px'}}>
                   {UiIcons.folder}
               </button>
           </div>
        </div>

        {/* Ações */}
        <div className="col col--1" style={{display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center'}}>
            <div className="button-group" style={{display:'flex', gap:'2px'}}>
                <button 
                    className="button button--outline button--secondary" 
                    disabled={index === 0}
                    onClick={() => onMove(-1)}
                    style={{padding: '2px 4px', lineHeight: 0, height: '24px', opacity: index===0 ? 0.3 : 1}}
                    title="Mover para Cima"
                >
                    {UiIcons.moveUp}
                </button>
                <button 
                    className="button button--outline button--secondary" 
                    disabled={index === totalItems - 1}
                    onClick={() => onMove(1)}
                    style={{padding: '2px 4px', lineHeight: 0, height: '24px', opacity: index===totalItems-1 ? 0.3 : 1}}
                    title="Mover para Baixo"
                >
                    {UiIcons.moveDown}
                </button>
            </div>

            <button 
                className="button button--danger button--outline" 
                style={{padding: '2px', lineHeight: 0, height: '24px', width: '100%', marginTop: '3px', display:'flex', alignItems:'center', justifyContent:'center'}} 
                onClick={onDelete}
                title="Excluir"
            >
                {UiIcons.trash}
            </button>
        </div>
    </div>
  );
};

// =============================================================================
//                              HomeEditor
// =============================================================================

export default function HomeEditor({ onBack, userToken }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); 
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [activeTab, setActiveTab] = useState('programacao');
  
  const [pickerType, setPickerType] = useState(null); 
  const [pickerTarget, setPickerTarget] = useState(null); 

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await githubFetch('/contents/minervacore/src/data/homeData.js', userToken);
        const rawContent = decodeURIComponent(escape(atob(res.content)));
        const regex = /const SiteData = ([\s\S]*?);/;
        const match = rawContent.match(regex);
        
        if (!match || !match[1]) throw new Error("Formato inválido no homeData.js");

        // eslint-disable-next-line no-eval
        const parsedData = eval(`(${match[1]})`);
        setData(parsedData);
      } catch (e) {
        setStatus({ type: 'danger', msg: `Erro ao carregar: ${e.message}` });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userToken]);

  const isFormValid = () => {
      if (!data) return false;
      for (const cat of Object.keys(data)) {
          for (const group of data[cat]) {
              for (const item of group.items) {
                  if (!item.title || item.title.trim() === '') return false;
                  if (!item.link || item.link.trim() === '') return false;
              }
          }
      }
      return true;
  };

  const handleSave = async () => {
    if (!data) return;
    setLoading(true);
    setStatus({ type: 'info', msg: 'Criando Branch e Pull Request...' });

    try {
      const fileContent = `// Arquivo para armazenar a lista de dados do site
/* ==========================================================================
      DADOS DO SITE (Atualizado via Editor Web)
   ========================================================================== */
const SiteData = ${JSON.stringify(data, null, 2)};

export default SiteData;
`;
      
      const link = await createPullRequest({
        token: userToken,
        filePath: 'minervacore/src/data/homeData.js',
        newContent: fileContent,
        prTitle: 'Update: Home Buttons (Editor Web)',
        prBody: 'Atualização da estrutura da Home Page via Painel Administrativo.'
      });

      setStatus({ type: 'success', msg: link }); 
    } catch (e) {
      setStatus({ type: 'danger', msg: `Erro ao salvar: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (groupIdx, itemIdx, field, val) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].items[itemIdx][field] = val;
    setData(newData);
  };

  const handleMoveItem = (groupIdx, itemIdx, direction) => {
      const newData = { ...data };
      const items = newData[activeTab][groupIdx].items;
      const temp = items[itemIdx];
      items[itemIdx] = items[itemIdx + direction];
      items[itemIdx + direction] = temp;
      setData(newData);
  };

  const handleGroupTitleChange = (groupIdx, val) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].title = val;
    setData(newData);
  };

  const handleAddItem = (groupIdx) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].items.push({
        title: 'Novo Botão',
        link: '/docs/...',
        iconSrc: '/img/icons/code.svg'
    });
    setData(newData);
  };

  const handleDeleteItem = (groupIdx, itemIdx) => {
    if(!confirm("Apagar este botão?")) return;
    const newData = { ...data };
    newData[activeTab][groupIdx].items.splice(itemIdx, 1);
    setData(newData);
  };

  const handleAddGroup = () => {
    const newData = { ...data };
    newData[activeTab].push({ title: 'Novo Grupo', items: [] });
    setData(newData);
  };

  const handleDeleteGroup = (groupIdx) => {
    if(!confirm("Apagar grupo inteiro?")) return;
    const newData = { ...data };
    newData[activeTab].splice(groupIdx, 1);
    setData(newData);
  };

  const openPicker = (type, groupIdx, itemIdx) => {
      setPickerType(type);
      setPickerTarget({ groupIdx, itemIdx });
  };

  const handlePickerSelect = (val) => {
      if (pickerTarget) {
          const field = pickerType === 'icon' ? 'iconSrc' : 'link';
          handleChange(pickerTarget.groupIdx, pickerTarget.itemIdx, field, val);
      }
      setPickerType(null);
  };

  if (loading) return <div className="container text--center margin-vert--xl"><h2>⏳ Processando...</h2></div>;

  if (status.type === 'success') return (
    <div className="container text--center margin-vert--xl">
      <div className="alert alert--success">
        <h3>✅ Pull Request Criado!</h3>
        <p>Suas alterações estão esperando aprovação.</p>
        <a href={status.msg} target="_blank" className="button button--primary">Ver no GitHub</a>
        <button className="button button--link margin-left--md" onClick={() => setStatus({type:'', msg:''})}>Voltar</button>
      </div>
    </div>
  );

  const isValid = isFormValid();

  return (
    <div className="container margin-vert--md">
      
      {pickerType === 'icon' && (
          <IconPicker 
            userToken={userToken} 
            onClose={() => setPickerType(null)} 
            onSelect={handlePickerSelect} 
          />
      )}
      {pickerType === 'link' && (
          <LinkPicker 
            userToken={userToken} 
            onClose={() => setPickerType(null)} 
            onSelect={handlePickerSelect} 
          />
      )}

      {/* STICKY HEADER */}
      <div style={{
          position: 'sticky', top: '60px', zIndex: 100, 
          backgroundColor: 'var(--ifm-background-color)', 
          padding: '15px 0', borderBottom: '1px solid var(--ifm-color-emphasis-200)', marginBottom: '20px',
          display:'flex', justifyContent:'space-between', alignItems:'center'
      }}>
        <button className="button button--link" onClick={onBack}>← Voltar</button>
        <h2 style={{margin:0}}>Editando Home</h2>
        <div>
            {!isValid && <span style={{color:'red', marginRight:'10px', fontSize:'0.8rem'}}>⚠️ Preencha todos os campos</span>}
            <button className="button button--success" onClick={handleSave} disabled={!isValid} style={{opacity: isValid ? 1 : 0.5}}>
                Salvar Alterações
            </button>
        </div>
      </div>

      {status.msg && <div className={`alert alert--${status.type} margin-bottom--md`}>{status.msg}</div>}

      <ul className="tabs tabs--block margin-bottom--md">
        {['programacao', 'arquitetura', 'eletronica'].map(tab => (
           <li key={tab} className={`tabs__item ${activeTab === tab ? 'tabs__item--active' : ''}`} onClick={() => setActiveTab(tab)}>
               {tab.charAt(0).toUpperCase() + tab.slice(1)}
           </li> 
        ))}
      </ul>

      {data && data[activeTab] ? (
        <>
            {data[activeTab].map((group, gIdx) => (
                <div key={gIdx} className="card margin-bottom--md padding--md" style={{border: '1px solid var(--ifm-color-emphasis-300)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom:'1px solid #ccc', paddingBottom:'10px', marginBottom: '10px'}}>
                        <input type="text" className="button button--outline button--secondary" style={{fontWeight: 'bold', fontSize: '1.1rem', flex: 1, marginRight: '10px', textAlign: 'left', cursor: 'text'}}
                            value={group.title}
                            onChange={(e) => handleGroupTitleChange(gIdx, e.target.value)}
                        />
                        <button className="button button--sm button--danger button--outline" onClick={() => handleDeleteGroup(gIdx)}>Apagar Grupo</button>
                    </div>
                    
                    {group.items.map((item, iIdx) => (
                        <HomeItemRow 
                            key={iIdx}
                            index={iIdx}
                            totalItems={group.items.length}
                            item={item}
                            onUpdate={(field, val) => handleChange(gIdx, iIdx, field, val)}
                            onDelete={() => handleDeleteItem(gIdx, iIdx)}
                            onMove={(dir) => handleMoveItem(gIdx, iIdx, dir)}
                            onOpenIconPicker={() => openPicker('icon', gIdx, iIdx)} 
                            onOpenLinkPicker={() => openPicker('link', gIdx, iIdx)}
                        />
                    ))}

                    <button className="button button--block button--secondary button--outline margin-top--md" style={{borderStyle: 'dashed'}} onClick={() => handleAddItem(gIdx)}>
                        + Adicionar Botão em "{group.title}"
                    </button>
                </div>
            ))}
            <div className="text--center margin-vert--lg">
                <button className="button button--lg button--primary" onClick={handleAddGroup}>+ Criar Novo Grupo</button>
            </div>
        </>
      ) : <p>Carregando...</p>}
    </div>
  );
}