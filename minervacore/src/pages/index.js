import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Dados dos tópicos pais
const KnowledgeTopics = [
  { 
    title: 'C++', 
    link: '/docs/cpp',
    iconSrc: '/img/icons/cpp.svg' 
  },

  { 
    title: 'Python', 
    link: '/docs/python',
    iconSrc: '/img/icons/python.svg'
  },

  {
    title: 'Arduino', 
    link: '/docs/arduino',
    iconSrc: '/img/icons/arduino.svg' 
  },

  { 
    title: 'ROS 2', 
    link: '/docs/ros2',
    iconSrc: '/img/icons/ros.svg'
  },

  { 
    title: 'Componentes', 
    link: '/docs/componentes',
    iconSrc: '/img/icons/chip.svg'
  },
];

// header (capa)
function HeroHeader() {
  return (
    <header className="hero-header">
      <div className="hero-bg-image" />
      <div className="hero-overlay" />

      <div className="hero-header-content">
        <img 
          src="img/minervacore-logo-transp.png" 
          alt="MinervaCore Logo" 
          className="hero-logo" 
        />
        <h1 className="hero-title">MinervaCore</h1>
        <p className="hero-subtitle">
          O núcleo de conhecimento da MinervaBots para EletroProgs!
        </p>
      </div>
    </header>
  );
}

// cards dos tópicos
function TopicsGrid() {
  return (
    <section className="topics-section">
      <div className="container">
        <div style={{
            textAlign: 'center', 
            marginBottom: '3rem', 
            borderBottom: '1px solid #333',
            paddingBottom: '20px'
        }}>
           <h1 style={{color: 'white', textTransform: 'uppercase', letterSpacing: '1px'}}>
             Trilhas de Aprendizado
           </h1>
        </div>

        <div className="knowledge-grid">
          {KnowledgeTopics.map((topic, idx) => (
            <Link key={idx} to={topic.link} className="knowledge-card">
              
              {topic.iconSrc ? (
                  <div className="card-icon-container">
                    <img src={topic.iconSrc} alt={topic.title} className="card-icon" />
                  </div>
              ) : (
                  <div style={{height: '50px', marginBottom: '20px'}}></div>
              )}

              <h3 className="card-title">{topic.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Início`}
      description="MinervaBots Firmware & Hardware Docs"
      noFooter={true}>
      
      <Head>
        <body className="homepage" />
      </Head>

      <main className="home-main-container">
        <HeroHeader />
        <TopicsGrid />
         <div style={{height: '100px'}}></div>
      </main>
      
    </Layout>
  );
}