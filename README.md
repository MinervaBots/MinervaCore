<div align="center">
  <img src="minervacore/static/img/minervacore-logo-transp.png" alt="MinervaCore Logo" width="200"/>

  # MinervaCore 🧠
  
  **O Núcleo de Conhecimento e Documentação Oficial da MinervaBots (UFRJ)**
  
  [![Build Status](https://github.com/MinervaBots/MinervaCore/actions/workflows/deploy.yml/badge.svg)](https://github.com/MinervaBots/MinervaCore/actions)
  ![Docusaurus](https://img.shields.io/badge/Built_with-Docusaurus_3-3ebb2b?logo=docusaurus)
  ![Node](https://img.shields.io/badge/Node.js-v22-green?logo=node.js)
  ![License](https://img.shields.io/badge/License-MIT-blue)

  [Ver Documentação Online 🚀](https://minervabots.github.io/MinervaCore/)
</div>

---

## 📖 Sobre o Projeto

O **MinervaCore** é uma plataforma central de documentação de conhecimento técnico. 

O objetivo deste projeto é centralizar o conhecimento técnico da equipe, facilitando o onboarding de novos membros e servindo como referência rápida para desenvolvimento de projetos robóticos dentro da MinervaBots.

Construído sobre o **Docusaurus 3**, o site oferece uma experiência moderna, rápida e otimizada para leitura técnica.

---

## 🚀 Como Rodar Localmente

Para contribuir com a mudanças no site, siga os passos abaixo.

### Pré-requisitos
* **Node.js** (Versão 20 ou superior recomendada. Testado na v22).
* **Git**.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/MinervaBots/MinervaCore.git](https://github.com/MinervaBots/MinervaCore.git)
    ```

2.  **Entre na pasta do projeto:**
    > ⚠️ **Atenção:** O código do site não está na raiz, mas sim na pasta `minervacore`.
    ```bash
    cd MinervaCore/minervacore
    ```

3.  **Instale as dependências:**
    ```bash
    npm ci
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```

O site abrirá automaticamente em `http://localhost:3000/MinervaCore/`.

---

## 🔐 Modo Edição (`/editor`)

A página de edição permite que membros escrevam conteúdo pelo navegador, sem abrir o
código: cada alteração vira um Pull Request no repositório.

O login é feito via **GitHub** — o membro clica em *Entrar com GitHub*, autoriza o
GitHub App `MinervaCore Editor` e volta autenticado. Só entra quem tem permissão de
escrita neste repositório.

Como o site é estático (GitHub Pages), a troca do código OAuth por um token acontece
num Cloudflare Worker minúsculo, que guarda o `client_secret`. O código dele e o passo
a passo de configuração estão em [`auth-worker/`](auth-worker/README.md).

O login antigo (senha da equipe + Personal Access Token) continua disponível como
alternativa, escondido atrás de *Entrar com token pessoal*.

---
