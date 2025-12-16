---
sidebar_position: 0
title: 0. Sensores Infravermelhos
---

# Sensores Infravermelhos
---
![](https://i.imgur.com/Cv89MYz.png)

São os famosos sensores de oponente utilizados por todos os sumôs da equipe. Eles geralmente trabalham com a emissão e recepção de um sinal infravermelho e servem para detectar se há ou não algo a frente do sensor. Dependendo do sensor, é possível medir a distância até o obstáculo.

Os sensores de obstáculo podem ser divididos em dois tipos, os sensores de ultrassom e os sensores de infravermelho. Neste documento estaremos falando apenas do segundo por que a utilização do primeiro já não é mais condizente com o cenário competitivo atual.

### Funcionamento Eletrônico

Os sensores de obstáculo trabalham com a emissão de uma onda eletromagnética, geralmente do espectro ao redor do infravermelho. Essa onda viaja o meio quase que numa linha reta até que colida com algum objeto e, nessa colisão, seja refletida devolta para o receptor deste sensor.

![Funcionamento de um Sensor de Obstáculo](https://i.ibb.co/CBCSLHV/SENSOR.png)

Na imagem acima, o caso **1** indica a detecção de um obstáculo, já no caso **2**, não houve essa reflexão e a onda seguiu indefinidamente, sem retornar para o receptor, gerando um timeout e posteriormente uma não detecção.

Dado esse formato de detecção, podemos imaginar um circuito básico interno do funcionamento eletrônico destes tipos de sensores.

![Circuito dos Sensores de Obstáculo](https://i.ibb.co/hmkTjYZ/SENSOR-CKT.png)

Assim, o circuito possui duas partes isoladas: A primeira composta pelo Diodo Infravermelho e pela resistência R1, esta seria a parte do emissor; e a segunda sendo a parte do Fototransistor com a resistência R2 correspondendo ao receptor.

Na primeira parte, um diodo ficaria aceso emitindo a luz infravermelha responsável por refletir num obstáculo e incidir sobre o fototransistor da segunda parte. Por fim, o fototransistor funcionará como uma chave que seria fechada quando essa incidência de luz infravermelha ocorresse, jogando o sinal de 5V na saída digital do sensor, simbolizada pelo formato triangular que sai do primeiro pino do resistor.

Sensores de Reflectância
---
![](https://i.imgur.com/yGRCMGh.png)

Os sensores de reflectância conseguem medir a intensidade da luz refletida por um obstáculo, assim, conseguimos saber a intensidade do brilho da cor dele. São utilizados na detecção de bordas das arenas do sumô e nas linhas dos seguidores justamente pela diferença entre o quanto de luz é enviada e o quanto é refletida de uma área de cor preta e uma de cor branca.

Basicamente o funcionamento deles é muito parecido com os de obstáculo, a única diferença é que eles se importam com a intensidade da onda infravermelha que chegou no receptor. Sendo assim, podemos fazer uma pequena altaeração no circuito interno para nos aproximarmos ao funcionamento de um sensor de reflectância.



Observamos que o fototransistor já não mais faz parte do circuito do receptor, mas o resto pôde continuar igual. Note também que o novo componente, o Fotodiodo, está polarizado inversamente, e isto é obrigatório para que seu funcionamento se assemelhe ao de um resistor LDR. Observemos o gráfico abaxio:

![Wavelength Electronics https://www.teamwavelength.com/photodiode-basics/](https://www.teamwavelength.com/download/i-v-curve-1024x685.png)

Podemos notar três curvas bem definidas nesse gráfico, elas possuem identificação de *P0*, *P1* e *P2* de cima para baixo e indicam, respectivamente, situações de pouquíssima luz, luz razoável e muita luz.
Para a correta análise desse gráfico, tomamos o ponto mais ou menos perto do **-5v** (visto que o diodo está polarizado inversamente). Imaginemos esse ponto estando na coluna da setinha **Ip** na figura. Como temos uma fonte de tensão que fixa essa voltagem neste valor, nossa análise fica restrita à esta coluna, não podemos variar nossa posição no eixo horizontal.

A outra variável que temos que observar é a intensidade de luz que chega no fotodiodo, representada pelas três curvas diferentes no gráfico. Perceba que o quanto mais luz existir no ambiente, mais essa curva irá movimentar-se para baixo, **aumentando o MÓDULO da corrente** que passa no diodo.
Portanto, dessa maneira temos um valor fixo, que é a **tensão em -5V**, um valor que depende do ambiente, que é a **intensidade da luz refletida** e o resultado disso tudo que é a **corrente que o diodo deixa passar por ele**.

É muito importante lembrar que estamos trabalhando com o fotodiodo polarizado inversamente e que, no final da contas, esse valor de corrente negativo será tomado como um valor positivo para todo o resto do circuito e por isso foi enfatizado que o módulo da corrente subiria, mesmo que numa análise invertida o valor da corrente estaria diminuindo para valores cada vez mais negativos.

Para concluir, quanto mais intensidade de luz chegar no foto diodo, mais corrente ele vai deixar passar por ele, funcionando como um resistor variante na luz.


### Sensores utilizados na Equipe:
## Sensor Ambar

![image](https://imgur.com/xKWWF3k.png)

| Model Code                           | AMBA2409                                             |
|--------------------------------------|------------------------------------------------------|
| Triggering function                  | Built-in oscillation circuit type (Internal trigger) |
| Método de saída                      | NPN open collector output / H type                   |
| Tensão de operação (V.DC)            | 4.5 to 5.5                                           |
| Corrente                             | 6.2mA / 11.2mA                                       |
| Detecação nominal        (cm)        | 80cm                                    |
| Ciclo de medição                     | 8mS                                                  |
| peso (g)                             | 9 g                                                  |




### [QRE1113GR](file:///C:/Users/lucas/Downloads/Sensor%20de%20Refletancia.pdf)

![image](https://imgur.com/kgGiGi3.png)

| Model Code                           | QRE1113GR                                       |
|--------------------------------------|------------------------------------------------------|
| Método de saída                      | Phototransistor output                   |
| Tensão de diodo (V.DC)               | 1.2 to 1.6                                           |
| Corrente                             | 20mA                                     |
| Detecação nominal        (cm)        | até 2mm                                    |
| Ciclo de medição                     | 25uS                                                  |
| peso (g)                             | 0.2g                                                  |
---


O circuito desse sensor é utilizado com um Pullup, é um sensor que envia um sinal analógico de nivel alto enquanto a baixa reflexão do laser, e alto quando há alta intensidade de onde refletida. Para utilizar sensores desse em paralelo deve ser feito uma calibração, pois em geral seus minimos e máximos não geram sinais iguais.

## Sensores de Velocidade Encoder

![](https://i.imgur.com/9PJdzsd.png)


Na imagem acima temos um encoder óptico, que usa os lasers para identificar a rotação do disco. Através da rotação do disco é possível calcular a velocidade angular das rodas e, consequentemente, a velocidade linear do robô. O que usamos na equipe é um encoder magnético, que usa o efeito Hall invés de sensores ópticos, mas o princípio é parecido. Devido a certa experiência que a equipe já possui com os encolders magnéticos, sendo usados em pelo menos 2 projetos, focaremos nesses tipos de sensores.

### Funcionamento Eletrônico
![](https://i.imgur.com/5yP3Y7e.png)

Como já mensionado os encolders magnéticos utiliza do efeito Hall. O efeito Hall está relacionado ao surgimento de uma diferença de potencial em um condutor elétrico, transversal ao fluxo de corrente e um campo magnético perpendicular à corrente. Essa diferença de potencial é detectada pelo sensor e transmitida para o arduino. Caso você queira entender  um pouco melhor como funciona o efeito Hall, [veja esse vídeo na velocidade x1.5](https://youtu.be/bHo6_jltfc8):

A grande vantagem em utilizá-los é o seu circuito ser composto pelo próprio sensor e um resistor de pull-up, o que simplifica bem as coisas.