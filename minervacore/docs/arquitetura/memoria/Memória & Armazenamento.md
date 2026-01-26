---
sidebar_position: 1
title: 1. Memória & Armazenamento
---

# Memória & Armazenamento
Como um microcontrolador consegue armazenar e rodar o código feito pra ele, salvar variáveis, salvar dados mesmo sem estar conectado na energia, rodar códigos de forma rápida e sem atrapalhar o loop principaL, etc??

Os grandes responsáveis por essas e diversas outras coisas são os diferentes tipos de memória que os microcontroladores possuem, que, trabalhando em harmonia, conseguem fazer toda essa mágica.

Aqui vamos entender melhor quais são essas memórias, como elas funcionam e pra que servem!!

## Tipos de Memória
As memórias dos microcontroladores atuais geralmente são dividas em 3, tendo cada uma sua função própria. Sendo Elas:

- **Memória RAM**
- **Memória FLASH**
- **Memória EEPROM**

![image.png](/img/uploads/1769400314125-image.png)

Antes de começarmos de fato, é bom entendermos dois conceitos que serão usados aqui: **Memória Volátil** e **Memória Não Volátil**

- **Volátil** - É o tipo de armazenamento onde os dados guardados apenas estarão salvos enquanto seu sistema estiver energizado, a partir do momento que ele é desligado todos os dados armazenados aqui são perdidos.
- **Não Volátil** - Ao contrário do primeiro, aqui mesmo após o seu sistema perder totalmente a energia e ser desligado, os dados ainda permanecem salvos e armazenados.

Finalmente, vamos começar a destrinchar essas memórias.

### Memória RAM
Essa nós podemos considerar análoga à memória RAM de um computador padrão. É uma memória volátil onde sua grande função é armazenar dados e variáveis do código que estará rodando no microcontrolador.

Então vamos supor que esse código de exemplo que soma 2 números esteja sendo executado:

```cpp
int somarNumeros(int numeroA, int numeroB){
  int soma = numeroA + numeroB;
  return soma;
}
```
A parte da memória que estará armazenando tanto os valores "numeroA" e "numeroB" quanto o resultado "soma" durante toda a execução dessa função será justamente a memória RAM.

Esse exemplo se estende para praticamente qualquer função mais complexa e variáveis ao longo do seu código.

A memória RAM é uma das memórias mais rápidas integradas com seu microcontrolador, dessa forma tanto o armazenamento quanto a leitura dos dados nela serão feitos de forma bem veloz.

No ESP32 essa memória e divida em 2 partes físicas:
- IRAM
- DRAM

![image.png](/img/uploads/1769401411832-image.png)

#### IRAM

Essa é uma parte menor do geral, e é usada especialmente pra rodar códigos rápidos que não são executados sequencialmente com o código principal.

É importante não confundir e achar que isso significa que esse código está em um novo núcleo ou uma nova thread, não consideramos que esse código rápido esteja em paralelo ou em concorrência com o principal.

O principal exemplo de uso dessa parte da memória são as Interrupções. Onde precisamos que sempre uma parte do Hardware esteja dedicada a receber e interpretar alguns sinais elétricos, independente do momento em que eles sejam recebidos. E a responsável por isso é justamente a IRAM.

#### DRAM
Está é a maior parte do armazenamento total da RAM, e é aqui onde de fato os dados ao longo do seu código é armazenado.

A parte mais especial e divertida de entender dela não é algo exclusivo dela em si, mas sim uma lógica de funcionamento de memórias hoje em dia. Que é a separação entre HEAP e STACK.


![image.png](/img/uploads/1769400396902-image.png)


![image.png](/img/uploads/1769400441191-image.png)



Vamos destrinchar melhor essas duas:

##### STACK
A Stack é a região da memória responsável por organizar a execução imediata das funções e o escopo local. Ela funciona exatamente como seu nome propõe ("Stack" ou "Pilha" do inglês). Os dados armazenados nela são de fato empilhados na memória, como se você estivesse fazendo uma pilha de pratos. Você só consegue colocar um prato novo no topo e, para tirar o de baixo precisa remover os de cima antes.

Isso é o que comumente chamamos de "LIFO" (Last In, First Out). Os dados são sempre colocados no topo, e são sempre removidos do topo pra baixo.

Vamos supor que você está executando essa função básica aqui, variante daquela primeira que foi mostrada:

```cpp
int somarEMultiplicarNumeros(int numeroA, int numeroB){
  int soma = numeroA + numeroB;
  int multiplicacao = numeroA * soma;
  return multiplicacao;
}
```

Quando essa função é chamada, ela é colocada no topo da Stack.

Todas as variáveis locais criadas dentro dessa função ficam ali empilhadas e são armazenadas na ordem que são criadas, então:
- Primeiro são armazenados "numeroA" e "numeroB".
- Depois "soma" e por fim "multiplicacao".

Quando a função termina (no "return") , ela é desempilhada, e toda a memória que aquelas variáveis ocupavam é liberada automaticamente e instantaneamente.

É por isso que a Stack é extremamente rápida e organizada, mas possui um tamanho limitado. Se você chamar funções dentro de funções infinitamente, a pilha enche e ocorre o famoso Stack Overflow (talvez você já tenha conhecido um site com esse nome rsrs, pois é o nome não veio do nada).

Outra razão que torna a Stack extremamente rápida é sua integração com a memória Cache de processadores. Resumindo bastante, a memória Cache é onde o processador consegue ler dados de forma mais rápida em comparação com qualquer outra memória, então sempre buscamos que dados que o processador está buscando fiquem nela. Quando um processador acha um dado que está buscando na Cache nós chamamos comumente de "Cache Hit". Quando o processador não encontra esses dados na Cache ele tem que ir buscar na RAM, tornando o processo mais lento, isso é o que chamamos de "Cache Miss".

