// Alterna o banco do projeto entre SQLite (desenvolvimento local),
// PostgreSQL e MySQL (produção).
//
// O Prisma não permite escolher o provider por variável de ambiente,
// então este script reescreve o schema em dois pontos:
//   1. a linha "provider" do bloco datasource;
//   2. os campos de texto longo, que no SQLite são String puro e no
//      MySQL/Postgres precisam de @db.Text (no MySQL, String vira
//      VARCHAR(191), curto demais para descrição, composição, avaliação,
//      itens do pedido e detalhe do log).
//
// Uso:
//   npm run db:sqlite     -> volta para o SQLite local
//   npm run db:postgres   -> prepara para PostgreSQL
//   npm run db:mysql      -> prepara para MySQL
//
// Depois de trocar, aponte DATABASE_URL para o servidor e rode:
//   npx prisma db push  &&  npm run db:seed
//
// O projeto volta ao SQLite com "npm run db:sqlite" (não esqueça: o
// schema fica alterado no disco até lá).

const fs = require("fs");
const path = require("path");

const PROVIDERS = { sqlite: "sqlite", postgres: "postgresql", mysql: "mysql" };
const destino = process.argv[2];
if (!PROVIDERS[destino]) {
  console.error('Informe o banco: "sqlite", "postgres" ou "mysql".');
  process.exit(1);
}

// Campos de texto longo (modelo.campo), marcados com @db.Text fora do SQLite
const TEXTO_LONGO = ["descricao", "composicao", "modoUso", "indicacoes", "texto", "itens", "detalhe", "valor"];

const provider = PROVIDERS[destino];
const caminho = path.join(__dirname, "..", "prisma", "schema.prisma");
const original = fs.readFileSync(caminho, "utf8");

// 1. A linha do provider dentro do bloco datasource
let atualizado = original.replace(
  /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"[^"]+"/,
  `$1"${provider}"`
);

// 2. @db.Text nos campos de texto longo (adiciona fora do SQLite, tira no SQLite)
const campos = new RegExp(`^(\\s*(?:${TEXTO_LONGO.join("|")})\\s+String\\??)(\\s*@db\\.Text)?`, "gm");
atualizado = atualizado.replace(campos, (m, campo) => (provider === "sqlite" ? campo : `${campo} @db.Text`));

if (atualizado === original) {
  console.log(`Nada a fazer — o schema já está preparado para "${provider}".`);
} else {
  fs.writeFileSync(caminho, atualizado);
  console.log(`Schema atualizado para "${provider}".`);
}

if (destino !== "sqlite") {
  const exemplo =
    destino === "mysql"
      ? 'mysql://usuario:senha@servidor:3306/viverbem'
      : 'postgresql://usuario:senha@servidor:5432/viverbem';
  console.log("\nPróximos passos:");
  console.log(`  1. No .env, aponte DATABASE_URL para o banco, ex.: ${exemplo}`);
  console.log("  2. npx prisma db push      (cria as tabelas)");
  console.log("  3. npm run db:seed         (categorias, produtos e avaliações)");
  console.log("  4. npx prisma generate     (se o client reclamar do provider)");
}
