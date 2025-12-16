---
sidebar_position: 0
title: 0. ESP-32
---
# Especificações do uso ESP32

### Introdução

- ESP32 ([Datasheet<sup>1</sup>](https://www.filipeflop.com/img/files/download/Datasheet_ESP8266_esp32_en.pdf), [Datasheet<sup>2</sup>](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf))
- [Referência de pinagem](https://capsistema.com.br/index.php/2020/03/22/referencia-de-pinagem-do-esp32-quais-pinos-do-gpio-voce-deve-usar/)

Nesta documentação estão registradas informações técnicas para auxiliar No uso do ESP32.

> O módulo ESP32 é um módulo de alta performance para aplicações envolvendo wifi, contando com um baixíssimo consumo de energia. É uma evolução do já conhecido ESP8266, com maior poder de processamento e bluetooth BLE 4.2 embutido.
> 
> Na placa temos o chip ESP32 com antena embutida, uma interface usb-serial e regulador de tensão 3.3V. A programação pode ser feita em LUA ou usando a IDE do Arduino através de um cabo micro-usb. Com 4 MB de memória flash, o ESP32 permite criar variadas aplicações para projetos de IoT, acesso remoto, webservers e dataloggers, entre outros.
> 
> Sem dúvidas este módulo é um grande aliado do maker IoT! Ao comparar seu preço com todas as possibilidades que ele proporciona, é possível concluir que seu custo benefício é excelente.
> 

### Drivers 

Os drivers são programas que fazem a comunicação entre o ESP32 e o computador, sem ele não conseguimos enviar o código para o microcontrolador.
- [Site da RoboCore](https://www.robocore.net/tutoriais/instalando-driver-do-nodemcu)
- [Site do fabricante](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads)

### Especificações

- CPU: Xtensa® Dual-Core 32-bit LX6
- ROM: 448 KBytes
- RAM: 520 Kbytes
- Flash: 4 MB
- Clock máximo: 240MHz
- Wireless padrão 802.11 b/g/n
- Conexão Wifi 2.4Ghz (máximo de 150 Mbps)
- Antena embutida
- Conector micro-usb
- Wi-Fi Direct (P2P), P2P Discovery, P2P Group Owner mode e P2P Power Management
- Modos de operação: STA/AP/STA+AP
- Bluetooth BLE 4.2
- Portas GPIO: 11
- GPIO com funções de PWM, I2C, SPI, etc
- Tensão de operação: 4,5 ~ 9V
- Taxa de transferência: 110-460800bps
- Suporta Upgrade remoto de firmware
- Conversor analógico digital (ADC)
- Distância entre pinos: 2,54 mm
- Dimensões: 52 mm x 28 mm x 5 mm (desconsiderando os pinos)

### Pinagem

![](https://1.bp.blogspot.com/-KeEh2o1z82w/XnUzYm7W2II/AAAAAAAADjU/xkViKlmAfzA-UXmYADkAAYWCpV0s8j8lgCLcBGAsYHQ/s1600/ESP32%2BWROOM32%2BFoto.png)

*Atenção!*

Os pinos ADC2 (GPIO 2, 4, 12, 13, 14, 15, 25, 26 e 27) **não podem ser usadas quando o Wi-Fi está ativado**.

Além disso, alguns pinos (GPIO 5, 14 e 15) emitem sinal ao ligar o ESP32. Cuidado ao conectar alguma entrada neles.

## ESP 32 Wroom
![image](https://imgur.com/t5SUYG8.png)


### Pinos especiais

- Os pinos 2, 4, 12, 13-15, 25, 26 e 27 são ADC2 e NÃO podem ser utilizados com o wi-fi ligado; 
- Os pinos 34,35,36 e 39 são apenas input;
- Os pinos 6-11 também não podem ;
- Os pinos 25 e 26 são DAC (conversor analógico - digital);
- 0, 2, 4, 5, 12 e 15 são pinos que o esp utiliza pra bootloader (pinos de amarração). 
- O pino 0 é exclusivo para enable (alto durante boot e baixo durante programação);
- Os pinos 1 e 3 são de uso exclusivo do RX/TX ;
- Os pinos 1, 3, 5, 6-11, 14 e 15 emitem um sinal alto quando da boot ou reset ;
- Os pinos 2 e 12 devem estar no estado baixo durante o boot;
- Os pinos 5 e 15 devem estar no estado alto durante boot, eles são alto naturalmente ou seja, apenas não forçar para ser baixo;

| Legenda       | Cor      |
| ------------- | -------- |
|    Seguro     |    🟢    |
|    Atenção    |    🟡    |
|     Não use   |    🔴    |



| GPIO | Seguro para usar? |                           Comentário                           |
|:----:|:-----------------:|:--------------------------------------------------------------:|
|  0   |        🟡         | Precisa ser HIGH durante boot e LOW durante programação / ADC2 |
|  1   |        🔴         |                      Uso exclusivo do RX                       |
|  2   |        🟡         |              Precisa ser LOW durante boot / ADC2               |
|  3   |        🔴         |                      Uso exclusivo do TX                       |
|  4   |        🟢         |                              ADC2                              |
|  5   |        🟡         |         Precisa ser HIGH durante boot / Apenas digital         |
|  6   |        🔴         |                   Conectado à memória flash                    |
|  7   |        🔴         |                   Conectado à memória flash                    |
|  8   |        🔴         |                   Conectado à memória flash                    |
|  9   |        🔴         |                   Conectado à memória flash                    |
|  10  |        🔴         |                   Conectado à memória flash                    |
|  11  |        🔴         |                   Conectado à memória flash                    |
|  12  |        🟡         |              Precisa ser LOW durante boot / ADC2               |
|  13  |        🟢         |                              ADC2                              |
|  14  |        🟡         |              Emite sinal LOW durante boot / ADC2               |
|  15  |        🟡         |             Precisa ser HIGH durante boot* / ADC2              |
|  16  |        🟢         |                         Apenas Digital                         |
|  17  |        🟢         |                         Apenas Digital                         |
|  18  |        🟢         |                         Apenas Digital                         |
|  19  |        🟢         |                         Apenas Digital                         |
|  20  |        🟢         |                         Apenas Digital                         |
|  21  |        🟢         |                         Apenas Digital                         |
|  22  |        🟢         |                         Apenas Digital                         |
|  23  |        🟢         |                         Apenas Digital                         |
|  25  |        🟢         |                              ADC2                              |
|  26  |        🟢         |                              ADC2                              |
|  27  |        🟢         |                              ADC2                              |
|  32  |        🟢         |                              ADC1                              |
|  33  |        🟢         |                              ADC1                              |
|  34  |        🟡         |                      Somente input / ADC1                      |
|  35  |        🟡         |                      Somente input / ADC1                      |
|  36  |        🟡         |                      Somente input / ADC1                      |
|  39  |        🟡         |                      Somente input / ADC1                      |


![Table 3- Strapping Pins](https://i.imgur.com/bezMSUN.png)

Referências:

https://randomnerdtutorials.com/esp32-pinout-reference-gpios/
