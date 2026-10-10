// Gera a VITRINE ESTÁTICA do site para o GitHub Pages.
//
// O GitHub Pages só serve arquivos estáticos, então esta versão:
//   - inclui o site do cliente (home, categorias, produtos, sobre,
//     lojas, contato e o pedido que fecha no WhatsApp)
//   - inclui o PAINEL em modo demonstração (10/10/2026, "só para a cliente
//     visualizar"): login pelo navegador, dados do retrato, nada é gravado
//     (ver src/lib/adminDemo.ts e src/components/admin/ModoDemo.tsx)
//   - deixa de fora as rotas de API (precisam de servidor)
//   - congela os produtos num JSON gerado a partir do banco atual; os
//     pedidos do painel são FICTÍCIOS, gerados aqui (dado de cliente de
//     verdade não vai para um site público)
//
// Uso:  npm run demo:build   -> gera a pasta docs/, que o Pages publica
//       (repositório abalduinojose-cmd/viverbem, branch main, /docs;
//        a primeira versão segue em app_viverbem-)
//
// PARE o `npm run dev` antes: os dois disputam a pasta .next.
// O projeto volta ao estado original no final, mesmo se der erro.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { espelharPrefetch } = require("./espelhar-prefetch");

const raiz = path.join(__dirname, "..");
const guardados = path.join(raiz, ".demo-temp");
const saidaNext = path.join(raiz, "out");
const publicada = path.join(raiz, "docs");

// Arquivos/pastas que saem do build estático (dependem de servidor)
const EXCLUIR = [
  path.join("src", "app", "api"),
  // redirecionamento não funciona em site estático
  path.join("src", "app", "catalogo"),
  // a prévia não deve ser indexada: vai um robots.txt fixo no lugar
  path.join("src", "app", "robots.ts"),
  path.join("src", "app", "sitemap.ts"),
];

// Páginas cuja renderização dinâmica precisa ser desligada no estático
const ADMIN = path.join("src", "app", "admin", "(protegido)");
const PAGINAS_DINAMICAS = [
  path.join("src", "app", "(site)", "page.tsx"),
  path.join("src", "app", "(site)", "produtos", "page.tsx"),
  path.join("src", "app", "(site)", "produtos", "[categoria]", "page.tsx"),
  path.join("src", "app", "(site)", "sobre", "page.tsx"),
  path.join("src", "app", "(site)", "produto", "[slug]", "page.tsx"),
  // o painel em modo demonstração
  path.join(ADMIN, "painel", "page.tsx"),
  path.join(ADMIN, "produtos", "page.tsx"),
  path.join(ADMIN, "produtos", "novo", "page.tsx"),
  path.join(ADMIN, "produtos", "[id]", "editar", "page.tsx"),
  path.join(ADMIN, "categorias", "page.tsx"),
  path.join(ADMIN, "clientes", "page.tsx"),
  path.join(ADMIN, "usuarios", "page.tsx"),
  path.join(ADMIN, "log", "page.tsx"),
  path.join(ADMIN, "site", "page.tsx"),
];

// ---------------------------------------------------------------- pedidos fictícios
// Pedidos de demonstração para o painel da prévia: nomes inventados, o
// WhatsApp mascarado e os itens tirados do catálogo real. Sempre os mesmos
// (gerador com semente fixa), espalhados pelos últimos 48 dias para os
// números do mês e os gráficos terem o que mostrar.
const NOMES_DEMO = [
  "Ana Paula", "Carlos Eduardo", "Fernanda", "João Pedro", "Mariana", "Ricardo", "Luciana",
  "Paulo Henrique", "Beatriz", "Rafael", "Juliana", "Marcelo", "Camila", "André", "Patrícia",
  "Gustavo", "Renata", "Felipe", "Simone", "Thiago", "Larissa", "Eduardo",
];
const SOBRENOMES_DEMO = ["S.", "M.", "R.", "A.", "C.", "L.", "P.", "F."];
const LOJAS_DEMO = [
  "Centro, Rua Dom Pedro Segundo, 31, Loja 37",
  "Corrêas, Rua Dr. Agostinho Goulão, 22",
  "Posse, Estrada União e Indústria, 33.383",
];
const BAIRROS_DEMO = ["Valparaíso", "Itaipava", "Bingen", "Quitandinha", "Mosela", "Nogueira", "Cascatinha"];

