---
sidebar_position: 7
title: 7. Arrays e Vetores
---

# Arrays e Vetores
Arrays e vetores são estruturas de dados simples e muito similares,
ambas são utilizadas para guardar um grande volume de dados em apenas uma variavel!
As duas são tão similares que em algumas linguagens elas são sinônimos(como no C classico por exemplo).
No entanto, em C++ as duas possuem diferença em relação a como lidam na memória os dados dentro delas

## Array
Array é provavelmente a estrutura de dados mais conhecida e usada. No C++ existem dois tipos de arrays, o array classico do C e o array da Standart Library.
Ambos os tipos possuem limitações e caracteristicas em comum. 
Entre elas e importante ressaltar como ele e criado na memória

![image.png](/img/uploads/1776059005371-image.png)


### Array Classico
O array classico é aquela estrutura de dados que estamos acostumados a ver e a usar. Ele segue o estilo que é usado em C

#### Criando um Array
A declaração de um array e muito simples, sua sintaxe básica é a seguinte:

```cpp
// Declaração de um array de inteiros de tamanho 5
int arrayExemplo[4] = {10, 4, 3, 8, 1}
```

:::tip Dica
Preste atençao que o array de tamanho "5" possui "4" entre os colchetes, isso acontece porque o primeiro elemento de um array começa no "0"
:::

#### Acessando elementos de um Array
Para acessar elementos de um array utilizamos a seguinte sintaxe:

```cpp
// Printando o primeiro elemento do "arrayExemplo", 
// nesse caso, o retorno seria 10
std::cout << arrayExemplo[0] << std::endl;
```

É comum também precisar acessar mais de um, ou todos os elementos de um array de uma vez. 
Existem várias maneiras de fazer isso, a mais comum é utilizar um simples [loop](https://minervabots.github.io/MinervaCore/docs/programacao/cpp/loops) para ir passando de elemento em elemento:

```cpp
// Percorremos todos os elementos do array e printamos cada um deles
// No fim, o retorno de bloco de codigo seria todos os elementos do array
for(int i = 0; i < 5; i++) {
   std::cout << arrayExemplo[i] << std::endl;
}
```

### Arrays Standart Library
O array da Standart Library pode ser considerado a "evolução" do array clássico no C++. A ideia aqui e a mesma do array normal, porém aqui o array é uma classe,
 e isso significa que, por exemplo, podemos utilizar metodos dessa classe! 

Isso facilita muito realizar tarefas que eram simples e trabalhosas, como ver o tamanho de uma array, onde aqui, apenas precisamos chamar o metodo "size".  

#### Criando um Array
Para criar uma array da Standart Library e bem parecido com o array convencional, com apenas uma pequena mudança na sintaxe
```cpp
// A sintaxe para criar um array se resume a std::array<tipo, tamanho> nome;
std::array<int, 10> arrayExemplo; // Cria um array do tipo int de tamanho 10
```

#### Acessando os elementos do Array
Para acessar elementos temos dois caminhos principais, ou usamos a sintaxe classsica, que mantém os problemas de segurança do array comum, 
ou utilizamos o metodo "at". Ele faz a verificação se aquele índice passado está dentro do array mesmo,
caso não estiver, ele irá lançar uma exceção ao inves de travar o programa.

Por causa disso é interessante utlizar um try catch que engloba esse acesso para poder tratar essa exceção como desejar.

```cpp
// Acessando da maneira convencional e não segura
arrayExemplo[0]

// Acessando com a verificacao do at para garantir que esta dentro do limite
arrayExemplo.at[0]
```
E importante ressaltar que o "at" por fazer uma verificação tem um custo de performace maior que o acesso convencional, 
então para unir o melhor dos dois mundos, podemos usar um loop especial do c++ chamado Range-Based for, ele não utiliza um iterador e basicamente passa por todo os elementos de uma estrutura.

```cpp
// Basicamente lemos "para cada item de cada estrutura, faça alguma coisa" 
for(int item : arrayExemplo) {}
```

#### Métodos notáveis
Existem MUITOS metodos na classe array e por isso é impossivel eu listar todos aqui, vou colocar algumas notáveis:

```cpp
arrayExemplo.size() // Retorna o tamanho do Array
arrayExemplo.fill(0) // Preenche o array com valor 0
arrayExemplo.swap(outroArrayExemplo) // Troca os valores de um array com outro
arrayExemplo.empty() // Retorna se o array esta vazio ou não 
arrayExemplo.front() // Retorna o primeiro elemento do array
arrayExemplo.back() // Retorna o último elemento do array
arrayExemplo.data() // Retorna um ponteiro para o primeiro elemento do array
arrayExemplo.begin() // Retorna um iterador para o primeiro elemento do array
arratExemplo.end() // Retorna um iterador para o último elemento do array
``` 
Caso queira ver mais métodos ou mais detalhes, sugiro olhar alguma [documentação do C++](https://devdocs.io/cpp/container/array)
## Vetores
Vetores possuem a mesma função de um array, so que a maneira que fazem isso na memória e diferente. A principal diferença e que vetores **não** possuem tamanho fixo. 
Ele é basiscamente um array de alocação dinâmica, por causa disso, ele é criado na HEAP.

Umas das vantagens do vetor é que a implementação dele na Standart Library abstrai muito do trabalho de se lidar com alocação dinâmica, o que traz facilidade e segurança pro seu código.

### Criando um vetor
Para criar um vetor, a sintaxe é muito parecida com o array da Standart Library: std::vector\<tipo> nome = {}

```cpp
// Cria um vetor com 3 itens
std::vector<int> vetorExemplo = {1, 2, 3} 
```
### Acessando elementos de um vetor 
Para acessar um elemento de um vetor é exatamente igual ao do array da Standart Library, usando os colchetes ou com a função "at", com as mesmas peculiaridades já comentadas acima
```cpp
// Acessando com colchetes da maneira convencional
vetorExemplo[0]

// Acessando com o metodo at
vetorExemplo.at[0]
```
### Adicionando elementos em um vetor
Por ser alocado dinamicamente, a maior vantagem do vetor e podermos adicionar elementos em tempo de execução. 

Para fazer isso normalmente usamos o "push_back", porém no C++11, foi adicionado o método "emplace_back", ambos vão adicionar um elemento no fim do vetor, com o emplace_back sendo um pouco mais rápido em certas situações
```cpp
// Ambos adicionam um elemento no fim do vetor
vetorExemplo.push_back[4] // Agora o vetor é {1, 2, 3, 4}

vetorExemplo.emplace_back[5] // Agora o vetor é {1, 2, 3, 4, 5}
```
Existem outras maneiro de adiconar elementos em um vetor, como o método insert, mas eles não são eficientes pelo forma que um vetor funciona na memória.

:::tip
Se estiver interessado em saber mais a fundo como o vetor funciona por de baixo dos panos, sugiro ver a aula do Fróes abaixo ou ler a documentação do C++
:::


## Capacitação de Estrutura de Dados
Caso queira se aprofundar mais em arrays e vetores, sugiro fortemente assistir a capacitação de estrutura de dados em C++ do Fróes(Arrays começa em 16:02)

<Video id="cNcOjCbPZeY" title="Capacitação de Estrutura de Dados em C++" />
