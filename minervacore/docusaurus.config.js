// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MinervaCore',
  tagline: 'O núcleo de conhecimento da MinervaBots',
  favicon: 'img/minervacore-logo-transp.png',

  // Configurações para o GitHub Pages
  url: 'https://MinervaBots.github.io',
  baseUrl: '/MinervaCore/',
  organizationName: 'MinervaBots',
  projectName: 'MinervaCore',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  plugins: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["en", "pt"],
      indexDocs: true,
      indexBlog: true,
    },
  ],
],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        // {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        //   onInlineTags: 'warn',
        //   onInlineAuthors: 'warn',
        //   onUntruncatedBlogPosts: 'warn',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/equipe-rc.jpg', // imagem de compartilhamento

      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },

      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      
      navbar: {
        title: 'MinervaCore',

        logo: {
          alt: 'MinervaCore Logo',
          src: 'img/minervacore-logo-transp.png',
        },

        items: [
          {
            type: 'docSidebar',  // Tipo especial que linka para uma sidebar
            sidebarId: 'programacaoSidebar', // Tem que ser o mesmo nome do sidebars.js
            position: 'left',
            label: 'Programação',
          },

          {
            type: 'docSidebar',
            sidebarId: 'arquiteturaSidebar',
            position: 'left',
            label: 'Arq. Hardware',
          },

          {
            type: 'docSidebar',
            sidebarId: 'eletronicaSidebar',
            position: 'left',
            label: 'Eletrônica',
          },

          {
            to: '/editor',
            label: '➕ Criar Página',
            position: 'right',
          },

          {
            href: 'https://github.com/MinervaBots',
            label: 'GitHub',
            position: 'right',
          },

          {
            href: 'https://gitlab.com/MinervaBots',
            label: 'GitLab',
            position: 'right',
          },
        ],
      },
      
      footer: {
        style: 'dark',
        logo: {
          alt: 'MinervaBots Logo',
          src: 'img/minervabots-logo-compl.png',
          href: 'https://minervabots.ufrj.br',
        },

        links: [
          {
            title: 'Redes Sociais',
            items: [
              {
                label: 'Instagram',
                href: 'https://instagram.com/minervabots',
              },
              {
                label: 'MinervaBots Site',
                href: 'https://minervabots.poli.ufrj.br',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MinervaBots. Built with Docusaurus.`,
      },
      
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['cpp', 'python', 'dart', 'bash', 'json', 'cmake', 'c', 'yaml', 'ini', 'makefile', 'arduino'],
      },
    }),
};

export default config;