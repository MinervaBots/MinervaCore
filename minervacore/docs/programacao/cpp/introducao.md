---
sidebar_position: 0
title: Introdução ao C++
---

# O que é programação?
É o processo de escrever instruções para um computador executar. 
É importante que essas intruções sejam claras e não ambiguas, ou seja, não dê pra entender outra coisa, porque o computador não tem uma interpretação de texto igual o ser humano, então precisamos deixar bem claro o que queremos que ele faça. 
> Essa sequência de instruções claras, e não ambiguas, é chamada de ==Algoritmo==.

# Bits e Bytes

Você já deve ter ouvido falar que um computador só entende `0` e `1`; desligado e ligado; OFF/ON. E todos os processos do computador são baseados em operações em cima desses dígitos e eles são a menor unidade de informação na computação.

>Esse dígito que pode ser 0 ou 1 é chamado de ==Bit== que vem de "binary digit".

Com a junção de vários **0's** e **1's**, **Bit's**, é possível determinar várias coisas, por exemplo, da pra representar números, letras e outras milhões de coisas. 

> `00110101 = 5` 
> `01000001 = 'A'`

> A junção de **8** bit's é chamada de ==Byte==.

Isso é muito importante porque, modificando esses **Bytes**, nos conseguimos assinalar uma sequência deles pra executar certas funções no computador, e ai sim, começarmos a fazer nossos algoritmos. Fazendo essa junção de bytes pra fazer algoritmos que comandam o computador, formamos assim a ==Linguagem de máquinha==.

# Linguagens

## `Assembly`

Concorda comigo que `11110111 11000101 00011010 10101011 01010101` não é muito fácil de entender pra quê serve e mesmo que você saiba o significado de cada sequência de bits, ainda sim é bem complicado de ler, não é? 
Bom, pensando nisso foi criado o `Assembly`, que é uma linguagem de programação pensada em transformar palavras em linguagem de máquina.

:::spoiler Exemplo Assembly
```asm
bits 64

section .rodata
    msg:     db  "Hello, World!", 10
    msglen:  equ $ - msg

section .text
global _start
_start:
    mov rax, 1          
    mov rdi, 1          
    mov rsi, msg        
    mov rdx, msglen     
    syscall

    mov rax, 60         
    mov rdi, 0          
    syscall   
```
:::

Apesar de estar um pouco mais legível do que antes, ainda sim, o código está num nível muito baixo, isso é, muitas coisas que não importam tanto pra nossa lógica em si tem que ser feitas para que o código funcione. Pensando nisso, foram criadas outras linguagens que deixassem esse processo mais fácil, permitindo que a gente foque mais no que é necessário.

## Compiladas X Interpretadas

Para transformar um código em um arquivo executável, é necessário transformar código em código que a máquina entende, com isso, existem comumente duas maneiras de fazer isso.

### Linguagens Compiladas
Esse tipo de linguagem pega o código feito, passa por um compilador e depois é transformada em um algo que o computador consegue executar. 

```csv
Código -> Compilador -> Programa Executável
```

Elas são conhecidas por:
- Alto desempenho
- Erros aparecem antes da execução
- Maior controle sobre o hardware

Exemplos de linguagens compiladas podem ser:
- C
- C++
- Rust

### Linguagens Interpretadas
Esse tipo de linguagem lê o código em tempo real linha por linha. 

Elas são conhecidas por:
- Fácil aprendizado
- Desenvolvimento rápido
- Menos performance
- Erros aparecem durante a execução

Exemplos de linguagens compiladas podem ser:
- Python
- JavaScript
- Lua


