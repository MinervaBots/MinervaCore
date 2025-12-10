---
sidebar_position: 6
title: 6. Nodes
---

# Nodes

## Exemplo 1 -  de Inicialização e Funcionamento de Nodes no ROS2

Neste guia, vamos explorar um exemplo básico de como iniciar e compreender o funcionamento dos Nodes no ROS (Robot Operating System).

Após criar os pacotes nas respectivas linguagens, podemos iniciar o processo de codificação. Vamos demonstrar como iniciar e entender o funcionamento dos Nodes no ROS.

Ao abrir o seu pacote Python no Visual Studio, você deverá se deparar com algo semelhante a isso:

![Estrutura do Pacote Python](https://hackmd.io/_uploads/ryjBBPi0a.png)

Dentro da pasta `my_py_pkg/`, já podemos criar o nosso primeiro arquivo, que chamaremos aqui de `exemplo_de_node.py`. No interior deste arquivo, na primeira linha, devemos inserir o comando que indica que o interpretador Python 3 deve ser utilizado:

```python
#!/usr/bin/env python3
```

Agora, vamos ao código de exemplo. Este é o exemplo mais simples de comunicação que podemos realizar. Recomendamos que você preste atenção aos comentários para uma melhor compreensão do código:

```python
#!/usr/bin/env python3

import rclpy  # Responsável por chamar as funcionalidades do ROS2
from rclpy.node import Node  # Importa a classe Node do ROS2

def main(args=None):
    rclpy.init(args=args)  # Inicializa a comunicação do ROS2
    node = Node('teste')  # Cria o construtor do Node e passa seu nome como parâmetro
    node.get_logger().info('Hello World')  # Envias a mensagem 'Hello World' para o log do ROS2
    rclpy.spin(node) # Mantem o loop do código
    rclpy.shutdown()  # Finaliza a comunicação do ROS2

if __name__ == '__main__':
    main()
```

Se você executar este código, deverá ver a frase "Hello World" impressa no seu terminal. Isso nada mais é do que um exemplo de comunicação entre Nodes. Se tivéssemos um ouvinte (listener) em execução, ele poderia capturar essa mensagem e realizar a comunicação corretamente.

![Exemplo de Saída no Terminal](https://hackmd.io/_uploads/Hy5OQdsA6.png)

Este exemplo demonstra a estrutura básica de um Node e como ele pode ser utilizado para enviar mensagens simples dentro do sistema ROS. Experimente adaptar e expandir este exemplo para criar comunicações mais complexas entre os Nodes do seu sistema.

## Exemplo 2 - Python Node com Programação Orientada a Objetos (POO)

Neste exemplo, demonstramos como criar um Node em Python usando programação orientada a objetos (POO) no ROS2.

```python
import rclpy  # Responsável por chamar as funcionalidades do ROS2
from rclpy.node import Node  # Importa a classe Node do ROS2

class MeuNode(Node):
    def __init__(self):
        super().__init__('meu_node')  # Chama o construtor da classe Node
        self.get_logger().info('Hello ROS2!')  # Imprime a mensagem no terminal
        self.contador = 0  # Inicializa o contador

        self.create_timer(0.5, self.timer_callback)  # Cria um timer de 1/2 segundo

    def timer_callback(self):
        self.contador += 1  # Incrementa o contador
        self.get_logger().info('Contador: ' + str(self.contador))  # Imprime o contador no terminal

def main(args=None):
    rclpy.init(args=args)  # Inicializa o ROS2
    node = MeuNode()  # Cria um objeto da classe MeuNode
    rclpy.spin(node)  # Mantém o programa rodando
    rclpy.shutdown()  # Finaliza o ROS2

if __name__ == '__main__':
    main()
```

Neste código, criamos uma classe `MeuNode` que herda as funcionalidades da classe `Node` do ROS2. No construtor da classe, inicializamos o Node com o nome `'meu_node'` e imprimimos uma mensagem de saudação. Em seguida, criamos um timer que chama a função `timer_callback` a cada 0.5 segundos, que incrementa um contador e exibe o valor no terminal.

O loop principal do programa é mantido pelo `rclpy.spin(node)`, que permite que o Node permaneça ativo e responsivo às mensagens e eventos no sistema ROS2.
Você pode ter notado que este exemplo se assemelha muito ao código de um ouvinte e um falante (listener e talker) mencionado anteriormente neste arquivo. De fato, a comunicação entre os dois derivaria diretamente deste código.

## Exemplo 3 - Comunicação Entre Nodes

### Como Tornar o Código Executável

Para tornar um Node um executável no ROS2, você pode seguir os seguintes passos:

1. **Atualize o `setup.py` (apenas para pacotes Python):**

   É necessário atualizar o arquivo `setup.py` para garantir que o nó seja instalado corretamente. Você deve achar esse arquivo dentro do seu pacote python. Adicione ao final do arquivo, dentro dos `entry_points` a seguinte sequência `'nome_do_node = nome_do_pacote.exemplo_de_node:main'` ou seja, seguindo os exemplos que estamos tendo, seria: 

   ```python
   from setuptools import setup

   setup(
       name='nome_do_pacote',
       version='0.0.0',
       packages=[''],
       py_modules=[
           'exemplo_de_node',
       ],
       install_requires=['setuptools'],
       zip_safe=True,
       maintainer='maintainer_name',
       maintainer_email='maintainer_email@example.com',
       description='Descrição do seu pacote',
       license='License',
       tests_require=['pytest'],
       entry_points={
           'console_scripts': [
               'nome_exemplo_node = my_py_pkg.exemplo_de_node:main',
           ],
       },
   )
   ```

2. **Compilação e Instalação:**

   Agora devemos fazer a compilação e a instalação do pacote rodando os comandos abaixo em ordem:
   ```bash
   cd/ros2_ws
   ```

   ```bash
   colcon build --packages-select exemplo_de_node
   ```
   Substitua o `exemplo_de_node` pelo nome que você deu e caso não tenho seguido o nomde de workspace aqui dado substitua no primeiro comando o `ros2_ws` pelo nome do seu workspace.

3. **Execute o Node:**

   Agora que seu Node está instalado como um executável, você pode executá-lo usando o nome especificado no `entry_points` do `setup.py`. Por exemplo, siga os comando abaixo:
   
    ```bash
    cd my_py_pkg
    ```  
    
    ```bash
    cd lib
    ```   
    
    ```bash
    cd source ~/.bashrc
    ```   
    

   ```bash
   ./nome_do_node
   ```

Com esses passos, seu Node Python deve ser transformado em um executável no ROS2 e você poderá executá-lo facilmente no terminal. Certifique-se de seguir as convenções de nomenclatura do ROS2 para garantir uma integração suave com o restante do ecossistema ROS2.



Aqui está um exemplo de comunicação entre nodes em ROS2. Este exemplo consiste em um servidor que publica mensagens em um tópico chamado "chatter" e um cliente que se inscreve nesse tópico para receber e imprimir essas mensagens.

### Servidor

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Servidor(Node):
    def __init__(self):
        super().__init__('servidor_node')  # Inicializa o nó servidor
        self.publisher_ = self.create_publisher(String, 'chatter', 10)  # Cria um publicador para o tópico 'chatter' com buffer de 10 mensagens
        self.timer_ = self.create_timer(1, self.publicar_mensagem)  # Cria um timer para publicar uma mensagem a cada segundo
        self.get_logger().info('Servidor Inicializado')  # Imprime uma mensagem de inicialização

    def publicar_mensagem(self):
        msg = String()  # Cria um objeto de mensagem do tipo String
        msg.data = 'Olá Mundo'  # Define o conteúdo da mensagem
        self.publisher_.publish(msg)  # Publica a mensagem
        self.get_logger().info('Publicando: %s' % msg.data)  # Imprime a mensagem no log

def main(args=None):
    rclpy.init(args=args)  # Inicializa o ROS2
    servidor = Servidor()  # Cria uma instância do servidor
    rclpy.spin(servidor)  # Mantém o servidor em execução
    rclpy.shutdown()  # Finaliza o ROS2

if __name__ == '__main__':
    main()
```

Explicação:

- Este código define um nó chamado `Servidor`.
- No método `__init__`, ele cria um publicador para o tópico 'chatter' e um timer para publicar uma mensagem a cada segundo.
- O método `publicar_mensagem` é chamado pelo timer para publicar uma mensagem contendo "Olá Mundo" no tópico 'chatter'.

### Cliente

```python
#!/usr/bin/env python3

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Cliente(Node):
    def __init__(self):
        super().__init__('cliente_node')  # Inicializa o nó cliente
        self.subscription_ = self.create_subscription(String, 'chatter', self.callback_mensagem, 10)  # Cria uma subscrição para o tópico 'chatter' que chama a função de callback para processar as mensagens recebidas
        self.subscription_  # Evita o aviso de variável não utilizada
        self.get_logger().info('Cliente Inicializado')  # Imprime uma mensagem de inicialização

    def callback_mensagem(self, msg):
        self.get_logger().info('Recebido: %s' % msg.data)  # Imprime a mensagem recebida no log

def main(args=None):
    rclpy.init(args=args)  # Inicializa o ROS2
    cliente = Cliente()  # Cria uma instância do cliente
    rclpy.spin(cliente)  # Mantém o cliente em execução
    rclpy.shutdown()  # Finaliza o ROS2

if __name__ == '__main__':
    main()
```

Explicação:

- Este código define um nó chamado `Cliente`.
- No método `__init__`, ele cria uma subscrição para o tópico 'chatter', especificando uma função de retorno de chamada `callback_mensagem` para processar as mensagens recebidas.
- O método `callback_mensagem` imprime as mensagens recebidas no log.

### Executando os Nodes

Para executar os nodes, siga estes passos:

1. **Compilação e Instalação:** Certifique-se de que seu pacote está compilado e instalado corretamente conforme explicado nas seções anteriores.

2. **Executando o Servidor:**
   
    ```bash
    cd my_py_pkg
    ```  
    
    ```bash
    cd lib
    ```   
    
    ```bash
    cd source ~/.bashrc
    ```   
    

   ```bash
   ./nome_do_node
   ```
   
3. **Executando o Cliente:**
   
    ```bash
    cd my_py_pkg
    ```  
    
    ```bash
    cd lib
    ```   
    
    ```bash
    cd source ~/.bashrc
    ```   
    

   ```bash
   ./nome_do_node
   ```
   
Com isso, o servidor começará a publicar mensagens "Olá Mundo" no tópico 'chatter' e o cliente receberá e imprimirá essas mensagens no log.