---
sidebar_position: 1
title: 1. Ciclo de Arquivos
---

Vamos entender um pouco do ciclo de vida dos arquivos com os três estados do Git, o jeito que ele enxerga todos os nossos arquivos.

## Três Áreas do Git

Vamos pensar usando uma analogia bem comum para esse caso, onde estamos preparando uma encomenda para enviar:

![estados-git](https://imgur.com/Rn10u6G.png)

1. Working Directory (A área de trabalho): Aqui é onde você está criando, editando ou bagunçando os arquivos. O Git sabe que os arquivos estão ali, mas não ta "manipulando" suas mudanças ainda. É como se fosse um estado de rascunho.
2. Staging Area (A área de envio): Aqui é onde ocorre uma espécie de preparação. Você escolhe quais arquivos da área de trabalho estão prontos para colocar dentro da caixa, ou seja, você diz para o Git que aqueles arquivos estão prontos para serem salvos na próxima versão.
3. Local Repository (O caminhão/Histórico): É quando você lacra e envia a caixa. O Git vai salvar definitivamente aquela versão e grava no histórico do .git

## Estados do Arquivo
Para transitar nas áreas que citamos acima, seus arquivos vão mudando de status no Git. Você consegue visualizar em qual estado seu arquivo está com o comando:

```bash
git status
```

Esse comando retornará qual estado estão seus arquivos. Sendo eles:

1. Untracked (Não existe): Esse é um estado um pouco raro de aparecer em repositórios com Git, porém pode acontecer. Ocorre em arquivos que não existem no Git e ele não consegue recuperar, pode acontecer se você cria um arquivo na área de trabalho e deleta ele recentemente.
2. Modified (Modificado): Esse é um padrão, nosso arquivo está na área de trabalho (working directory), mas as mudanças ainda não chegaram na "caixa" (staging).
3. Staged (Pronto): Aqui o arquivo está na área de preparado para ser salvo e versionado, a Staging Area.
4. Committed (Salvo): Agora, por fim, nosso arquivo está salvo e commitado, ou seja, temos uma versão dele nova.

## Comandos para Gerenciar Áreas

Vamos ver alguns comandos para transitarmos entre essas áreas:

### git add
> O git add prepara um item, ou seja, ele tira do Modified (Working Directory) para Staged (Staging Area)

```bash
git add SEU_ARQUIVO
```
> Move apenas um arquivo

```bash
git add .
```
> Move todos os arquivos que estão em Modified para Staged

### git commit

Esse é um dos comandos principais, vamos até criar uma página só para ele!
[Commits](https://minervabots.github.io/MinervaCore/docs/programacao/git/padronizacao-commits)


