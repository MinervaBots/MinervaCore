---
sidebar_position: 0
title: 0. Soldagem
---

# Capacitação de Solda - Passo a Passo e Guia prático:

# Passo a passo:
> Foto maneira
## Passo 1 - Estação de trabalho e utensílios
> Foto da bancada
- Na sala da equipe há uma bancada da eletrônica propícia para soldagem, porém nela há outros equipamentos, como fontes de bancada carregadores de baterias e utensílios gerais da eletrônica, a ideia é que ela sempre esteja organizada e com os itens nos lugares corretos.
- Para soldar na sala da equipe, nós usamos exclusivamente a bancada da eletrônica.
- Além do ferro de solda, para soldar existem alguns utensílios básicos como pinças, alicates, prendedores de placas, morças, uma boa iluminação e uma lupa.

### Pinças

![](https://i.imgur.com/e94xrvV.png=300x)
 - As pinças ficam na caixa transparente que por sua vez fica na bancada baixa da eletrônica. 
> Adicionar foto do local
- As pinças normalmente são usadas para manusear e soldar componentes SMD
![](https://i.imgur.com/UH72JDG.png=200x)
- O correto evita que percamos componentes eletronicos, pois ao deixar cair um resistor minúsculo é quase improvável de achar no chão da sala da equipe.
- Para isso pegue apenas um componente smd por vez e em seguida com a pinça tente deixa-lo sempre em cima da bancada, onde você consiga ve-lo, ou ao lado do local de solda na própria placa usando a pinça. 

### Alicates

- Eletrônicos, normalmente estão em contato com 3 tipos de alicates o universal, o de bico e o de corte.

#### Universal / de bico
![](https://i.imgur.com/C8X8n2I.png=200x) ![](https://i.imgur.com/snGmxuq.png=200x) ![](https://i.imgur.com/nGmv9QG.png=200x)
- São usados para segurar e pegar componentes, cabos, conectores e etc
- O alicate universal também tem uma parte para cortar
#### Corte
![](https://i.imgur.com/o8WMYbx.png=200x) ![](https://i.imgur.com/UHftDdR.png=200x)

- São usados para corte de fio e desencapamento

### Suporte para placas
![](https://i.imgur.com/ZzFF062.png=300x)

- É basicamente um prendedor de placas universal
- É utilizado principalmente em placas maiores onde a morsa não tem abertura
#### Morsa/torno

![](https://i.imgur.com/8RmnwD8.png=250x)

- Tem a mesma função, mas também é usado para prender outros itens.
- Elas tem um limite máximo de tamanho de abertura, porem possui um mecanismo giratório que permite escolher o ângulo de inclinação desejado com amplitude de 360°


### Lupa e iluminação

![](https://i.imgur.com/TrK7f2p.png=250x)
- Normalmente a área de solda da eletrônica não é tão iluminada, por isso é interssante usar uma luminária para soldagem
- Assim como pode ser interessante usar uma lupa para trabalhos minuciosos de de alta precisão.

## Passo 2 - Segurança do trabalho
![](https://i.imgur.com/CfDBuGM.png=x400)
> É MEME
### Uso de EPI's e vestimenta

- É obrigatório o uso de:
    - Calças compridas(de preferencia jeans);
    - Máscara;
    - Tênis.
- Caso você tenha cabelo grande, você precisará prende-lo
- Para evitar inalação de estanho e chumbo, coloque um ventilador preferencialmente atrás de você ou na lateral da mesa caso esteja sozinho de forma a afastar os gases da solda.
- Assim como para proteger contra a covid as máscaras ideias para solda são PFF-2/N95, pois garantem a maior proteção individual.
![](https://i.imgur.com/Fe7ZReO.jpg=250x)
> Máscara usada pela equipe Atlas em 21.2 e pelo coord. Eletronica de 21.2 e 22.1
 
### Postura, organização e limpeza
- Esvaziar a mesa ao máximo, deixar só o essencial (estanho, pinça, componentes, multímetro ...) nas laterais.
- Ajuste a postura (não deixar o olho ou corpo perto da solda).
- Solde sentado.
- **CASO SUJE, SEMPRE LIMPE O AMBIENTE APÓS QUE TERMINAR DE SOLDAR**
![](https://i.imgur.com/570H0PK.jpg=300x) ![](https://i.imgur.com/Ud9kQXz.jpg=300x) ![](https://i.imgur.com/OujNArM.png=300x) ![](https://i.imgur.com/kxOUdQr.png=300x) 
- Tente evitar se aproximar muito da placa, se for necessário use lupa
![](https://i.imgur.com/gYu5Nq3.png=300x)

### Ilustração amigável e prática do que NÃO fazer
- Isso:
![](https://i.imgur.com/VGTaiz9.png=x500)



- Não desligar ferro de solda depois de usá-lo:
    - O mau uso infelizmente é uma prática comum na equipe, portanto, é de extrema importância que nos ajudemos a fiscalizar e cuidar de nossos ferros! Independente se veterano, líder ou calouro, avisar e cuidar com base no Espírito de Dono é incentivado sempre para que tenhamos equipamentos na equipe
    - Exemplos reais que ocorreram na sala: 
    ![](https://i.imgur.com/4acnXYy.png)

> Adicionar casos do passado da equipe
## Passo 3 - Entendendo o básico sobre as placas eletronicas
![](https://i.imgur.com/boAZmjo.jpg=x400)

### Esquemático
- O uso do esquemático para identificar os componentes, assim como valores de capacitancia e resistencia é essencial
- Assim como identificar o caminho que entra e sai dos componentes, para facilitar de achar a trilha correspondente na PCB
### PCB
- Placa Pfizer do projeto Atlas
![](https://i.imgur.com/qPUThLe.png=x300)![](https://i.imgur.com/1Uubmwz.png=x300)
- As placas eletrônicas possuem algumas características básicas e abaixo está mostrando cada item, assim como um breve resumo do que são cada parte do recorte:
![](https://i.imgur.com/jGmqOpx.png)
    - Cobre
        - Todas as nossas placas são feitas de cobre, que é um condutor comum do mundo em geral, normalmente ele vem estanhado(estanho "soldado" no cobre) e por isso assume uma cor prateada.
    - Furos 
        - Vias
            - As vias são furos que levam as trilhas para o outro layer da placa, normalmente são furos bem pequenos, menores que os pads THT
        - Pads THT
            - São os furos onde os componentes THT são encaixados e soldados na parte de cobre
        - Furos para fixação
            - São furos com ou sem cobre que estão compleamente isolados da placa, servem para prender as placas nos seus suportes.
    - Pads SMD
        - São as regiões de cobre onde se solda os componentes SMD
    - Trilhas
        - São os fios da placa, elas que fazem as conexões de pads e vias, são duplamente isoladas pela máscara de solda e pelo isolamento de cobre para não se ligarem as malhas.
    - Malhas
        - São como se fossem trilhas só que em escala maior, como se fossem formas geométricas. Um exemplo usado clássicamente pela equipe são as Malhas de GND, onde fazemos uma malha pegando o perímetro da placa e definimos como sendo a "trilha" de GND.
    - Máscara de solda
        - Basicamente é um isolante das placas que proteje o cobre da placa, é a parte pintada da placa, normalmente por uma cor de escolha da equipe de projeto, como é visível a Pfizer é vermelha, tudo que estiver em vermelho é cobre isolado do exterior.
    - Isolamento de cobre
        - Normalmente é o isolamento feito nas trilhas, pads e vias para evitar contato com as malhas. São eles que formam os caminhos visíveis na placa.



## Passo 4 -  O melhor amigo de um eletrônico: O múltimetro

![](https://i.imgur.com/80BLH3A.jpg=x400)
- O multímetro é um instrumento de medição que possui dentro dele várias funções de outros instrumentros de medição usados na eletrônica, como voltímetro, amperímetro e ohmimetro.
- Por convenção é usado a cor vermelha para representar a parte positiva(+) e a cor preta para representar a parte negativa(-)

<p>
<details>    
<summary>Voltimetro e amperimetro</summary>
    
### Voltimetro
- Instrumento que mede **diferença de potencial(DDP)/tensão** entre dois pontos do circuito, medida em **volts(v)**. Para que ele faça isso precisamos liga-lo em **PARALELO** com os ponto em que desejamos medira DDP no circuito.
- Normalmente ele tem dois modos, medindo em corrente continua(CC/DC) que é a tensão proviniente de baterias e fontes de alimentação e em corrente alternada(AC/~) que é a da tomada 127V/220V normalmente.
- ![](https://i.imgur.com/tMVXLE0.png=200x)
- Para realizar a medição a resistencia interna do multimetro nessa configuração é muito **ALTA**, tentendo ao infinito positivo.
### Amperímetro DC
- Instrumento que mede a **corrente** que passa pela região do circuito onde ele é inserido, medida em **amperes(A)**. Para que ele faça isso precisamos liga-lo em **SÉRIE** com o circuito que desejamos medir a corrente.
- ![](https://i.imgur.com/eyqk6OV.png=200x)
- Para realizar a medição a resistencia interna do multimetro nessa configuração é muito **BAIXA**, tentendo ao infinito negativo.

</details>
</p>

### Ohmímetro DC

- O ohmímetro é usado para medir a resistência elétrica no circuito ou dos proprios resistores.
- Seu funcionamento é bem simples: através de duas pontas de medição, o aparelho aplica uma tensão a uma resistência.
![](https://i.imgur.com/lU8dJzx.png=x300)
 
### Testador de LED e condutividade

- É uma das funções mais utilizadas pela equipe, funciona basicamente como o ohmímetro, com o artifício de que quando acontece um curto emite um apito atravez de um buzzer
- Na soldagem, é usado para verificar curto e verificar condutividade, ou seja, verificar se sua solda está conduzindo ou se conectou onde não devia.
- Também pode funcionar como testador de LEDS, já que fornece tensão/corrente fazendo assim ele acender.
- ![](https://i.imgur.com/F3iEdLe.png=x300)

## Passo 5 - Soldagem e dessoldagem eletrônica

![](https://i.imgur.com/dxNtXEC.jpg=x400)

### Solda, ferros e estações de solda 
- Na equipe nós usamos uma liga de estanho e chumbo para soldagem
    - ![](https://i.imgur.com/dGEyDAj.png=x200)
    - Existem diferentes tipos de liga, com diferentes caracterísicas, geralmente nós usamos estanho fino, com mais estanho do que chumbo para soldar na sala da equipe por derreterem e dar liga mais facilmente com os componentes e a placa.
- Precisando assim de altas temperaturas(+300ºC) para poder derreter a ligae realizar a soldagem
- Para isso NORMALMENTE ferros e estação de solda dão conta:
    - Ferros:
        - ![](https://i.imgur.com/aOdWFmq.png=x250)
        - São ferros cilíndricos e normalmente acoplada ao cilindro uma ponta cônica usada para realizar a solda.
        - São ligados diretamente na tomada e não possuem controle de temperatura
        - Possuem a potencia sua e operação e as vezes um mini manual dizendo até qual temperatura o ferro aquece
            - ![](https://i.imgur.com/A5ZQXNC.png=x300)
        - São mais baratos que as estações de solda, normalmente apresentam pior desempenho e maiores problemas. Porém é são itens que bem cuidado são duradouros
    - Estações:
        - ![](https://i.imgur.com/GoCOGtY.png=x250)
        - São basicamente ferros de solda com uma eletrônica de controle de temperatura
        - São mais caros e possuem performace melhor que os ferros convencionais

### Suporte e limpeza
![](https://i.imgur.com/znc7FiR.png=x200) ![](https://i.imgur.com/NxSTVc9.jpg=x200) ![](https://i.imgur.com/aLUbYt6.png=x200)

- Normalmente temos um suporte para cada ferro de solda e uma esponja vegetal acoplada ao suporte
- Também há a opção de esponja metálica ao invés da vegetal
- Para limpar basta umidecer a esponja e passar a ponta do ferro de solda quente na esponja, assim removendo os restos de solda que ficaram no ferro
- O maior cuidado para ter é para não deixar o ferro tempo de mais e queimar a esponja e consequentemente sujar o ferro ao invés de limpa-lo

### Soldagem de uma placa na prática
![](https://i.imgur.com/J9kLCMw.png)

- Limpe a bancada, ligue o ventilador atrás de você (se tiver disponível), pegue a cadeira/banco
- Separe tudo que você ira precisar(estanho, placa, componentes, pinça, alicate, múltimetro, suporte para placa e etc)
- Ligue o ferro a ≈ 320/340°
- Fixe a placa no suporte escolhido e numa boa posição.
- Espere até o ferro esquentar, e com sua mão dominante, peque e puxe o ferro pela parte **NÃO METÁLICA** tendo cuidado para que o fio não limite seus movimentos(puxe de uma maneira confortável).
- **IMPORTANTE:** Atenção redobrada para não pegar acidentalmente na parte metálica para não se queimar.
- Limpe o ferro na esponja umidecida.
- Com sua outra mão pegue o estanho e dependendo do que for soldar ou da sua preferência:
    - Componente THT:
        - ![](https://i.imgur.com/BsE6eRy.png)
        - Esquente o PAD THT que ira receber solda e adicione estanho, até ficar perfeito(próximo tópico)
        - Ou estanhe a ponta do ferro e mova o ferro até o PAD THT depois e adicione(ou não) mais solda até ficar perfeito(próximo tópico).

    - Componente SMD:
        - Esquente o PAD que ira receber solda e adicione estanho, peque o componente com a pinça, aqueça a solda e empurre com a pinça o pino/parte do componente no pad que esta com solda derretida. Solde o(s) outro(s) lado(s)/pino(s).
        - Estanhe a ponta do ferro e mova o ferro até o pad depois e com a pinça coloque o componente no pad junto com a solda dicionada adicione(ou não) mais solda até ficar perfeito(próximo tópico).
- Espere esfriar antes de tentar movimentar as partes soldadas
- Esse processo pode variar dependendo do componente
- Assim que acabar, por mais rápido que seja, limpe e estanhe o ferro guarde no suporte até ter tudo pronto para o próximo componente.

### Como saber se a solda perfeita:

![](https://i.imgur.com/pH3HSO6.png)

- Perfeita - é a solda em formato de suspiro/pera e brilhosa.
- Ruima - normalmente é em formato de bola ou opaca.
- Muita solda - não é um problema tão grande, só é bom evitar
- Pouca solda - é um problema grave pois o componente pode sair ou haver mal contato
- Sem conexão - sempre observe se o pad foi todo coberto de solda pois as vezes a solda não aconteceu e sim apenas ficou presa ao pino do componente
- Aquecimento em excesso - é bom evitar pois danifica a placa e pode ser quebradiça
- Curto circuito - é um dos piores casos de muita solda, pois assim você pode queimar os compoenentes, baterias e gerar prejuiço a equipe e ao projeto. 
- **IMPORTANTE: SEMPRE TOMAR CUIDADO COM CURTO CIRCUITO NA SOLDAGEM**



### Dessolda


<p>
<details>    
<summary>Capacitação</summary>
    
## Capacitação:
### Passo a passo:

1 - Bancada da eletronica
- onde ficam os itens 
- o que você vai precisar

2 - Postura e cuidados
- quais epi's usar
    - Prender cabelo(para cabelos grandes), calça compridas(sem ser poliester) de preferencia jeans, máscara, tenis
- como se posicionar na mesa
- limpeza do ambiente ao redor
- iluminação
- exemplo do que não fazer

3 - Como entender as placas eletronicas
- Como usar o esquemático para identificar componentes
- Como itentificar as ligações(netlabes também) entre componentes 
- O que são trilhas, pads e vias
- O que o é a malha de gnd

    
    
4 - Capacitação de múltimetro
- O que é um multimetro ?
- Voltimetro AC e a ligação em paralelo
    - Medir a tomada
- Voltimetro DC
    - Medir a fonte ou bateria
- Amperimetro DC e a ligação em série
- Ohmimetro (medidor de resistencias)
    - Resistor 
- Condutividade e sua função de testar led's
    - Testar com algum fios

    

5 - A teoria por tras da solda
- O que é o ferro de solda
- Como ele funciona
- Como manusear
- Como limpar
    
6 - Exemplo prático de solda
- analisar a placa
- Soldar header
- soldar resistor
- testar condutividade 
- testar resistencia
    
7 - Dessoldar
- Como usar o soprador de ar e o que é 
- Como usar a fita
- Sugador de solda
- Artificio: curtar tudo e aquecer

8 - Exercicio pratico
- Analisar a placa
- Soldar header
- Soldar 2 resistores/capacitor
- Soldar LED
- Dessolar resistor


9 - Outros/ se der tempo
- Fluxo de solda
- Álcool Isopropílico
- Capacitação de baterias
- Capacitação de solda de chicotes xt60 e jst

</details>
</p>
    
    
## Guia da Rebecca
### Básico:
![](https://i.imgur.com/1AmrOJd.jpg)

- Esvaziar a mesa ao máximo, deixar só o essencial (solda, pinça, peça, ...) nas laterais.
- Ajuste a postura (não deixar o olho ou corpo perto da solda).
- Solde sentado.
- Para evitar inalação, coloque um ventilador na lateral da mesa de forma a afastar os gases da solda.
- Cuidado com o fio ao devolver a máquina ao suporte, por ser quente, se encostar na ponta pode derrete-lo.
- Lembrar: Solda só gruda na parte metalizada da placa.

### Cuidados:
- Desligar ferro de solda depois de usá-lo
    - o mau uso infelizmente é uma prática comum na equipe, portanto, é de extrema importância que nos ajudemos a fiscalizar e cuidar de nossos ferros! Independente se veterano, líder ou calouro, avisar e cuidar com base no Espírito de Dono é incentivado sempre para que tenhamos equipamentos na equipe
    - Exemplos reais que ocorreram na sala: 
    ![](https://i.imgur.com/4acnXYy.png)

    

### Soldar:
![](https://i.imgur.com/dxNtXEC.jpg)

- Fixe a placa na estrutura.
- Ligue a máquina a ≈ 320/340°
- Puxe a máquina tendo cuidado para que o fio não limite seus movimentos (puxe de uma maneira confortável).
- IMPORTANTE: Segure a máquina pela parte emborrachada do cabo, atenção redobrada para não pegar acidentalmente na parte metálica.
- Passe a máquina na esponja umidecida.
- Esquente a superfície que ira ser soldada.
- Com auxílio de uma pinça, coloque o objeto na posição que irá ser fixada e, com a máquina, esquente o fio de solda nos redores _(processo pode variar dependendo da peça)_
- Sempre que acabar uma peça, por mais rápido que seja, passe o bico da máquina na esponja e guarde no apoio até ter tudo pronto para próxima peça.
#### Soldar Leds:
- O led, ao contrário dos resistores, tem polaridade

#### Macetes:
- Como identificar um GND:
    - Nas placas, geralmente a parte com borda é positiva e a parte sem borda é negativa. Além disso, aqueles que não possuem trilha estão conectados a malha de GND - Se a malha é 5V, os pads sem trilha estão a 5V.
    ![](https://i.imgur.com/B0er3VT.png)
- Limpar após solda - **álcool isopropílico!** e escovinha (Conferir se escova não tá com fluxo! Se está limpa basicamente)
 
    
### Como saber se a solda tá boa:
![](https://i.imgur.com/J9kLCMw.png)
- Uma solda ruim normalmente é em formato de bola ou opaca.
- Uma solda boa é em formato de suspiro e brilhosa.


### Tirar solda:
- Máquina de Dessolda (no tópico abaixo há um passo a passo de como usar).
- Com a própria máquina de solda (caso esteja mais agarrada), usa a máquina quente sem colocar solda, apenas o calor ao redor da solda que deseja "descolar".
    - IMPORTANTE: cuidado com a trilha! Não puxar se tiver com muita resistência, porque a trilha pode soltar! Ao invés disso:
    - 1) esquentar dos dois lados
    - 2) curtar tudo (botar mais solda) e esquentar o mostrengo inteiro! 


_________

## Soprador:
![](https://i.imgur.com/dQoJgiq.jpg)
- Tirar solda.
- Importante: Não deixar mais de 3 minutos ligada.
### Passo a passo:
- Ligar máquina a 350°-400°.
- Passa vento em movimentos circulares ao redor da solda que deseja descolar, esquentando todos os arredores.
- Usar por no máximo 3 minutos (≈ 2 min e meio).
- Desligar máquina e deixar vento quente saindo > Para tal, aumentar saída de vento ao máximo e deligar.

___

_Feito por: Rebecca_