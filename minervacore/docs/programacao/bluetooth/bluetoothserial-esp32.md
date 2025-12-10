---
sidebar_position: 1
title: 1. BluetoothSerial ESP32
---

# Biblioteca de Bluetooth Clássico para ESP32

O framework Arduino já possuí uma biblioteca de Bluetooth Clássico. Para utilizá-la basta incluir o cabeçalho ```BluetoothSerial.h```. Ela funciona de forma bem parecida com as funções ```Serial```. Para utilizar as funções do Bluetooth primeiro é necessário instanciar um objeto do tipo ```BluetoothSerial```. A partir disso, será possível utilizar os métodos para realizar a troca de dados. Segue abaixo a lista de métodos e o que eles fazem:

- ```BluetoothSerial::begin(String localName = String(), bool isMaster = false)```: Inicia o Bluetooth, permitindo que dispositivos pareem com o ESP32. A string passada será o nome que irá aparecer na varredura do Bluetooth;
- ```BluetoothSerial::available()```: Retorna a quantidade de bytes recebidos via Bluetooth. É utilizada para verificar se pode começar a leitura da mensagem recebida;
- ```BluetoothSerial::read()```: Retorna **um** byte da mensagem recebida;
- ```BluetoothSerial::write(const uint8_t *buffer, size_t size)```: Envia uma mensagem via Bluetooth. Recebe uma string com a mensagem e seu tamanho.

## Código Exemplo

A seguir está um código que envia e recebe mensagens em formato JSON via Bluetooth. O ESP32 foi conectado no celular utilizando o app [Serial Bluetooth Terminal](https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal&hl=en).

![Serial Bluetooth Terminal na Google Play Store](https://i.imgur.com/h2hsedJ.png)

### Código

```cpp
#include <Arduino.h>
#include <BluetoothSerial.h>

#include <ArduinoJson.h> // Biblioteca ArduinoJson por Benoit Blanchon

// Objeto responsável pela troca de dados via Bluetooth
BluetoothSerial bt;

// String para armazenar a mensagem recebida via Bluetooth
String mensagemRecebida;

// Documento JSON para armazenar a mensagem recebida via Bluetooth
DynamicJsonDocument documentoJSONDaMensagemRecebida(1024);

void setup() {
    // Inicia o Bluetooth com o nome "Presto" como o nome do dispositivo
    bt.begin("Presto");
}

void loop() {
    // Loop para ler a mensagem recebida via Bluetooth
    // Também pode ser utilizado "if" se deseja fazer outras coisas enquanto recebe a mensagem
    while (bt.available()) {
        // Lê o byte recebido
        char byteRecebido = (char)bt.read();

        // Se o byte recebido for o caractere terminador nulo ('\0') desserializa a mensagem recebida no documento JSON
        // O recebimento deste caractere indica que a mensagem completa foi recebida
        if (byteRecebido == '\0') {
            // Desserializa a mensagem recebida no documento JSON
            DeserializationError houveErroAoDesserializar = deserializeJson(documentoJSONDaMensagemRecebida, mensagemRecebida);

            // Se não houve erro ao desserializar, envia de volta a mensagem recebida
            // Enviar a mensagem de volta é só um exemplo, a partir daqui já é possível aplicar as requisições com os dados em formato JSON
            if (houveErroAoDesserializar == DeserializationError::Ok) {
                bt.write((uint8_t*)mensagemRecebida.c_str(), mensagemRecebida.length());
            }

            // Reseta a string que armazena a mensagem recebida
            mensagemRecebida = "";
        }
        // Senão, concatena o byte recebido na string que armazena a mensagem recebida
        else {
            // Concatena o byte recebido na string que armazena a mensagem recebida
            mensagemRecebida += byteRecebido;
        }
    }
}

```

### Imagens

#### Pareando o ESP32 no celular:

<img src="https://i.imgur.com/PRIrf3v.png" width="300"></img>

#### Configurando o Caractere Terminador

<img src="https://i.imgur.com/Feb4rIT.png" width="300"></img>
<img src="https://i.imgur.com/stgEbjh.png" width="300"></img>

#### Conectando o ESP32 no app:

<img src="https://i.imgur.com/U4fIJ9R.png" width="300"></img>
<img src="https://i.imgur.com/Bi7fYwD.png" width="300"></img>

#### Enviando e Recebendo Mensagens

<img src="https://i.imgur.com/NlcTPP4.png" width="300"></img>
<img src="https://i.imgur.com/bHDfkch.png" width="300"></img>
