---
sidebar_position: 5
title: 5. Dissipação no Mosfet
---

## Cálculo de dissipação no mosfet
O cálculo da dissipação de energia em um MOSFET (Transistor de Efeito de Campo Metal-Oxide-Semiconductor) é importante para garantir que o dispositivo opere dentro de suas especificações de temperatura e potência. A dissipação de energia ocorre devido à queda de tensão e corrente através do MOSFET, resultando em calor que precisa ser dissipado para evitar danos ao componente.

A fórmula básica para calcular a dissipação de potência em um MOSFET é:

Pdiss = Id . Vds

onde:
- Pdiss é a potência dissipada em watts (W),
- Id é a corrente através do MOSFET no canal de dreno (em ampères, A),
- Vds é a queda de tensão entre o dreno e a fonte do MOSFET (em volts, V).

Além disso, a potência total dissipada em um MOSFET pode ser encontrada somando a potência de condução e a potência de comutação 
onde:
- a potência de condução, relacionada à operação contínua do MOSFET,
- a potência de comutação, relacionada ao processo de ligar e desligar do MOSFET.

A potência de comutação pode ser calculada usando a frequência de comutação (Fsw) e a energia total de comutação (Eon/off):

Psw= 1/2 (Fsw.(Eon+Eoff))
onde Eon é a energia de ligação e Eoff é a energia de desligamento.

Certifique-se de verificar as especificações do MOSFET no datasheet, pois esses cálculos podem variar com base nas características específicas do dispositivo. O datasheet fornecerá informações sobre a resistência térmica, limites de temperatura, corrente máxima permitida, entre outros dados importantes para o projeto e cálculo adequados.