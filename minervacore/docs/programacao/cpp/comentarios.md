---
sidebar_position: 1
title: 1. Comentários e Sintaxe
---

# Comentários em C++

Os comentários em códigos são escritas ignoradas na execução e compilação do código. O objetivo desses comentários é principalmente documentar e explicar o que esta sendo feito em cada parte do código, mas podem ser usados para que determinada parte do código seja ignorada na execução em alguns momentos.

## Comentários de Linha Única
Use `//` para comentar apenas uma linha.

```cpp
// Isso é um comentário
bool roboArmado = false; // Armazena o estado do robô (começa como desarmado/falso)

// Variável não usada no momento
// int velocidadePadrao = 0.5f 
````

## Comentários de Múltiplas Linhas

Para casos em que se deseja escrever um texto maior e não um comentário simples, use `/*` e `*/` para criar blocos.

```cpp
/*
  Este é um bloco de comentário.
  Tudo aqui dentro será ignorado.
*/

int roboArmado = false /* Também pode ser usado em apenas uma linha, mas dificilmente será usada nesse caso */
```

## Comentários Doxygen

Doxygen em C++ é uma ferramenta que gera documentação técnica com comentários especiais. O básico de comentários Doxygen é para documentar funções e classes, além de outras funcionalidades básicas. A notação para comentários assim é com `/**` no começo e `*/` no final, com a diferença que cada linha dentro do bloco deve conter um `*` no começo, por exemplo:

```cpp
/**
 * @brief Faz a soma de dois números inteiros.
 * 
 * @param x O primeiro número a ser somado.
 * @param y O segundo número a ser somado.
 *
 * @return A soma dos dois números.
 */
int add(int x, int y) {
    return x + y;
}

/**
 * @todo Precisa atualizar o valor do pino do motor
 */
#define PINO_MOTOR_IN1 18

```
Nesse caso, existem notações chaves para cada tipo de comentário dentro do bloco, são essas palavras começadas por `@`.

- `@brief`: Explica a funcionalidade da função ou classe de forma breve
- `@details`: Descrição detalhada e estendida da classe ou função
- `@param <parametro>`: Descreve um parâmetro de função, seguido pelo nome do parâmetro e sua descrição
- `@return`: Descreve o valor de retorno da função
- `@todo`: Sinaliza que precisa ser feito algo dentro do código, seja uma atualização, adição, etc.

Existem diversos outros comandos para comentários com Doxygen, mas esses são os principais.

> O Doxygen também permite que tenhamos comentários formatados dentro do código em HTML, PDF, LaTex, dentre outros.
> Para fazer essa incorporação de comentários, devemos criar um arquivo `Doxyfile` dentro do nosso repositório contendo algumas informações.
>
> Mais conteúdos sobre essas funções mais avançadas: [Documentação Doxygen](https://www.doxygen.nl/index.html#cplusplus)

## Importância dos Comentários

Comentar um código é uma boa prática de programação, um código sem comentários é um código morto. Eles são necessários para manter a continuidade e evolução do trabalho em equipe na programação.

## Vídeo tutorial

<Video id="ulsU0YTz3IY" title="Tutorial de Comentários em C++" />

---