---
sidebar_position: 3
title: 3. Gate Driver
---

## Mosfet como chaves (Gate Driver) 
O transistor MOSFET desempenha um papel fundamental em conversores chaveados. Em situações em que o controle é realizado por microcontroladores (MCUs) ou processadores digitais de sinais (DSPs), é comum empregar um circuito de comando para acionar o MOSFET. Esses circuitos são essenciais devido à falta de capacidade suficiente de corrente e tensão nos dispositivos de controle.

Os circuitos de comando para MOSFETs podem ser isolados ou não isolados, dependendo da aplicação específica. Em casos em que o terminal "source" do transistor compartilha o mesmo "terra" do conversor e a potência não ultrapassa 200 W, um circuito de comando não isolado pode ser utilizado. Contudo, quando o terminal "source" possui um referencial diferente do "terra" ou a potência é mais elevada, a utilização de um circuito de comando isolado torna-se necessária.

![image](https://hackmd.io/_uploads/ByPIQcTY6.png)

Exemplos de aplicações em que (a) o terminal source compartilha o mesmo "terra" do circuito e (b) o terminal ource é referenciado a um ponto diferente do "terra".

**Resumindo para Canal N:** 
Drain - Conetado na carga (um motor por exemplo)
Gate - Conectado no sinal de controle
Source - Conectado no Terra

Link legal: https://www.youtube.com/watch?v=Q5Dj9uvIEbc