// Junta às avaliações do Google já no site as novas (11/10/2026), baixando
// as fotos reais; quem só tem o avatar padrão fica sem foto.
const fs = require("fs"); const path = require("path"); const sharp = require("sharp");
const raiz = path.join(__dirname, "..");
const lista = path.join(raiz, "prisma", "avaliacoes-google.js");
const pasta = path.join(raiz, "public", "uploads", "avaliacoes");
const existentes = require(lista);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const slug = (s) => norm(s).replace(/\s+/g, "-");
const NOVAS = [
  ["Lili Braga", "A Viver Bem tem excelente atendimento e produtos de confiança! A melhor!", "https://lh3.googleusercontent.com/a-/ALV-UjU93z25hUiOiIFbtkATP29Rx9fmopWo_HeT4Thq4-FmbkRuFG2-KA=s128-c-rp-mo-br100"],
  ["Maria Alice Mansur", "O atendimento melhorou muito. São simpáticos, pontuais e bem responsáveis. Gosto muito de comprar lá.", "https://lh3.googleusercontent.com/a-/ALV-UjXcTqxU_c3umnwRnZUml_2zd1zJdgVDLZ3125X55SdxWaRN3X8c=s128-c-rp-mo-br100"],
  ["Gisele Luiza", "O pessoal é muito atencioso e gentil e os valores são justos.", "https://lh3.googleusercontent.com/a-/ALV-UjWqrWuphr2eHvto5VpuDUznNr79zwBfkEArMrYizBdPmNXn6cLHnA=s128-c-rp-mo-br100"],
  ["Marcela A Kuster", "Atendimento excelente! Preço e prazo de entrega justos.", "https://lh3.googleusercontent.com/a-/ALV-UjVbfgV73kWZYMTdLBNOXbbi1LoXySBBIEkyG7q_Nl0jh7QMrHY93w=s128-c-rp-mo-br100"],
  ["Rose Godois", "Atendimento: excelente\nProdutos: excelente\nEmbalagem: lindas\nEntregas: muito rápido\nQualidade: exata como pedi\nTransparência: parabéns excelente\nNota 10/10⭐⭐⭐⭐⭐", "https://lh3.googleusercontent.com/a-/ALV-UjWWe4YH71AAvDbhaTWT-jtqMXRDTXzNoQvnqtrRIgJ8zKRW8i26lA=s128-c-rp-mo-br100"],
  ["Janiiny Mourah", "O atendimento é rápido e satisfatório. Fui muito bem bem atendida.", "https://lh3.googleusercontent.com/a-/ALV-UjUYyT6YyePnF5FGsQpjLcZQvyszEAAevjzwPrR9PxV-21WivSgfCQ=s128-c-rp-mo-br100"],
  ["Adriana Teles", "Excelente! Tainara resolveu tudo que precisava com rapidez.", "https://lh3.googleusercontent.com/a-/ALV-UjVpu9SpLdcnh_6JX6pPjrjLm88vMZ-_-sfff78tsMDeuPgwjIyr=s128-c-rp-mo-br100"],
  ["Wallace Sutter", "Atendimento excelente, sem contar o comprometimento que eles tem como os seus clientes e a rapidez com que eles, manipulam os medicamentos", "https://lh3.googleusercontent.com/a-/ALV-UjV5PvZeyIAvYQ6-bBSDRlm2k90E0Cpq70ZtlfaVV3SRdGD6bBeg=s128-c-rp-mo-br100"],
  ["Rosangela M.A", "Minha experiência nessa farmácia de manipulação é muito boa. Os funcionários são sempre atenciosos,  educados e gentis ao nos atender tanto pessoalmente quanto on line. Quanto a manipulação utilizam fórmulas de inteira confiança.", null],
  ["Maria da Conceição", "Gosto muito de comprar aqui. O atendimento é sempre muito bom!", null],
  ["Daniela Azevedo", "Farmácia Excelente: Atendimento preciso e entrega rápida dos medicamentos.", null],
  ["Eliane Gomes", "Excelência na qualidade das manipulações e atendimento cordial. 👏👏👍", null],
  ["Isabel Baldi", "Sempre fui muito bem atendida, gosto muito dos remédios da Manipulação.", null],
];
(async () => {
  const nomes = new Set(existentes.map((a) => norm(a.nome)));
  const textos = new Set(existentes.map((a) => norm(a.texto).slice(0, 60)));
  const adicionadas = [];
  for (const [nome, texto, foto] of NOVAS) {
    if (nomes.has(norm(nome)) || textos.has(norm(texto).slice(0, 60))) { console.log("já existia:", nome); continue; }
    let fotoUrl = null;
    if (foto) {
      try {
        const r = await fetch(foto); if (!r.ok) throw new Error("HTTP " + r.status);
        const buf = Buffer.from(await r.arrayBuffer());
        const arquivo = `${slug(nome)}.jpg`;
        await sharp(buf).resize(96, 96, { fit: "cover" }).jpeg({ quality: 84 }).toFile(path.join(pasta, arquivo));
        fotoUrl = `/uploads/avaliacoes/${arquivo}`;
      } catch (e) { console.log("sem foto:", nome, String(e.message)); }
    }
    adicionadas.push({ nome, texto, fotoUrl });
  }
  const todas = [...existentes, ...adicionadas];
  const cabecalho = `// Avaliações REAIS do Google (Viver Bem - Farmácia de Manipulação).
// Gerado por scripts/baixar-avaliacoes.js — não edite à mão.
// Todas com nota 5. As fotos ficam em public/uploads/avaliacoes/.
// 11/10/2026: ${adicionadas.length} avaliações novas (as mais recentes do perfil)
// juntadas pelo script juntar-avaliacoes.js, para a página /avaliacoes.
`;
  fs.writeFileSync(lista, cabecalho + "module.exports = " + JSON.stringify(todas, null, 2) + ";\n");
  console.log(`total ${todas.length} (novas ${adicionadas.length}, com foto ${todas.filter((a) => a.fotoUrl).length})`);
})().catch((e) => { console.error(e); process.exit(1); });
