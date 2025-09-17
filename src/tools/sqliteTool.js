import { tool } from "@langchain/core/tools";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { z } from "zod";

/**
 * Função que executa queries em um banco SQLite
 */
function runSQLiteQuery(dbName, query) {
  const dbPath = path.resolve("data/sqlite", dbName);

  if (!fs.existsSync(dbPath)) {
    throw new Error(`Banco de dados não encontrado em: ${dbPath}`);
  }

  const db = new Database(dbPath, { readonly: true });

  try {
    const stmt = db.prepare(query);
    const results = stmt.all(); // retorna todos os resultados
    return results;
  } catch (err) {
    throw new Error(`Erro ao executar query: ${err.message}`);
  } finally {
    db.close();
  }
}

/**
 * Tool SQLite implementada com o helper `tool()`
 */
export const sqliteTool = tool(
  async ({ dbName, query }) => {
    return JSON.stringify(runSQLiteQuery(dbName, query));
  },
  {
    name: "sqlite_query",
    description:
      "Use esta ferramenta para consultar um banco SQLite em `data/sqlite`. Forneça o nome do arquivo `.db` e a query SQL que deseja executar.",
    schema: z.object({
      dbName: z.string().describe("Nome do arquivo SQLite (.db)"),
      query: z.string().describe("Query SQL a ser executada"),
    }),
  }
);

