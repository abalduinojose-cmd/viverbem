// Recarrega só as avaliações do Google no banco, sem tocar nos
// produtos. Útil depois de rodar scripts/dados/baixar-avaliacoes.js.
const { PrismaClient } = require("@prisma/client");
const avaliacoes = require("../../prisma/dados/avaliacoes-google");

const db = new PrismaClient();

(async () => {
  await db.depoimento.deleteMany();
  for (let i = 0; i < avaliacoes.length; i++) {
    const a = avaliacoes[i];
    await db.depoimento.create({
      data: {
        nome: a.nome,
        texto: a.texto,
        fotoUrl: a.fotoUrl,
        nota: 5,
        fonte: "Google",
        ordem: i,
      },
    });
  }
  const total = await db.depoimento.count();
  const comFoto = await db.depoimento.count({ where: { NOT: { fotoUrl: null } } });
  console.log(`depoimentos: ${total} | com foto: ${comFoto}`);
  await db.$disconnect();
})();
