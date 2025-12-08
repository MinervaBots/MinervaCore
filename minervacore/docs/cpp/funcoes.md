---
sidebar_position: 6
title: 6. Funções
---

# Funções 

São blocos de código que rodam sempre que são chamados. São utilizadas para realizar ações.

Estrutura: 
```cpp
tipoDoDadoRetornado nomeDaFunção(parâmetro - opcional){

código que será rodado

}
```

> Qual a diferença entre argumento e parâmetro?
> 
> As informações que são passadas para as funções são chamadas de parâmetros e o argumento é um parâmetro "passado" para uma função. Exemplo:

```cpp 
// parâmetro 
void enviarMensagem(const char* mensagem){
    cout << mensagem << endl;
}
//argumento 
// para chamar a função basta escrever seu nome com seu argumento 
enviarMensagem("texto";)
    
// caso a função tenha algum tipo de retorno, ele deve ser salvo em uma variável 
    
bool detectarOponente(){
    bool leituraSensor = digitalRead(pinoSensorUlt);
    return leituraSensor;
}

int main(){
    
    detectacaoOponente = detectarOponente();
}

// Podemos definir valores default tbm, ou seja, valores que caso não seja passado, já está pré-definido 

// caso o num2 não seja passado, o compilador entende que ele valerá 10 
int soma(num1, num2 = 10){
    // código 
}
```