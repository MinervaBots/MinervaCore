---
sidebar_position: 0
title: 0. Introdução às Metaheurísticas
---

# Introdução às Metaheurísticas

## O que são metaheurísticas?

As metaheurísticas são um algoritmo de alto nível para solucionar problemas de otimização complexos com soluções suficientemente boas (Nem sempre a melhor, lembre-se disso!).
Vamos destrinchar isso melhor:
> Heurísticas são procedimentos mentais simples que ajudam a encontrar respostas adequadas, embora várias vezes imperfeitas para perguntas difíceis, de acordo com a Wikipédia, que inclusive complementa dizendo que a palavra tem a mesma raiz de "eureca".
>
> Mas o que isso quer dizer? Vamos exemplificar...
> Imagine que você está na sala da equipe e perdeu o telefone, o que você faria? Existem diversos tipos de respostas para essa pergunta e ela pode ser adequada, mas não necessariamente a que fará você encontrar seu celular. Você pode procurar na mochila, na mesa da equipe, na mecânica, ligar para ele e por ai vai, em todas elas você pode encontrar seu telefone, ou não.
>
> Ok, mas então, o que são metaheurísticas?
> Imagine todas aquelas ideias que você teve para procurar seu telefone, você pode não encontrar ele logo na primeira, então você vai para a segunda e tenta novamente, até encontrar.
> Em algoritmos de simulação, esse exemplo do telefone pode não fazer tanto sentido, pois ele é binário, ou você encontra seu telefone ou não. Mas imagine uma situação onde você está soldando uma placa, a temperatura do seu ferro de solda pode variar de 250º até 400º para você conseguir soldar ela sem ter outros problemas e 320° é a temperatura perfeita. 
> Partindo do ferro de solda, vamos ligar ele na temperatura zero e vamos iniciar um algoritmo de metaheurística:
> - Começamos com a temperatura 50° (já que sabemos que 0° é praticamente impossível e não seria funcional);
> - Com 50° não conseguimos soldar, vamos então para 120°;
> - Não conseguimos novamente, mas estamos mais perto do que a primeira opção, então vamos para 250º;
> - Ok, agora conseguimos soldar, mas esse ainda não é o melhor resultado, vamos para 370°;
> - Ainda conseguimos soldar sem problemas, porém, não estamos ainda no melhor resultado, por fim vamos tentando chegar cada vez mais perto de 320° que é o melhor.
>
> Como você pode perceber, a gente podia ter parado em 250º que continuaríamos conseguindo soldar, ou para em 370º que provavelmente o estanho derretia melhor. As vezes a gente não chega no resultado perfeito (quase nunca se o problema for extremamente grande), mas podemos ter resultados melhores fazendo essas buscas.
> Você também pode perceber que podíamos ter começado em 320° e todo outro caminho que fossemos seria pior que o nosso início, isso também é uma possibilidade.

## Aplicação de uma metaheurística

Ok, mas como eu sei que eu posso implementar uma metaheurística em um problema de otimização? Não vamos entrar em código, vamos manter em conceito por enquanto.

> Quando você tem um problema, você tem um objetivo que almeja atingir, com esse objetivo você pode ter suas restrições.
>
> Vamos para o melhor exemplo: Robôs seguidores de linha
> Nosso objetivo de otimização no seguidor é simples, fazer a pista em menos tempo otimizando os caminhos, nossas restrições são: Conceitos físicos do robô (velocidade, aceleração, etc.) e não podemos deixar de ter o robô com pelo menos uma parte em cima da linha em nenhum momento.
> 
> Com nosso algoritmo tendo ideia do objetivo e das restrições, nos vamos ter que dar um caminho inicial para ele e isso pode ser feito de diversas formas, podemos dar o caminho que deu melhor ou pior resultado nos testes, podemos dar um caminho aleatório, isso varia e é um parâmetro de entrada no algoritmo.
> 
> Após isso, nosso algoritmo vai pegar o caminho inicial e vai mudar ele tomando decisões que variam que qual metaheurística você está usando. Então, ele vai lá e testa os resultados obtidos nesse novo caminho, se for bom, mudamos o nosso melhor caminho, se for ruim, normalmente, realizamos uma punição.
>  
> Graças a essa punição, nosso algoritmo vai saber que aquilo é ruim e ele já vai estar aprendendo com isso. (sim é muito parecido com aprendizado por reforço de machine learning, mas é menos complexo ainda)
> E então o algoritmo vai seguir assim, aprendendo e testando até você decidir onde para o algoritmo, são os parâmetros de parada que você decidir.

## Estratégias de Busca

### Busca Local