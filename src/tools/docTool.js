import { tool } from "@langchain/core/tools";
import fs from "fs";
import path from "path";
import { z } from "zod";

/**
 * Tool que busca informação dentro de arquivos .txt na pasta data/documents
 */
export const docTool = tool(
  async ({ fileName, query }) => {
    const filePath = path.resolve("data/documents", fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf-8");

    // Aqui fazemos uma busca simples: retorna linhas que contêm a query
    const results = content
      .split("\n")
      .filter(line => line.toLowerCase().includes(query.toLowerCase()));

    return results.length ? results.join("\n") : "Nenhuma correspondência encontrada.";
  },
  {
    name: "document_search",
    description:
      "Use esta ferramenta para buscar informações dentro de arquivos .txt na pasta data/documents. Forneça o nome do arquivo e o termo que deseja buscar.",
    schema: z.object({
      fileName: z.string().describe("Nome do arquivo .txt dentro de data/documents"),
      query: z.string().describe("Palavra ou frase a ser buscada"),
    }),
  }
);

