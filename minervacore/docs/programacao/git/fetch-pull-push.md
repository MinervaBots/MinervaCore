---
sidebar_position: 2
title: 2. Fetch, Pull e Push
---

Aqui veremos como sincronizamos nosso trabalho local com o restante da equipe. Vamos entender como levar as alterações do nosso computador para o repositório remoto e como trazemos de lá para nosso computador também.

![pull-push](https://imgur.com/CKW0u3Z.png)

## Sincronização de Repositórios

### Fetch & Pull

- `git fetch` (ferramenta de busca): Esse comando vai até o nosso repositório remoto e verifica se há alguma nova versão (algum commit ou ramificação), **mas não altera os arquivos locais**. Ele basicamente vai lá na nuvem, olha e te trás como resposta se tem algo ou não, mais nada. É uma ferramenta usada para segurança.
- `git pull` (Ferramenta para trazer algo): Esse comando ele vai fazer o que o fetch não fez, que é trazer as alterações que tem no repositório remoto para o seu repositório local, fazendo um merge dos dois.

> Um pouco mais técnico:
> O **Pull** é uma união do Fetch com um Merge (já vamos falar dele), então quando você usa pull, ele faz um fetch para buscar se há alguma alteração e se tiver ele imediatamente vai juntar a branch do repositório remoto (origin) para o seu diretório de trabalho do repositório local, fazendo com que você tenha acesso as alterações realizadas.
>
> **Quando usamos o Pull, não precisamos usar o Fetch antes, ele é uma abstração de dois comandos**, ao invés de fazermos fetch + merge, fazemos direto o pull, como podemos ver na imagem abaixo, ele vai pular a etapa de passar pelo repositório local e trazer direto para seu diretório de trabalho.
> Dificilmente você usará o Fetch, apenas em casos onde você não queira trazer de imediato as alterações que existem no repositório remoto por algum motivo.

!(pull)[https://imgur.com/naXzMvT.png]

### Push

O Push é responsável por enviar seus commits locais para o repositório remoto. Ao fazer isso, você torna seu trabalho acessível para toda a equipe.
> Nota: O Git só permitirá o Push se o seu histórico local estiver atualizado com o remoto. Caso contrário, você precisará dar um pull primeiro.

!(push)[https://imgur.com/Wf2uoE9.png]

### Merge

O merge é uma ferramenta de mesclagem, ele serve para juntar duas ramificações em uma só, como é o caso do pull que vimos, que realiza a mesclagem da branch remota com a branch local e acontece o mesmo vice-versa com o push.
Ele é mais utilizado por nós quando trabalhamos com branchs de nome diferente no nosso código, quando trabalhamos apenas com um nome de branch (ex: main), ele normalmente é abstraído em outras ferramentas diferenciando a branch remota da local, mas não é algo que precisamos nos preocupar normalmente.

## Boas práticas

:::tip Dica
- Sempre use o comando **PULL** antes de começar a editar um repositório, isso evita conflitos e faça com que você tenha sempre a última versão do que está editando.
- Após salvar uma nova versão (commit) faça um **PUSH**, a menos que o seu commit possua erros.
:::
