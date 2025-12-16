---
sidebar_position: 0
title: 0. Funcionamento do Encoder
---

# Sensores de Velocidade Encoder

![](https://i.imgur.com/9PJdzsd.png)


Na imagem acima temos um encoder óptico, que usa os lasers para identificar a rotação do disco. Através da rotação do disco é possível calcular a velocidade angular das rodas e, consequentemente, a velocidade linear do robô. O que usamos na equipe é um encoder magnético, que usa o efeito Hall invés de sensores ópticos, mas o princípio é parecido. Devido a certa experiência que a equipe já possui com os encolders magnéticos, sendo usados em pelo menos 2 projetos, focaremos nesses tipos de sensores.

### Funcionamento Eletrônico
![](https://i.imgur.com/5yP3Y7e.png)

Como já mensionado os encolders magnéticos utiliza do efeito Hall. O efeito Hall está relacionado ao surgimento de uma diferença de potencial em um condutor elétrico, transversal ao fluxo de corrente e um campo magnético perpendicular à corrente. Essa diferença de potencial é detectada pelo sensor e transmitida para o arduino. Caso você queira entender  um pouco melhor como funciona o efeito Hall, [veja esse vídeo na velocidade x1.5](https://youtu.be/bHo6_jltfc8):

A grande vantagem em utilizá-los é o seu circuito ser composto pelo próprio sensor e um resistor de pull-up, o que simplifica bem as coisas.


### Encoder por Quadratura

![](https://i.imgur.com/f6jX8xI.png)

 Esse sensor utiliza do efeito Hall 

## Elementos do encoder na programação:
+ dois pinos, canais do encoder
+ função que altera o contador
+ interrupção


![image](https://imgur.com/undefined.png)

O enconder que utilizamos é um encoder por quadratura, ele consegue tanto detectar a direção de giro da roda quanto calcular sua velocidade.
São **dois pinos** para cada encoder. Para verificar a direção do giro fixamos um dos canais e lemos uma transição especifica. se lermos do canal "A" as transições de subiba, no canal "B" quando ocorrer a transição o canal estará em nível baixo, isso com o motor girando para determinada direção. Agora se analisarmos o canal "A" com a mesma transição, entretanto com o motor girando para o outro lado, o estado do canal "B" estará em nível alto. Enquanto os tics são indicados por cada transição, para termos resolução total contamos tanto as transições de subida quanto descida de cada canal.