function gerarPedidosFicticios(produtos) {
  let semente = 20261010;
  const rnd = () => {
    semente = (semente * 1103515245 + 12345) % 2147483648;
    return semente / 2147483648;
  };
  const sorteio = (lista) => lista[Math.floor(rnd() * lista.length)];
  const comPreco = produtos.filter(
    (p) => p.venda === "INDUSTRIALIZADO" && p.precoCentavos > 0 && p.ativo && p.aprovado
  );
  const agora = Date.now();
  const pedidos = [];
  for (let i = 0; i < NOMES_DEMO.length; i++) {
    const diasAtras = Math.floor(rnd() * 48);
    const data = new Date(agora - diasAtras * 86400000 - Math.floor(rnd() * 36000000));
    const receita = rnd() < 0.55;
    const itens = [];
    if (comPreco.length > 0 && (!receita || rnd() < 0.4)) {
      const quantos = 1 + Math.floor(rnd() * 2);
      for (let k = 0; k < quantos; k++) {
        const p = sorteio(comPreco);
        itens.push({ nome: p.nome, dosagem: null, quantidade: 1 + Math.floor(rnd() * 2), precoCentavos: p.precoCentavos });
      }
    }
    const total = itens.reduce((s, it) => s + it.quantidade * it.precoCentavos, 0);
    const retirada = rnd() < 0.5;
    pedidos.push({
      id: i + 1,
      nome: `${NOMES_DEMO[i]} ${sorteio(SOBRENOMES_DEMO)}`,
      whatsapp: `(24) 9****-${String(1000 + Math.floor(rnd() * 9000))}`,
      pagamento: "",
      entrega: retirada ? "Retirada na loja" : "Entrega em casa",
      local: retirada ? sorteio(LOJAS_DEMO) : `${sorteio(BAIRROS_DEMO)}, Petrópolis`,
      receita,
      codigo: `VB-${String(1200 + i * 7).padStart(4, "0")}`,
      totalCentavos: total,
      itens: JSON.stringify(itens),
      criadoEm: data.toISOString(),
    });
  }
  return pedidos.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}
// (a home também lê o banco em obterSecoesHome/obterArteHero: em DEMO as
// duas funções caem no retrato, então a página fica estática)

const LINHA_DINAMICA = 'export const dynamic = "force-dynamic";';

function log(msg) {
  console.log(`[demo] ${msg}`);
}

/** Lê o banco atual e grava o retrato usado pela vitrine. Entra só o que
 *  apareceria no site de verdade: ativo, publicado pelo gestor e sem combo. */
async function gerarRetrato() {
  const { PrismaClient } = require("@prisma/client");
  const db = new PrismaClient();
  try {
    // (registrosLog, e não "log": o nome log é da função que imprime o progresso)
    const [categorias, produtosTodos, avaliacoes, configuracoes, usuarios, registrosLog] = await Promise.all([
      db.categoria.findMany({ orderBy: { ordem: "asc" }, include: { _count: { select: { produtos: true } } } }),
      // O catálogo inteiro: o painel da prévia mostra também o que está
      // escondido ou aguardando publicação; o site filtra logo abaixo
      db.produto.findMany({
        orderBy: [{ ordem: "asc" }, { nome: "asc" }],
        include: { categoria: { select: { nome: true } }, fotos: { orderBy: { ordem: "asc" } } },
      }),
      db.depoimento.findMany({ where: { ativo: true }, orderBy: { ordem: "asc" } }),
      db.configuracao.findMany(),
      db.usuario.findMany({ orderBy: [{ ativo: "desc" }, { papel: "asc" }, { nome: "asc" }] }),
      db.logAlteracao.findMany({ orderBy: { criadoEm: "desc" }, take: 60 }),
    ]);

    // Os ajustes do painel (seções da home, arte da dobra), lidos do JSON
    const configuracao = {};
    for (const c of configuracoes) {
      try {
        configuracao[c.chave] = JSON.parse(c.valor);
      } catch {
        /* valor inválido: fica o padrão */
      }
    }

    const mapearCategoria = (c) => ({
      id: c.id,
      nome: c.nome,
      slug: c.slug,
      ordem: c.ordem,
      visivel: c.visivel,
      vitrineHome: c.vitrineHome,
    });
    const mapearProduto = (p) => ({
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      descricao: p.descricao,
      precoCentavos: p.precoCentavos,
      tipo: p.tipo,
      venda: p.venda,
      aprovado: p.aprovado,
      fotoUrl: p.fotos[0]?.url ?? p.fotoUrl,
      fotos: p.fotos.length > 0 ? p.fotos.map((f) => f.url) : p.fotoUrl ? [p.fotoUrl] : [],
      mostrarPreco: p.mostrarPreco,
      ativo: p.ativo,
      novidade: p.novidade,
      destaque: p.destaque,
      ordem: p.ordem,
      categoriaId: p.categoriaId,
      categoriaNome: p.categoria?.nome ?? null,
      dosagens: p.dosagens,
      composicao: p.composicao,
      modoUso: p.modoUso,
      indicacoes: p.indicacoes,
      apresentacao: p.apresentacao,
    });
    const todos = produtosTodos.map(mapearProduto);
    // O site só mostra o que está ativo, publicado pelo gestor e não é combo
    const produtos = todos.filter((p) => p.ativo && p.aprovado && p.tipo !== "COMBO");

    const retrato = {
      catalogo: {
        categorias: categorias.map(mapearCategoria),
        produtos,
      },
      // O painel da prévia (ver src/lib/adminDemo.ts)
      admin: {
        produtos: todos,
        categorias: categorias.map((c) => ({ ...mapearCategoria(c), totalProdutos: c._count.produtos })),
        usuarios: usuarios.map((u) => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          papel: u.papel,
          ativo: u.ativo,
          ultimoAcesso: u.ultimoAcesso ? u.ultimoAcesso.toISOString() : null,
          criadoEm: u.criadoEm.toISOString(),
        })),
        log: registrosLog.map((r) => ({
          id: r.id,
          usuario: r.usuario,
          acao: r.acao,
          detalhe: r.detalhe,
          criadoEm: r.criadoEm.toISOString(),
        })),
        pedidos: gerarPedidosFicticios(todos),
      },
      avaliacoes: avaliacoes
        .filter((a) => a.fotoUrl)
        .map((a) => ({
          id: a.id,
          nome: a.nome,
          texto: a.texto,
          nota: a.nota,
          fonte: a.fonte,
          fotoUrl: a.fotoUrl,
          ativo: a.ativo,
          ordem: a.ordem,
        })),
      configuracao: {
        secoesHome: configuracao.secoesHome ?? null,
        heroDesktop: configuracao.heroDesktop ?? null,
        heroCelular: configuracao.heroCelular ?? null,
        heroDesktop2: configuracao.heroDesktop2 ?? null,
        heroCelular2: configuracao.heroCelular2 ?? null,
      },
    };

    fs.writeFileSync(
      path.join(raiz, "src", "lib", "dados-demo.json"),
      JSON.stringify(retrato, null, 2) + "\n"
    );
    log(
      `retrato gerado: ${retrato.catalogo.produtos.length} produtos, ` +
        `${retrato.catalogo.categorias.length} categorias, ` +
        `${retrato.avaliacoes.length} avaliações`
    );
  } finally {
    await db.$disconnect();
  }
}

