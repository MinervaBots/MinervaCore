// Componente para facilidar a criação dos cartões de tópicos em markdown

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Componente individual do cartão
export const TopicCard = ({ title, description, link, icon }) => {
  
  const imagePath = useBaseUrl(icon || '/img/icons/chip.svg');

  const content = (
    <>
      <div className="topic-icon-box">
        <img src={imagePath} className="topic-icon" alt={title} />
      </div>
      <div className="topic-content">
        <h3 className="topic-title">{title}</h3>
        {description && <p className="topic-desc">{description}</p>}
      </div>
    </>
  );

  // Sem link = conteúdo ainda não escrito. Antes era preciso inventar um
  // link (como "/docs/"), que virava link quebrado no site.
  if (!link) {
    return (
      <div className="topic-card topic-card--soon" aria-disabled="true">
        {content}
        <span className="topic-card__badge">Em breve</span>
      </div>
    );
  }

  return (
    <Link to={link} className="topic-card">
      {content}
    </Link>
  );
};

// Container Grid
export const TopicGrid = ({ children }) => {
  return <div className="topic-grid">{children}</div>;
};