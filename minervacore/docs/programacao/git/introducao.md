---
sidebar_position: 0
title: 0. Introdução ao Git
---

# Introdução ao Git

## Conceitos básicos

### O que é Git?

- O git é o que chamamos de ferramenta de versionamento. *Imaginem que vocês vão escrever um livro e começam fazendo um rascunho geral, e aí no dia 1 vocês escrevem x coisas, no dia 2 vocês escrevem y coisas, no dia 3 z coisas, e assim por diante. Quando chega no dia 10, por exemplo, vocês percebem que não gostaram do que escreveram no dia 9 e acham que na verdade o livro tava melhor no dia 7. Basta você voltar a versão anterior e retornar ao commit da época em que você achava melhor.* Então, essa é a principal ideia do Git e porque ele é tão famoso no mundo da tecnologia em relação aos projetos. Ele permite que você faça um controle das versões do desenvolvimento do seu software e também consiga resolver possíveis conflitos resultantes da participação de outros membros e criação de novas features.

### Por que ferramentas de versionamento são importantes?

- Como podem ver, escrever um livro do 0 toda vez que fizer algo errado, não é algo muito eficiente, então basicamente todas as pessoas ou empresas que tenham projetos - sejam eles de programação, mecânica, eletrônica, design, gestão, etc - utilizam o sistema de versionamento. Ele ajuda a termos um controle sobre todas as versões de um projeto e isso, quando falamos em projetos maiores e mais complexos, se torna fundamental, principalmente por contar com muitas pessoas trabalhando juntas.

### Por que Git?

- O git torna nossa vida muito fácil e ajuda a descomplicar muitos problemas que temos ao longo do tempo. Infelizmente o processo de desenvolvimento de um software não é trivial nem algo que segue exatamente uma linha do início ao fim, ele sofre alterações, bugs, adições, etc, ao longo do tempo. E quando isso acontece com a participação de diversos times e pessoas, que estão fazendo coisas diferentes e alterações que muitas das vezes não se complementam ou não se parecem, podem surgir conflitos e problemas na hora de juntar todas as alterações a linha principal de desenvolvimento.
- O git traz facilidade a essas questões. Ele consegue tornar o ato de mesclar/ramificar muito mais simples do que seria em outras ferramentas como CVS/Subversion. A fusão( ou ramificação) são conceitos bastantes chatos e que acabam se tornando massivos para muitos. O git consegue trazer uma simplicidade a isso.

## Repositórios

Repositório é o local onde guardamos o nosso projeto. Voltando ao exemplo do livro: imaginem que vocês precisam guardar o livro de vocês em um local onde sempre que vocês quiserem mexer nele, vocês só precisam ir até lá e fazer. Essa é a ideia do Repositório, é como se fosse uma pasta onde você guarda o seu projeto para controle e fazer alterações sempre que quiser.

- Existem **repositórios locais**, que é quando criamos uma pasta e guardamos o nosso projeto no nosso computador - isso é feito por meio de clonar o repositório e trazer até sua máquina. O projeto está no seu computador e as alterações que você fizer só estará lá disponível para você até que você dê um **push** para "*empurrar*" as atualizações para o repositório em Nuvem.

![image](https://imgur.com/sux3eqS.png)

-  E também existem os **repositórios da nuvem** que é quando o projeto está em uma plataforma externa (GitLab, Github, etc) e todas as alterações que fizermos estará disponível para todo mundo que tem acesso.

![image](https://i.imgur.com/hifLqZp.png)


## Pull e Push

O **Push** é o responsável por "mandar os arquivos para o repositório na nuvem", o que significa que basicamente cada modificação que alguma pessoa faz cria uma nova versão do projeto e para possibilita que toda a sua equipe de projeto tenha acesso a essa versão é necessário usar o **Push**.

Já o **Pull** é o responsável por "Atualizar os arquivos no seu PC de acordo com a versão no repositório na nuvem", o que significa que quando alguém faz o **Pull**, o arquivo do projeto no PC dessa pessoa é atualizado para a versão mais recente desse arquivo que estiver no repositório na nuvem.

## Pull Requests

- Para subir alterações feitas, você convoca pessoas a analisarem e apontarem se são alterações válidas e coerentes. Acontece muito com casos de códigos open source, onde pessoas fazem alterações mas precisam do pull request para que o revisor e dono do projeto aprove suas alterações;
- Ainda neste exemplo, também existe os "Forks", onde você pode bifurcar o código original e fazer as alterações como se fosse um repositório próprio. Após isso, pode fazer o pull request e o revisor analisar se é cabível;

![image](https://i.imgur.com/nkjHI5j.png)



## Conflitos de Mesclagem

Conflitos podem ocorrer de diversas formas e isso principalmente quando integramos commits de diferentes fontes. Então, neste ponto, entenderemos como se dão essas questões de forma mais direta a partir de três pontos focais básicos:
> 1. quando eles acontecem;
2. o que de fato acontece;
3. como resolvê-los.

![image](https://i.imgur.com/Ps3wjEm.png)


### Como acontecem

Geralmente o Git consegue resolver coisas simples de conflitos, mas há casos em que ele não consegue resolver e esses casos na maioria são relacionados a linhas de código que foram selecionadas diferentemente em branches separadas e não há como ele decidir qual que deve ser usada, ou então arquivo que foi modificado em uma branh e apagada em outra, etc.

![image](https://imgur.com/YWsVMLl.png)



### Como desfazer um conflito e Começar do 0

Você sempre pode desfazer e começar de novo graças a duas opções dadas pelo Git:

```shell
git merge --abort
git rebase --abort
```