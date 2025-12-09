// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MinervaCore',
  tagline: 'O núcleo de conhecimento da MinervaBots',
  favicon: 'img/minervacore-logo-transp.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
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
      
      navbar: {
        title: 'MinervaCore',

        logo: {
          alt: 'MinervaCore Logo',
          src: 'img/minervacore-logo-transp.png',
        },

        items: [
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

          {
            to: '/editor',
            label: '➕ Criar Página', // Botão visível para facilitar
            position: 'left',
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
      
      // Configuração de cores do modo escuro/claro
      colorMode: {
        defaultMode: 'dark', // começa no modo escuro
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
    }),
};

export default config;
