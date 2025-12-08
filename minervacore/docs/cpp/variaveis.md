---
sidebar_position: 2
title: 2. Variáveis e Tipos de Dados
---

# Variáveis e Constantes

São containers (nomes) para armazenar dados.

## Tipos

Para que o computador consiga entender os dados do código, precisamos definir seu tipo antes. Temos basicamente  5 tipos: 

* int (inteiros): armazena números positivos e negativos, sem ponto e vírgula. 
Ex.: -23456 e 8.

* float e double (decimais): armazena números positivos e negativos com vírgula. A diferença entre os dois é a precisão das casas decimais, o float tem até 6 casas, equanto o double, 15.

Ex.: -78.08 e 9.0

* char (caracteres): são letras tanto maiúsculas quanto minúsculas, envolvidas por aspas simples.
E.: 'e' e 'B'.

* string (texto): conjnto de strings, são envoltas por aspas duplas.
Ex.: "MinervaBots" e "Esta é a super wiki".

* bool: apresenta duas possibilidades de valor - true e false. 

## Sintaxe 

Para declarar (criar) uma variável, precisamos informar o seu tipo, sendo que ela pode ou não ser declarada com seu valor, uma vez que ele pode ser alterado ao longo do código;

tipo nome_da_variavel = valor;

```c++
int leitura_sensor_ultrassonico; // sem valor

bool oponente_detectado = false; // com valor 

```

Já para as constantes, como seu valor não varia, ela deve ser declarada com o seu valor.

```c+++ 

const float distanicia_minima = 23.7; 

```

Obs.: Conseguimos declarar as várias variáveis de mesmo tipo de uma vez.

tipo variavel1, variavel2, variavel3 = valor1, valor2, valor3; // declarando 3 variáveis ao mesmo tempo