Quando armazenamos os dados em pilha como na Stack, aumentamos a chance de conseguir um Cache Hit. É por isso também que a Stack é tão rápida.

Se quiser entender melhor esse processo de Memória Cache e sua integração com a Stack recomendo esse vídeo aqui:

<Video id="N3o5yHYLviQ" title="Por que a Stack é tão rápida?" />


##### HEAP

Um dos problemas da Stack é não conseguir armazenar dados dinâmicos, ou seja variáveis que mudam de tamanho ao longo do código. Para isso existe a HEAP.

Ao contrário da organização de pilhas da Stack, o Heap é como um monte de memória disponível para uso dinâmico. Aqui, as variáveis não são limpas automaticamente quando uma função termina.

O Heap é utilizado quando você precisa alocar memória de forma dinâmica usando ```malloc``` em C ou ```new``` em C++, quando criamos vetores e strings de tamanho dinâmico ou quando criamos objetos complexos que precisam sobreviver por mais tempo do que a execução de uma única função.

Sua grande vantagem é a sua flexibilidade com variáveis dinâmicas e a persistência de dados.

A desvantagem vem justamenteda sua velocidade, é bem mais lenta que a Stack, além disso se você não gerenciar bem (não deletar o que criou), pode causar vazamento de memória (memory leak), travando o seu sistema.

A lentidão da HEAP, além da sua falta de integração com a Memória Cache por falta de organização, vem também do que chamamos de "System Calls" que é quando seu processo precisa pedir memória extra para o seu sistema operacional. Isso leva um tempo grande e é bem comum na HEAP por que é difícil manter dados de forma organizada nela, causando fragmentação da memória e sendo sempre necessário ter mais um "bloco" de memória pra ser usado.

Se quiser entender mais sobre a lentidão da HEAP, recomendo esse vídeo, que complementa muito bem o vídeo mostrado anteriormente sobre a STACK:

<Video id="ioJkA7Mw2-U" title="Por que a HEAP é tão lenta?" />

Imagem que demonstra o que a falta de organização da HEAP causa, a fragmentação da memória:

![image.png](/img/uploads/1769400521686-image.png)

### Memória FLASH

Análoga ao HD ou SSD dos computadores padrões. A Memória FLASH faz um papel muito semelhante no microcontrolador. Ela é uma memória Não Volátil e é, geralmente, a que possui o maior espaço de armazenamento disponível no chip.

A principal função da FLASH é armazenar o seu código, que nesse caso é chamado de programa ou Firmware.

Quando você clica em "Upload" na sua IDE (seja Arduíno, Platform.IO ou qualquer outra), o código é compilado em linguagem de máquina (zeros e uns) e gravado permanentemente nesta memória. É por isso que, ao desligar e ligar o microcontrolador, ele volta a rodar exatamente o mesmo código de onde parou.

Além do código, a FLASH também pode ser usada para guardar outras coisas, como:

 - **Constantes**: Dados que nunca mudam podem ser marcados como const ou para ficarem na FLASH e economizarem a preciosa memória RAM.

- **Sistemas de Arquivos**: Em microcontroladores mais recentes (como o próprio ESP32), parte da FLASH pode ser formatada para salvar arquivos reais, como HTML, CSS, imagens ou arquivos de texto (.txt).

### Memória EEPROM

A EEPROM (Electrically Erasable Programmable Read-Only Memory) é uma memória Não Volátil, assim como a FLASH, mas com um propósito e funcionamento ligeiramente diferentes. Ela é focada em armazenar configurações.

Supunhamos que você está criando um código que precisa se conectar ao Wi-Fi. Você não quer guardar a senha do Wi-Fi no código (FLASH), pois se a senha mudar, você teria que regravar o código inteiro. Você também não pode salvar na RAM, se não ao acabar a energia, a senha some.

A solução é a EEPROM. Ela é perfeita para salvar pequenos dados que precisam persistir, como:

- Informações de Wi-Fi (SSID e Senha).

- Valores de calibração de sensores.

- Contadores de uso.

**Pontos Importantes sobre ela:**

- **Ciclos de Vida**: A EEPROM tem um limite físico de gravações, variando dependendo do seu microcontrolador. Se você salvar dados nela dentro de um loop rápido, pode queimar a memória em poucos minutos. A leitura, porém, é ilimitada por ser sua principal função.

- **Lentidão:** O processo de gravação na EEPROM é significativamente mais lento do que em outras memórias.

- Muitos microcontroladores modernos (como o ESP32) não possuem uma EEPROM física dedicada, mas simulam uma usando uma pequena parte da memória FLASH, entregando o mesmo resultado prático.


## Resumo

Abaixo, segue uma tabela com o resumo sobre cada uma das três memórias aqui apresentadas.


| Características | RAM  | FLASH | EEPROM |
| --------------- | ---- | ----- | ------ |
| Volatilidade | Volátil | Não Volátil | Não Volátil |
| Velocidade de Leitura | Extremamente Rápida | Rápida | Lenta |
| Velocidade de Escrita | Extremamente Rápida | Lenta | Extremamente Lenta |
| Tamanho Típico | Pequeno (KB ou poucos MB) | Grande (MB) | Muito Pequeno (KB ou Bytes) |
| Uso Principal | Variáveis, Stack, Heap | Armazenar Código e Arquivos | Configurações e Pequenos Dados |

