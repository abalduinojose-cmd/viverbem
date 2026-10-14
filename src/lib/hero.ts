// As artes da dobra (abertura da home).
//
// A ideia (usuário, 07/10/2026): o cliente faz a própria arte e manda pelo
// painel; na dobra ficam só os botões, por cima da arte. Pode haver até
// duas artes (cada uma com a versão do computador e a do celular): com
// duas, a dobra alterna entre elas. Fontes, nesta ordem:
//   1. os banners "dobra-1" e "dobra-2" do painel (14/10/2026: foto, GIF
//      ou vídeo, ver lib/banners.ts);
//   2. as chaves antigas heroDesktop/heroCelular da Configuracao (as artes
//      enviadas antes dos banners);
//   3. para a primeira arte, os arquivos soltos em public/uploads/hero/
//      (para quem prefere copiar a imagem direto no servidor):
//        desktop.(jpg|png|webp)  ~1920x760 (a dobra do computador)
//        celular.(jpg|png|webp)  ~1080x1350 (a dobra do celular), opcional
// Sem nada, a dobra mostra a composição padrão (texto e potes). Roda só
// no servidor (ou no build da vitrine estática).
import fs from "fs";
import path from "path";
import { obterArtesHeroConfiguradas, obterBanners } from "@/lib/configuracao";
import type { Midia } from "@/lib/banners";

export type ArteHero = {
  /** A arte do computador (imagem, GIF ou vídeo) */
  desktop: Midia;
  /** A arte do celular, ou null para reaproveitar a do computador */
  celular: Midia | null;
};

const EXTENSOES = ["jpg", "jpeg", "png", "webp"];

function acharArquivo(nome: string): string | null {
  for (const extensao of EXTENSOES) {
    const relativo = `/uploads/hero/${nome}.${extensao}`;
    if (fs.existsSync(path.join(process.cwd(), "public", relativo))) return relativo;
  }
  return null;
}

const imagem = (url: string | null): Midia | null => (url ? { url, tipo: "imagem" } : null);

/** As artes prontas para a dobra (só as que têm a versão do computador);
 *  lista vazia = dobra padrão. */
export async function obterArtesHero(): Promise<ArteHero[]> {
  const [configuradas, banners] = await Promise.all([obterArtesHeroConfiguradas(), obterBanners()]);
  const artes: ArteHero[] = [];
  configuradas.forEach((c, i) => {
    const banner = banners[`dobra-${i + 1}`];
    const desktop = banner?.desktop ?? imagem(c.desktop) ?? (i === 0 ? imagem(acharArquivo("desktop")) : null);
    if (!desktop) return;
    const celular = banner?.celular ?? imagem(c.celular) ?? (i === 0 ? imagem(acharArquivo("celular")) : null);
    artes.push({ desktop, celular });
  });
  return artes;
}
