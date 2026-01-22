import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { githubFetch, createPullRequest } from '../../utils/githubApi';
import IconPicker from './IconPicker';
import LinkPicker from './LinkPicker';

const HomeItemRow = ({ item, index, totalItems, onUpdate, onDelete, onMove, onOpenIconPicker, onOpenLinkPicker }) => {
  const fullIconPath = useBaseUrl(item.iconSrc);
  
  // Validação Visual
  const isTitleInvalid = !item.title || item.title.trim() === '';
  const isLinkInvalid = !item.link || item.link.trim() === '';

  return (
    <div className="row margin-top--sm" style={{
        backgroundColor: 'var(--ifm-color-emphasis-100)', 
        padding: '10px', 
        borderRadius: '5px', 
        alignItems: 'center', 
        position: 'relative',
        borderLeft: (isTitleInvalid || isLinkInvalid) ? '3px solid red' : '3px solid transparent' // Indicador de erro lateral
    }}>
        
        {/* Ícone Preview */}
        <div className="col col--1 text--center" style={{cursor: 'pointer'}} onClick={onOpenIconPicker} title="Alterar ícone">
           <img 
             src={fullIconPath} 
             style={{width:'28px', filter:'invert(1)'}} 
             onError={(e)=>e.target.style.display='none'} 
             alt="icon"
           />
        </div>

        {/* Título */}
        <div className="col col--3">
           <small>Título {isTitleInvalid && <span style={{color:'red'}}>*</span>}</small>
           <input 
              type="text" 
              className="button button--outline button--secondary button--block" 
              style={{
                  textAlign:'left', padding:'5px', cursor: 'text',
                  borderColor: isTitleInvalid ? 'red' : ''
              }}
              value={item.title} 
              onChange={e => onUpdate('title', e.target.value)} 
           />
        </div>

        {/* Link com Picker */}
        <div className="col col--4">
           <small>Link {isLinkInvalid && <span style={{color:'red'}}>*</span>}</small>
           <div style={{display: 'flex', gap: '5px'}}>
               <input 
                  type="text" 
                  className="button button--outline button--secondary button--block" 
                  style={{
                      textAlign:'left', padding:'5px', cursor: 'text', flex: 1,
                      borderColor: isLinkInvalid ? 'red' : ''
                  }}
                  value={item.link} 
                  onChange={e => onUpdate('link', e.target.value)} 
               />
               <button className="button button--sm button--secondary" onClick={onOpenLinkPicker} title="Escolher Página">
                   🔗
               </button>
           </div>
        </div>

        {/* Ícone Path */}
        <div className="col col--3">
           <small>Ícone</small>
           <div style={{display: 'flex', gap: '5px'}}>
               <input 
                  type="text" 
                  disabled
                  className="button button--outline button--secondary" 
                  style={{textAlign:'left', padding:'5px', cursor: 'default', flex: 1, fontSize: '0.7rem', opacity: 0.7}}
                  value={item.iconSrc} 
               />
               <button className="button button--sm button--secondary" onClick={onOpenIconPicker} title="Escolher da Galeria">
                   📂
               </button>
           </div>
        </div>

        {/* Reordenar e Excluir */}
        <div className="col col--1 text--right" style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
            {/* Seta Cima (Desabilita se for o primeiro) */}
            <button 
                className="button button--xs button--secondary" 
                disabled={index === 0}
                onClick={() => onMove(-1)}
                title="Mover para cima"
            >
                ▲
            </button>
            
            {/* Seta Baixo (Desabilita se for o último) */}
            <button 
                className="button button--xs button--secondary" 
                disabled={index === totalItems - 1}
                onClick={() => onMove(1)}
                title="Mover para baixo"
            >
                ▼
            </button>

            {/* Excluir (X) */}
            <button 
                className="button button--xs button--danger" 
                style={{marginTop: '5px'}} 
                onClick={onDelete}
                title="Excluir"
            >
                ✕
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
  
  // ESTADOS DOS PICKERS
  const [pickerType, setPickerType] = useState(null); // 'icon' ou 'link' ou null
  const [pickerTarget, setPickerTarget] = useState(null); // { groupIdx, itemIdx }

  // Carregar Dados
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

  // VALIDAÇÃO GERAL
  const isFormValid = () => {
      if (!data) return false;
      // Varre todas as categorias
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

  // Salvar
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

  // HANDLERS DE DADOS

  const handleChange = (groupIdx, itemIdx, field, val) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].items[itemIdx][field] = val;
    setData(newData);
  };

  const handleMoveItem = (groupIdx, itemIdx, direction) => {
      const newData = { ...data };
      const items = newData[activeTab][groupIdx].items;
      
      // Troca de posição
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

  // HANDLERS DOS PICKERS
  
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

  // RENDER

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
      
      {/* MODAIS */}
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

      {/* HEADER FIXO */}
      <div style={{
          position: 'sticky', 
          top: '60px',
          zIndex: 100, 
          backgroundColor: 'var(--ifm-background-color)',
          padding: '15px 0',
          borderBottom: '1px solid var(--ifm-color-emphasis-200)',
          marginBottom: '20px',
          display:'flex', justifyContent:'space-between', alignItems:'center'
      }}>
        <button className="button button--link" onClick={onBack}>← Voltar</button>
        <h2 style={{margin:0}}>🎨 Editando Home</h2>
        <div>
            {!isValid && <span style={{color:'red', marginRight:'10px', fontSize:'0.8rem'}}>⚠️ Preencha todos os campos</span>}
            <button 
                className="button button--success" 
                onClick={handleSave}
                disabled={!isValid}
                style={{opacity: isValid ? 1 : 0.5}}
            >
                Salvar Alterações
            </button>
        </div>
      </div>

      {status.msg && <div className={`alert alert--${status.type} margin-bottom--md`}>{status.msg}</div>}

      {/* Abas */}
      <ul className="tabs tabs--block margin-bottom--md">
        {['programacao', 'arquitetura', 'eletronica'].map(tab => (
           <li key={tab} className={`tabs__item ${activeTab === tab ? 'tabs__item--active' : ''}`} onClick={() => setActiveTab(tab)}>
               {tab.charAt(0).toUpperCase() + tab.slice(1)}
           </li> 
        ))}
      </ul>

      {/* Editor de Lista */}
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