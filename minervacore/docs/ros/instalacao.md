---
sidebar_position: 0
title: 0. Instalação ROS 2 Humble
---

# Instalação ROS 2

Esse é um tutorial de instalação do ROS 2 HUMBLE, que não é mais atual, porém conta com um suporte longo e possui grande documentação na internet, facilitando nossas vidas para pesquisas.

# Passo a passo

* Crash Course com o básico de ROS 2 Humble (em inglês com legendas em português): [link](https://www.youtube.com/watch?v=Gg25GfA456o)

> Basicamente, o conteúdo abordado nesse documento será uma tradução e simplificação desse vídeo, a fim de facilitar a sua vida, amigo ;)

* Estimativa de duração da etapa: <span style="color:red">30 Minutos.</span>

> A versão que vamos utilizar, e a que esta contida na vídeo aula que colocamos no início deste tutorial, é o ROS 2 Humble. Vamos ver como começar a instalar essa brincadeira na sua máquina virtual.

- Acesse o [site oficial](https://docs.ros.org/en/humble/Installation.html) para instalação, recomendamos que você tente abri-lo no navegador de sua máquina virtual para copiar os comandos que você terá de usar no terminal, para isso basta pesquisar no navegador FireFox padrão por <span style="color:lightgreen">ROS 2 Humble installation</span>, provavelmente será o primeiro link que aparecer.

![image](https://hackmd.io/_uploads/S1xHMcUa6.png)


1. Chegando no site, selecionaremos a opção sublinhada abaixo para continuarmos com a instalação 

    ![image](https://hackmd.io/_uploads/SkkeTOfpa.png)
    
2. Após acessarmos a página acima encontraremos diversos scripts para rodarmos no nosso terminal, é só seguirmos sequêncialmente para completarmos a instalação! Mas na parte de install, ignore apenas parte de "ROS-Base Install (Bare Bones)", não utilizaremos ela, mas sim a versão **Desktop** juntamente com o **Development tools**.  
 
    ![image](https://hackmd.io/_uploads/Bkp10Ozpa.png)
    
3. A instalação de todos os pacotes pode (e vai) demorar um pouquinho, mas após a instalação basta digitarmos ros2 para checarmos se ocorreu tudo bem, mas vamos acabar nos deparando com <span style="color:red">isso</span>:
 
     ![image](https://hackmd.io/_uploads/rkfNyKfaT.png)
     😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱😱
     
>Mas porque isso aconteceu? será que deu algum problema na instalação? <span style="color:red">Não</span>, isso é completamente normal, quando queremos utilizar o ros, precisamos primeiro preparar o ambiente para ele, ou seja...rodar uma linha de código no nosso terminal mais especificamente essa daqui: 

     echo $0

>Digitando esse comando você pode obter algumas respostas. São elas: **bash, sh, zsh**
>Agora você vai digitar o seguinte comando no terminal, substituindo o <span style="color:red">bash</span> no final pela resposta anterior:

        source /opt/ros/humble/setup.bash

- Com o ambiente preparado, quando você digitar ros2 novamente, se tudo estiver certo, você vai ver essa mensagem com as funções do ros:    
    

    
    ![image](https://hackmd.io/_uploads/Sk3dQtGTp.png)

     
     
> Porém, precisamos fazer isso para <span style="color:red">cada</span> terminal que quisermos usar, o que seria muito chato não é mesmo? Para fazermos com que esse processo seja automático, podemos adicionar o script acima no arquivo .bashrc da nossa máquina, que fará com que esse script seja executado  <span style="color:red">toda vez que abrirmos um novo terminal</span>, bem mais fácil né? 

- Rodamos o código abaixo para podermos editar o arquivo que dita todos scripts que são executados quando chamamos um novo terminal: 

        gedit ~/.bashrc

    
- Nesse arquivo, vamos até o final dele e adicionamos a linha de código:
 <span style="color:red">source /opt/ros/humble/setup.bash</span>
 
    ![image](https://hackmd.io/_uploads/S1hwrFMp6.png)
    
- E tudo pronto! Agora sempre que você abrir um novo terminal ele vai estar configurado para poder usar o ROS 🥳🥳🥳.

4. Existem alguns arquivos de teste que te permitem sentir um pouco o que o ROS pode fazer, recomendo que façam esses testes na máquina de vocês, o mais básico é rodar 2 comandos em terminais diferentes, um que estará enviando uma mensagem e outro que estará recebendo:

- Executando  <span style="color:red">ros2 run demo_nodes_cpp talker</span> em um terminal, você inicia o programa que estará publicando uma mensagem:

    ![image](https://hackmd.io/_uploads/B1XXPFGTp.png)
    
- E executando <span style="color:red">ros2 run demo_nodes_cpp listener</span>, você inicia o programa que lê a mensagem que o outro programa está enviando!

    ![image](https://hackmd.io/_uploads/SJwWdYMpT.png)
    
- E executando  <span style="color:red">rqt_graph</span>no seu terminal, uma janela será aberta com um grafo que ilustra a comunicação entre os programas!
    
    ![image](https://hackmd.io/_uploads/HJyVKzap6.png)
    
    - Aqui podemos ver os códigos rodando e o grafo mostrando a comunicação entre eles.
    
> Para o nó parar de ser executado, basta pressionar Ctrl+C no terminal    
    
5. Agora precisamos instalar o Colcon ([site explicativo](https://colcon.readthedocs.io/en/released/)) para o ROS 2. Ele simplifica a construção de pacotes, tornando a vida mais fácil. Com o Colcon, você ganha agilidade na compilação, testes e empacotamento, promovendo uma estrutura mais organizada e eficiente para seus projetos. Para isso basta inserir o comando abaixo:

        sudo apt install python3-colcon-common-extensions
        
    Talvez o terminal peça pela sua senha e uma confirmação de instalação. Após isso, basta inserir o comando abaixo na última linha do arquivo .bashrc citado anteriormente:
    
       gedit ~/.bashrc 
   
       sudo /usr/share/colcon_argcomplete/hook/colcon-argcomplete.bash
        
Pronto, se você fez toda a instalação corretamente até aqui, você já deve estar pronto para realizar seus primeiros passos com o ROS 2.
