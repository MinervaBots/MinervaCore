---
sidebar_position: 2
title: 2. Elementos da Rede
---

# Elementos da Rede

Existem basicamente três grandes elementos na rede do ROS: os **nós** (que podem ser *Publishers* ou *Subscribers*), os **tópicos** e as **mensagens**.

![rede](https://hackmd.io/_uploads/BynVYSSz-x.png)

## Nós (Nodes) 
São processos individuais que executam tarefas. Eles se comunicam uns com os outros através de mensagens, seja escrevendo (publish) ou lendo (subscribe). Em outras palavras, os nós são os tais dos programas executáveis que vão processar os dados da rede, ou seja, são os códigos (em C++ ou em Python) que vamos utilizar nos robôs, basicamente isso. Geralmente cada nó tem um propósito único, vai ser responsável pelo processamento de um dado importante e assim podemos utilizar vários nós com objetivos diferentes para que a rede seja completa.

## Tópicos (Topics)
São canais de comunicação entre os nós. Tópicos são os elementos que vão apenas armazenar os dados. São passivos, é como um armário onde podemos guardar nele qualquer objeto e em outra hora podemos também abri-lo e retirar alguma coisa de dentro dele. Por isso alguns nós são Publishers, publicadores, os nós que vão jogar os dados dentro do tópico. Outros no entanto são Subscribers, inscritos, nesse caso são os que vão ler os dados de dentro do tópico. Importante ressaltar que um Tópico pode ter infinito subscribers, porém apenas um publisher. 

## Mensagens (Messages)
São estruturas de dados usadas para transmitir informações entre os nós. O ROS fornece muitos tipos de mensagens pré-definidas para diferentes tipos de dados.São a formatação dos dados que vão ser compartilhados entre os nós e os tópicos na rede. Não são a informação em si mas sim como ela está sendo passada. Falando de uma forma um pouco mais simplificada, sabe na programação onde temos variáveis que são ou string, ou int, ou float, ou bool...? A mensagem é como se fosse cada um desses tipos, só que com um grau de complexidade maior.
Por exemplo, uma mensagem pode ser uma String, ou seja uma estrutura de texto simples. Pode ser também uma Pose (não confundir com o artista contemporâneo), que é uma estrutura que nos diz a posição e a orientação de um objeto no espaço; pode ser uma Twist, que é uma mensagem construída pra nos informar velocidade ou até mesmo uma Imagem.

## Serviços (Services)
São outra maneira dos nós se comunicarem. Um nó pode "prover" o serviço enquanto outro nó pode "chamar" esse mesmo serviço (função que pode ser chamada). Em outras palavras, os serviços permitem a comunicação ponto a ponto entre nós, em que um nó solicita a outro a realizar uma tarefa específica.

> Você também pode consultar a própria documentação do ROS (inglês), que dá mais detalhes sobre esses conceitos [clicando aqui](https://docs.ros.org/en/humble/Concepts/Basic.html)