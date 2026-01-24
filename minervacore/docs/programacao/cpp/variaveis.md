---
sidebar_position: 2
title: 2. Variáveis e Tipos de Dados
---

### Tipos de dados

Ao trabalhar com programação é essencial o uso e manipulação de dados, sendo assim, existem diferentes tipos de dados a serem armazenados. Escolher corretamente o tipo evita desperdício de memória e erros lógicos. Mas antes de falar sobre eles, é preciso saber um pouco sobre `bits` e `bytes`.

> ### Bit
>Um bit é a menor forma de informação que um computador/microcontrolador pode armazenar, podendo ser `0` ou `1`. Apenas uma iformação com 2 estados não diz muito, além de poder ser utilizado como `0 -> Falso` e `1 -> Verdadeiro`. 
> Mas é possível combina-los e trazer mais informações.

>### Byte
>Um byte é composto por 8 bits. Ele é capaz de armazenar valores numéricos inteiros de `0` a `255` quando não possui sinal. 


| Tipo        | Categoria           | Bytes  | Descrição                                       |
| ----------- | ------------------- | ------ | ----------------------------------------------- |
| `char`      | Inteiro / caractere | 1      | Armazena um caractere ou número inteiro pequeno |
| `int`       | Inteiro             | 4      | Inteiro padrão                                  |
| `float`     | Real                | 4      | Número real com menor precisão                  |
| `double`    | Real                | 8      | Número real com maior precisão                  |
| `bool`      | Lógico              | 1      | Verdadeiro ou falso                             |
| `void`      | Especial            | 0      | Ausência de tipo                                |

> Observação: os tamanhos em bytes podem variar conforme o compilador e arquitetura, mas os valores acima são os mais comuns.


### Exemplos de uso por tipo

#### `int`

Usado para contadores, idades, quantidades e valores inteiros gerais.

```cpp
int idade = 18;
int quantidade = 50;
```

---

#### `float`

Usado quando há necessidade de casas decimais, mas sem alta precisão.

```cpp
float altura = 1.75;
float temperatura = 36.5;
```

---

#### `double`

Usado quando maior precisão é necessária, como em cálculos matemáticos.

```cpp
double pi = 3.14159265359;
double media = 7.833333;
```

---

#### `char`

Usado para armazenar um único caractere (tabela ASCII).

```cpp
char letra = 'A';
char sexo = 'M';
```

---

#### `bool`

Usado para decisões lógicas. Sendo `False = Falso` e `True = Verdadeiro`

```cpp
bool aprovado = true;
bool ligado = false;
```

tipo variavel1, variavel2, variavel3 = valor1, valor2, valor3; // declarando 3 variáveis ao mesmo tempo


---

## Modificadores

Modificadores alteram o **comportamento**, **alcance** ou **valores possíveis** de variáveis e funções. Eles não são tipos de dados, mas trabalham em conjunto com eles.

| Modificador | Função                                     |
| ----------- | ------------------------------------------ |
| `const`     | Impede que o valor seja alterado           |
| `unsigned`  | Remove valores negativos                   |
| `signed`    | Permite valores negativos                  |
| `static`    | Mantém o valor entre chamadas              |
| `volatile`  | Indica que o valor pode mudar externamente |


### Exemplos de uso por modificador

#### `const`

Usado quando o valor **não deve ser alterado** durante a execução.

```cpp
const float PI = 3.14;
```

---

#### `unsigned`

Usado quando o valor **nunca será negativo**.

```cpp
unsigned int contador = 0;
```

---

#### `static`

Usado quando o valor precisa ser preservado entre execuções da função.

```cpp
static int chamadas = 0;
```

---

#### `volatile`

Usado quando o valor pode ser alterado fora do fluxo normal do programa.

```cpp
volatile int status;
```

