---
sidebar_position: 1
title: 1. Mixagem de Locomoção
---

# Mixagem de Locomoção

A locomoção de robôs é crucial para o funcionamento de todos os robôs da Minervabots ~~se não tiverem aberto o drone ainda kk~~ e consiste em entender como a cinemática de robôs com rodas funciona e como implementar isso em código.

Feitas as recomendações, abordaremos os seguintes tópicos nessa wiki que visam explicitar a locomoção de um robô:
* Oque faz um robô se mover?
* Qual a lógica por trás desse movimento?
* Como eu implemento isso em código?
    * Quais são os problemas que posso encontrar durante a minha implementação?

## Oque faz um robô se mover?

Os motores juntamente com as rodas que fazem os robôs se moverem, portanto, a velocidade das rodas está diretamente ligada com a velocidade do robô como um todo. 

A diferença de velocidade entre as rodas e o sentido de rotação vão definir a movimentação do robô, note alguns exemplos:

* Se ambas as rodas estiverem girando no sentido horário:
    * Se tiverem a mesma velocidade vão pra frente;
    * Se a roda esquerda for mais rápida vai pra frente e pra direita;
    * Se a roda direita for mais rápida vai pra frente e pra esquerda;

* Se ambas as rodas estiverem girando no sentido anti-horário:
    * Se tiverem a mesma velocidade vão pra trás;
    * Se a roda esquerda for mais rápida vai pra tras e pra direita;
    * Se a roda direita for mais rápida vai pra tras e pra esquerda;


É importante também lembrar que as rodas podem girar em sentidos diferentes entre si, aumentando as possibilidades:

* Se a roda esquerda estiver girando no sentido horário e a direita no sentido anti-horário:
    * Se a roda esquerda estiver mais rápida vai pra frente e pra direita;
    * Se a roda direita estiver mais rápida vai pra trás e pra esquerda;

* Se a roda direita estiver girando no sentido horário e a esquerda no sentido anti-horário:
    * Se a roda esquerda estiver mais rápida vai pra trás e pra direita;
    * Se a roda direita estiver mais rápida vai pra frente e pra esquerda;


Em programação, poderíamos dizer o quanto gostaríamos de velocidade em cada roda através do PWM nos motoress e fazer diversos testes ajustando esses valores até atingir o movimento desejado para o nosso robô, mas essa não é a forma mais eficiente de se fazer em código. Perceba que isso acarretaria em MUITOS `Ifs` e testar e ajustar todos esses valores seria bastante trabalhoso.

Seria mais intuitivo dizer **"o quanto o robô tem que ir pra frente"** e **"o quanto o robô tem que fazer curva"** ao invés de controlar o quanto cada roda tem que rodar. Dessa forma eu preciso relacionar a velocidade das rodas com a velocidade do robô,mas como transformar a velocidade que eu quero pro robô em velocidade das rodas?

## Qual a lógica por trás desse movimento?

Percebemos no raciocínio anterior que fazer curva tinha relação com diferença entre as velocidades das rodas então faria sentido eu somar um valor na roda que eu gostaria que fosse mais rápida e subtrair um valor na roda que eu gostaria que fosse mais lenta para fazer a minha curva, chegaríamos no seguinte raciocínio:

```cpp

velocidade_roda_esquerda = quantidade de ir pra frente - quantidade de fazer curva
velocidade_roda_direita =  quantidade de ir pra frente + quantidade de fazer curva
```

* Se eu não quiser fazer curva `quantidade de fazer curva = 0` ambas as rodas tem a mesma velocidade `quantidade de ir pra frente` 
* Se `quantidade de ir pra frente > 0` e `quantidade de fazer curva > 0` eu vou subtrair da roda esquerda e somar na roda direita, logo a roda direita fica mais rápida e assim o robô vai pra frente e pra esquerda.
* Se `quantidade de ir pra frente > 0` e `quantidade de fazer curva < 0` eu vou subtrair da roda esquerda e somar na roda direita, logo a roda direita fica mais rápida e assim o robô vai pra frente e pra direita.
* Se `quantidade de ir pra frente < 0` o robo anda pra trás com as mesmas lógicas de ir pra esquerda e direita citadas acima.
* Se eu não quiser ir pra frente ou pra trás `quantidade de ir pra frente = 0` e `quantidade de fazer curva` faz o robô girar no próprio eixo.

Assim, só com essa fórmula simplista poderíamos fazer o robô andar corretamente!

Porém, essa fórmula não representaria o movimento matemático real do robô, mas como provavelmente vamos ajustar valores de `quantidade de ir pra frente` e `quantidade de fazer curva` de forma empírica testando e não calculando nós não necessáriamente precisaríamos de um robô matematicamente correto, a menos que vc seja do Trekking ou do Seguidor, onde a acurácia da movimentação do robô é mais necessária.

