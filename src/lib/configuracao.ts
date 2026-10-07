// Ajustes do site feitos pelo painel (tabela Configuracao, chave/valor em
// JSON): quais seções da home aparecem e a arte da dobra enviada pela
// farmácia. Em modo DEMO (vitrine estática) tudo vem do retrato em
// src/lib/dados-demo.json, gerado por scripts/gerar-demo.js.
import { db } from "@/lib/db";
import { lerRetratoDemo } from "@/lib/catalogo";
import { normalizarSecoes, type SecoesHome } from "@/lib/secoes";

const EH_DEMO = process.env.DEMO === "1";

export const CHAVE_SECOES = "secoesHome";
export const CHAVE_HERO_DESKTOP = "heroDesktop";
export const CHAVE_HERO_CELULAR = "heroCelular";

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

/** A arte da dobra enviada pelo painel (null em cada tela sem arquivo). */
export async function obterArteHeroConfigurada(): Promise<{
  desktop: string | null;
  celular: string | null;
}> {
  if (EH_DEMO) {
    const config = (await lerRetratoDemo()).configuracao;
    return { desktop: config?.heroDesktop ?? null, celular: config?.heroCelular ?? null };
  }
  const [desktop, celular] = await Promise.all([
    lerConfiguracao<string | null>(CHAVE_HERO_DESKTOP, null),
    lerConfiguracao<string | null>(CHAVE_HERO_CELULAR, null),
  ]);
  return { desktop, celular };
}
