---
sidebar_position: 1
title: Reguladores de Tensão
---

# Tipos de reguladores

## Reguladores Linear

#### Família 78XX

![image](https://imgur.com/mKg7xhp.png)

- 78 - número que representa um tipo de regulador, trabalha com tensão positiva e Regula reduzindo a tensão por efeito Joule.
- XX- É o valor para qual a tensão é regulada.
 
São bastante utilizados na equipe, muitas vezes para regulação de 5V (7805)

Perdem sua eficiência quando precisam reduzir de tensões muito altas, nesse ponto um regulador buck, ou associação de reguladores pode ser uma opção.

-regulador linear

-Tensão máxima(Vin): 35V

-Tensão min(Vin): 3V acima da tensão a ser regulada 

-Potência dissipada: P= (Vin - Vout)*Iout

-A partir de 1W é extremamente recomendado uso de dissipador

-Potência máxima com dissipador: 15W

-Corrente máxima de saída: 1A

-É possível regular uma tensão maior que 5v em sua saída associando um resistor entre o pino 2 e o GND

-[datasheet](https://www.ti.com/lit/ds/symlink/lm340.pdf?ts=1702935851352&ref_url=https%253A%252F%252Fwww.ti.com%252Fproduct%252FLM340%253Futm_source%253Dgoogle%2526utm_medium%253Dcpc%2526utm_campaign%253Dti-null-null-xref-cpc-pf-google-wwe%2526utm_content%253Dxref%2526ds_k%253D%257B_dssearchterm%257D%2526DCM%253Dyes%2526gad_source%253D1%2526gclid%253DCjwKCAiA-P-rBhBEEiwAQEXhH_DWy3FJ8n5A3nCi7tHMGzxrh7MoEaSQ7ydt30wCRLRoMtneMw5dtRoC_v8QAvD_BwE%2526gclsrc%253Daw.ds)



### Família 79XX
-79 -número que representa um tipo de regulador, trabalha com tensão negativa e Regula reduzindo a tensão por efeito Joule.

-não é comum utilizarmos na equipe

-Diferente do 7805, sua tensão de entrada deve ser negativa.

-[Datasheet](https://pdf1.alldatasheet.com/datasheet-pdf/view/33409/UTC/LM7905.html)

Referência:
[Unesp:78XX e 79XX](https://www.feg.unesp.br/Home/PaginasPessoais/ProfMarceloWendling/2---ci-reguladores-de-tensao---v1.0.pdf)


### LM317EMP

![image](https://imgur.com/GGFFMDQ.png)

- Tensão máxima(Vin): 37V
- Tipo Linear
- Regulador normalmente utilizado para controle de tensão do Wroom, inclusive no próprio módulo
- [Datasheet](https://pdf1.alldatasheet.com/datasheet-pdf/view/447306/TGS/LM317EMP.html)
## Reguladores tipo buck
São reguraldores conhecidos como conversor Buck:


### Mini 360

![image](https://imgur.com/In3RaJl.png)

-É um regulador bastante comum utilizado na equipe
- possui em geral uma alta eficiência
- Regulador tipo buck - step down(reduz tensão)
- Entrada 4.75 - 23V
- saída ajustável (1-17)V
- Corrente máxima de saída: 1,8 nominal. pico de 3A
- ajuste precisa ser no mínimo 2V de diferença

- [MP2307DN](https://pdf1.alldatasheet.com/datasheet-pdf/view/189149/MPS/MP2307DN.html) buck converter chip

- [datasheet](https://www.matts-electronics.com/wp-content/uploads/2018/06/MINI-360.pdf)

