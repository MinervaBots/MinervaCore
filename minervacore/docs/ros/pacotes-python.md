---
sidebar_position: 4
title: 4. Pacotes em Python
---

# Pacote em Python

Para avançarmos na criação do nosso primeiro nó ROS 2, precisamos primeiro criar seu pacote. Os pacotes são blocos de código independentes que podem controlar componentes específicos, como uma câmera ou um sistema de locomoção. Vamos começar.

Primeiro, abra o diretório `src` dentro do workspace criado anteriormente e navegue até ele com os comandos abaixo:

```bash
cd ros2_ws/src
ls
```

Agora, execute o seguinte comando para criar o pacote. Lembre-se de que onde está escrito `my_py_pkg` é o nome do seu pacote, que pode ser qualquer um de sua escolha, mas estamos seguindo essa convenção para manter a consistência com os tutoriais:

```bash
ros2 pkg create my_py_pkg --build-type ament_python --dependencies rclpy
```

Se tudo ocorrer conforme o esperado, uma série de arquivos será instalada e uma nova pasta com o nome que você escolheu deve ter sido criada. Agora, com o VSCode, que pode ser instalado pela loja do próprio sistema, você pode abrir o arquivo. Para evitar bugs, recomenda-se não abrir o VSCode diretamente, mas sim abrir a pasta no explorador de arquivos, clicar com o botão direito e selecionar "Abrir com outra aplicação", escolhendo o VSCode.

![image](https://hackmd.io/_uploads/Byq4XfrRp.png)

Se tudo correu bem até agora, você deverá ver todos esses arquivos em seu VSCode.

![image](https://hackmd.io/_uploads/H1FCmfH06.png)

Agora, de volta a um terminal limpo, digite os comandos abaixo:

```bash
cd ros2_ws/
colcon build
```

Ao executar o segundo comando, é provável que ocorra um erro. Nesse caso, precisaremos seguir outros passos. Digite o comando abaixo:

```bash
pip3 list
```

Caso esse comando funcione, ótimo. Caso contrário, execute o seguinte comando para instalar o pip3:

```bash
sudo apt install python3-pip
```

Após a instalação, execute novamente o comando:

```bash
pip3 list
```

Depois, execute o comando abaixo para verificar a versão do pacote `setuptools`:

```bash
pip3 list | grep setuptools
```

Se a versão do pacote for diferente de 58.2.0, precisaremos fazer um downgrade. Execute o seguinte comando:

```bash
pip3 install setuptools==58.2.0
```

Após isso, verifique novamente a versão do pacote. Em seguida, execute novamente o comando abaixo:

```bash
colcon build
```

Dessa vez, a instalação deve ser concluída com êxito. Com isso feito, execute o seguinte comando para ativar o compilador do seu pacote e deixá-lo pronto para uso:

```bash
colcon build --packages-select my_py_pkg
```

Lembre-se de substituir `my_py_pkg` pelo nome do seu pacote, caso tenha escolhido um diferente.