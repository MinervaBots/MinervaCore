---
sidebar_position: 0
title: 0. Controle Spektrum
---

# Controle Spektrum

## O que vai ser visto aqui:

## Geral:
A intenção do relatório é mostrar o passo a passo de todos os processos necessários
para usar o controle da Spektrum, além de fornecer informações dos canais exibidos
pelo monitor do controle.

![image](https://imgur.com/7lLgEO7.png)

## Alimentação:
- o Controle: São necessárias quatro pilhas normais de 1,5V ou alimentação
externa, recomendável, entre 5V e 6V. Abaixo de 4,5V o controle começa
a apitar, indicando tensão baixa. Caso esteja abaixo de 4V o mesmo é
incapaz de ligar.

![image](https://imgur.com/A376WWF.png)

- Receptor: Basta conectar uma alimentação de 6V no pino positivo de
qualquer canal e o GND no pino negativo, também de qualquer canal e
estará ligado, mesmo não acendendo nenhum LED.

## Bind:
Para sincronizar o receptor (modelo: AR6210) com o controle é necessário realizar o
processo de bind do mesmo.

O primeiro passo é conectar um bind plug (ou um jumper) no pino GND (esquerda)
e no pino de Sinal (direita) do canal BIND/DATA.

![image](https://imgur.com/6H3gAvb.png)

Feito isso, o receptor deve ser alimentado, no pino positivo (meio) e no negativo,
ambos podem ser conectados em qualquer canal. Assim ele estará ligado (piscado o LED
rapidamente) e pronto para realizar o bind com algum controle.

Para bindar o controle com o receptor, segure a chave TRAINER no controle (canto
superior esquerdo) e ligue o mesmo. Assim, ele estará procurando o receptor e irá
aparecer “BIND” no monitor. Quando o LED do receptor parar de piscar e ficar aceso,
solte a chave TRAINER. Após, desligue o controle e o receptor para remover o bind plug.
Assim, a operação estará realizada com sucesso.

![image](https://imgur.com/tDbwOyj.png)

## Configuração Trekking:

![image](https://imgur.com/ZIySp4M.png)

Para alterar o modo de locomoção do Trekking, coloque a chave GEAR (canto superior
esquerdo) em:
- 0 para Autônomo
- 1 para Rádio Controlado

Os canais que são utilizados no Trekking, quando está em modo RC, e suas
respectivas funções são:
- Throttle (Esquerda vertical): Varia a posição da câmera.
- Elevator (Direita vertical): Varia a velocidade linear do robô.
- Rudder (Esquerda horizontal): Varia a direção do robô.
o Aileron (Direita horizontal): Disponível para futuras utilidades.

## Acessar o Monitor:

O monitor é a forma de visualizar no próprio controle a variação de cada canal ao
mudar a posição de cada Joystick.

Para acessar essa funcionalidade, basta clicar no botão/rodinha do lado direito da tela.
Assim, irá para o menu ilustrado abaixo

![image](https://imgur.com/foaT1br.png)

Gire o botão/rodinha para direita até chegar em SETUP LIST. Então clique para acessá-la.

![image](https://imgur.com/qfklQgM.png)

Vá até MONITOR e clique nele.

![image](https://imgur.com/7kZweNO.png)

Após isso, é possível visualizar todos os canais e sua formas de variações conforme se muda
a posição dos Joysticks.

![image](https://imgur.com/nQJi0ho.png)

## Reversão de canais:

Para acessar essa funcionalidade, basta ir em REVERSE no menu ADJUST LIST.

![image](https://imgur.com/7xDuEhi.png)

Caso queira reverter um canal, ou seja, quando o joystick vai para um lado, o controle
considera que ele está indo para o outro, basta ir até o nome dele, como mostra a figura, e
clicar com o botão/rodinha para ele mudar de “N” para “R” de reverse.