Podemos traduzir matematicamente **"o quanto o robô tem que ir pra frente"** na **velocidade linear do robô** e **"o quanto o robô tem que fazer curva"** em sua **velocidade angular**. 

Assim, podemos utilizar o [Modelo Diferencial de Robôs com Roda](https://edisciplinas.usp.br/pluginfile.php/5152060/mod_resource/content/1/PMR3502_Aula3_Modelo_Robos_Rodas_Final.pdf) para calcular a velocidade de cada uma das rodas com base nas velocidades linear e angular desejadas. Esse modelo se baseia nas teorias do [Livro "Introduction to Robot Mobile Control"](https://books.google.com.br/books?hl=pt-BR&lr=&id=gmYALDVqlLUC&oi=fnd&pg=PP1&dq=mobile+robot+kinematics&ots=55FRno2edv&sig=EW95_tuSOGPzY2V5a-00-cKsJ5o#v=onepage&q=holonomic&f=false) :

```cpp
velocidade_roda_esquerda = (2*velocidade_linear_robo - distancia_entre_rodas * velocidade_angular_robo)/(2*raio_roda)
velocidade_roda_direita = (2*velocidade_linear_robo + distancia_entre_rodas * velocidade_angular_robo)/(2*raio_roda)
```

> Obs.: perceba que na forma simplista poderia ser ` velocidade_roda_direita =  quantidade de ir pra frente + quantidade de fazer curva`, e isso só faria com que `quantidade de fazer curva > 0` implicassem em curvas para direita ao invés de esquerda e `quantidade de fazer curva < 0`  em curvas para esquerda ao invés de direita, assim o robô se moveria corretamente mas com uma referência de valores diferente. No entanto, o modelo matemático define como mostrado acima para seguir o sentido trigonométrico e também a regra da mão direita (produto vetorial de X e Y , gera Z sentido de rotação pra esquerda).

Não é necessário se aprofundar no porque dessas fórmulas desde que tenhamos uma noção intuitiva de como elas funcionam e implementar conforme a vontade/necessidade!

Mas com essa lógica, como partimos para o código?

## Como eu implemento isso em código?

Vamos supor a nossa função seja chamada de `mover_robo`, ela vai receber 2 argumentos que são **"o quanto o robô tem que ir pra frente"** e **"o quanto o robô tem que fazer curva"** que nós já traduzimos em `velocidade_linear_robo` e `velocidade_angular_robo` respectivamente, logo:

```cpp
mover_robo(velocidade_linear_robo,velocidade_angular_robo)
```

Vamos supor que `distancia_entre_rodas = 10` e `raio_roda = 5`. Vamos supor também que a **velocidade máxima** que eu quero para meu robo seja de **1.0** tanto para `velocidade_linear_robo` quanto para `velocidade_angular_robo` e a **mínima -1.0**.

O primeiro passo seria então converter essas velocidades de robô em velocidades de roda atráves do tópico acima, vamos usar por exemplo o modelo matematicamento correto:

```cpp
velocidade_roda_esquerda = (2*velocidade_linear_robo - distancia_entre_rodas * velocidade_angular_robo)/(2*raio_roda)
velocidade_roda_direita = (2*velocidade_linear_robo + distancia_entre_rodas * velocidade_angular_robo)/(2*raio_roda)
```

Aqui a gente já encontra um problema que devemos ficar atentos. Existem 2 problemas clássicos nesse tipo de código:
* Valores máximos e Mínimos da rodas e do robô
* Garantir Curvas (que pode ser interpretado como uma mixagem de canais de um controle)

### Problema Comum - Valores Máximos e Mínimos da Roda e do Robô

Na realidade, a velocidade linear máxima do robô é diferente da velocidade angular máxima do robô. Isso ocorre porque elas são definidas pelas velocidades máximas das rodas, que são iguais pois o robô idealmente sempre terá 2 motores iguais. Podemos chegar a essa conclusão da seguinte forma:

* Somando e subtraindo as equações de cada roda obtemos e isolando as velocidades do robô obtemos:
```cpp
velocidade_linear_robo = raio_roda*(velocidade_roda_esquerda + velocidade_roda_direita)/2 
velocidade_angular_robo = raio_roda*(velocidade_roda_direita - velocidade_roda_esquerda)/distancia_entre_rodas
```
* Logo:
```cpp
velocidade_linear_maxima_real = raio_roda*(velocidade_maxima_roda + velocidade_maxima_roda)/2 
                              = raio_roda * velocidade_maxima_roda
velocidade_angular_maxima_real = raio_roda*(velocidade_maxima_roda - velocidade_minima_roda)/distancia_entre_rodas 
                               = raio_roda * 2 * velocidade_maxima_roda/distancia_entre_rodas
```

Assim, percebemos que é necessário converter `velocidade_linear_robo` e `velocidade_angular_robo` que no nosso exemplo vão de `-1.0 a 1.0` para os seus intervalos reais de` -velocidade_linear_maxima_real a velocidade_linear_maxima_real` e `-velocidade_angular_maxima_real a velocidade_angular_maxima_real` respectivamente, antes de converter em velocidade das rodas.
```cpp
velocidade_linear_robo = map_double(velocidade_linear_robo,-1.0,1.0,-velocidade_linear_maxima_real,velocidade_linear_maxima_real)
velocidade_angular_robo = map_double(velocidade_linear_robo,-1.0,1.0,-velocidade_angular_maxima_real,velocidade_angular_maxima_real)
```

> Obs.: map do arduino só funciona com inteiros, nesse exemplo usei números com vírgula portanto seria necessário criar uma função map que funcione com double, nesse caso chamada de map_double().

Uma dúvida que poderia surgir seria porque não definir de inicio `velocidade_linear_robo` e `velocidade_angular_robo` com valores máximos reais ao invés de `-1.0 e 1.0`,como nesse caso? Vamos considerar o seguinte exemplo:

* Suponha raio_roda = 5, distancia_entre_rodas = 10, velocidade_roda_max = 1.0 teríamos:

```cpp
velocidade_linear_maxima_real = 5*(1.0 + 1.0)/2 = 5
velocidade_angular_maxima_real = 5*(1.0 - (-1.0))/10 = 1
```

* Logo, se eu quisesse chamar a função mover com velocidade linear maxima e velocidade angular maxima eu faria:

```cpp
mover_robo(5,1)
```

* Ou seja, se eu quisesse valores máximos em ambos os argumentos eu teria que colocar 2 valores diferentes oque seria extremamente esquisito e anti intuitivo, logo, o `map` anterior serve pra que os valores de velocidade linear e agular sejam inseridos com mesma escala apesar de não serem de mesma escala, e dentro da função se corrige isso.

Vale notar que no método simples não seria necessário fazer essa correção uma vez que no método simples as `quantidade de ir pra frente` e `quantidade de fazer curva` tem valores máximos iguais, portanto, no método simples, o map pode ser ignorado e as quantidades inseridas na função podem ser convertidas diretamente em velocidade das rodas.

Agora que temos os valores inseridos corrigidos e as velocidades das rodas calculadas, precisamos nos preocupar com o outro grande causador de problemas...

### Problema Comum - Garantir as Curvas

* Imagine o seguinte cenário:
```cpp
mover(1.0,0.9)
``` 
* Supondo raio_roda = 5, distancia_entre_rodas = 10, velocidade_roda_max = 1.0,temos:

```cpp
velocidade_roda_esquerda = (2*1.0 - 10 * 0.9)/(2*5) 
                         = -0.7
velocidade_roda_direita = (2*1.0 + 10 * 0.9)/(2*5) 
                        = 1.1
```
* Note que a roda direita ultrapassou o valor máximo permitido para uma roda. Nesse caso, não estariamos executando o movimento desejado porque a velocidade máxima calculada para roda não pode ser atingida. Dessa forma, para resolver o problema precisamos garantir que esse valor excedido seja transmitido de maneira poporcional para ambas as rodas.
    Oque se faz então é calcular a diferença do quanto a velocidade da roda ultrapassou o máximo e reduzir de ambas as rodas essa diferença, dessa forma, a roda que ultrapassou o limite fica com o valor máximo permitido mas a outra roda perde velocidade, mantendo a diferença de velocidade entre as rodas sem ultrapassar a velocidade máxima permitindo assim o movimento desejado, veja o exemplo:

```cpp
diferenca_estourada = 1.1 - 1.0 
diferenca_estourada = 0.1
    
velocidade_roda_esquerda = (2*1.0 - 10 * 0.9)/(2*5) 
velocidade_roda_esquerda = -0.7 
velocidade_roda_esquerda =- diferenca_estourada = -0.7 -0.1 
velocidade_roda_esquerda = - 0.8
    
velocidade_roda_direita = (2*1.0 + 10 * 0.9)/(2*5) 
velocidade_roda_direita = 1.1 
velocidade_roda_direita =- diferenca_estourada = 1.1 - 0.1
velocidade_roda_direita = 1.0
```
* Logo: 
    * A diferença entre velocidade das rodas desejeado era: `1.1 - (-0.7) = 1.8`
    * A diferença entre velocidade das rodas depois da correção é: `1.0 - (-0.8) = 1.8`
* Ou seja, mantivemos a diferença de velocidade desejada, que garante a curva desejada, sem ultrapassar o valor máximo permitido!

Note no entanto que se tivesse estourado o valor mínimo da roda seria necessário somar um valor a cada roda, porque na verdade a ideia é subtrair o valor absoluto da diferença ultrapassada e como tudo estaria negativo, somar um valor negativo a um positivo gera uma subtração. Como no exemplo:
```cpp
mover(-1.0,0.9)
```
* Supondo raio_roda = 5, distancia_entre_rodas = 10, velocidade_roda_max = 1.0,temos:

```cpp
velocidade_roda_esquerda = (-2*1.0 - 10 * 0.9)/(2*5) 
velocidade_roda_esquerda = -1.1
    
velocidade_roda_direita = (-2*1.0 + 10 * 0.9)/(2*5) 
velocidade_roda_direita = 0.7
    
diferenca_estourada = abs(-1.1 - (-1.0)) 
diferenca_estourada = 0.1
    
velocidade_roda_esquerda =+ diferenca_estourada = -1.1 +0.1
velocidade_roda_esquerda = -1.0


velocidade_roda_direita =+ diferenca_estourada = 0.7 + 0.1 
velocidade_roda_direita = 0.8
```

* Logo: 
    * A diferença entre velocidade das rodas desejeado era: `-1.1 - 0.7 = -1.8`
    * A diferença entre velocidade das rodas depois da correção é: `-1.0 - 0.8 = -1.8`

Um exemplo de implementação seria:
```cpp
if(roda_mais_rapida > velocidade_maxima_roda){
    diferenca_estourada = abs(roda_mais_rapida - velocidade_maxima_roda)
    velocidade_roda_esquerda -= diferenca_estourada
    velocidade_roda_direita -= diferenca_estourada
}
else if (roda_mais_lenda < -velocidade_maxima_roda){
    diferenca_estourada = abs(roda_mais_lenta - (-velocidade_maxima_roda))
    velocidade_roda_esquerda += diferenca_estourada
    velocidade_roda_direita += diferenca_estourada
}   
```

Essa necessidade de garantir as curvas surge pelo fato de `velocidade_linear` e `velocidade_angular` serem independentes no código. Esse é o mesmo fenômeno causado por controles em robôs rádio controlados, uma vez que um canal transmite `quantidade de ir pra frente` e o outro a `quantidade de fazer curva` ,ou seja, `velocidade_linear` e `velocidade_angular` ao invés de diretamente a velocidade das rodas e por isso faz-se necessário misturar ou mixar os 2 canais para garantir o movimento desejado, dando origem ao conceito de **mixagem de canais**. 
É importante perceber então que também existe necessidade de mixagem em códigos de robôs autônomos caso se esteja trabalhando com velocidades linear e angular do robô ao invés de velocidade das rodas.

Por fim, basta transformar as velocidades da roda em PWM, lembrando que no Arduino o PWM vai de `0 a 255` e no ESP32 de `0 a 4095` a depender da resolução além de não se utilizar `analogWrite` (mais sobre na página ["Gerando Sinais de PWM com o ESP32"](https://gitlab.com/MinervaBots/conhecimentos/programacao/-/wikis/Gerando-Sinais-de-PWM-com-o-ESP32)). Ou seja, o PWM não define o sentido de rotação do motor, apenas a sua intensidade, normalmente as pontes H tem pinos para setar o sentido de rotação do motor e depende muito de cada ponte. Logo, valores próximos de `-velocidade_maxima_roda ` devem ser mapeados para valores próximos de 255, assim como valores próximos de `velocidade_maxima_roda` enquanto valores próximos de 0 são mapeados para 0. Um exemplo seria:
```cpp
if (velocidade_roda_esquerda > 0){
      pwm_roda_esquerda = map_double(velocidade_roda_esquerda,0,velocidade_maxima_roda,0,255)
      digitalWrite(PINO_SENTIDO_MOTOR,HIGH)
      analogWrite(PINO_PWM_MOTOR,pwm_roda_esquerda)
}
else{
      pwm_roda_esquerda = map_double(velocidade_roda_esquerda,-velocidade_maxima_roda,0,255,0)
      digitalWrite(PINO_SENTIDO_MOTOR,LOW)
      analogWrite(PINO_PWM_MOTOR,pwm_roda_esquerda)     
}
```

Vasco.

(Feito por Danilo)