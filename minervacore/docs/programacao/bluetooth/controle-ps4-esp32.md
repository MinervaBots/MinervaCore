---
sidebar_position: 3
title: 3. Controle de PS4 via Bluetooth ESP32
---

# Biblioteca de Controle de PS4 com Bluetooth para ESP32

[**Link do github**](https://github.com/aed3/PS4-esp32)

**Biblioteca copiada no PlatformIO**

Alguém copiou a biblioteca que ficava no apenas naquele repositorio no github para o PlatformIO. É a mesma coisa, com as mesmas funções.

Para achá-la, basta pesquisar por PS4 em libraries no PlatformIO e procurar PS4_Controller_Host.

## Como usar a biblioteca

- A biblioteca é feita para permitir toda a comunicação do microcontrolador com o controle, desde a conexão entre os dois ao recebimento das diversas informações de botões utilizados no controle, tudo isso de forma muito intuitiva.

- A biblioteca é feita com uma classe **PS4** e dessa forma, todas as funções referentes ao seu uso, são métodos da classe e serão feitas da seguinte forma **PS4.Função()**. Exemplos mais concretos serão mostrados mais a frente.

### #include

- Para começar, devemos incluir a biblioteca ao código. Colocando ela na pasta **lib**, podemos incluir ela de forma direta nos arquivos de código da seguinte forma.

```.cpp
#include <PS4Controller.h>
```

### Conexão

- A conexão com dispositivos bluetooth, como é o caso do controle de PS4, é feita utilizando uma certa identificação chamada endereço MAC. A grande maioria dos dispositivos inclusive mouses bluetooth, notebooks e computadores em geral possuem esse tal endereço.

- Tendo em mão esse endereço (Consultem os avaliadores, nós daremos o endereço quando necessário) referente ao controle que se deseja utilizar, a função para realizar a conexão inicial é a função **PS4.begin()**

```.cpp
// Definimos o endereço MAC da seguinte forma
char *enderecoMAC = "xx:xx:xx:xx:xx:xx";

// Na função begin(), colocamos o endereço como argumento
PS4.begin(enderecoMAC);
```

- Para finalizar a conexão, utilizamos a função **PS4.attachOnConnect()**. Essa função é usada para fazer algo assim que se der a conexão inicial e geralmente utilizamos para definir um cor inicial no controle e saber que a conexão teve êxito.

```.cpp
PS4.attachOnConnect([] {
            
            // A função setled() define uma cor no LED do controle.
            // Os argumentos são valores de RGB 
            // que variam de 0 a 255
            // No caso, (255, 0, 0) representa apenas o padrão 
            //vermelho em seu valor máximo 
            PS4.setLed(255, 0, 0);
            
            // A função sendToController(), serve apenas para 
            // confirmar e enviar o que foi definido.
            PS4.sendToController();
});
```

### Botões Booleanos

- Todos os botões que são apenas pressionados (EX. Bola, Cruz, setinhas, R1, L1 etc) tem funções que retornam um valor booleano. Dessa forma, se eu apertar o triângulo no controle, a função devolverá 1 (ou True ou HIGH) enquanto o botão estiver pressionado e 0 quando não estiver pressionado.

```.cpp
bool triangulo;

triangulo = PS4.Triangle(); // Recebe 1 se pressionar o triangulo

// Outros exemplos

PS4.Square(); // Quadrado
PS4.Circle(); // Bola
PS4.Cross(); // Cruz  
PS4.Up(); // pra cima (setinha)
PS4.Left(); // pra esquerdo (setinha)
PS4.Right(); // pra direita (setinha)
PS4.Down(); // pra baixo (setinha)

// Pode ser usado da seguinte forma

if (PS4.Cross()) {

    Eventos do código;

}

// Nesse caso, quando a cruz for pressionada, será executado algum comando do código

```

### Gatilhos e Analógicos

- Os gatilhos e analógicos possuem intensidade envolvida e seus valores variam. 
- Se eu apertar mais o R2, um valor mais é gerado e se eu apertar menos, um valor menor.
- Se eu coloco o analógico para cima é um valor e para baixo, é outro.
- Os valores dos gatilhos (R2 e L2) variam de 0 a 255 e os analógicos de -255 a 255 para cada eixo.

```.cpp

// r2 vai receber o valor de 0 a 255
// de acordo com o quanto o gatilho foi pressionado.
int r2 = PS4.R2();

// Para o Eixo Y utilizamos o Y ao final de LStick()
// Valor varia de -255 (analógico esquerdo para baixo) a 255 (analógico esquerdo para cima)
// Quando parado, o valor é 0
int analogicoEsquerdoY = PS4.LStickY();

// Para o Eixo X utilizamos o X ao final de LStick()
// Valor varia de -255 (analógico esquerdo para esquerda) a 255 (analógico esquerdo para direita)
// Quando parado, o valor é 0
int analogicoEsquerdoX = PS4.LStickX();

// A mesma lógica funciona para o analógico direito

AnalógicoDireitoY = PS4.RStickY();
AnalógicoDireitoX = PS4.RStickX();


```