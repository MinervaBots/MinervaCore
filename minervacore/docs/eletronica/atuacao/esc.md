---
sidebar_position: 0
title: ESC
---

# ESC's 🛞

## O que é um ESC

Um ESC, ou _Eletronic Speed Controller_, como o nome já diz, nada mais é do que um controlador de velocidade eletrônico. Ele serve para controlar a rotação de motores elétricos, os **Motores Brushed**, ou o acionamento das bobinas nos **Motores Brushless**.

Apesar de já ter casos na equipe em que usamos ESC's para controlar motores brushed, a gente usa os ESC's exclusivamente para o controle de motores brushless. Nessa página na wiki aprenderemos um pouco melhor como funciona e como utilizar um ESC, mais especificamente o ESC Brushless.

---

## Como funciona um ESC para motores brush

Antes de falar sobre o ESC em sí, vamos primeiro entender como funciona um motor brushless.

Os motores brushless, assim como o próprio nome diz, são motores que **não possuem escova**, mas sim, **bobinas**. Isso faz com que o controle dele se torne um pouco mais complicado do que um motor brushed, em que basta usar uma Ponte-H para controlá-lo, nós precisamos de um circuito que faça o chaviamentos das bobinas de maneira correta, e é aqui que entra o ESC.

O ESC possui um microcontrolador com uma configuração no seu firmware pré-definida que irá controlar o acionamentos dos MOSFET's para energizar as bobinas do motor, assim, controlando a rotação dele.

![](https://blog.eletrogate.com/wp-content/uploads/2020/07/three-phase-motor_zps74akxbas.gif)

A velocidade de rotação do motor é controlado por um sinal PWM recebido - seja diretamente do receptor ou de uma placa nossa, esp e etc - e interpretado pelo microcontrolador que controlará a velocidade de chaviamento dos MOSFET's.

## Como usar um ESC para motores brushless

Agora que já sabemos como funciona os motores brushless e o ESC brushless, podemos entender melhor como funciona a montagem do circuito com eles.

![](https://i.imgur.com/CjDthw0.png)

Em um ESC nós temos 3 partes importantes, sendo elas:

- **Alimentação:** Aqui não tem muito segredo, é onde o ESC será alimentado. Importante lembrar que o ESC tem limite de **Tensão** e **Corrente**, então antes de comprar seu ESC fique antento com isso.

- **Motor:** Esses 3 fios são as saídas do motor. Diferente de um motor brushed, os motores brushless tem 3 sáida por causa de suas bobinas - ao todo, os motores possuem 3 bobinas, ou seja, um fio para cada uma delas.

- **Sinal:** É esse conector que ligaremos na placa ou direto no receptor e é onde por onde chega o sinal de PWM para o ESC. Além do sinal, nesse conector temos outros 2 fios com a seguinte função:
    - **BEC:** O BEC, ou _Battery Eliminator Circuit_, serve basicamente para alimentar o seu circuito e evitar que a gente tenha que usa uma alimentação externa para ele. Nas nossas placas não usamos ele pois temos que alimentar algumas coisas que esse BEC não daria conta, mas aonde a gente mais usa ele é nos **receptores**. Para a gente não usar uma bateria externa mais um regulador de tensão para regular a tensão dessa bateria e alimentar o receptor, a gente usa o BEC do ESC, que nada mais é do que um 5V. Vale ressaltar que alguns ESC's não possuem o BEC, isso varia de ESC para ESC.
    - **GND:** Nossa famosa tensão de referência ;)

Agora, vamos partir para a montagem do circuito:

![](https://i.imgur.com/hK2p91R.png)

Aqui estamos usando um arduino para montar o circuito, mas poderia ser uma de nossas placas ou direto no receptor como foi falado, basta respeitar os pinos de sinal, bec e GND.

Sobre esse circuito em si não temos muito o que falar, ele é basicamente isso da imagem.

Sobre o código dele, a gente trata o ESC como se fosse um servo. Podemos ver no código de exemplo abaixo:

~~~C++
#include <Servo.h> //inclui a biblioteca Servo

Servo ESC; //cria o objeto ESC

void setup(){
  ESC.attach(pinoEsc); //informa o pino em que o ESC esta conectado
}
void loop(){
 ESC.write(valor); //envia um valor para o ESC (entre 0 e 180)
}
~~~

Obs: Algo que muitas pessoas tem duvida é sobre como medir a corrente de um motor brushless e para isso existem duas formas:
- **Primeira:** Basta usar um alicate amperimetro para corrente alternada em um dos fios do motor. Ele não dará o valor exato até por que não é uma corrente alternada, mas será um valor bem próximo pois o que acontece nos fios do motor se aproxima de uma corrente alternada.
- **Segunda:** Basta ligar um amperimetro em série entre a bateria e o ESC. Terá um corrente que serve para o funcionamento do ESC mas essa corrente é bem baixa.