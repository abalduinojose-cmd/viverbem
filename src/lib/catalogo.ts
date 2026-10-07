// Consulta do catálogo público, usada por todas as páginas do site
// (home, lista de produtos e página de cada produto).
//
// Em modo DEMO (vitrine estática do GitHub Pages) os dados vêm de um
// "retrato" em JSON, gerado por scripts/gerar-demo.js — assim a vitrine
// funciona sem servidor e sem banco.
import { db } from "@/lib/db";
import {
  CategoriaDTO,
  ProdutoDTO,
  DepoimentoDTO,
  TIPO_COMBO,
  VENDA_MANIPULADO,
  ehIndustrializado,
} from "@/lib/tipos";
import { INCLUIR_PRODUTO, categoriaParaDTO, produtoParaDTO } from "@/lib/produtoDTO";

export interface Catalogo {
  // Só as categorias ligadas no painel ("No site")
  categorias: CategoriaDTO[];
  // Só o que pode aparecer no site: ativo, aprovado pelo gestor, que não
  // seja combo (combo de manipulado é promoção, e promoção de manipulado
  // não pode) e cuja categoria esteja no site. Vem com o nome da categoria.
  produtos: ProdutoDTO[];
}

/** O retrato gravado por scripts/gerar-demo.js para a vitrine estática. */
export interface RetratoDemo {
  catalogo: Catalogo;
  avaliacoes: DepoimentoDTO[];
  configuracao?: {
    secoesHome?: Record<string, boolean>;
    heroDesktop?: string | null;
    heroCelular?: string | null;
  };
}

const EH_DEMO = process.env.DEMO === "1";

/** O que de cada produto pode sair do servidor. Desde 05/10/2026 o site
 *  não mostra preço por padrão (o farmacêutico passa o valor pelo
 *  WhatsApp): o preço só sai quando o painel liga "preço no site" num
 *  industrializado. Fora disso ele nem vai no código da página: se fosse,
 *  apareceria para quem abrisse o código-fonte, mesmo sem estar na tela.
 *  Do manipulado também não saem dosagem, apresentação e indicações. */
function paraVitrine(p: ProdutoDTO): ProdutoDTO {
  if (ehIndustrializado(p)) {
    return p.mostrarPreco ? p : { ...p, precoCentavos: 0 };
  }
  return {
    ...p,
    precoCentavos: 0,
    mostrarPreco: false,
    novidade: false,
    destaque: false,
    dosagens: null,
    composicao: null,
    modoUso: null,
    indicacoes: null,
    apresentacao: null,
  };
}

/** Carrega o retrato estático usado na vitrine de demonstração. */
export async function lerRetratoDemo(): Promise<RetratoDemo> {
  const dados = await import("./dados-demo.json");
  return (dados.default ?? dados) as unknown as RetratoDemo;
}

// Retrato antigo não tem os campos novos: completa com o padrão
function completarCategoria(c: Partial<CategoriaDTO> & { id: number; nome: string; slug: string }): CategoriaDTO {
  return { ordem: 0, visivel: true, vitrineHome: true, ...c };
}
function completarProduto(p: Partial<ProdutoDTO> & { id: number; nome: string; slug: string }): ProdutoDTO {
  const fotoUrl = p.fotoUrl ?? null;
  return {
    descricao: "",
    precoCentavos: 0,
    tipo: "PRODUTO",
    ativo: true,
    novidade: false,
    destaque: false,
    ordem: 0,
    categoriaId: null,
    dosagens: null,
    composicao: null,
    modoUso: null,
    indicacoes: null,
    apresentacao: null,
    ...p,
    venda: p.venda || VENDA_MANIPULADO,
    aprovado: true,
    fotoUrl,
    fotos: p.fotos && p.fotos.length > 0 ? p.fotos : fotoUrl ? [fotoUrl] : [],
    mostrarPreco: p.mostrarPreco === true,
  };
}

export async function obterCatalogo(): Promise<Catalogo> {
  if (EH_DEMO) {
    const { catalogo } = await lerRetratoDemo();
    const categorias = catalogo.categorias.map(completarCategoria).filter((c) => c.visivel);
    const visiveis = new Set(categorias.map((c) => c.id));
    return {
      categorias,
      produtos: catalogo.produtos
        .filter((p) => p.tipo !== TIPO_COMBO)
        .filter((p) => p.categoriaId === null || visiveis.has(p.categoriaId as number))
        .map((p) => paraVitrine(completarProduto(p))),
    };
  }

  const [categorias, produtos] = await Promise.all([
    db.categoria.findMany({ where: { visivel: true }, orderBy: { ordem: "asc" } }),
    db.produto.findMany({
      where: {
        ativo: true,
        aprovado: true,
        NOT: { tipo: TIPO_COMBO },
        // Categoria tirada do site leva os produtos dela junto
        OR: [{ categoriaId: null }, { categoria: { visivel: true } }],
      },
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: INCLUIR_PRODUTO,
    }),
  ]);

  return {
    categorias: categorias.map(categoriaParaDTO),
    produtos: produtos.map((p) => paraVitrine(produtoParaDTO(p))),
  };
}

/** Só as categorias no site, para o menu do cabeçalho (sem carregar produtos). */
export async function obterCategorias(): Promise<CategoriaDTO[]> {
  if (EH_DEMO) {
    return (await lerRetratoDemo()).catalogo.categorias.map(completarCategoria).filter((c) => c.visivel);
  }
  const categorias = await db.categoria.findMany({ where: { visivel: true }, orderBy: { ordem: "asc" } });
  return categorias.map(categoriaParaDTO);
}

/** Avaliações ativas exibidas na home e na página "A Viver Bem". */
// Só entram no site as avaliações COM foto do cliente: um cartão com
// a inicial no lugar do rosto passa impressão de depoimento inventado.
export async function obterAvaliacoes(): Promise<DepoimentoDTO[]> {
  if (EH_DEMO) {
    return (await lerRetratoDemo()).avaliacoes.filter((a) => Boolean(a.fotoUrl));
  }

  const avaliacoes = await db.depoimento.findMany({
    where: { ativo: true, NOT: { fotoUrl: null } },
    orderBy: { ordem: "asc" },
  });

  return avaliacoes.map((a) => ({
    id: a.id,
    nome: a.nome,
    texto: a.texto,
    nota: a.nota,
    fonte: a.fonte,
    fotoUrl: a.fotoUrl,
    ativo: a.ativo,
    ordem: a.ordem,
  }));
}
