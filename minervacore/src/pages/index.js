import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

/* ==========================================================================
                              DADOS DO SITE
   ========================================================================== 
   
   O templante para criar novos botões é:
    - Escolher uma categoria (programacao, arquitetura, eletronica)
    - Adicionar um novo objeto no array 'items' da subcategoria desejada
    - Seguir o modelo:
        { 
          title: 'NOME DO TÓPICO',
          link: '/docs/caminho/para/o/topico',
          iconSrc: '/img/icons/nome-do-icone.svg' 
        }
   
   Lembre-se de criar o ícone SVG correspondente na pasta 'static/img/icons/'.
   Idealmente, os ícones devem ser simples e representativos do tópico.
   A maioria dos ícones podem ser encontrados nos seguintes sites:
    - simpleicons.org (para logos de empresas e tecnologias)
    - freesvgicons.com (para ícones genéricos)
*/
const SiteData = {
  programacao: [
    {
      title: 'Linguagens',
      items: [
        { title: 'C++', link: '/docs/programacao/cpp', iconSrc: '/img/icons/cpp.svg' },
        { title: 'Python', link: '/docs/programacao/python', iconSrc: '/img/icons/python.svg' },
        { title: 'Dart & Flutter', link: '/docs/programacao/dart-flutter', iconSrc: '/img/icons/dart.svg' },
        { title: 'Markdown', link: '/docs/programacao/markdown', iconSrc: '/img/icons/markdown.svg' },
        { title: 'NXC', link: '/docs/programacao/nxc', iconSrc: '/img/icons/nxc.svg' },
      ]
    },
    {
      title: 'Firmware & Sistemas Operacionais',
      items: [
        { title: 'Arduino', link: '/docs/programacao/arduino', iconSrc: '/img/icons/arduino.svg' },
        { title: 'Espressif IDF', link: '/docs/programacao/espressif', iconSrc: '/img/icons/espressif.svg' },
        { title: 'FreeRTOS', link: '/docs/programacao/freertos', iconSrc: '/img/icons/freertos.svg' },
        { title: 'PlatformIO', link: '/docs/programacao/platformio', iconSrc: '/img/icons/platformio.svg' },
        { title: 'ROS 2', link: '/docs/programacao/ros', iconSrc: '/img/icons/ros.svg' },
      ]
    },
    {
      title: 'Robótica & Algoritmos',
      items: [
        { title: 'Sistemas de Controle', link: '/docs/programacao/sistemas-controle', iconSrc: '/img/icons/robotic-arm.svg' },
        { title: 'Metaheurísticas', link: '/docs/programacao/metaheuristicas', iconSrc: '/img/icons/smart-optimization.svg' },
      ]
    },
    {
        title: 'Comunicação',
        items: [
          { title: 'JSON', link: '/docs/programacao/json', iconSrc: '/img/icons/json.svg' },
          { title: 'Wi-Fi', link: '/docs/programacao/wifi', iconSrc: '/img/icons/wifi.svg' },
          { title: 'Bluetooth', link: '/docs/programacao/bluetooth', iconSrc: '/img/icons/bluetooth.svg' },
        ]
    },
    {
      title: 'Ferramentas & Simuladores',
      items: [
        { title: 'Git', link: '/docs/programacao/git', iconSrc: '/img/icons/git.svg' },
        { title: 'Wokwi', link: '/docs/programacao/wokwi', iconSrc: '/img/icons/wokwi.svg' },
      ]
    }
  ],

  arquitetura: [
    {
      title: 'Conceitos de Hardware',
      items: [
        { title: 'Memória & Armazenamento', link: '/docs/arquitetura/memoria', iconSrc: '/img/icons/memory.svg' },
        { title: 'Clock & Interrupções', link: '/docs/arquitetura/clock', iconSrc: '/img/icons/chip.svg' },
        { title: 'Comunicação Serial', link: '/docs/arquitetura/serial', iconSrc: '/img/icons/chip.svg' },
      ]
    },
    {
      title: 'Microcontroladores',
      items: [
        { title: 'ESP-32', link: '/docs/arquitetura/esp32', iconSrc: '/img/icons/espressif.svg' },
      ]
    }
  ],

  eletronica: [
    {
      title: 'Componentes Básicos',
      items: [
        { title: 'Resistores', link: '/docs/eletronica/resistores', iconSrc: '/img/icons/resistor.svg' },
        { title: 'Capacitores', link: '/docs/eletronica/capacitores', iconSrc: '/img/icons/capacitor.svg' },
        { title: 'Diodos', link: '/docs/eletronica/diodos', iconSrc: '/img/icons/diode.svg' },
        { title: 'Transistores', link: '/docs/eletronica/transistores', iconSrc: '/img/icons/transistor.svg' },
      ]
    },
    {
      title: 'PCB',
      items: [
        { title: 'Altium Designer', link: '/docs/eletronica/altium', iconSrc: '/img/icons/altium.svg' },
      ]
    },
    {
      title: 'Sensores',
      items: [
        { title: 'Infravermelho', link: '/docs/eletronica/infravermelho', iconSrc: '/img/icons/infrared.svg' },
        { title: 'Ultrassom', link: '/docs/eletronica/ultrassom', iconSrc: '/img/icons/ultrasound.svg' },
        { title: 'IMU', link: '/docs/eletronica/imu', iconSrc: '/img/icons/chip.svg' },
      ]
    }
  ]
};

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
    return (
        <Link to={link} className="knowledge-card">
            {iconSrc ? (
              <div className="card-icon-container">
                <img src={iconUrl} alt={title} className="card-icon" />
              </div>
            ) : (
              <div style={{height: '50px', marginBottom: '20px'}}></div>
            )}
            <h3 className="card-title">{title}</h3>
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
                {SiteData[activeTab].map((category, idx) => (
                    <CategorySection 
                        key={idx} 
                        title={category.title} 
                        items={category.items} 
                    />
                ))}
            </div>

        </div>
      </main>
      
    </Layout>
  );
}