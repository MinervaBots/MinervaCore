---
sidebar_position: 0
title: 0. Ponto de Acesso & Estação ESP32
---

# Ponto de Acesso e Estação de Wi-fi no ESP32

## Modos do Wi-fi
Com nosso microcontrolador temos três opções de ação para a rede: Ponto de acesso, estação da rede (gerar a rede) ou ambos (podemos gerar a rede e fazer esse mesmo ponto estar conectado a outro ponto de acesso).

### Estação

Quando o ESP32 está configurado como uma estação Wi-Fi, ele pode se conectar a outras redes. Você pode se comunicar com o ESP usando outros dispositivos (estações) que também estão conectados à mesma rede, consultando o endereço IP exclusivo do ESP, que foi pré-definido pelo ponto de acesso. A imagem abaixo mostra bem este caso:
![](https://i.imgur.com/DNwC1FE.png)

Para iniciar uma conexão em uma rede Wi-fi existente, temos o seguinte modelo de exemplo:

~~~c

// Importando biblioteca do Wi-fi
#include <WiFi.h>

// Definindo as requisições básicas da rede
const char *NOME_DA_REDE = "MinervaBots";
const char *SENHA_DA_REDE = "MinervaBots2012";


void setup() {
    
    // Definindo wi-fi no modo Estação de rede
    WiFi.mode(WIFI_STA);

    // Iniciando a conexão na rede wi-fi existente
    WiFi.begin(NOME_DA_REDE, SENHA_DA_REDE);

}

~~~

Segue a explicação passo a passo:

1. Em primeiro lugar deve-se importara biblioteca padrão do Wi-fi para ter acesso as funcionalidades. Essa biblioteca por padrão vem instalada quando criamos o projeto no platformIO utilizando a board do ESP32, então o que resta é basicamente importar no seu arquivo.
2. Em segundo lugar, devemos ter pré-definido qual a rede que iremos conectar e para isso, devemos informar qual é o nome da rede e qual a senha. O tipo delas é por definição `const char*` que é um ponteiro de caracteres onde basicamente serve como uma String. Não podemos declarar como String exatamente porque essas variáveis serão utilizadas na função `Wifi.begin()`, que por padrão só aceita parâmetros do tipo `const char*`.
3. Na void setup, função que inicializa as configurações do nosso código, devemos iniciar a conexão. Para isso, devemos definir o modo ao qual queremos iniciar o wifi (`Wifi.mode(WIFI_STA)`) e logo abaixo devemos iniciar por si só a conexão com a rede fazendo `Wifi.begin(NOME_DA_REDE, SENHA_DA_REDE)`.

Com isso, temos nossa conexão setada e pronta para utilizarmos da forma com que queremos! Existem diversas aplicações para este tipo de conexão e duas delas são usando protocolos de servidor `Web` ou servidor `WebSocket`, mas isso é assunto para outra hora. Na página da wiki de `Servidor Web` ou `Servidor WebSocket` provavelmente terá um exemplo que usa exatamente esse tipo de conexão na prática.

### Ponto de acesso

Quando definimos o ESP32 como um ponto de acesso, podemos nos conectar usando qualquer dispositivo com recursos de Wi-Fi. Ao definirmos o ESP32 como ponto de acesso, criamos nossa própria rede Wi-Fi, e dispositivos Wi-Fi próximos (estações) podem se conectar a ela.

![](https://i.imgur.com/GTCSIcG.png)

> Este modelo atualmente (2023.1) é muito utilizado na equipe, temos o Atlas utilizando para comunicar o computador com o ESP32 onde temos códigos rodando e se comunicando e também o código dos Sumôs onde fazemos a conexão do MinervApp com o ESP32 através do Wi-fi.

Obs.: Como o ESP32 não se conecta mais a uma rede com fio, ele é chamado de **soft-AP** (`soft Access Point`). Isso significa que, se você tentar carregar bibliotecas ou usar firmware da Internet, não funcionará. Também não funciona se você fizer solicitações HTTP para serviços na internet para publicar leituras de sensores na nuvem ou usar serviços na internet (como enviar um e-mail, por exemplo)

Para iniciarmos um ponto de acesso com nosso ESP32, temos o seguinte exemplo:

~~~c
#include <WiFi.h>


const char *NOME_DA_REDE = "Atena";             // SSID (nome da rede)
const char *SENHA_DA_REDE = "MinervaBots2012";  // Senha da rede

// Endereço IP da rede gerada pelo ESP
IPAddress enderecoIP(192, 168, 4, 1);

// Mascara de subrede da rede gerada
IPAddress mascaraDeSubRede(255, 255, 255, 0);


void setup() {

    // Define o modo do Wi-Fi do ESP32 como ponto de acesso
    WiFi.mode(WIFI_AP);

    // Configura o endereço IP fixo do ESP32
    WiFi.config(enderecoIP, enderecoIP, mascaraDeSubRede);

    // Inicia o ponto de acesso Wi-Fi
    WiFi.softAP(NOME_DA_REDE, SENHA_DA_REDE);


}

~~~

Segue a explicação passo a passo:

1. Importamos a biblioteca para poder utilizar suas funcionalidades.
2. Declaramos variáveis importantes que serão utilizadas nas funções posteriores como: `endereço de ip` e `máscara de subrede`. Definir esses valores para nosso ip ajuda a controlar e contornar o fato de que toda vez que o ESP é inicializado, ele troca o endereço de ip gerando um aleatório. Para isso definimos logo aqui de cara e na `void setup()` iremos chamar o método `WiFi.config()` em que iremos definir como constantes esses valores.
3. Definimos o modo AP (Ponto de acesso) de como iremos iniciar o Wi-fi do nosso ESP.
4. Utilizamos o `Wifi.config()` para configurar nosso próprio ponto de acesso passando por parâmetros o endereço de ip estático que nós definimos anteriormente para nosso ESP. Temos o ``ip local`` (primeiro parâmetro), o  ``gateway`` (segundo parâmetro) e a ``máscara de sub-rede``(terceiro parâmetro).
5. Utilizamos o método `Wifi.softAP` para finalmente iniciar o ponto de acesso Wifi do nosso esp passando por parâmetros o nome e senha da nossa rede.


### Estação e Ponto de acesso

Quando queremos utilizar ambos os modos ao mesmo tempo, utilizamos o modo em que ambos são ativados. Como isso funciona? Basicamente o ESP gera um ponto de acesso a sua própria e rede e também se conecta a uma outra rede pré-existente.

~~~c
#include <WiFi.h>


const char *NOME_DA_REDE = "Atena";                         // SSID (nome da rede)
const char *SENHA_DA_REDE = "MinervaBots2012";              // Senha da rede

const char *NOME_DA_REDE_A_CONECTAR = "wifiAleatorio";      // Nome da rede que o ESP irá conectar
const char *SENHA_DA_REDE_A_CONECTAR = "senhaAleatoria123"; // senha da rede que o ESP irá conectar

// Endereço IP da rede gerada pelo ESP
IPAddress enderecoIP(192, 168, 4, 1);

// Mascara de subrede da rede gerada
IPAddress mascaraDeSubRede(255, 255, 255, 0);


void setup() {

    // Define o modo do Wi-Fi do ESP32 como ponto de acesso
    WiFi.mode(WIFI_AP_STA);
    
    // Configura o endereço IP fixo do ESP32
    WiFi.config(enderecoIP, enderecoIP, mascaraDeSubRede);

    // Inicia o ponto de acesso Wi-Fi
    WiFi.softAP(NOME_DA_REDE, SENHA_DA_REDE);

    // Inicia a conexão na rede já existente
    WiFi.begin(NOME_DA_REDE_A_CONECTAR, SENHA_DA_REDE_A_CONECTAR);


}
~~~

A explicação para esse modo segue a mesma utilizada para os outros, com a adição de que agora temos as funções utilizadas nos dois modos. Um detalhe a se observar é que o modo deve ser identificado antes de serem chamados os métodos de iniciação e configuração.


## Formas de debuggar nossa conexão

Existem algumas formas para descobrirmos como está sendo feita nossa conexão, se ela está como esperamos, se ainda não foi realizada a comunicação em si, etc. Para isso temos alguns métodos correspondentes que podem ser utilizados da forma com que nos convém.

Para isso, podemos utilizar o `WiFi.status()` onde ele nos retornará os dados de acordo com o que queremos:

![](https://i.imgur.com/JDYZens.png)


Exemplo utilizando um desses métodos de debug:

~~~c
#include <WiFi.h>

const char* NOME_DA_REDE = "Atena";
const char* SENHA_DA_REDE = "minervaBots123";

void setup() {
  // Iniciando o monitor serial
  Serial.begin(115200);
  
  // Definindo o modo como estação
  WiFi.mode(WIFI_STA);
  
  // Iniciando a conexão na rede
  WiFi.begin(NOME_DA_REDE, SENHA_DA_REDE);
    
  Serial.print("Conectando ao WiFi ...");
  
  // Enquanto a conexão não é estabelecida, printa vários pontos na tela.
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
}

~~~

## Cuidados ao usar o Wi-Fi

Alguns pinos são compartilhados com as funções do WiFi e do Bluetooth, e podem causar interferência e mau funcionamento se usados simultaneamente com esses módulos.

É importante dar uma olhada  na documentação do ESP32 para verificar quais pinos são compartilhados com outras funções e evitar o uso simultâneo desses pinos com o WiFi ou o Bluetooth. 