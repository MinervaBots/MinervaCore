---
sidebar_position: 1
title: 1. Padronização de Commits
---

# Padronização de Commits

## Commit

Já vimos **Pull e Push**, agora vamos ao Commit que consiste em uma "foto" do seu projeto, o que significa que quando alguém faz um commit, ela tá registrando a versão do arquivo no seu repositório local. O que é uma pré-etapa para fazemos o **Push**, no qual damos um nome para a versão, uma breve e direta descrição sobre as alterações, além de decidimos quais alterações serão realmente efetivadas. 

![image](https://imgur.com/paz138c.png)


> ⚠️ Sempre priorize fazer vários commits com alterações pequenas do que poucos commits com grandes alterações. Objetivo é facilitar o entendimento de quem está visualizando os commits a fim de entender melhor o que foi feito. Quando fazemos commits pequenos conseguimos manter uma clareza do que está sendo alterado e qual o real impacto daquelas alterações.


### Mensagem

#### Por que se preocupar com a mensagem?

- A importância de você escrever um bom commit é que pode economizar horas para si mesmo e/ou outros membros pesquisando durante a solução de problemas, fornecendo essa descrição útil.

- O tempo extra que leva para escrever uma mensagem de commit cuidadosa é extremamente valioso. Em projetos de grande escala, já não é mais novidade que a documentação é imprescindível para a manutenção.

#### A descrição Perfeita

> ⚠️ Uma das partes mais importantes do processo de versionamento de um projeto é a mensagem do commit que referencia determinada alteração. Quando vamos commitar uma alteração e subir ela à nuvem, precisamos deixar uma descrição concisa, esclarecedora e bem escrita para que qualquer pessoa consiga entender o que foi feito.

- Quando você estiver escrevendo uma mensagem de commit, tenha em mente que, a pessoa que irá ler essa mensagem depois, pode ou não ser uma pessoa com conhecimentos técnicos, então pense em deixar claro quais arquivos foram modificados e quais foram as modificações de forma concisa e objetiva.

- Aproveite este espaço para explicar, conceitualmente, o porquê daquela alteração, qual foi a motivação ou o contexto.  Talvez não dê saber o que motivou essa alteração, e a mensagem do commit é um ótimo lugar para manter essa informação.

- Você também pode utilizar essa mensagem para explicar como aquele pedaço de código funcionava antes, e como ele irá funcionar a partir de agora, sempre focando no porquê aquela alteração foi feita, e dependendo, como ela foi feita.

### O Commit Perfeito
![image](https://imgur.com/0YH3Lwx.png)


![image](https://imgur.com/Hq5Nm5g.png)


- Sempre que for projetar uma mensagem de commit analise as questões apontadas na descrição e analise como você pode passar a informação de forma correta do commit.

- Quando for projetar uma mensagem de commit faça no imperativo e pense nas seguintes sentenças como exemplos corretos de como você pode escrever no seu:
	- Quando aplicado, *o que esse commit faz?* **Corrige o teste de integração**
	- Quando aplicado, *o que esse commit faz?* **Refatora o cadastro de cliente**
	- Quando aplicado, *o que esse commit faz?* **Cria a tela de login**
	
	Caso contrário, escrevendo de outra forma, a frase fica sem sentido:
	
	- Quando aplicado, *o que esse commit faz?* **Alterei as configurações de banco**
	- Quando aplicado, *o que esse commit faz?* **Criados os arquivos para nova integração**


#### Tipos

O uso dos tipos facilita a filtragem e a pesquisa de confirmações específicas pelos membros do projeto. Segue todos os tipos a serem utilizados junto a exemplos de sumários correspondentes:

- `ADD`– adicionar um novo recurso ou funcionalidade ao código;
	- "adiciona a biblioteca do controle de PS4 ao código"
- `DROP` - remoção de recurso ou funcionalidade;
	- "remove a função delayJavierre() do código, pois não era mais utilizada"
- `FIX`- ajuste de bugs e problemas;
	- "conserta o bug da leitura do sensor de reflectância"
- `BUILD` –  atualização de dependências ou características de compilação;
	- "atualiza as dependências do código do Minervapp"
	- "muda o nome do ambiente do Zé para Zé-pequeno"
- `REFACTOR`– refatoração de código;
	- "refatora a classe de mixagem"
- `DOCS`– qualquer alteração referente a documentação como comentários ou alterações no readme;
	- "adiciona comentários no arquivo main"
- `STYLE`– alterações que só afetam o estilo visual e não está relacionado ao conteúdo base;
	- "altera a cor base da seleção de estratégias"

### Trabalho Conjunto

Às vezes, temos mais de uma pessoa trabalhando em um commit e é bem legal adicionar uma referência àquela pessoa no commit. Para isso, nós seguimos o seguinte formato:

```
Co-authored-by: Paulo Vitor Rosendo <paulo.vitor.rsd@poli.ufrj.br>
```