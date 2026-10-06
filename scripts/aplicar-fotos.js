// Devolve ao banco que JÁ EXISTE a foto e o nome do pote dos 10 produtos
// que têm foto da linha Viver Bem (pedido do cliente em 05/10/2026). A
// descrição neutra de prisma/conformidade.js continua. Banco novo já
// nasce assim pelo seed.
//
//   node scripts/aplicar-fotos.js
//
// Acha cada produto pelo nome genérico de hoje ou pelo nome do pote, então
// pode rodar mais de uma vez.
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

// nome do pote -> nome genérico que ele recebeu em 23/09 e a foto
const COM_FOTO = {
  "CitoRepair™ 2.0": ["Fórmula com espermidina e resveratrol", "/uploads/citorepair.png"],
  "Ômega 3 Viver Bem": ["Ômega 3 com EPA e DHA", "/uploads/omega3.png"],
  VitaFlex: ["Fórmula com curcumina e colágeno tipo II", "/uploads/vitaflex.png"],
  "Creatina Gummy": ["Creatina em gomas", "/uploads/creatina-gummy.png"],
  "Caramelo de Creatina": ["Caramelo de creatina", "/uploads/caramelo-creatina.png"],
  "Glow Cream": ["Creme facial com ceramida e niacinamida", "/uploads/glow-cream.png"],
  "Firm Defense Serum": ["Sérum com ceramidas e centella", "/uploads/firm-defense-serum.png"],
  "ZincBlock FPS": ["Protetor solar com óxido de zinco", "/uploads/zincblock-fps.png"],
  "Bastão Clareador": ["Bastão com vitamina C", "/uploads/bastao-clareador.png"],
  "Pó Finalizador FPB 20": ["Pó facial finalizador", "/uploads/po-finalizador.png"],
};

// Mesma regra de src/lib/slug.ts
function slugificar(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function slugLivre(nome, idAtual) {
  const base = slugificar(nome) || "produto";
  let slug = base;
  let n = 2;
  for (;;) {
    const dono = await db.produto.findUnique({ where: { slug }, select: { id: true } });
    if (!dono || dono.id === idAtual) return slug;
    slug = `${base}-${n++}`;
  }
}

(async () => {
  let trocados = 0;
  for (const [nomePote, [nomeGenerico, foto]] of Object.entries(COM_FOTO)) {
    const produto = await db.produto.findFirst({
      where: { nome: { in: [nomeGenerico, nomePote] } },
    });
    if (!produto) {
      console.log(`  não achado: ${nomePote}`);
      continue;
    }
    await db.produto.update({
      where: { id: produto.id },
      data: { nome: nomePote, slug: await slugLivre(nomePote, produto.id), fotoUrl: foto },
    });
    trocados++;
    console.log(`  ${produto.nome}  ->  ${nomePote}`);
  }
  console.log(`\ncom foto: ${trocados} de ${Object.keys(COM_FOTO).length}`);
  await db.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
