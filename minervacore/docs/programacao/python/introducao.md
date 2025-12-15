---
sidebar_position: 0
title: 0. Introdução ao Python
---

# Introdução ao Python

> Python é uma linguagem de programação criada em 1989 pelo programador Guido Van Rossum. Ela foi desenvolvida como um hobby e com a ideia de dar continuidade na linguagem ABC, que tava sendo desenvolvida no Centro de Pesquisas Holandês (CWI).
> ABC era uma linguagem para ser simples e para iniciantes (parecido com o que o Python se tornou né), então como continuidade veio o Python com os objetivos de ser fácil e intuitiva, open source (código aberto, onde todos podem contribuir) e produtiva, com ideia de você focar apenas nas soluções para o problema e não também na complexidade do código para resolver o problema.
>
> ![image](https://hackmd.io/_uploads/HydriGTz-l.png)
> 
> - A primeira versão pública do Python (0.9.0) foi lançada em 1991 e em 1994 foi lançada a versão completa (1.0).
> - A segunda versão (2.0) foi lançada em 2000, onde nasceu a compreensão de listas e as melhorias de coletas de lixo, fundamentais para o Python ser o que ele é hoje.
> - A terceira versão (3.0) foi lançada em 2008, com a resolução de muitos problemas de design da linguagem e de performance. Essa versão não é retrocompatível, então não conseguimos usar um código daqui nas outras duas versões. Porém, como grande parte dos problemas foram resolvidos ali, até os dias de hoje (~2025~) ainda estamos na versão 3.XY.Z.

## Onde usar Python?

Python é uma das linguagens mais versáteis encontradas na programação, isso por diversos motivos. Um deles é a quantidade de bibliotecas que a linguagem tem, o nível de abstração em Python é muito alto e isso é benéfico para a comunidade em um contexto geral, mesmo as vezes tendo um desempenho computacional ruim.

![image](https://hackmd.io/_uploads/ryrORG6Mbl.png)

### Python na robótica

Na nossa área, o Python é muito utilizado em tarefas de alto nível e muito aproveitada pela sua integração com linguagens de baixo nível, como o C e C++.

> Onde Python é usado na robótica:
> - ROS
> - Inteligência Artificial
> - Visão Computacional
> - Linguagem MicroPython
> - Interfaces e Comunicação

### Destaques do Python
> - Tipagem dinâmica e forte
> - Multiplataforma e multiparadigma
> - Comunidade muito forte
> - Curva de aprendizado baixa

## Instalação do Python

Linux e MacOS já vem com Python instalado normalmente, para conferir use esse comando no terminal e veja se ele irá retornar a sua versão do python:

```shell
python3 -V
```

No Windows, para instalar o Python, acesse este site: [python.org](https://www.python.org/downloads/windows/)

Dê preferência para instalar a última versão:
![image](https://hackmd.io/_uploads/H1LRgQTzZx.png)

Aqui tem um tutorial bem completo de como instalar o Python na sua máquina:
[Tutorial Instalação Python](https://python.org.br/instalacao-windows/)

## IDE para Python

### IDLE (IDE nativa do Python)

Ao instalar o Python, ele também instala no seu computador o IDLE, que pode ser usada para testes de códigos bem básicos e pequenos na linguagem, códigos grandes são bem difícieis de serem rodados no IDLE.

![image](https://hackmd.io/_uploads/ryh4z7pfWl.png)

### VSCode

A IDE mais versártil da programação é uma das melhores ferramentas para programar em Python, ela tem diversas extensões para a linguagem e é muito boa de trabalhar.
![image](https://hackmd.io/_uploads/B1iKGQTzWg.png)

### Anaconda

Eu (~fróes~), particurlamente gosto muito da Anaconda para montar os ambientes de desenvolvimento do Python, se você ainda não sabe o que é isso, pense como se fosse o computador virtual que rodará seu código, isso é muito importante no Python e falaremos bem sobre isso, mas o Anaconda já vem com diversas bibliotecas do Python e isso é excelente para preparar um ambiente rápido para um código que você está desenvolvendo.

O Anaconda também já vem com suporte para diversas ferramentas do Python, como Jupyter Notebook, PyCharm, Spyder, etc.

[Download Anaconda](https://www.anaconda.com/download)

![image](https://hackmd.io/_uploads/S1Ku7m6f-x.png)
