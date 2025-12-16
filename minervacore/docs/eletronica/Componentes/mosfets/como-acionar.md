---
sidebar_position: 4
title: 4. Como acionar o Mosfet
---

## Como acionar o mosfet?

**1. Identifique os pinos:**

Source (Fonte): Terminal por onde a corrente entra.
Gate (Porta): Terminal de controle que determina a condutividade do canal.
Drain (Dreno): Terminal por onde a corrente sai.

Obs: Atente-se a qual Mosfet está sendo usado! No NMOS, a corrente flui do Source para o Drain quando a tensão na Porta (Gate) é positiva em relação ao Source. No PMOS, a corrente flui do Drain para o Source quando a tensão na Porta é negativa em relação ao Source.

**2. Tensão de Alimentação:**

Aplique uma tensão adequada entre o Source e o Drain para permitir a passagem de corrente quando o MOSFET estiver ativado. Como esse tipo de transistor é comandado por tensão, para acionarmos um MOSFET precisamos aplicar uma tensão positiva maior ou menor que a tensão de threshold entre os terminais gate e source. 

**3. Aplicação de Tensão na Porta (Gate):**

No caso de um NMOS, uma tensão positiva (superior à tensão do Source) na porta em relação à fonte tornará o MOSFET condutivo, permitindo a passagem de corrente do Source para o Drain.
Para um PMOS, uma tensão negativa (inferior à tensão do Source) na porta em relação à fonte terá o mesmo efeito.

**4. Tensão de Threshold (Limiar):**

Lembre-se de que os MOSFETs têm uma tensão de threshold, abaixo da qual o MOSFET não conduz significativamente. Certifique-se de aplicar uma tensão na porta que ultrapasse esse valor. Para alguns casos também pode ser necessário colocar um resistor de pull down ligado ao terra para manter a entrada em nível lógico baixo quando nenhum outro componente estiver conduzindo. Além disso, esse resistor é util para limitar a corrente de carga e descarga da capacitância da porta, melhorando assim a eficiência e a velocidade de comutação.

**5. Tensão de Gate-Gate (Vgs):**

A diferença de potencial entre a porta e a fonte, chamada tensão Gate-Source (Vgs), é crucial para determinar o estado do MOSFET.