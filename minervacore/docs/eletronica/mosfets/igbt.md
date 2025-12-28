---
sidebar_position: 1
title: 1. IGBT
---

# IGBT (Insulated Gate Bipolar Transistor):

O IGBT é um dispositivo híbrido que combina características dos transistores bipolares de junção (BJT) e dos transistores de efeito de campo (FET). Ele possui uma estrutura bipolar na camada de saída (coletor-emissor) e um controle de porta similar ao Mosfet.

A necessidade do transistor bipolar de porta isolada, IGBT, surgiu porque os MOSFETs e os transistores de junção bipolar, BJTs, têm suas limitações, principalmente quando se trata de aplicações de alta corrente.

Consequentemente, a invenção do transistor IGBT permitiu que as vantagens de ambos os tipos de dispositivos fossem combinadas em um único dispositivo semicondutor.

![image](https://hackmd.io/_uploads/rJ6h_F6ta.png)


**Características de Comutação**

Os IGBTs (Insulated Gate Bipolar Transistors) são amplamente utilizados como comutadores em conversores de frequência, inversores, entre outros. Em aplicações onde cargas indutivas são ligadas e desligadas, podem surgir tensões inversas elevadas que precisam ser protegidas. Essa proteção é realizada usando diodos ou circuitos semelhantes aos estudados para MOSFETs de potência. Quando o IGBT é ligado novamente, o fluxo de corrente no diodo inicialmente age como um curto, exigindo a remoção da carga armazenada para que o diodo possa bloquear a tensão. Esse processo resulta em uma corrente adicional chamada de corrente reversa de recuperação do diodo (Irr), cujo valor máximo ocorre quando a soma das tensões sobre o IGBT e o diodo é igual à tensão de alimentação, conforme exemplificado no gráfico da figura 7.

![image](https://hackmd.io/_uploads/HyHyUK6tp.png)

### Considerações finais:

- IGBTs são frequentemente usados em aplicações de alta potência, onde é necessária a capacidade de lidar com altas tensões e correntes.