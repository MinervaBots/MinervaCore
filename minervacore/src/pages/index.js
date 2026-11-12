import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import SiteData from '../data/homeData';

/* ==========================================================================
                        COMPONENTES AUXILIARES
   ========================================================================== */

function HeroHeader() {
  return (
    <header className="hero-header">
      <div className="hero-bg-image" />
      <div className="hero-overlay" />
      <div className="hero-header-content">
        <img 
          src={useBaseUrl('img/minervacore-logo-transp.png')}
          alt="MinervaCore Logo" 
          className="hero-logo" 
        />
        <h1 className="hero-title">MinervaCore</h1>
        <p className="hero-subtitle">
          O núcleo de conhecimento da MinervaBots
        </p>
      </div>
    </header>
  );
}

function KnowledgeCard({ title, link, iconSrc }) {
    const iconUrl = useBaseUrl(iconSrc);
    const content = (
        <>
            {iconSrc ? (
              <div className="card-icon-container">
                <img src={iconUrl} alt={title} className="card-icon" />
              </div>
            ) : (
              <div style={{height: '50px', marginBottom: '20px'}}></div>
            )}
            <h3 className="card-title">{title}</h3>
        </>
    );

    // Sem link = conteúdo ainda não escrito
    if (!link) {
        return (
            <div className="knowledge-card knowledge-card--soon" aria-disabled="true">
                {content}
                <span className="knowledge-card__badge">Em breve</span>
            </div>
        );
    }

    return (
        <Link to={link} className="knowledge-card">
            {content}
        </Link>
    );
}

function CategorySection({ title, items }) {
  return (
    <div className="category-section fade-in" style={{marginBottom: '3rem'}}>
      <h2 style={{
        textAlign: 'center', fontSize: '1.4rem', marginBottom: '1.5rem',
        color: '#9e1f22', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'
      }}>
        {title}
      </h2>

      <div className="knowledge-grid">
        {items.map((item, idx) => (
            <KnowledgeCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
                        COMPONENTE PRINCIPAL (HOME)
   ========================================================================== */

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const [activeTab, setActiveTab] = useState('programacao');

  const TabButton = ({ id, label, iconPath }) => (
    <button 
        className={`tab-button ${activeTab === id ? 'active' : ''}`}
        onClick={() => setActiveTab(id)}
    >
        <img src={useBaseUrl(iconPath)} className="tab-icon-svg" alt="" />
        {label}
    </button>
  );

  return (
    <Layout
      title={`Início`}
      description="Núcleo de conhecimento da MinervaBots"
      noFooter={true}>
      
      <Head>
        <body className="homepage" />
      </Head>

      <main className="home-main-container">
        <HeroHeader />

        <div className="container">
            <div className="tabs-container">
                <TabButton 
                    id="programacao" 
                    label="Programação" 
                    iconPath="img/icons/code.svg" 
                />
                
                <TabButton 
                    id="arquitetura" 
                    label="Arq. Hardware" 
                    iconPath="img/icons/chip.svg" 
                />

                <TabButton 
                    id="eletronica" 
                    label="Eletrônica" 
                    iconPath="img/icons/diode.svg" 
                />
            </div>

            <div style={{ minHeight: '400px', paddingBottom: '100px' }}>
                {/* As três abas vão para o HTML e só a ativa aparece. Assim o build
                    enxerga os links de todas e avisa se algum estiver quebrado
                    (antes só os da primeira aba eram verificados). */}
                {Object.keys(SiteData).map((tab) => (
                    <div key={tab} hidden={activeTab !== tab}>
                        {SiteData[tab].map((category, idx) => (
                            <CategorySection
                                key={idx}
                                title={category.title}
                                items={category.items}
                            />
                        ))}
                    </div>
                ))}
            </div>

        </div>
      </main>
      
    </Layout>
  );
}