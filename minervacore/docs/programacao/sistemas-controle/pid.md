# PID

O PID é atualmente o sistema de controle mais utilizado na indústria, sua função é manter o valor de uma variável de um processo no valor desejado. Ele conta com 3 ações de controle (Proporcional, Integrtival, Derivativa). 

![](https://i.imgur.com/GP8BW9T.png)

Legenda da figura acima:
- SV: valor desejado
- PV: valor real 

Na MinervaBots, o PID é muito utilizado para o controle dos motores através do que é recebido dos sensores. 


## Como funciona o PID?

Para explicar melhor o conceito de PID, primeiro temos que entender os seguintes conceitos, para explicá-los melhor, vamos usar como exemplo um sistema de aquecimento de água à gás. 

![](https://i.imgur.com/Rf8gBbk.png)


*1. Variável controlada:* é a entidade ou grandeza que deseja ser controlada para atingir o resultado esperado, no exemplo, se queremos mudar a temperatura da água, a temperatura é a nossa variável controlada. 
*2. SetPoint:* é o valor desejado do sistema. Se no exemplo, queremos que a temperatura chegue até 40ºC, o nosso setPoint é 40.  
*3. Variável Manipulada:* é a grandeza ou entidade que ao ser manipulada (seja para mais ou menos) vai fazer com que a resposta do sistema seja a mais próxima da ideal.
*4. Erro:* É a diferença entre o setpoint e o útimo valor medido da variável controlada. 

Com essas grandezas em mente, vamos pensar em como seria o funcionamento do PID para um seguidor de linha: 

![](https://i.imgur.com/qm39SI6.png)

Na figura do meio, podemos ver o robô em linha reta, ambas as rodas estão com mesma velocidade. Para fazer curvas, um das rodas tem que ter uma velocidade menor que a outra. Então, se o robô quer fazer uma curva para a direita, a velocidade da esquerda tem que ser maior que da direita.

Mas como o robô sabe que deve fazer curvas ao ler a linha?

![](https://i.imgur.com/oiDzj2I.png)

Ao escrever o código, já sabemos qual é o valor retornado no sensor. Esse valor inclusive é calibrado antes das competições. 

Analisando a figura pela esquerda:

Então, sabemos que quando o sensor não "lê" a linha, ele vai está retornando um erro. O erro, pré definido que para a direita é negativo e para a esquerda positivo (nesse caso), mostra que precisamos aumentar a velocidade da roda direita para que o erro retorne a ser zero. 

O oposto ocorre na parte direita da figura, o erro foi positivo, então precisamos aumentar a velocidade da esquerda para que o erro zere.

O objetivo é fazer com que essa correção da orientação do robô seja suavizada, evitando que o robô fique percorrendo a linha tremendo e consequentemente perdendo muito tempo nesse movimento errático.

Obs.: malha aberta vs. malha fechada 

A malha é a representação do sistema em forma de fluxograma dos dados, desde entrada até a saída. A malha, por sua vez, pode ser uma malha aberta, sem realimentação, ou uma malha fechada, com realimentação.

![](https://i.imgur.com/FJ8lveP.png)

![](https://i.imgur.com/OxDRZcu.png)

Na prática, a malha aberta seria só verificar os sensores uma vez e a malha fechada é verificar a leitura dos sensores indefinidamente, como é feito com os nossos robôs. 

## A conta 

![](https://i.imgur.com/O8BWfJP.png)

![](https://i.imgur.com/aEfBcRX.png)

![](https://i.imgur.com/h2UKiyM.png)


![](https://i.imgur.com/EL93iMr.gif)

### O que exatamente significa cada sigla do PID? 

Sabemos o que o PID faz, mas o que está por trás do funcionamento dele, e como podemos extrair conhecimento pra ser botado em prática?

Todas as funções aplicadas no PID se baseiam em aplicar uma fórmula em em função do erro calculado, a partir de uma constante (definida a partir de testes). Para explicar mais facilmente, vamos usar a seguinte analogia: Vamos imaginar que temos 3 motoristas (as três funções) em um carro, cujo objetivo é chegar a uma dada velocidade. Evoluiremos essa ideia ao falar individualmente de cada função. 
#### P

O P da sigla representa a função proporcional em cima do erro.

Fórmula: Kp (constante proporcional) * e(t) (erro calculado em dado tempo).

É a mais simples das 3 funções, fazendo uma simples multiplicação. No entanto, é a que causará mais problemas caso não seja tratada com as 2 outras, pois é muito fácil ultrapassar o valor estabelecido e formar um loop de valores errados, onde a função demora para estabilizar alternando entre valores muito altos e muito baixos. 

Na analogia do carro, vamos chamar a função proporcional de motorista "Afobada". Ela quer muito chegar no valor objetivo de velocidade (a variável controlada), e para isso pisa fundo no acelerador (a variável monitorada). Quando ela percebe que passou do objetivo, ela pisa fundo dando ré, e assim vai. 

#### I 

O I da sigla significa a função integrativa em cima do erro. 

Fórmula: Ki (constante integrativa) * Integral de e(t) (erro calculado). 

A função integrativa serve para amenizar a função proporcional, promovendo uma aproximação mais lenta do valor objetivo. 

Na analogia do carro, ela seria seria a motorista "Cautelosa". Ela quer se aproximar do setpoint mais lentamente, retornando valores mais próximos do setpoint por longos períodos de tempo. 

#### D

O D da sigla significa a função derivativa em cima do erro.

Fórmula: Kd (constante derivativa) * derivada em função de t de e(t) (erro calculado). 

A função derivativa serve para limpar erros da função integrativa, que pode demorar para estabilizar o erro. 

Na analogia do carro, ela seria a motorista "impaciente". Ela vê a função integrativa sendo cautelosa e andando lento demais e não consegue esperar, fica irritada e corrige ela.

## Código Exemplo

No código a seguir, iremos controlar a perseguição de um robô de sumô utilizando PID para controlar a velocidade de uma das rodas. A roda escolhida depende do erro gerado pelos sensores.

OBS.: É muito complexo fazer com que microcontroladores calculem derivadas e integrais. Por esse motivo, a fórmula do cálculo do PID é discretizada. Referências:

http://meggi.usuarios.rdc.puc-rio.br/teses/TFC11_Marcos_Marzano.pdf
http://sistemaolimpo.org/midias/uploads/818be1f6490b957a9c280dcbe1b7411a.pdf

Esquema de erro por sensor:

Sensor          | Erro
:-------------- | :--:
Sensor Esquerdo |  -1
Sensor Direito  |   1

```cpp
class PID {

private:

    float _Kp;
    float _Ki;
    float _Kd;

    float _integral = 0.F;

    float _erroAnterior = 0.F;

public:

    PID(float Kp, float Ki, float Kd): _Kp(Kp), _Ki(Ki), _Kd(Kd) {}

    float calcular(float erro) {
        float _proporcional = _Kp * erro;
        _integral += _Ki * erro;
        float _derivativo = _Kd * (erro - _erroAnterior);
        
        _erroAnterior = erro;
        
        return _proporcional + _integral + _derivativo;
    }

};

class Motor {
    public:
    
    Motor();
    
    void setPotencia(int potencia);
    
    int getValorMaximoDePotencia();
};

void perseguir(float erro, PID &pid, Motor &motorEsquerdo, Motor &motorDireito) {
    float resultadoPID = pid.calcular(erro);
    
    if (erro >= 0) {
        motorEsquerdo.setPotencia(motorEsquerdo.getValorMaximoDePotencia());
        motorDireito.setPotencia(motorDireito.getValorMaximoDePotencia() - resultadoPID);
    }
    else {
        motorEsquerdo.setPotencia(motorEsquerdo.getValorMaximoDePotencia() + resultadoPID);
        motorDireito.setPotencia(motorEsquerdo.getValorMaximoDePotencia());
    }
}

```