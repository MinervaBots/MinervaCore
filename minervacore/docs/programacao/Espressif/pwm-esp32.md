---
sidebar_position: 0
title: 0. PWM no ESP32
---
# Gerando Sinais de PWM com o ESP32

## O que é um sinal com PWM?

PWM é uma técnica para gerar sinais que simulam valores de tensão variados. O microcontrolador emite um sinal variando entre estado alto e estado baixo muito rápido. Dessa forma, quanto maior o tempo do pulso em estado alto, maior a tensão e vice versa.

Quando queremos gerar sinais de PWM com o Arduino utilizavamos a função ```analogWrite```, porém no ESP32 é diferente. A framework do Arduino no PlatformIO para o ESP32 até tem essa função mais ela é meio instável de se usar. Para gerar os sinais PWM, o ESP32 possui um conjunto de funções dedicadas para essa função. Inclusive, a função ```analogWrite``` imbutida no PlatformIO utiliza elas. Esse conjunto de funções para gerar PWM no ESP32 é chamado de **ledc** e foi desenvolvido específicamente para controlar a intensidade do brilho de LEDs (por isso esse nome), mas também serve para controlar motores ou qualquer outra coisa que precise de um sinal PWM.

Além disso, diferente do Arduino que possui pinos específicos para gerar sinais de PWM, qualquer pino do ESP32 pode emitir esses sinais. Isso acontece porque os responsáveis por gerar o sinal de PWM são **canais** de temporizadores e não os pinos em si.

<center>
![](https://i.imgur.com/aEAgANi.png)
<p>Configurações principais da API do controlador PWM LED</p>
</center>

A limitação do ESP32 é que ele possui 16 canais de PWM que são numerados de ```0 a 15```.

Portanto, para gerar os sinais PWM utilizamos 3 funções do conjunto **ledc**:

```cpp
ledcSetup(canal, frequencia, resolucao);
ledcAttachPin(pino, canal);
ledcWrite(canal, valorDePWM);
```

A função ```ledcSetup``` serve para configurar o canal. Ela recebe de entrada 3 parâmetros:

- O primeiro parâmetro é o canal que será utilizado para gerar os sinais. Lembrando que o ESP32 possui 16 canais numerados de ```0 a 15```;
- O segundo parâmetro é a frequência do sinal gerado em Hz. Geralmente é utilizado o valor de 1000 Hz;
- O terceiro parâmetro é a resolução. Ela indica a quantidade de bits do intervalo do valor de PWM. Por exemplo, com uma resolução de 8 bits o valor de PWM varia no intervalo [0, 255], pois $`2^{8} - 1 = 255`$. Para uma resolução de 12 bits, o valor varia no intervalo [0, 4095], pois $`2^{12} - 1 = 4095`$.

A segunda função, a ```ledcAttachPin``` serve para anexar um pino (GPIO) ao canal, ou seja, quando o sinal de PWM for gerado pelo canal, ele irá aparecer no pino.

A ultima função, a ```ledcWrite```, serve para gerar o sinal com o valor de PWM como parâmetro. Ela é bem parecida com a ```analogWrite```, mas ao invés de usar o pino como parâmetro, é utilizado o canal.

Além disso, é possível anexar mais de um pino ao mesmo canal com a função ```ledcAttachPin```. Ao fazer isso, o mesmo sinal de PWM irá aparecer em todos os pinos que estão anexados ao mesmo canal.

## **Exemplo de Código:**

```cpp
/*
    Código para controlar a intensidade do brilho de dois LEDs. Um irá
    acender devagar enquanto o outro irá apagar devagar, ao mesmo tempo.
*/

#include <Arduino.h>

// Definição dos pinos dos LEDs
const int LED_1 = 2;
const int LED_2 = 4;

// Definição dos canais utilizados
const int CANAL_DO_LED_1 = 0;
const int CANAL_DO_LED_2 = 1;

// Definição da frequência, em Hz, do sinal de PWM
const int FREQUENCIA_DO_SINAL_DE_PWM = 1000;

// Definição da resolução (em bits) que define o intervalo entre o mínimo e máximo do valor de PWM
// Uma resolução de 8 bits significa que o valor de PWM varia no intervalo [0, 255] (2⁸ = 256 níveis de controle)
const int RESOLUCAO = 8;

void setup() {
    // Configura os canais que geram os sinais de PWM
    ledcSetup(CANAL_DO_LED_1, FREQUENCIA_DO_SINAL_DE_PWM, RESOLUCAO);
    ledcSetup(CANAL_DO_LED_2, FREQUENCIA_DO_SINAL_DE_PWM, RESOLUCAO);

    // Anexa os canais que geram os sinais de PWM nos pinos
    ledcAttachPin(LED_1, CANAL_DO_LED_1);
    ledcAttachPin(LED_2, CANAL_DO_LED_2);
}

void loop() {
    // Estrutura de repetição com i iniciando com o valor 0 e j com o valor 255
    // A cada repetição é somado 1 ao valor de i e subtraído 1 do valor de j
    for (int i = 0, j = 255; i <= 255; i++, j--) {
        // Altera o valor do brilho dos LEDs
        ledcWrite(CANAL_DO_LED_1, i);
        ledcWrite(CANAL_DO_LED_2, j);

        // Espera 10 ms
        delay(10);
    }
}

```