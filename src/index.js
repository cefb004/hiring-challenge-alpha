import dotenv from "dotenv";
dotenv.config();

import inquirer from "inquirer";
import { ChatOpenAI } from "@langchain/openai";
import { sqliteTool } from "./tools/sqliteTool.js";
import { docTool } from "./tools/docTool.js";

async function main() {
  console.log("Ì±ã Bem-vindo ao Multi-Source AI Agent Challenge!");

  let sair = false;
  while (!sair) {
    // Menu interativo
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "acao",
        message: "O que voc√™ quer fazer?",
        choices: [
          "1. Testar conex√£o com modelo OpenAI",
          "2. Listar tabelas no music.db",
          "3. Mostrar primeiros 5 √°lbuns",
          "4. Buscar em documento", 
          "5. Sair"
        ]
      }
    ]);

    switch (answers.acao) {
      case "1. Testar conex√£o com modelo OpenAI": {
        const llm = new ChatOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          model: "gpt-4o-mini",
          temperature: 0,
        });

        const response = await llm.invoke("Diga ol√°, estou testando minha integra√ß√£o!");
        console.log("Ì¥ñ Resposta do modelo:", response.content);
        break;
      }

      case "2. Listar tabelas no music.db": {
        try {
          const tables = await sqliteTool.call({
            dbName: "music.db",
            query: "SELECT name FROM sqlite_master WHERE type='table';"
          });
          console.log("Ì≥Ç Tabelas encontradas:", tables);
        } catch (err) {
          console.error("‚ùå Erro:", err.message);
        }
        break;
      }

      case "3. Mostrar primeiros 5 √°lbuns": {
        try {
          const albums = await sqliteTool.call({
            dbName: "music.db",
            query: "SELECT * FROM Album LIMIT 5;"
          });
          console.log("Ìæµ Primeiros √°lbuns:", albums);
        } catch (err) {
          console.error("‚ùå Erro:", err.message);
        }
        break;
      }

case "4. Buscar em documento": {
  try {
    const answers = await inquirer.prompt([
      { type: "input", name: "fileName", message: "Nome do arquivo (.txt):" },
      { type: "input", name: "query", message: "Termo a buscar:" }
    ]);

    const results = await docTool.call({
      fileName: answers.fileName,
      query: answers.query
    });

    console.log("Ì¥ç Resultados encontrados:\n", results);
  } catch (err) {
    console.error("‚ùå Erro:", err.message);
  }
  break;
}

      case "5. Sair":
        sair = true;
        console.log("Ì±ã Encerrando o agente. At√© logo!");
        break;
    }
  }
}

main();

