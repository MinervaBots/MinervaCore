---
sidebar_position: 3
title: 3. PDN Analyzer
---

# PDN Analyzer 📊

## O que é o PDN?

PDN Analyzer é uma extensão para o Altium que permite fazermos simulações das redes de distribuição de energia dentro de um projeto PCB. Com essa análise conseguimos uma simulação da queda de tensão que ocorre em cada ponto da trilha, podendo assim resolver problemas de componentes não serem alimentados corretamente, e também simular o fluxo de corrente elétrica sob uma trilha, nos dando também a densidade de corrente que a percorre e podermos verificar se está dentro dos limites do material para que a placa não sobreaqueça. Não só nas trilhas em si como também nas malhas, como a de GND.

---

## Que tipo de simulação conseguimos fazer?

Conseguimos simular as redes de alimentação da placa e dos seus componentes, como por exemplo todo o caminho que a energia percorre assim que entra na PCB pela bateria, passa pelos reguladores de tensão, alimenta os periféricos como sensores, módulos entre outros, e também a alimentação de microcontroladores e microprocessadores. Outro exemplo é para placas de controle de motores em que o caminho da energia até as ponte H também consegue ser simulado para saber se as trilhas que levam energia até os motores estão bem dimensionadas e projetadas na placa

---

## Instalação

