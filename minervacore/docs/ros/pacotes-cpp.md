---
sidebar_position: 5
title: 5. Pacotes em C++
---

# Pacote em C++

Primeiro, vamos abrir o diretório `src` do seu workspace, utilizando o nome `ros2_ws` como exemplo. Se você estiver usando outro nome, adapte os comandos abaixo:

```bash
cd ros2_ws/src
```

Caso você execute o comando `ls`, verá sua pasta com o pacote Python. Agora, vamos criar um pacote em C++, executando o seguinte comando, muito semelhante ao anterior:

```bash
ros2 pkg create my_cpp_pkg --build-type ament_cmake --dependencies rclcpp
```

Se tudo ocorrer conforme o esperado, você poderá abrir a pasta no VSCode e visualizar algo semelhante à imagem abaixo:

![image](https://hackmd.io/_uploads/S1nFnGS06.png)

Para finalizar, devemos habilitar a compilação desse pacote, seguindo os comandos abaixo em um novo terminal:

```bash
cd ros2_ws/
colcon build
```

Isso iniciará um processo de instalação que pode levar algum tempo. Para concluir, execute o seguinte comando, lembrando de substituir os nomes do pacote, caso sejam diferentes:

```bash
colcon build --packages-select my_cpp_pkg