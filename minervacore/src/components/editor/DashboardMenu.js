// Arquivo que contém o menu principal da página de alterações

import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Card Individual
const DashboardCard = ({ item, onSelect }) => (
  <div className="col col--4">
    <div 
      className="card shadow--md"
      style={{
        cursor: 'pointer', height: '100%', 
        transition: 'transform 0.2s', border: '1px solid var(--ifm-color-emphasis-200)'
      }}
      onClick={() => onSelect(item.id)}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="card__image" style={{height: '160px', overflow: 'hidden', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
         {/* Fallback para evitar erros de render */}
         <img 
            src={useBaseUrl(item.image)} 
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = useBaseUrl(item.fallbackIcon);
                e.target.style.width = '50px';
                e.target.style.filter = 'invert(1)';
            }}
            style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8}}
         />
      </div>
      <div className="card__body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div className="card__footer">
        <button className="button button--primary button--block" style={{color: '#fff', fontWeight: 'bold'}}>
            Acessar
        </button>
      </div>
    </div>
  </div>
);

export default function DashboardMenu({ onSelectOption }) {
  const menuItems = [
    {
      id: 'home', title: 'Editar Home', description: 'Botões da página inicial.',
      image: 'img/dashboard/home-edit.png', fallbackIcon: 'img/icons/code.svg'
    },
    {
      id: 'topics', title: 'Gerenciar Tópicos', description: 'Pastas e categorias.',
      image: 'img/dashboard/topics-edit.png', fallbackIcon: 'img/icons/chip.svg'
    },
    {
      id: 'pages', title: 'Editar Páginas', description: 'Wikis Markdown.',
      image: 'img/dashboard/pages-edit.png', fallbackIcon: 'img/icons/markdown.svg'
    }
  ];

  return (
    <div className="container margin-vert--xl">
      <div className="text--center margin-bottom--lg">
        <h1>Painel MinervaCore</h1>
        <p>Selecione uma ferramenta administrativa</p>
      </div>
      <div className="row">
        {menuItems.map((item) => (
          <DashboardCard key={item.id} item={item} onSelect={onSelectOption} />
        ))}
      </div>
    </div>
  );
}