- Primeiramente, devemos instalar [o Altium versão estudante](https://drive.google.com/file/d/1ufHmie2z2RVubbK3uAvS9jpv8YIGfgQa/view?usp=sharing) ~~crackeado~~
    - Importante ressaltar que não podemos colocar o crack no Altium licenciado pela equipe!!
- Seguir o passo a passo de instalação normal do Altium crackeado
    - Baixar o arquivo
    - Iniciar a instalação clicando no executável
    - Depois de instalado, **não abra o programa ainda**
    - Abra a pasta "Crack"
    - Copie o arquivo "shfolder.dll"
    - Vá no local onde o arquivo foi instalado, se você não alterou o diretório de instalação ele estará em "C:\Program Files\Altium\AD20"
    - Cole este arquivo na pasta "AD20"
    - Depois dessa etapa, você já pode abrir seu Altium
- Para licenciar seu software 
    - Clicar no perfil no canto superior direito
    - ![](https://i.imgur.com/i5CU920.png)
    - Apertar em "Licenses"
    - ![](https://i.imgur.com/u6rnX41.png)
    - Clique em "Add standalone license"
    - Vá na pasta "Crack" depois em "licences"
    - Selecione uma licença, a "Altium Designer License 44XD-CBK8 R10.alf" tem funcionado

- Agora, para trocar adicionar o PDN Analyzer
    - Clicar no perfil no canto superior direito
    - ![](https://i.imgur.com/i5CU920.png)
    - Apertar em "Extensions and Updates..."
    - ![](https://i.imgur.com/QqYuT8Y.png)
    - Clicar em "Purchased"
    - ![](https://i.imgur.com/ctrej1p.png)
    - Buscar o quadro "PDN Analyzer" e apertar para instalar 

Se você fez todos os passos corretamente o seu Altium e o PDN Analyzer jáestão prontos para serem utilizados!

---

## Iniciando no PDN Analyzer

Na equipe, nos basicamente usamos essa extensão para ver a concentração de corrente nas trilhas/malha para não termos risco de explodir alguma trilha ou até mesmo a malha. Para fazer isso nós iremos seguir o percurso que a corrente faz na parte de potência da placa.

Se vocês tiverem dificuldade de ver o caminho que a corrente faz, vocês podem usar o diagrama de potência para auxiliar no processo. Agora vamos ao que importa

---

### Iniciando o projeto

Antes de iniciar o projeto no PDN Analyzer, você já tem que ter a sua PCB finalizada.

Com a PCB aberta, vocês vão em **Tools -> PDN Analyzer**
![](https://i.imgur.com/zMn7u3L.png)

Se for sua primeira vez abrindo o PDN Analyzer no projeto, a primeira tela que aparecerá é a **PDN Analyzer DC Net Identification**
![](https://i.imgur.com/vuNth6F.png)

Nessa tela o que iremos fazer é colocar os valores das tensões que utilizaremos. Por isso é maneiro enquanto você está fazendo essa análise estar com o diagrama de potência, para poder se guiar.

Nessas simulações a gente quer ver se a placa aguenta a corrente máxima possível que vai ser puxada pelo circuito, por isso que nessas simulações a gente considera que o robô está andando, então nas saídas dos drivers de motor a gente coloca a tensão máxima possível

Depois de colocar as tensões corretas, selecione as caixas das nets que serão utilizadas e clique em **Add Selected**

Para a placa do combate, o Crepe Suzette ficou da seguinte forma:
![](https://i.imgur.com/4T90NFH.png)

Depois disso basta clicar em **Ok** e iremos para a próxima etapa.

---

### Avisos antes de começar a simulação

Assim que você clicar no _Ok_ a tela que aparecerá é a seguinte:
![](https://i.imgur.com/CWcmx4Z.png)

**Obs:** Recomendo vocês irem em **Files -> Compact Layout** ou **Ctrl + '** pra ficar com um pouco menos de informação na tela. A partir desse momento, estarei utilizando apenas esse layout.

**Obs²:** Não deixe os arquivos do seu projeto num diretório que possua caractéres especiais, isso vai fazer com que a simulação de um erro.

Antes da gente começar a de fato a mexer na simulação é interessante a gente entender um pouco melhor o que iremos fazer aqui. Como foi dito mais em cima, a gente quer colocar a placa para trabalhar com a corrente máxima para ver se alguma trilha ou malha rompa. 

Com isso, o que iremos fazer nessa simulação? Nós iremos pegar todo o caminho que a corrente faz desde a bateria até a saída dos motores.

---

### Montando a Simulação

Como já falei, estou usando o controlador do combate, o Crepe Suzette. A corrente funciona da seguinte forma aqui: **VCC Bateria -> BTN7970+ -> Motor -> BTN7970- -> GND Bateria**

A primeira coisa que vocês vão fazer é clicar em **Network**.

Para a simulação funcionar a gente precisa de um **Power**, um **Ground**, um **Source** e um **Load**

- **Power Net**
  
  Aqui, adicionaremos nossa tensão máxima, seja a tensão da bateria ou do regulador. Para adicionar basta clicar em **< Power Net >**, selecionar sua fonte de tensão e dar o _Ok_.
  ![](https://i.imgur.com/gJarsUX.png)

- **Ground Net**

  Aqui não tem muito segredo, vai ser nosso GND, nossa tensão de referência. Para adicionar, basta fazer a mesma coisa que fizemos para a Power Net, clicamos em **< Ground Net >**, selecionamos a tensão de referência e clicamos em _Ok_.
  ![](https://i.imgur.com/HcrHChM.png)

- **Source**

  Vai ser nossa fonte de tensão, pode ser o regulador, a bateria e etc. Para essa simulação estaremos utilizando a bateria.

  Para adicionar, basta clicar com o botão direito e **Add Source**. Abrirá a seguinte janela:
  ![](https://i.imgur.com/f38tlni.png)
  
  Obs: O **V_BAT** virou o **VCC**, fiz isso por que estava dando algum conflito quando foi dado merge nas brands no git mas o underline não da nenhum problema não.

  Aqui nessa janela temos alguma coisas interessantes:
  
  - **Device Type**: é o tipo do componente, a opção **Voltage Source** é para a bateria, as opções **VRM** são reguladores, cada um diferente. Não vou entrar em detalhes aqui mas de maneira resumida:
    - **Linear**: Regulador linear padrão que a gente conhece, os LM78XX por exemplo
    - **SMPS**: São reguladores chaveados, um Step-Down por exemplo
    - **SMPS Sense**: São os reguladores chaveados porém com um sensor de corrente
  
    Aqui nesse caso utilizaremos o Voltage Source mesmo pois não estamos o regulador.

  Depois de escolhermos o Device Type, temos que colocar as **Refdes** das nets, ou seja, de onde eles estão vindo. Nesse caso, está vindo do XT30.

  No final, ficou da seguinte forma:
  ![](https://i.imgur.com/48QmjLk.png)

Antes de adicionarmos o **Load**, ou seja, o nosso fornecedor de potência, vulgo motores, a gente tem que colocar os drivers.

Se a gente olhar o esquemático ou diagrama de potência, nós vemos que os driver de motor estão em paralelo com a bateria:
![](https://i.imgur.com/nSMtEpp.png)

Para adicionarmos componentes em série basta clicar na Power/Ground com o botão direito e apertar **Extend Net**. Ele vai abrir a janela para escolher a Net:
![](https://i.imgur.com/48BPMng.png)

Nesse caso estou escolhendo uma das meia-pontes h. Depois de escolher sua net, basta escolher o componente.

Depois de escolher a net, sua janela deve estar com algo mais ou menos assim:
![](https://i.imgur.com/sRan0q4.png)

Nós temos que escolher o que é aquele componente em série, nesse caso, é uma das meia-pontes h. Basta clicar duas vezes e aparecerá a janela para você escolher.

Para não ficar colocando muita imagem aqui e acabar atrapalhando um pouco já vou colocar a meia-ponte h do GND também. No final, ficaremos com algo mais ou menos assim:
![](https://i.imgur.com/Fp8ULTO.png)

Com isso, podemos colocar nosso load.

- **Load**

    Como já falei, eles são nossos fornecedores de potência. Para nós, em grande parte eles serão nossos motores.

    Para adiciona-lo, basta clicar com o botão direito e **Add Source**. Fazendo isso abrirá a seguinte janela:
    ![](https://i.imgur.com/Ue1iLZZ.png)

    Novamente temos nosso **Device Type** e aqui temos duas novas opções, o **IC**, que é uma fonte de corrente, e o **Resistor**.

    Para o motor, seria maneiro usar o IC, que ai a gente poderia colocar direito quanto o motor puxa, porém, não consegui fazer ele funcionar até então. Dito isso, estaremos utilizando o **Resistor**

    A gente vai selecionar o valor da resistência fazendo uma continha simples, utilizando o famoso U = R.i. Os motores dos beetles puxam, em média, 6A. Como estamos utilizando uma 6S, ou seja, mais ou menos 25V, faremos 25/6 que da 4.2 ohns.

    Colocaremos esse valor e daremos o _Ok_

Agora, nos já poderiamos iniciar nossa simulação, porém só colocamos um dos motores. Fazendo o circuito para os dois motores e clicando em **Analyze** temos algo mais ou menos assim:

![](https://i.imgur.com/IQn6Ccw.png)

---

### Interpretando a Simulação

Após clicar em _Analyze_ abrirá uma nova guia com algumas informações, se quiser mudar alguma coisa na simulação, basta voltar para a janela **Config**. 

![](https://i.imgur.com/TpxBrha.png)

Como foi dito diversas vezes, queremos ver a quantidade de corrente que está passando por uma trilha para ver se ela corre o risco de explodir ou não. Para fazer isso, na janela _Visual_, clique em **Current Density**, selecione a caixa **Highlight Peak Values** e em _Views_ clique em **2D** ou **3D**. Com essa opção ele mostrará os picos na placa com concentração de corrente por milímetro quadrado (A/mm²).

![](https://i.imgur.com/Y1Ej50k.png)

Olhando a PCB você consegue ver onde estãos esses picos por causa da opção **Highlight Peak Values**. Na janela do PDN, você consegue ver qual o valor de corrente por milímetro quadrado e ver os outros locais onde tem esses picos.

![](https://i.imgur.com/dyLvO3U.png)

Depois de alguns testes, chegamos a conclusão que o limite para esse valor é de **400 A/mm²**, passando desse valor o ricos da trilha/malha romper é alto.

---
