---
sidebar_position: 8
title: 8. Structs
---

### Structs
Até o momento, usamos tipos de dados bem específicos, como `int`, `double` e `float`, `char` e `std::string`.

Através dos **arrays**, conseguimos criar e trabalhar com esses tipos de dados de uma maneira bem fácil.

Porém, tem um problema. Os tipos de dados de um array são sempre iguais. Não dá pra ter um array que tem um inteiro dentro representando a idade de um funcionário, uma string armazenando o nome do funcionário e um float para guardar seu salário.

Para isso que servem as structs: empacotar outros tipos de dados, para criar seu próprio tipo de dado. Através das structs, podemos criar novos tipos de dados.

:::info
O **struct** pode conter diversos tipos de variaveis diferentes: `int`, `string`, `bool`, etc.
:::

:::warning
Para atribuir um valor à variável de um struct, utilizaremos a sintaxe `struct.nomeDaVariavel = valor;`.
:::

:::danger
O struct deve possuir um nome com letra maiúscula e deve ter `;` no final de sua declaração (no fechamento das chaves)
:::


Por exemplo, vamos criar o tipo de dado **Carro**. Dentro dele, é criado um inteiro pra armazenar o ano, float pra armazenar o preço e strings para armazenar o nome do modelo e da marca.

```cpp
#include <iostream>
#include <string>

struct Carro{
    int ano;
    float preco;
    std::string modelo;
    std::string marca;
};

int main() {
    carro meuCarro;

    meuCarro.ano = 1998;
    meuCarro.preco = 8500.99;
    meuCarro.modelo = "Gol";
    meuCarro.marca = "Volkswagen";

    std::cout << "Ano: " << meuCarro.ano << std::endl;
    std::cout << "Preco: " << meuCarro.preco << std::endl;
    std::cout << "Modelo: " << meuCarro.modelo << std::endl;
    std::cout << "Marca: " << meuCarro.marca << std::endl;
}
```
Atribuimos os valores às variáveis usando, por exemplo, `meuCarro.ano = 1998`. No final do código, printamos no terminal as variáveis que foram definidas dentro do struct.
