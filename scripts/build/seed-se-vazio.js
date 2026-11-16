// Popula o banco com os dados iniciais SOMENTE se ele estiver vazio.
//
// Roda automaticamente no build do Vercel (ver package.json > vercel-build),
// para que a primeira publicação já venha com produtos e usuários — sem
// precisar rodar nenhum comando manualmente.
//
// Como só semeia quando NÃO há produtos, publicações seguintes nunca
// apagam o que o cliente cadastrou.

const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");

const db = new PrismaClient();

async function main() {
  let total = 0;
  try {
    total = await db.produto.count();
  } catch (e) {
    console.error("[setup] não consegui ler o banco:", e.message);
    process.exit(1);
  }

  if (total > 0) {
    console.log(`[setup] banco já tem ${total} produtos — nada a semear.`);
    return;
  }

  console.log("[setup] banco vazio — cadastrando produtos e usuários iniciais...");
  execSync("node prisma/seed.js", { stdio: "inherit" });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
