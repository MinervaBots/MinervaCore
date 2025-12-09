---
sidebar_position: 3
title: 3. Workspace
---

# Criando o WorkSpace

Para configurar seu ambiente de desenvolvimento no ROS 2, é necessário criar um workspace, onde você irá trabalhar em seus códigos. Siga os passos abaixo em seu terminal, na ordem indicada:

1. Navegue até o diretório raiz usando o comando `cd`.

        cd
        
2. Liste o conteúdo do diretório atual usando o comando `ls`.

        ls

3. Crie um diretório para o seu workspace do ROS 2, seguindo a convenção usual de nomeá-lo como `ros2_ws`.


        mkdir ros2_ws


Agora, dentro do diretório `ros2_ws`, crie um diretório chamado `src`, onde você colocará seus pacotes ROS.

        cd ros2_ws/
        mkdir src

Em seguida, construa seu workspace utilizando o comando `colcon build`.

        colcon build

Se ocorrer algum erro durante esse processo, verifique se todos os passos anteriores foram seguidos corretamente.

Após a conclusão da construção do workspace, você deve ver uma série de arquivos, incluindo `build`, `install`, `log` e `src`. Entre no diretório `install` com o comando:

        cd install/


Dentro do diretório `install`, você encontrará o arquivo `setup.bash`, responsável por configurar o workspace. Para evitar a necessidade de configurá-lo manualmente toda vez que você iniciar um novo terminal, vamos configurar o arquivo `.bashrc`.

Abra o arquivo `.bashrc` usando um editor de texto, como o `gedit`.

        gedit .bashrc


Na última linha do arquivo `.bashrc`, adicione o seguinte comando:


        source ~/ros2_ws/install/setup.bash


Salve e feche o arquivo. Agora, sempre que abrir um novo terminal, seu ambiente estará configurado para trabalhar com o ROS 2.