// Baixa as fotos dos clientes que avaliaram a Viver Bem no Google e
// grava prisma/avaliacoes-google.js, que o seed importa.
//
// Os textos abaixo são as avaliações REAIS do perfil do Google
// (Viver Bem - Farmácia de Manipulação, 634 avaliações, nota 5,0),
// copiados sem alteração. As fotos são as do próprio perfil de cada
// pessoa, salvas em public/uploads/avaliacoes/ para o site não
// depender dos servidores do Google.
//
// Para atualizar: rode o scraper de novo e ajuste a lista.
//
// Quem não tem foto no Google aparece com o avatar padrão (um círculo de
// uma cor só com a inicial). Isso não é foto: o arquivo é descartado e a
// avaliação fica sem foto, então não entra no site (pedido de 05/10/2026,
// "só as avaliações com fotos").
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const AVALIACOES = [
  {
    nome: "Edilene Lima",
    texto:
      "Minha experiência com a Farmácia Viver Bem é sempre maravilhosa e satisfatória. A Farmácia oferece produtos de qualidade e o atendimento também não fica de fora. As meninas são muitíssimo simpáticas e atenciosas. O atendimento é rápido tanto presencialmente quanto on-line. EU RECOMENDO",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocKYosuAa1SOUom4ZVxQan7gVQG2X1ml51CV6skPKEd2AWttLQ=s128-c-rp-mo-br100",
  },
  {
    nome: "Karoll Carboni",
    texto:
      "Compro manipulados para meu filhos autista, há bastante tempo e Indico de olhos fechados. Sinto total segurança na procedência das matérias-primas e no controle de qualidade. Transmite seriedade e respeito à saúde do cliente em cada detalhe. Atendimento humanizado e ágil.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjWNfGiIOSWqe1XQCqjHuyAbCUTzJr_Rnag7zkdnlERgAYmO5fVuLg=s128-c-rp-mo-br100",
  },
  {
    nome: "Viviane Sutter",
    texto:
      "Farmácia de minha inteira confiança, eu e minha família somos clientes a muitos anos. Além de preços acessíveis a qualidade é indiscutível. Estou cursando nutrição período 4/8 e quando estiver formada, essa será minha indicação também para meus futuros pacientes.",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocLovfD1ZWcHyBZz3NULsu9Mo6GAz6bHonkia91nkhNOVB2fAw=s128-c-rp-mo-br100",
  },
  {
    nome: "Bianca Borsato",
    texto:
      "Sempre muito bem atendida, o preço é o mais acessivel da cidade. Todas as minhas dúvidas são respondidas em prontidão. O atendimento via WhatsApp é bem rápido.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjWOx2bTx-6CDtu4gLQm_sBJCHXyQYZboQue2V4DaUMEb9V60XNC=s128-c-rp-mo-br100",
  },
  {
    nome: "Sonia Lacerda",
    texto:
      "Já sou cliente da Viver Bem há muitos anos. Sempre fui muito bem atendida e a qualidade dos produtos é excelente. Há um profissionalismo enorme nessa empresa.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjUmvbTKz6mX8FgEkOjKulm3dsNCC2UdqpbMhZReT1dcQHlicns6Tw=s128-c-rp-mo-br100",
  },
  {
    nome: "Aparecida Prendim",
    texto:
      "Parabéns ao atendimento, tanto presencial quanto no ZAP. Isso faz toda diferença. Tanto que voltei a procurar novos produtos que estava precisando. Agora já sei onde encontrar. Não só para mim, mas já indiquei pra outras pessoas.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjUI7LQV5BZT6zTBj8GSO6qpkmgab_55Cp9cc-5NVp26pLMz47KW=s256-c-rp-mo-ba12-br100",
  },
  {
    nome: "Jane Mary Lima",
    texto:
      "Os atendimentos na farmácia Viver Bem é impecável! As meninas são muito solícitas e simpáticas, tanto pessoalmente quanto por WhatsApp! E os produtos e medicamentos são ótimos! Parabéns!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjW3rb-7ZOmTXyrnrn7mjjBIVh67ah-X_SMwye86zrGi-_yU7CsmUg=s128-c-rp-mo-br100",
  },
  {
    nome: "Ana Carolina Cunha",
    texto:
      "Uso as medicações da Viver Bem desde sempre, ótimo custo benefício e realmente cumprem o que promete! Valem muito a pena e sempre recebo um atendimento ótimo!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjW_nSdL6UnNbdIxL1gcUGld1NbMPyq_A0qO10qYOT3th4R7lzY=s128-c-rp-mo-br100",
  },
  {
    nome: "Shirley Torres",
    texto:
      "Atendimento pelo WhatsApp maravilhoso, sempre muito atenciosos e ágeis, produtos excelentes e acessíveis. Parabéns a toda equipe.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjWSBO4FywctR55PPAfKEntPDpODy2SnwZ4UWc856IqTZGcrsRnAXQ=s256-c-rp-mo-ba12-br100",
  },
  {
    nome: "Mariane Ignacio",
    texto:
      "Excelente atendimento por WhatsApp, com praticidade e agilidade. Preços ótimos e os medicamentos ficam prontos em um curto período de tempo, o que é ótimo!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjWL8AwY2RomcmSUJFCabX5hr9F53lL9_XftKJhVUg1cVfw-vvrh=s128-c-rp-mo-br100",
  },
  {
    nome: "Hilda Lorão",
    texto:
      "A equipe que tem feito atendimento são bons profissionais e adequados, principalmente ao lidar com pessoas da terceira idade. Parabenizo a todos.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjVLbQHEl5X5cp6PWtaRrbFjRCTmfjyYsvluBdQWemufmAIy4Ny9eg=s128-c-rp-mo-br100",
  },
  {
    nome: "Raquel Monteiro Florentino",
    texto:
      "O atendimento é sempre excelente e descobri que tenho desconto pela minha prescritora, foi ótimo. Gratidão pelo cuidado!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjUBPQKjh7jVSzVEkH2bvPOixlRgO41G4K30USOQRPw4zqrEAM7LlA=s128-c-rp-mo-br100",
  },
  {
    nome: "Matheus Rizzo de Almeida",
    texto:
      "Recomendo fortemente. Bons preços, conseguem agilizar o atendimento via WhatsApp e costumam ter compostos que alguns outros laboratórios não tem.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjUjowbiKI0b59kQM5W-HNNsJ-zshOFp003cbCNe3X595RMgWdRl=s128-c-rp-mo-br100",
  },
  {
    nome: "Marcia Teixeira",
    texto:
      "Ótima, atendimento gentil e rapidez no processo da fabricação de medicamentos. Ambiente limpo, higienizado e muito bem decorado. Parabéns!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjXqZmOaTd4_YPqxe4vA1tyynbll1iGSXF7W9BWKZYne_A9_bOQYuw=s256-c-rp-mo-ba12-br100",
  },
  {
    nome: "Flavia Figueiredo",
    texto:
      "O atendimento é excelente, os produtos são de extrema qualidade, a melhor em valores também! Super indico.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjWcrf9z13VwqmjZQ0cK6F0CftJO9Reu6xpSKFG242iNkK42OuiX=s128-c-rp-mo-br100",
  },
  {
    nome: "Regina Célia Gravano de Souza",
    texto:
      "Ótimo atendimento. Paciente e esclarecedor. Tira todas as suas dúvidas. Sou cliente e recomendo.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjVLH3LNgemef-KgXALcubAJKofRV45EbDfTCPTb-r5QMqT8jFw2=s128-c-rp-mo-br100",
  },
  {
    nome: "Jane Loureiro",
    texto:
      "Déborah como sempre tira todas as minhas dúvidas e me ajudou nas minhas escolhas. Muita paciência e extremamente atenciosa.",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocJ_ewBq2iXEVd9y3U5hUXiDeqqH-HmkIe9LOEeg0oAuBBEx=s128-c-rp-mo-br100",
  },
  {
    nome: "Bruna Oliveira",
    texto:
      "Excelente farmácia, atendentes espetacular e produtos sensacionais, tudo muito feito com carinho e dedicação.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjXN5XlUZOQjB-UWG_Kc3xyxcEo2IZcYNWFDh1-9d44G4es-mn0=s128-c-rp-mo-br100",
  },
  {
    nome: "Claudia de F. Campos Morelli",
    texto:
      "Atendimento muito bom. Ótimos produtos e entrega rápida e segura. Super indico.",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocLcVshLQE6TXc7KSrcjrvgzxtSpnwLSg0LLFf0jWO9bx6JIq4o=s128-c-rp-mo-br100",
  },
  {
    nome: "Andrea Amorim",
    texto:
      "Pronto atendimento. Que simpática! Facilidade em encomendar o produto. Melhor preço pesquisado.",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocJx5rw8GbJm_Am-ur6szNxBJYBaB204KDllBlAkNo8KZrXINA=s128-c-rp-mo-br100",
  },
  {
    nome: "Ana Maria",
    texto: "Já sou cliente muitos anos. Gosto muito do atendimento. Todos muitos simpáticos.",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocLBHAnEu0wx6JZhVQZ20Peu94izL-zTVjGo27grp9gm-7illw=s256-c-rp-mo-ba12-br100",
  },
  {
    nome: "Sahara Raposo",
    texto:
      "Atendimento excelente, super recomendo! Produtos de ótima qualidade, com preços maravilhosos.",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocLqpnfUFvy-4W8gLe9IKOHFmt4ICv5ChpgCI5L5f4P6BoCa3A=s128-c-rp-mo-br100",
  },
  {
    nome: "Tânia Falch",
    texto: "Ótimo atendimento, bom preço e entrega rápida. Super indico!",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocLDQXYDHrlvybNmgiwNdEJiT0nKRz9ANxg6Xwlo-DxbX-ASgItk=s128-c-rp-mo-br100",
  },
  {
    nome: "João Luis",
    texto:
      "A atendente Olivia foi bastante atenciosa, buscando resolver minha necessidade de maneira objetiva e rápida. Obrigado!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjUV6OA2Z63bakrJ2CkpRvw95E3TzOBJIDwNr1O0B53h8UOOHMQ6uQ=s128-c-rp-mo-br100",
  },
  {
    nome: "Shirlei Mayworm",
    texto:
      "Ótimo atendimento, entrega rápida. Produtos de qualidade. Minha preferida!",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjXDqtX7MYQrj3wRxZXFC8_rLwvpfaHGODGNlBONR6cJB-NwmHVSSA=s128-c-rp-mo-br100",
  },
  {
    nome: "Andresa Neumann",
    texto:
      "A atendente foi muito solícita e respondeu bem rápido. Os produtos são de ótima qualidade.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjVx9CVowHRBApFzxFi6NcWExeJNSbXFIAe1Wx-nub-WWh8RItJD=s128-c-rp-mo-br100",
  },
  {
    nome: "Marcela A Kuster",
    texto:
      "Atendimento excelente! Preço e prazo de entrega justos.",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjVbfgV73kWZYMTdLBNOXbbi1LoXySBBIEkyG7q_Nl0jh7QMrHY93w=s128-c-rp-mo-br100",
  },
];

