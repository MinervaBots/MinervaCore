// Componente para facilidar a criação dos cartões de tópicos em markdown

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Componente individual do cartão
export const TopicCard = ({ title, description, link, icon }) => {
  
  const imagePath = useBaseUrl(icon || '/img/icons/chip.svg');

  return (
    <Link to={link} className="topic-card">
      <div className="topic-icon-box">
        <img src={imagePath} className="topic-icon" alt={title} />
      </div>
      <div className="topic-content">
        <h3 className="topic-title">{title}</h3>
        {description && <p className="topic-desc">{description}</p>}
      </div>
    </Link>
  );
};

// Container Grid
export const TopicGrid = ({ children }) => {
  return <div className="topic-grid">{children}</div>;
};