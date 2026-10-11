// Baixa o avatar do Google de quem avaliou e NÃO tem foto própria (o
// círculo com a inicial que o próprio Google mostra), para a página
// /avaliacoes ter uma imagem em todos os cartões (11/10/2026, pedido:
// "coloque as fotos na parte de avaliações"). As URLs vêm da lista do
// scripts/baixar-avaliacoes.js (as 27 primeiras) e das 12 novas (abaixo).
const fs = require("fs"); const path = require("path"); const sharp = require("sharp");
const raiz = path.join(__dirname, ".."); const lista = path.join(raiz, "prisma", "avaliacoes-google.js");
const pasta = path.join(raiz, "public", "uploads", "avaliacoes");
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const slug = (s) => norm(s).replace(/\s+/g, "-");
// As URLs do script original (campo foto), lidas do próprio arquivo
const fonte = fs.readFileSync(path.join(__dirname, "baixar-avaliacoes.js"), "utf8");
const urls = new Map();
for (const m of fonte.matchAll(/nome:\s*"([^"]+)"[\s\S]*?foto:\s*"([^"]+)"/g)) urls.set(norm(m[1]), m[2]);
const NOVAS = {
  "rosangela m a": "https://lh3.googleusercontent.com/a/ACg8ocJjlIxyx_UX3jnybBAUkAgV8jLx91OYZeu61-pk9Oxk4WUdsA=s128-c-rp-mo-br100",
  "maria da conceicao": "https://lh3.googleusercontent.com/a/ACg8ocI5iaBlM4P_B_ILwRo-2or6H4MNLBH9m7Kp_6UeBpi9ZmKaOQ=s128-c-rp-mo-br100",
  "daniela azevedo": "https://lh3.googleusercontent.com/a/ACg8ocIxNsGeHv0Dcrdb67pyehH5kKVjPdLdw_SBu9VwdIhOEn-eqQ=s128-c-rp-mo-br100",
  "eliane gomes": "https://lh3.googleusercontent.com/a/ACg8ocLTGvKChbK5NvXQs5nkO4AqSJWOViHPWsgGxWnlo8WfkDQHwQ=s128-c-rp-mo-br100",
  "isabel baldi": "https://lh3.googleusercontent.com/a/ACg8ocI9s-UtJ8Ea0AxDQGq-sDqeMMtiPF5ivTv9r1NnQ-qp_tlbEQ=s128-c-rp-mo-br100",
};
for (const [k, v] of Object.entries(NOVAS)) urls.set(k, v);
(async () => {
  const todas = require(lista); let baixadas = 0;
  for (const a of todas) {
    if (a.fotoUrl) continue;
    const url = urls.get(norm(a.nome));
    if (!url) { console.log("sem URL:", a.nome); continue; }
    try {
      const r = await fetch(url.replace(/=s\d+-c-rp-mo-br100$/, "=s128-c-rp-mo-br100")); if (!r.ok) throw new Error("HTTP " + r.status);
      const buf = Buffer.from(await r.arrayBuffer()); const arquivo = `${slug(a.nome)}.jpg`;
      await sharp(buf).resize(96, 96, { fit: "cover" }).jpeg({ quality: 84 }).toFile(path.join(pasta, arquivo));
      a.fotoUrl = `/uploads/avaliacoes/${arquivo}`; baixadas++;
    } catch (e) { console.log("falhou:", a.nome, e.message); }
  }
  const cabecalho = fs.readFileSync(lista, "utf8").split("module.exports")[0];
  fs.writeFileSync(lista, cabecalho + "module.exports = " + JSON.stringify(todas, null, 2) + ";\n");
  console.log(`avatares baixados: ${baixadas}; com foto agora: ${todas.filter((a) => a.fotoUrl).length} de ${todas.length}`);
})().catch((e) => { console.error(e); process.exit(1); });