const DESTINO = path.join(process.cwd(), "public", "uploads", "avaliacoes");

// Nome de arquivo previsível a partir do nome da pessoa
function apelido(nome) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function baixar(url, destino) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const bytes = Buffer.from(await resposta.arrayBuffer());
  fs.writeFileSync(destino, bytes);
  return bytes.length;
}

/** Avatar padrão do Google: uma cor cobre a maior parte da imagem. Nas
 *  fotos de 05/10/2026 a cor dominante cobria até 47%; nos avatares de
 *  letra, de 65% a 71%. O corte fica em 60%. */
async function ehAvatarDeLetra(arquivo) {
  const { data, info } = await sharp(arquivo)
    .resize(64, 64, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const contagem = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    // 8 faixas por canal, para juntar tons quase iguais
    const cor = (data[i] >> 5) * 64 + (data[i + 1] >> 5) * 8 + (data[i + 2] >> 5);
    contagem.set(cor, (contagem.get(cor) || 0) + 1);
  }
  return Math.max(...contagem.values()) / (info.width * info.height) >= 0.6;
}

async function principal() {
  fs.mkdirSync(DESTINO, { recursive: true });
  const prontas = [];

  for (const a of AVALIACOES) {
    const arquivo = `${apelido(a.nome)}.jpg`;
    try {
      const destino = path.join(DESTINO, arquivo);
      const tamanho = await baixar(a.foto, destino);
      if (await ehAvatarDeLetra(destino)) {
        fs.unlinkSync(destino);
        console.log(`sem foto ${arquivo} (avatar de letra do Google)`);
        prontas.push({ nome: a.nome, texto: a.texto, fotoUrl: null });
        continue;
      }
      console.log(`ok   ${arquivo} (${(tamanho / 1024).toFixed(1)} kB)`);
      prontas.push({ nome: a.nome, texto: a.texto, fotoUrl: `/uploads/avaliacoes/${arquivo}` });
    } catch (erro) {
      // Sem foto o site cai na inicial do nome, então não é impeditivo
      console.log(`FALHOU ${arquivo}: ${erro.message}`);
      prontas.push({ nome: a.nome, texto: a.texto, fotoUrl: null });
    }
  }

  const conteudo =
    "// Avaliações REAIS do Google (Viver Bem - Farmácia de Manipulação).\n" +
    "// Gerado por scripts/baixar-avaliacoes.js — não edite à mão.\n" +
    "// Todas com nota 5. As fotos ficam em public/uploads/avaliacoes/.\n" +
    "module.exports = " +
    JSON.stringify(prontas, null, 2) +
    ";\n";
  fs.writeFileSync(path.join(process.cwd(), "prisma", "avaliacoes-google.js"), conteudo, "utf8");

  const comFoto = prontas.filter((p) => p.fotoUrl).length;
  console.log(`\n${prontas.length} avaliações, ${comFoto} com foto.`);
}

principal();
