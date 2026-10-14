// Os banners do site que o painel pode trocar por foto, GIF ou vídeo
// (14/10/2026, "coloque banners, a pessoa pode alterar por fotos, vídeos
// ou GIFs, e quero isso para todos os banners do site"). Este arquivo não
// toca no banco: o painel (cliente) e o site (servidor) leem a mesma
// lista; quem lê e grava é src/lib/configuracao.ts, na chave "banners".
//
// Cada banner tem a mídia do computador e, quando faz sentido, a do
// celular. Um GIF é só uma imagem animada: entra como imagem. Vídeo entra
// sem som, em laço, como fundo.

export type TipoMidia = "imagem" | "video";
export type Midia = { url: string; tipo: TipoMidia };
export type BannerMidia = { desktop: Midia | null; celular: Midia | null };
export type Banners = Record<string, BannerMidia>;

export type DefinicaoBanner = {
  chave: string;
  titulo: string;
  texto: string;
  /** Tem versão própria para o celular? */
  celular: boolean;
  /** Proporções do palco no painel (CSS aspect-ratio) e as medidas sugeridas */
  proporcaoDesktop: string;
  medidaDesktop: string;
  proporcaoCelular?: string;
  medidaCelular?: string;
  /** Aceita vídeo (a dobra e os banners grandes); os cartões das faixas, só imagem */
  video: boolean;
};

export const BANNERS_FIXOS: DefinicaoBanner[] = [
  {
    chave: "dobra-1",
    titulo: "Dobra, arte 1",
    texto: "A abertura do site. Com uma arte, a dobra vira a mídia inteira com só os três botões por cima; com duas, alterna. Sem nenhuma, mostra o texto e os potes.",
    celular: true,
    proporcaoDesktop: "1920 / 760",
    medidaDesktop: "1920 × 760 px",
    proporcaoCelular: "1080 / 1350",
    medidaCelular: "1080 × 1350 px",
    video: true,
  },
  {
    chave: "dobra-2",
    titulo: "Dobra, arte 2",
    texto: "A segunda arte da abertura: com ela a dobra alterna entre as duas.",
    celular: true,
    proporcaoDesktop: "1920 / 760",
    medidaDesktop: "1920 × 760 px",
    proporcaoCelular: "1080 / 1350",
    medidaCelular: "1080 × 1350 px",
    video: true,
  },
  {
    chave: "saude-mulher",
    titulo: "Saúde da Mulher",
    texto: "Entra no lugar da animação dos potes, com o convite \"Ver a linha\" por cima.",
    celular: true,
    proporcaoDesktop: "1920 / 760",
    medidaDesktop: "1920 × 760 px",
    proporcaoCelular: "1080 / 1560",
    medidaCelular: "1080 × 1560 px",
    video: true,
  },
  {
    chave: "mais-procurados",
    titulo: "Faixa Mais procurados",
    texto: "O cartão no fim da faixa, atrás do texto \"Cada fórmula sai com o seu nome no rótulo\".",
    celular: false,
    proporcaoDesktop: "4 / 5",
    medidaDesktop: "800 × 1000 px",
    video: false,
  },
  {
    chave: "historia",
    titulo: "Banner da história (celular)",
    texto: "A foto atrás do \"20 anos construindo cuidado\", depois das avaliações.",
    celular: false,
    proporcaoDesktop: "4 / 5",
    medidaDesktop: "1200 × 1500 px",
    video: false,
  },
];

/** A chave do banner no fim da faixa de uma área */
export const chaveBannerVitrine = (slug: string) => `vitrine-${slug}`;

export function definicaoBannerVitrine(categoria: { nome: string; slug: string }): DefinicaoBanner {
  return {
    chave: chaveBannerVitrine(categoria.slug),
    titulo: `Faixa ${categoria.nome}`,
    texto: "O cartão no fim da faixa da área, atrás do título dela.",
    celular: false,
    proporcaoDesktop: "4 / 5",
    medidaDesktop: "800 × 1000 px",
    video: false,
  };
}

const CHAVES_FIXAS = new Set(BANNERS_FIXOS.map((b) => b.chave));

/** A chave é de um banner conhecido? (as faixas valem para qualquer slug) */
export function chaveBannerValida(chave: string, slugsDeCategoria: string[]): boolean {
  if (CHAVES_FIXAS.has(chave)) return true;
  return slugsDeCategoria.some((s) => chaveBannerVitrine(s) === chave);
}

export function definicaoDoBanner(chave: string, categorias: { nome: string; slug: string }[]): DefinicaoBanner | null {
  const fixo = BANNERS_FIXOS.find((b) => b.chave === chave);
  if (fixo) return fixo;
  const c = categorias.find((x) => chaveBannerVitrine(x.slug) === chave);
  return c ? definicaoBannerVitrine(c) : null;
}

function normalizarMidia(valor: unknown): Midia | null {
  if (!valor || typeof valor !== "object") return null;
  const v = valor as Record<string, unknown>;
  if (typeof v.url !== "string" || !v.url) return null;
  return { url: v.url, tipo: v.tipo === "video" ? "video" : "imagem" };
}

/** O que veio do banco, conferido campo a campo */
export function normalizarBanners(valor: unknown): Banners {
  const resultado: Banners = {};
  if (!valor || typeof valor !== "object") return resultado;
  for (const [chave, b] of Object.entries(valor as Record<string, unknown>)) {
    if (!b || typeof b !== "object") continue;
    const lido = b as Record<string, unknown>;
    const desktop = normalizarMidia(lido.desktop);
    const celular = normalizarMidia(lido.celular);
    if (desktop || celular) resultado[chave] = { desktop, celular };
  }
  return resultado;
}

/** A extensão diz se é vídeo (para mídias antigas sem o tipo gravado) */
export function tipoPelaUrl(url: string): TipoMidia {
  return /\.(mp4|webm)(\?|$)/i.test(url) ? "video" : "imagem";
}
