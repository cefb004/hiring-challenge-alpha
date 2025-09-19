// src/tools/bashTool.js
import { tool } from "@langchain/core/tools";
import inquirer from "inquirer";
import { exec } from "child_process";
import { z } from "zod";

/**
 * Verificação simples de comandos perigosos.
 * Ajuste a lista conforme seu cenário.
 */
function isDangerous(cmd) {
  const denyPatterns = [
    /(^|\s)rm\s+-rf\s+/i,
    /(^|\s)sudo\s+/i,
    /(^|\s)shutdown\b/i,
    /(^|\s)reboot\b/i,
    /(^|\s)mkfs\b/i,
    /(^|\s)dd\b/i,
    /(^|\s):\s*>\s*/i,
    />\s*\S+/i,            // redirecionamentos
    /(^|\s)nc\b/i,
    /(^|\s)ncat\b/i,
    /(^|\s)ftp\b/i,
    /(^|\s)scp\b/i,
    /(^|\s)chmod\s+7/i,   // chmod 777 etc (opcional)
    /(^|\s)chown\b/i
  ];
  return denyPatterns.some((r) => r.test(cmd));
}

async function runBashWithApproval(command) {
  if (isDangerous(command)) {
    return { status: "blocked", message: "Comando potencialmente perigoso e foi bloqueado." };
  }

  const { approve } = await inquirer.prompt([{
    type: "confirm",
    name: "approve",
    message: `Deseja executar o comando no shell?\n  ${command}\n(Responder 'Sim' executará o comando)`,
    default: false
  }]);

  if (!approve) {
    return { status: "rejected", message: "Comando rejeitado pelo usuário." };
  }

  return new Promise((resolve) => {
    // timeout em ms e tamanho máximo do stdout
    const opts = { maxBuffer: 10 * 1024 * 1024, timeout: 15000 };
    exec(command, opts, (err, stdout, stderr) => {
      if (err) {
        // inclui erro e possíveis saídas
        const out = (stdout || "").toString();
        const errOut = (stderr || "").toString();
        resolve({
          status: "error",
          error: err.message,
          stdout: out.length > 10000 ? out.slice(0, 10000) + "\n\n...output truncated..." : out,
          stderr: errOut.length > 10000 ? errOut.slice(0, 10000) + "\n\n...stderr truncated..." : errOut
        });
      } else {
        const out = (stdout || stderr || "").toString();
        resolve({
          status: "ok",
          output: out.length > 10000 ? out.slice(0, 10000) + "\n\n...output truncated..." : out
        });
      }
    });
  });
}

/**
 * Tool do LangChain para executar comandos shell (com aprovação)
 */
export const bashTool = tool(
  async ({ command }) => {
    const res = await runBashWithApproval(command);
    if (res.status === "ok") return res.output;
    if (res.status === "rejected") return "Execução cancelada pelo usuário.";
    if (res.status === "blocked") return `Bloqueado: ${res.message}`;
    if (res.status === "error") return `Erro ao executar: ${res.error}\n\nSTDOUT:\n${res.stdout}\n\nSTDERR:\n${res.stderr}`;
    return "Resultado desconhecido.";
  },
  {
    name: "run_bash",
    description: "Executa um comando shell (apenas com aprovação explícita do usuário). Não executa comandos potencialmente perigosos.",
    schema: z.object({
      command: z.string().describe("Comando shell a ser executado, ex: \"curl -s https://example.com\"")
    })
  }
);

