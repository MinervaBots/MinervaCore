import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { githubFetch, createPullRequest } from '../../utils/githubApi';

// =============================================================================
//                              Linha do Item
// =============================================================================
const HomeItemRow = ({ item, onUpdate, onDelete }) => {
  const fullIconPath = useBaseUrl(item.iconSrc);

  return (
    <div className="row margin-top--sm" style={{backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '10px', borderRadius: '5px', alignItems: 'center', position: 'relative'}}>
        
        {/* Ícone Preview */}
        <div className="col col--1">
           <img 
             src={fullIconPath} 
             style={{width:'24px', filter:'invert(1)'}} 
             onError={(e)=>e.target.style.display='none'} 
             alt="icon"
           />
        </div>

        {/* Inputs */}
        <div className="col col--3">
           <small>Título</small>
           <input 
              type="text" 
              className="button button--outline button--secondary button--block" 
              style={{textAlign:'left', padding:'5px', cursor: 'text'}}
              value={item.title} 
              onChange={e => onUpdate('title', e.target.value)} 
           />
        </div>

        <div className="col col--4">
           <small>Link</small>
           <input 
              type="text" 
              className="button button--outline button--secondary button--block" 
              style={{textAlign:'left', padding:'5px', cursor: 'text'}}
              value={item.link} 
              onChange={e => onUpdate('link', e.target.value)} 
           />
        </div>

        <div className="col col--3">
           <small>Icon Path</small>
           <input 
              type="text" 
              className="button button--outline button--secondary button--block" 
              style={{textAlign:'left', padding:'5px', cursor: 'text'}}
              value={item.iconSrc} 
              onChange={e => onUpdate('iconSrc', e.target.value)} 
           />
        </div>

        {/* Botão de Excluir Item (X) */}
        <div className="col col--1 text--right">
            <button 
                className="button button--sm button--danger" 
                style={{padding: '5px 10px'}}
                onClick={onDelete}
                title="Excluir este botão"
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

  // Salvar (Criar Pull Request)
  const handleSave = async () => {
    if (!data) return;
    
    // Pequena validação para não salvar dados quebrados
    if (!data.programacao || !data.arquitetura || !data.eletronica) {
        alert("Erro: A estrutura de dados parece corrompida. Recarregue a página.");
        return;
    }

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

  // FUNÇÕES DE MANIPULAÇÃO DE DADOS

  // Alterar valor de texto
  const handleChange = (groupIdx, itemIdx, field, val) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].items[itemIdx][field] = val;
    setData(newData);
  };

  // Alterar Título do Grupo
  const handleGroupTitleChange = (groupIdx, val) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].title = val;
    setData(newData);
  };

  // Adicionar Novo Item
  const handleAddItem = (groupIdx) => {
    const newData = { ...data };
    newData[activeTab][groupIdx].items.push({
        title: 'Novo Botão',
        link: '/docs/caminho/novo',
        iconSrc: '/img/icons/code.svg'
    });
    setData(newData);
  };

  // Remover Item
  const handleDeleteItem = (groupIdx, itemIdx) => {
    if(!confirm("Tem certeza que deseja apagar este botão?")) return;
    const newData = { ...data };
    newData[activeTab][groupIdx].items.splice(itemIdx, 1);
    setData(newData);
  };

  // Adicionar Novo Grupo
  const handleAddGroup = () => {
    const newData = { ...data };
    newData[activeTab].push({
        title: 'Novo Grupo de Títulos',
        items: [] // Começa vazio
    });
    setData(newData);
  };

  // Remover Grupo Inteiro
  const handleDeleteGroup = (groupIdx) => {
    if(!confirm("CUIDADO: Isso vai apagar o grupo inteiro e todos os botões dentro dele.\nContinuar?")) return;
    const newData = { ...data };
    newData[activeTab].splice(groupIdx, 1);
    setData(newData);
  };

  // RENDERIZAÇÃO

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

  return (
    <div className="container margin-vert--md">
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <button className="button button--link" onClick={onBack}>← Voltar</button>
        <h2>Editando Home</h2>
        <button className="button button--success" onClick={handleSave}>Salvar Alterações</button>
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
                    
                    {/* Header do Grupo com Botão de Excluir */}
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom:'1px solid #ccc', paddingBottom:'10px', marginBottom: '10px'}}>
                        <input 
                            type="text" 
                            className="button button--outline button--secondary" 
                            style={{fontWeight: 'bold', fontSize: '1.1rem', flex: 1, marginRight: '10px', textAlign: 'left', cursor: 'text'}}
                            value={group.title}
                            onChange={(e) => handleGroupTitleChange(gIdx, e.target.value)}
                        />
                        <button className="button button--sm button--danger button--outline" onClick={() => handleDeleteGroup(gIdx)}>
                            Apagar Grupo
                        </button>
                    </div>
                    
                    {/* Lista de Itens */}
                    {group.items.map((item, iIdx) => (
                        <HomeItemRow 
                            key={iIdx}
                            item={item}
                            onUpdate={(field, val) => handleChange(gIdx, iIdx, field, val)}
                            onDelete={() => handleDeleteItem(gIdx, iIdx)}
                        />
                    ))}

                    {/* Botão Adicionar Item no Grupo */}
                    <button 
                        className="button button--block button--secondary button--outline margin-top--md"
                        style={{borderStyle: 'dashed'}}
                        onClick={() => handleAddItem(gIdx)}
                    >
                        + Adicionar Novo Botão em "{group.title}"
                    </button>
                </div>
            ))}

            {/* Botão Adicionar Novo Grupo na Página */}
            <div className="text--center margin-vert--lg">
                <button 
                    className="button button--lg button--primary"
                    onClick={handleAddGroup}
                >
                    + Criar Novo Grupo de Títulos
                </button>
            </div>
        </>
      ) : <p>Carregando...</p>}
    </div>
  );
}