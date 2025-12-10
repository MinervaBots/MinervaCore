---
sidebar_position: 0
title: 0. Configuração Inicial
---

# Configuração Inicial no Wokwi

Essa wiki foi feita pelo Gabriel Neri. Muitos agradecimentos a ele!

---
## Instalando Wokwi no vscode
Vá em estensôes(passo 1), procure por "wokwi" e instale a extensão "Wokwi Simulator"(passo 2).
![](https://hackmd.io/_uploads/rybcfi3t3.png)

---
## Preparando o workspace
### Compilando o Código
De começo, o seu código no platformio estará assim:
![](https://hackmd.io/_uploads/H1PxXihFn.png)


Compile o código clicando em "build" e espere até aparecer "SUCCES" verde:

![](https://hackmd.io/_uploads/BJdKho2t3.png)![](https://hackmd.io/_uploads/ByBxaihtn.png)

Com a compilação do código foram gerados alguns arquivos dentro de "*.pio\build\\(nome_do_enviroment)*".
Dentre eles, o "**firmware.bin**" e o "**firmware.elf**", você deverá copiar o caminho deles mais tarde.
![](https://hackmd.io/_uploads/SypI1nhtn.png)


Agora, você deverá criar dois arquivos (não precisarão estar em pastas):

---
### wokwi.toml:


Clique com o botão direito nessa área da esquerda e crie um novo arquivo.
![](https://hackmd.io/_uploads/S1fM8onth.png)


Coloque o nome do arquivo de "**wokwi.toml**":
![](https://hackmd.io/_uploads/SkODDo2tn.png)


Escreva no arquivo as seguintes linhas:
    
```
[wokwi]
version = 1
firmware = ''
elf = ''
```

![](https://hackmd.io/_uploads/BkUpFs2Yn.png)
 
 Em firmware você devrá colocar o caminho do **framework.bin** entre as aspas simples, e em elf o caminho do **framework.elf**.
 Para copiar o caminho, é só clicar com o botão direito no arquivo e ir em *Copy Relative Path*
 
 ![](https://hackmd.io/_uploads/rJB9fh2t3.png)
 
![](https://hackmd.io/_uploads/BkIMm2htn.png)

Note que para você, onde está escrito "abc" no path estará escrito outra coisa, por conta do nome do seu enviroment. O meu é abc.

---

### diagram.json
Crie um arquivo, do mesmo modo que o wokwi.toml foi criado, mas agora com o nome "**diagram.json**"
![](https://hackmd.io/_uploads/SyxNgInhYh.png)
Dentro desse arquivo, você deverá  colocar o diagrama do circuito, em formato json, que você fez no wokwi(obs: site, e não extensão do vscode).

![](https://hackmd.io/_uploads/rJPw_nhKn.png)

Cole o texto que está escrito dentro do diagram.json do seu vscode.
![](https://hackmd.io/_uploads/H1hIwn2th.png)

---

## Licença
Agora, você precisará colocar uma licença para poder usar a simulação. A licensa poderá ser facilmente obtida.
Clique em **F1** para abrir um campo de pesquisa e pesquise por "**Wokwi: Request a New License**" e clique nessa opção:
![](https://hackmd.io/_uploads/H1780n2F2.png)

Abrirá uma janela, clique em open:

![](https://hackmd.io/_uploads/BJgyJ6nth.png)

Você será redirecionado para um site, é necesaário que você tenha uma conta no wokwi. Você deverá se conectar na sua conta, feito isso, clique em "**GET YOUR LICENSE**"
![](https://hackmd.io/_uploads/Bkp1bahYn.png)

Clique em "**Abrir  Visual Studio Code**"
![](https://hackmd.io/_uploads/r1__-antn.png)

Clique em open
![](https://hackmd.io/_uploads/S1iZG63K2.png)

E, por fim, irá aparecer que a sua licença foi concedida
![](https://hackmd.io/_uploads/B1TDzpnF3.png)

---


## Simulação
Com o código escrito na main. Agora é a hora de simular de fato o circuito. Lembre-se sempre de compilar o código toda vez depois de alterar ele, para usar a simulação.

Clique em **F1** para abrir novamente o campo de pesquisa. Agora, pesquise por "**Wokwi: Start Simulator**"
![](https://hackmd.io/_uploads/B1PHVT2Fn.png)



Note que temos duas opções, as duas fazem simulações. 
A diferença delas é que a opção **"Wokwi: Start Simulator"**  inicia assim:
![](https://hackmd.io/_uploads/H1PPwp3Kh.png)

e a opção **"Wokwi: Start Simulator for Debugguer"** permite a vizualização de algumas informações a mais parafins de debug:![](https://hackmd.io/_uploads/SkLJDa2Fn.png)