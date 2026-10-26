// Ajustes do site feitos pelo painel (tabela Configuracao, chave/valor em
// JSON): quais seções da home aparecem e as artes da dobra enviadas pela
// farmácia (até duas, cada uma com a versão do computador e a do celular;
// com duas, a dobra alterna entre elas). Em modo DEMO (vitrine estática)
// tudo vem do retrato em src/lib/dados-demo.json, gerado por
// scripts/gerar-demo.js.
//
// 14/10/2026: entraram a ordem das seções (secoesOrdem), a foto de cada
// linha dos círculos (linhasFotos) e os banners trocáveis por foto, GIF
// ou vídeo (banners, ver src/lib/banners.ts). Tudo JSON na mesma tabela,
// sem migração.
import { db } from "@/lib/db";
import { lerRetratoDemo } from "@/lib/catalogo";
import { normalizarSecoes, normalizarOrdem, type SecoesHome, CHAVE_EXTRAS, normalizarExtras, type SecaoExtra } from "@/lib/secoes";
import { normalizarBanners, type Banners } from "@/lib/banners";

const EH_DEMO = process.env.DEMO === "1";

export const CHAVE_SECOES = "secoesHome";
export const CHAVE_ORDEM = "secoesOrdem";
export const CHAVE_LINHAS = "linhasFotos";
export const CHAVE_BANNERS = "banners";

/** Lê uma chave do site: no banco, ou, na vitrine estática, no retrato. */
export async function lerConfiguracaoSite<T>(chave: string, padrao: T): Promise<T> {
  if (EH_DEMO) {
    const c = ((await lerRetratoDemo()).configuracao ?? {}) as Record<string, unknown>;
    return (c[chave] ?? padrao) as T;
  }
  return lerConfiguracao(chave, padrao);
}

/** As seções extras da home (26/10/2026): linhas de produtos por área que o gestor criou. */
export async function obterSecoesExtras(): Promise<SecaoExtra[]> {
  return normalizarExtras(await lerConfiguracaoSite<unknown>(CHAVE_EXTRAS, null));
}

/** A ordem das seções da home, fixas e extras (as que faltarem entram no fim). */
export async function obterSecoesOrdem(): Promise<string[]> {
  const extras = await obterSecoesExtras();
  return normalizarOrdem(await lerConfiguracaoSite<unknown>(CHAVE_ORDEM, null), extras);
}

/** A foto de cada linha dos círculos, por slug da categoria. */
export async function obterLinhasFotos(): Promise<Record<string, string>> {
  const lido = await lerConfiguracaoSite<unknown>(CHAVE_LINHAS, null);
  const resultado: Record<string, string> = {};
  if (lido && typeof lido === "object") {
    for (const [slug, url] of Object.entries(lido as Record<string, unknown>)) {
      if (typeof url === "string" && url) resultado[slug] = url;
    }
  }
  return resultado;
}

/** Os banners enviados pelo painel (só os que têm alguma mídia). */
export async function obterBanners(): Promise<Banners> {
  return normalizarBanners(await lerConfiguracaoSite<unknown>(CHAVE_BANNERS, null));
}

/** Quantas artes a dobra aceita (07/10/2026: "duas fotos na home"). */
export const MAX_ARTES_HERO = 2;

/** As chaves de cada arte: a 1ª é heroDesktop/heroCelular, a 2ª heroDesktop2/heroCelular2. */
export function chavesDaArte(indice: number) {
  const sufixo = indice === 0 ? "" : String(indice + 1);
  return { desktop: `heroDesktop${sufixo}`, celular: `heroCelular${sufixo}` };
}

export type ArteConfigurada = { desktop: string | null; celular: string | null };

/** Lê um valor; qualquer problema (chave inexistente, JSON ruim) devolve o padrão. */
export async function lerConfiguracao<T>(chave: string, padrao: T): Promise<T> {
  const registro = await db.configuracao.findUnique({ where: { chave } });
  if (!registro) return padrao;
  try {
    return JSON.parse(registro.valor) as T;
  } catch {
    return padrao;
  }
}

export async function gravarConfiguracao(chave: string, valor: unknown) {
  const texto = JSON.stringify(valor);
  await db.configuracao.upsert({
    where: { chave },
    create: { chave, valor: texto },
    update: { valor: texto },
  });
}

export async function apagarConfiguracao(chave: string) {
  await db.configuracao.deleteMany({ where: { chave } });
}

/** Quais seções da home estão ligadas (chave nova entra ligada). */
export async function obterSecoesHome(): Promise<SecoesHome> {
  if (EH_DEMO) {
    return normalizarSecoes((await lerRetratoDemo()).configuracao?.secoesHome);
  }
  return normalizarSecoes(await lerConfiguracao<unknown>(CHAVE_SECOES, null));
}

/** As artes da dobra configuradas, sempre MAX_ARTES_HERO posições (null onde
 *  não há arquivo). */
export async function obterArtesHeroConfiguradas(): Promise<ArteConfigurada[]> {
  if (EH_DEMO) {
    const c = (await lerRetratoDemo()).configuracao ?? {};
    const lido = c as Record<string, string | null | undefined>;
    return Array.from({ length: MAX_ARTES_HERO }, (_, i) => {
      const k = chavesDaArte(i);
      return { desktop: lido[k.desktop] ?? null, celular: lido[k.celular] ?? null };
    });
  }
  const registros = await db.configuracao.findMany({ where: { chave: { startsWith: "hero" } } });
  const valores = new Map<string, string | null>();
  for (const r of registros) {
    try {
      valores.set(r.chave, JSON.parse(r.valor) as string | null);
    } catch {
      valores.set(r.chave, null);
    }
  }
  return Array.from({ length: MAX_ARTES_HERO }, (_, i) => {
    const k = chavesDaArte(i);
    return { desktop: valores.get(k.desktop) ?? null, celular: valores.get(k.celular) ?? null };
  });
}
