---
sidebar_position: 5
title: 5. Estruturas de Loop
---

# Loops

Os Loops podem executar um bloco de código várias vezes enquanto a condição definida for verdadeira. 

## While 

### Sintaxe 
````c++
while (condição) {
  // o código que deve ser repitido 
}
````

Exemplo:

```c++

// Variável que armazena o valor true ou false do módulo start 
bool leituraModuloStart;
leituraModuloStart = digitalRead(pinagemModulo);

// Enquanto a leitura for true, o robô será movimentado
while(leituraModuloStart){

moverRobo();

}

```

## for 

### sintaxe 

````c++
for (inicialização; condição; atualização) {
    // o código que deve ser repitido 
}
````


A *inicialização:* é executada primeiro e apenas uma vez. Esta etapa permite declarar e inicializar quaisquer variáveis de controle de loop. Você não é obrigado a colocar uma declaração aqui, desde que apareça um ponto e vírgula.

Em seguida, a *condição* é avaliada. Se for verdadeiro, o corpo do loop é executado. Se for falso, o corpo do loop não é executado e o fluxo de controle pula para a próxima instrução logo após o loop for.

Depois que o corpo do loop for é executado, o fluxo de controle volta para a instrução de incremento. Esta instrução pode ser deixada em branco, desde que um ponto e vírgula apareça após a condição.

A condição agora é avaliada novamente. Se for verdadeiro, o loop é executado e o processo se repete (corpo do loop, depois incrementa a etapa e novamente condiciona). Depois que a condição se torna falsa, o loop for termina.

Exemplo: 

````c++
for(int contador = 0; contador < 10, contador++){

cout << "Combate" << endl;

}

````

Obs.: for loop para conjuntos (vetores e arrays)

````c++

#include <iostream>
using namespace std; 

void inicializar(const char* nomes){
    cout << nomes << " " << " está ligado." << endl;
}

int main() {
  
    const char* nomesRobos[] = {"Fred Fab", "Bigode", "B1", "B2", "Moxtro" };
  
    for (const char* nomes : nomesRobos) {
        cout << nomes << " " << endl;
    }
    
    for (const char* nomes : nomesRobos) {
        inicializar(nomes);
    }
  
    return 0;
}

/*
Output: 

Fred Fab 
Bigode 
B1 
B2 
Moxtro 
Fred Fab  está ligado.
Bigode  está ligado.
B1  está ligado.
B2  está ligado.
Moxtro  está ligado.

*/
````