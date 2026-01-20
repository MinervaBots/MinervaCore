---
sidebar_position: 5
title: 5. Estratégias de Branching
---

# Estratégias de Branch

## Introdução

- Git permite que nós criemos branches, mas não diz como devemos fazer (ou seja, temos total liberdade);
- Ajuda completamente na integração de novos membros, ou seja, com uma estrutura de branch bem estabelecida, novos membros podem sentir mais facilidade para se integrar aos projetos;

## Linha principal de Desenvolvimento

> "Always Be Integrating"

- Poucas branches
- Commits relativamente pequenos
- Alta qualidade de testes

Quando se temos uma estrutura básica de ramificação, por exemplo, utilizando apenas a main, temos um ambiente bastante integrado. Entretanto, isso resulta em poucas possibilidades e contribui com os pontos apontados acima. Os commits devem ser relativamente pequenos, pois commits com alterações grandes acabam prejudicando o fluxo de atualizações e ainda prejudica ainda mais se o modelo de testes não for tão qualificado quanto necessário.

![image](https://imgur.com/ptNHfhs.png)


>[!DANGER] Completamente contra-indicado a um projeto grande

## Branches de Estado, Atualização e Recursos

- Diferentes tipos de branches;
- cumprir diferentes tipos de trabalhos;

Dependendo do projeto, cabe termos diferentes tipos de branches para que possamos aplicar outras atualizações de acordo com a necessidade. O modelo referenciado neste tópico, aponta que podemos utilizar ramificações específicas para manter modificações e depois juntá-las a ramificação main.

![image](https://imgur.com/DMpE693.png)


## Branches de longa duração e Curta duração

### Longa Duração 

> Exemplos: main, master e develop
- existem durante toda a vida útil do projeto
- muitas vezes, eles espelham "estágios" em seu ciclo de vida de desenvolvimento

São branches que acompanham a maior parte do projeto, ela serve para se manter com uma longa vida útil. Geralmente são utilizadas para manter um projeto estável durante estados diferentes como desenvolvimento, produção e deployment.

![image](https://imgur.com/pIgUMm2.png)


### Curta Duração


> Exemplo: feature, fix, etc

- Para novos recursos, conserto de bugs, refatoração, experimentos, etc;
- Vai ser deletada depois de merges ou rebases;

Geralmente são criados a partir de ramificações de longa duração. Por exemplo: a partir de um ideia surgida em uma branch develop, criar uma branch de feature para aplicar um novo recurso e depois poder mergir na develop quando finalizado.

![image](https://imgur.com/I1hlerN.png)



## Estratégias GitHub Flow e GitFlow

### GitHub Flow

- Muito simples, muito limpa: só possui uma ramificação de longa duração (main) + ramificações de recursos
![image](https://imgur.com/EWylDDq.png)



### GitFlow

- mais estrutura, mais regras;
- duas ramificações de longa duração: "main" e "develop";
- ramificações de curta duração: features, releases, hotfixes;

![image](https://imgur.com/x0O5i1P.png)



### O sistema Git-Flow

> Este modelo foi concebido em 2010, agora há mais de 10 anos, e não muito tempo depois que o próprio Git surgiu. Nesses 10 anos, o **git-flow** tornou-se extremamente popular em muitas equipes de software.

> O **git-flow** é um estilo de versionamento bastante famoso e serve especialmente para projetos que necessitem adotar um fluxo de trabalho focado em sistema versionado e com controle de versões. Um exemplo claro deste é o próprio ***MinervApp***, que utiliza deste estilo justamente por ser um software que trabalha com versões e controle de estabilidade de código.
>
Se você abrir o repositório do MinervApp verá que existem duas ramificações principais: *main* e *develop*. Elas são as duas branchs de longa duração, onde são responsáveis por guardar as versões estáveis (main) e também controlar todas as atualizações principais referentes ao código principal (develop). As branchs de curta duração que surgem ao longo do tempo são branchs de adição de recursos ao software (features) e para correção de bugs (hotfixes).


Nesta documentação você encontrará um estudo e explicação sobre como funciona este modelo previamente apresentado e o porquê dele funcionar tão bem e ser um dos principais estilos de versionamento utilizado no mundo da programação sendo referência de estratégia de ramificação e gerenciamento de atualização.

>[!EXAMPLE] Segue abaixo um exemplo mostrando como funciona o Git-flow
<center>
  <img src="https://nvie.com/img/git-model@2x.png" width="500"></img>
</center>


#### Descentralizado, mas centralizado

A configuração do repositório que usamos e que funciona bem com esse modelo de ramificação é aquela com um repositório “verdadeiro” central. Iremos nos referir a este repositório como `origin`. 

<center>
  <img src="https://nvie.com/img/centr-decentr@2x.png" width="500"></img>
</center>

Cada membro executa *puxa* (**pull**) e *empurra* (**push**) para a origem. Mas além dos relacionamentos push-pull centralizados, cada membro também pode obter alterações de outros pares para formar subequipes. Por exemplo, isso se torna extremamente útil para trabalhar em conjunto com dois ou mais membros em um grande novo recurso, antes de dar push para `origin`. A imagem acima mostra vários times de Alice e Bob, Alice e David, etc.

>[!Example] Um exemplo claro disso foi no período 23.1 onde precisávamos preparar o MinervApp para praticamente todos os projetos e diversos times foram formados para que o desenvolvimento fosse feito. Nessa questão, foram divididas ramificações formando subequipes que conforme foram terminando o desenvolvimento, deram push para a ramificação principal, que no caso, era a *develop*.


#### As main Branches


No fundo, o modelo de desenvolvimento é muito inspirado nos modelos existentes por aí (vide Github Flow). O repositório central contém duas ramificações principais com um tempo de vida infinito:

- main (ou master);
- develop;

<center>
  <img src="https://nvie.com/img/main-branches@2x.png" width="350"></img>
</center>


A branch ***main*** em `origin` deve ser familiar para todos os usuários. Paralelamente, temos também a branch chamada de ***develop***.

- Consideramos `origin/master`ser o ramo principal onde o código-fonte `HEAD`sempre reflete um estado estável do código.

- Consideramos `origin/develop`ser o ramo principal onde o código-fonte `HEAD`sempre reflete um estado com as últimas alterações de desenvolvimento entregues para o próximo lançamento (**release**). Alguns chamariam isso de “branch de integração”. É aqui que todos os testes e alterações principais são feitas.

Quando o código-fonte na `develop` atinge um ponto estável e está pronto para ser lançado, todas as alterações devem ser mescladas novamente na `main` de alguma forma e, em seguida, marcadas com um número de versão. Como isso é feito em detalhes será discutido mais adiante.

Portanto, cada vez que as alterações são mescladas novamente na `main`, esta é uma nova versão determinada como estável e funcional. Tendemos (e devemos) a ser muito rigorosos com isso, justamente por ter ciência de aquela é uma versão dada como completamente estável e sem problemas que ficará guardada para uso. No mundo de desenvolvimento a fora isso significaria que o aplicativo está pronto para fase de produção, ou seja, sendo possivelmente disponibilizado para usuários.

#### Branches de Suporte

Ao lado das branches principais `main`e `develop`, temos uma variedade de branches de suporte para ajudar no desenvolvimento paralelo entre os membros da equipe, facilitar o rastreamento de recursos, preparar para lançamentos de estabilidade e ajudar na correção rápida de problemas. Ao contrário das branches principais, essas branches sempre têm um tempo de vida limitado, pois serão removidos eventualmente. Isso as configura exatamente como branches de curta duração.

Os diferentes tipos de branches que podemos usar são:

- **Feature branches (Ramos de recursos)**
- **Release branches (Ramos de lançamento)**
- **Hotfix branches (Ramos de correção)**

Cada uma dessas ramificações tem um propósito específico e está sujeita a regras estritas sobre quais ramificações podem ser suas ramificações de origem e quais ramificações devem ser seus destinos de mesclagem.

##### Feature Branches

As ramificações de recursos (ou às vezes chamadas de ramificações de tópicos) são usadas para desenvolver novos recursos para o próximo ou um lançamento futuro distante. Ao iniciar o desenvolvimento de um recurso, o lançamento de destino no qual esse recurso será incorporado pode ser desconhecido nesse ponto. A essência de um branch de recurso é que ele existe enquanto o recurso estiver em desenvolvimento, mas eventualmente será mesclado na `develop`(para adicionar definitivamente o novo recurso ao próximo lançamento) ou descartado (no caso de um experimento decepcionante).


<center>
  <img src="https://nvie.com/img/fb@2x.png" width="150"></img>
</center>


##### Release Branches

Ramos de lançamento suportam a preparação de um novo lançamento de produção. Eles permitem ajustes finos e preparações para lançamento de uma nova versão. Além disso, eles permitem pequenas correções de bugs. Ao fazer todo esse trabalho em uma ramificação de lançamento, a `develop`ramificação é liberada para receber recursos para o próximo grande lançamento.

O momento chave para fazer uma nova branch de lançamento `develop`é quando o desenvolvimento (quase) reflete o estado desejado do novo lançamento. Pelo menos todos os recursos direcionados para a versão a ser construída devem ser mesclados `develop`neste momento.

É exatamente no início de uma ramificação de lançamento que o próximo lançamento recebe um número de versão - não antes. Até aquele momento, a branch `develop` refletia mudanças para o “próximo release”, mas não está claro se esse “próximo release” acabará se tornando 0.3 ou 1.0, até que o release branch seja iniciado. Essa decisão é tomada no início da ramificação de lançamento e é executada pelas regras do projeto sobre aumento de número de versão.

>[!NOTED] Atualmente - 23.1 -  esse estilo de branch não é utilizado na equipe, pois não temos necessidade de ter uma trabalho a mais para preparação e lançamento de versões. O que fazemos no MinervApp para controle de versões é: toda vez que grandes alterações (sendo elas bem significativas) são feitas, nós alteramos a versão dela em +1.0.0. Se a alteração for de calibre menor, a versão é alterada em +0.1.0 ou +0.0.1, a depender do nível de alteração.


##### Hotfix Branches

Objetivo das branches de correção são para que bugs sejam ajustados e investigados sem parar o desenvolvimento do resto do projeto que está ocorrendo provavelmente na `develop`. Essas branches surgem da necessidade de agir imediatamente acerca de problemas graves ou imediatos que possam prejudicar o time de desenvolvimento.

<center>
<img src = "https://nvie.com/img/hotfix-branches@2x.png" width="300"></img>
</center>


#### Resumo

Embora não haja nada muito absurdo nesse modelo de ramificação, ele forma um modelo mental elegante que é fácil de compreender e permite que os membros da equipe desenvolvam uma compreensão compartilhada dos processos de ramificação e desenvolvimento dos projetos.