/** Tira do caminho as pastas que não vão para o estático. */
function guardarExcluidos() {
  fs.mkdirSync(guardados, { recursive: true });
  for (const alvo of EXCLUIR) {
    const origem = path.join(raiz, alvo);
    if (!fs.existsSync(origem)) continue;
    const destino = path.join(guardados, alvo.replace(/[\\/]/g, "__"));
    fs.renameSync(origem, destino);
    log(`fora do build: ${alvo}`);
  }
}

function devolverExcluidos() {
  if (!fs.existsSync(guardados)) return;
  for (const alvo of EXCLUIR) {
    const destino = path.join(guardados, alvo.replace(/[\\/]/g, "__"));
    if (!fs.existsSync(destino)) continue;
    const origem = path.join(raiz, alvo);
    fs.mkdirSync(path.dirname(origem), { recursive: true });
    fs.renameSync(destino, origem);
  }
  fs.rmSync(guardados, { recursive: true, force: true });
  log("pastas do servidor devolvidas");
}

/** Comenta a linha de renderização dinâmica (incompatível com export). */
function patchPaginas(ativar) {
  for (const rel of PAGINAS_DINAMICAS) {
    const arquivo = path.join(raiz, rel);
    if (!fs.existsSync(arquivo)) continue;
    let texto = fs.readFileSync(arquivo, "utf8");
    if (ativar) {
      texto = texto.replace(LINHA_DINAMICA, `// ${LINHA_DINAMICA}`);
    } else {
      texto = texto.replace(`// ${LINHA_DINAMICA}`, LINHA_DINAMICA);
    }
    fs.writeFileSync(arquivo, texto);
  }
}

/** Move o export para docs/, que é a pasta que o Pages publica. A pasta é
 *  recriada inteira a cada build: nada além da vitrine deve morar nela. */
function publicarEmDocs() {
  fs.rmSync(publicada, { recursive: true, force: true });
  fs.renameSync(saidaNext, publicada);
  // O Pages ignora pastas que começam com "_" (como _next/) sem este arquivo
  fs.writeFileSync(path.join(publicada, ".nojekyll"), "");
  log(`pré-carregamento espelhado: ${espelharPrefetch(publicada)} arquivos`);
  // Prévia fora do Google, para não competir com o domínio definitivo
  fs.writeFileSync(path.join(publicada, "robots.txt"), "User-agent: *\nDisallow: /\n");
}

async function main() {
  await gerarRetrato();

  try {
    guardarExcluidos();
    patchPaginas(true);

    // Os tipos de rota gerados pelo dev server ainda citam /admin e /api;
    // sem limpar, o type-check quebra ao construir sem essas pastas.
    for (const cache of ["dev/types", "types"]) {
      const alvo = path.join(raiz, ".next", cache);
      if (fs.existsSync(alvo)) {
        fs.rmSync(alvo, { recursive: true, force: true });
        log(`cache de tipos limpo: .next/${cache}`);
      }
    }

    fs.rmSync(saidaNext, { recursive: true, force: true });
    log("compilando a vitrine estática...");
    execSync("npx next build", {
      cwd: raiz,
      stdio: "inherit",
      env: { ...process.env, DEMO: "1" },
    });

    publicarEmDocs();
    log("pronto! vitrine gerada em docs/");
  } finally {
    patchPaginas(false);
    devolverExcluidos();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
