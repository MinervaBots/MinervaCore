---
sidebar_position: 0
title: 0. Funcionamento do IMU
---

# Sensor IMU
---
O IMU tem como objetivo medir uma força específica, taxa angular e orientação do corpo. Essa informação é fornecida por meio de acelerômetros, giroscópios e magnetômetros. O primeiro mede a aceleração de um corpo por meio de um sistema de capacitâncias. O segundo é usado para saber a rotação de um sistema. Enquanto o último funciona como um módulo de bússola. Dessa forma, os sensores se complementam para dar uma melhor referência um ao outro, o que garante maior precisão.
Os mais comuns utilizados na equipe são o **MPU-6050** e o **MPU-9152**.

![](https://i.imgur.com/F5jvoj4.png)

### Funcionamento Eletrônico
No caso do MPU-6050 acima temos um acelerômetro e giroscópio.
O acelerômetro funciona a partir de uma pressão mecânica que gera uma tensão elétrica. Imaginando que temos uma bola dentro de um cubo, toda vez que ela for movimentada ela colidirá em uma das paredes, sendo que cada uma delas representará um dos eixos X, Y, Z.

![](https://i.imgur.com/U7IJfYk.png)

O giroscópio por sua vez consiste em uma roda livre para girar em qualquer direção e opõe-se a qualquer tentativa de mudar sua direção original. Tem como objetivo identificar se você gira algo em seu próprio eixo ou saber se está apontando-o para cima ou para baixo.

![](https://i.imgur.com/HaeF6nG.png)
