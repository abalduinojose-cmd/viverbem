// As seções da home que o painel liga e desliga ("subir a seção no site
// ou não", pedido de 07/10/2026). Este arquivo não toca no banco, para o
// componente do painel (cliente) e a home (servidor) lerem a mesma lista;
// quem lê e grava a escolha é src/lib/configuracao.ts.
//
// A dobra e as vantagens não entram: sem elas a página não se sustenta.
// A ordem aqui é a ordem da página.

export const SECOES_HOME = [
  {
    chave: "categorias",
    titulo: "Nossas categorias",
    texto: "Os círculos das áreas, logo abaixo da dobra.",
  },
  {
    chave: "maisProcurados",
    titulo: "Mais procurados",
    texto: "A primeira faixa de produtos, com os que têm foto.",
  },
  {
    chave: "vitrinesAreas",
    titulo: "Faixas por área",
    texto: "Uma faixa por categoria com fotos. Cada área também tem a própria chave em Categorias.",
  },
  {
    chave: "prontaEntrega",
    titulo: "Pronta entrega",
    texto: "Os industrializados com registro, quando houver algum no site.",
  },
  {
    chave: "comoFunciona",
    titulo: "Como funciona",
    texto: "Os quatro passos do pedido pela receita.",
  },
  {
    chave: "bannerMulher",
    titulo: "Saúde da Mulher",
    texto: "A animação com os potes da linha feminina e a faixa com os produtos da linha.",
  },
  {
    chave: "reels",
    titulo: "Por dentro da Viver Bem",
    texto: "Os vídeos do Instagram.",
  },
  {
    chave: "avaliacoes",
    titulo: "O que dizem sobre a gente",
    texto: "As avaliações do Google.",
  },
  {
    chave: "bannerHistoria",
    titulo: "Banner da história (só no celular)",
    texto: "Depois das avaliações: a foto da equipe com \"20 anos construindo cuidado\", levando para A Viver Bem.",
  },
] as const;

export type ChaveSecao = (typeof SECOES_HOME)[number]["chave"];
export type SecoesHome = Record<ChaveSecao, boolean>;

/** Tudo ligado: é como o site nasce. */
export const SECOES_PADRAO: SecoesHome = Object.fromEntries(
  SECOES_HOME.map((s) => [s.chave, true])
) as SecoesHome;

/** Completa o que veio do banco com o padrão (chave nova entra ligada). */
export function normalizarSecoes(valor: unknown): SecoesHome {
  const lido = (valor && typeof valor === "object" ? valor : {}) as Record<string, unknown>;
  const resultado = { ...SECOES_PADRAO };
  for (const s of SECOES_HOME) {
    if (typeof lido[s.chave] === "boolean") resultado[s.chave] = lido[s.chave] as boolean;
  }
  return resultado;
}
