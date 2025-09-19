# Multi-Source AI Agent Challenge

Este projeto implementa um Agente de IA multimodal capaz de buscar informações em diferentes fontes:

1) Banco SQLite (music.db)

2) Documentos de texto (.txt em /data/documents/)

3) Comandos de terminal (Bash) – com aprovação explícita do usuário

O agente foi construído utilizando LangChain + LangGraph, integrado à API da OpenAI.

## Funcionalidades

- Teste de conexão com modelo OpenAI (verifica se a integração funciona).

- Consulta ao SQLite (music.db): listar tabelas, buscar registros de álbuns etc.

- Busca em documentos de texto (economy_books.txt e outros).

- Execução de comandos Bash (com confirmação e bloqueio de comandos perigosos).

- Orquestração com LangGraph para escolher dinamicamente a melhor fonte de dados.

- Menu interativo com Inquirer (terminal amigável).

## Pré-requisitos

- Node.js (>= 18.x)

- NPM ou Yarn

- Conta e chave da API OpenAI

#### Como executar

Inicie o agente:

npm start

Será exibido um menu interativo como este:
? O que você quer fazer? (Use arrow keys)

❯ 1) Testar conexão com modelo OpenAI

  2) Listar tabelas no music.db
   
  3) Mostrar primeiros 5 álbuns
     
  4) Buscar em Documento
     
  5) Executar comando Bash (com aprovação)
     
  6) Sair

#### Exemplos de uso

- SQLite → "Mostrar primeiros 5 álbuns" retorna registros da tabela Album.

- Documento → buscar "economy" em economy_books.txt.

- Bash → executar echo Olá mundo → requer confirmação.

### Segurança da Bash Tool

- Implementa denylist de comandos perigosos (rm -rf, sudo, shutdown etc).

- Requer confirmação explícita antes de rodar qualquer comando.

- Limita saída a 10.000 caracteres e timeout de 15s.

## Próximos passos

 - Conectar as três Tools em um agente orquestrado com LangGraph.

## Autor

Projeto desenvolvido por Carlos Brandão como parte do desafio Hiring Challenge Alpha.
   
