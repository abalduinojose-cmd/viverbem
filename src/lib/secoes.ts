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

/** A ordem padrão: a da lista acima. */
export const ORDEM_PADRAO: ChaveSecao[] = SECOES_HOME.map((s) => s.chave);

// ---------- Seções extras (26/10/2026, "coloque a opção de adicionar seção") ----------
// Uma seção extra é uma linha de produtos de uma área, no formato de faixa
// (arrasta para o lado, com o banner) ou de bancada (grade de potes). O
// gestor cria quantas quiser pelo painel; elas entram na ordem da home com a
// chave "extra:<id>" e podem ser ligadas, desligadas, movidas e removidas.
export const CHAVE_EXTRAS = "secoesExtras";
export const FORMATOS_EXTRA = ["faixa", "bancada"] as const;
export type FormatoExtra = (typeof FORMATOS_EXTRA)[number];
export interface SecaoExtra {
  id: string;
  categoriaId: number;
  formato: FormatoExtra;
  /** Título opcional; vazio usa o nome da área */
  titulo: string;
  ativa: boolean;
}
export const PREFIXO_EXTRA = "extra:";
export function chaveDaExtra(e: SecaoExtra) {
  return `${PREFIXO_EXTRA}${e.id}`;
}
export function ehChaveExtra(chave: string) {
  return chave.startsWith(PREFIXO_EXTRA);
}
export function ehChaveFixa(chave: string): chave is ChaveSecao {
  return (ORDEM_PADRAO as string[]).includes(chave);
}

/** As extras que vieram do banco: só as bem formadas, sem id repetido, no máximo 12. */
export function normalizarExtras(valor: unknown): SecaoExtra[] {
  if (!Array.isArray(valor)) return [];
  const vistos = new Set<string>();
  const saida: SecaoExtra[] = [];
  for (const v of valor) {
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id.replace(/[^a-z0-9-]/gi, "").slice(0, 24) : "";
    const categoriaId = Number(o.categoriaId);
    const formato = FORMATOS_EXTRA.includes(o.formato as FormatoExtra) ? (o.formato as FormatoExtra) : "faixa";
    if (!id || vistos.has(id) || !Number.isInteger(categoriaId) || categoriaId <= 0) continue;
    vistos.add(id);
    saida.push({
      id,
      categoriaId,
      formato,
      titulo: typeof o.titulo === "string" ? o.titulo.trim().slice(0, 80) : "",
      ativa: o.ativa !== false,
    });
    if (saida.length >= 12) break;
  }
  return saida;
}

/** A ordem das seções que veio do banco (14/10/2026, "a pessoa pode
 *  controlar qual vem primeiro"): só chaves conhecidas (as fixas e as
 *  extras existentes), sem repetição; as que faltarem entram no fim, as
 *  fixas na ordem padrão e as extras na ordem em que foram criadas. */
export function normalizarOrdem(valor: unknown, extras: SecaoExtra[] = []): string[] {
  const chavesExtras = extras.map(chaveDaExtra);
  const conhecidas = new Set<string>([...ORDEM_PADRAO, ...chavesExtras]);
  const resultado: string[] = [];
  if (Array.isArray(valor)) {
    for (const v of valor) {
      if (typeof v === "string" && conhecidas.has(v) && !resultado.includes(v)) resultado.push(v);
    }
  }
  for (const chave of ORDEM_PADRAO) if (!resultado.includes(chave)) resultado.push(chave);
  for (const chave of chavesExtras) if (!resultado.includes(chave)) resultado.push(chave);
  return resultado;
}

/** Completa o que veio do banco com o padrão (chave nova entra ligada). */
export function normalizarSecoes(valor: unknown): SecoesHome {
  const lido = (valor && typeof valor === "object" ? valor : {}) as Record<string, unknown>;
  const resultado = { ...SECOES_PADRAO };
  for (const s of SECOES_HOME) {
    if (typeof lido[s.chave] === "boolean") resultado[s.chave] = lido[s.chave] as boolean;
  }
  return resultado;
}
