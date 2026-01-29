---
sidebar_position: 0
title: Ponteiros e Referências
---

### Ponteiros e Referências
Em um programa, toda variável tem um **endereço que indica sua localização na memória do computador** . Além disso, existe o **conteúdo da variável**, que é o valor armazenado naquela posição de memória. 

> As informações sobre memória e armazenamento são explicadas melhor [nesta seção MinervaCore](https://minervabots.github.io/MinervaCore/docs/arquitetura/memoria).

A partir dessas informações, utilizaremos ferramentas para que possamos acessar e alterar valores diretamente na memória, economizando processamento e modificando variáveis globalmente mesmo que estas estejam dentro de funções. Essas ferramentas serão os **ponteiros** e as **referências**.
:::info
#### O que são ponteiros?
 Ponteiros são um tipo de dado utilizado para armazenar **endereços de variáveis na memória**.
 
 Ponteiros são definidos usando o caracter `*` antes do nome de uma variável em sua declaração.
:::

:::warning
#### Como declarar ponteiros?
```cpp
int velocidade = 100;
int *pVelocidade = &velocidade;
```
:::

:::info
#### O que são referências?
Referências em C++ possuem múltiplas utilidades, sendo duas delas delas:
- Descobrir o endereço de uma variável na memória para armazená-lo em um **ponteiro**
- Passar um parâmetro como referência. Quando passamos um argumento para uma função, qualquer alteração dentro da função morre quando a função termina. Quando usamos referência, a variável irá persistir (tornar-se global), pois alteramos o valor direto na memória.

:::

:::warning
#### Como utilizar referências

##### Para armazenar o endereço em um ponteiro

```cpp
int velocidadeInicial = 10;
int *pVelocidadeInicial = &velocidadeInicial;
```

##### Para passar o argumento como referência
```cpp
void incrementar(int &num) {
    num++; 
}

int main() {
    int x = 10;
    incrementar(x); // x agora vale 11 na memória
}
```

:::

