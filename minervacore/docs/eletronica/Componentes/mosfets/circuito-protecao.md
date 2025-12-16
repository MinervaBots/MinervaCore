---
sidebar_position: 6
title: 6. Circuito de Proteção em Mosfets
---

## Circuito de Proteção para os mosfets 
### Snubber Circuit 
O circuito snubber é geralmente composto por resistores, capacitores e, às vezes, diodos. Existem dois tipos principais de circuitos snubber: snubber de tensão (voltage snubber) e snubber de corrente (current snubber). Aqui, vou explicar brevemente cada um deles:

##### Snubber de Tensão (Voltage Snubber):

Consiste em um resistor e um capacitor conectados em paralelo.
O resistor ajuda a limitar a taxa de aumento da tensão (dv/dt) durante a comutação.
O capacitor é usado para absorver energia e reduzir picos de tensão.
A equação fundamental do snubber de tensão é 
RC ≥ Ton/2 , onde Ton é o tempo de condução do mosfet.

##### Snubber de Corrente (Current Snubber):

Consiste em um resistor em série com um diodo em antiparalelo e um capacitor conectado em paralelo.
Ajuda a limitar a taxa de aumento da corrente (di/dt) durante a comutação.
O diodo permite que a corrente flua em direção oposta durante a comutação, reduzindo os transientes de corrente.
A equação fundamental do snubber de corrente é 
L ≥ (R.Ton)/2 , onde L é a indutância no circuito.


### Diodo de Roda Livre 
O que é um diodo roda livre? Então, emprega se um diodo em paralelo com a carga (diodo de roda-livre) para suprimir a parcela de tensão negativa, aumentando a tensão média na carga. 