---
sidebar_position: 4
title: 4. Estruturas Condicionais
---

# Condicionais

A estrutura condicional é uma seção que ajuda a definir condições para a execução de determinados  blocos de comando.
Ao invés de executar tudo de vez, sem nenhuma interrupção, o programa deve parar para executar um teste e decidir qual caminho seguir, evitando erros no código.

```c++

if (condicao1) {

  // bloco de código que será executado se a condição foi verdadeira, se for falsa, testar o else if 

} else if (condicao2) {
  // bloco de código que será executado se a condição foi verdadeira, se for falsa
} else {
  // bloco de código que será executado se as condições anteriores forem falsas

  // obs.: podemos ter quantos else if forem necessários
}
```

Obs.: Operador Ternário: ele pode ser usado para if else simples. 

Sintaxe: nome_da_variavel = (condição) ? 'retorna isso se for verdade' : 'retorna isso se for falso';

``` c++ 

// if e else
bool leitura_sensor;
string resultado;

if (leitura_sensor == true){

  resultado = "estou vendo o oponente";

} else {

  resultado = "não estou vendo o oponente";

}

// operador ternário 

bool leitura_sensor;
string resultado;

resultado = (leitura_sensor) ? "estou vendo o oponente" : "não estou vendo o oponente";

```

# Switch 

É parecido com if e else, mas apresenta suas particularidades.

```c++

#include <iostream>

int entrada;

using namespace std;

int main() {
    cin >> entrada;
    
    switch (entrada) {
        case 1: // só aceita números inteiros 
            cout << "a mimir";
            break;
            
        case 2:
            cout << "nao mimir";
            break;

        default: // não é obrigatório ter, roda quando nenhuma opção é chamada
            cout << "beber café";
            break;
    }

    return 0;
}

```