// As artes da dobra (abertura da home).
//
// A ideia (usuário, 07/10/2026): o cliente faz a própria arte e manda pelo
// painel; na dobra ficam só os botões, por cima da arte. Pode haver até
// duas artes (cada uma com a versão do computador e a do celular): com
// duas, a dobra alterna entre elas. Fontes, nesta ordem:
//   1. o que foi enviado pelo painel (Painel > Site > Arte da dobra), que
//      fica na tabela Configuracao com a URL de cada imagem;
//   2. para a primeira arte, os arquivos soltos em public/uploads/hero/
//      (para quem prefere copiar a imagem direto no servidor):
//        desktop.(jpg|png|webp)  ~1920x760 (a dobra do computador)
//        celular.(jpg|png|webp)  ~1080x1350 (a dobra do celular), opcional
// Sem nada, a dobra mostra a composição padrão (texto e potes). Roda só
// no servidor (ou no build da vitrine estática).
import fs from "fs";
import path from "path";
import { obterArtesHeroConfiguradas } from "@/lib/configuracao";

export type ArteHero = {
  /** Caminho público da arte do computador, ex.: /uploads/hero/desktop.jpg */
  desktop: string;
  /** Caminho público da arte do celular, ou null para reaproveitar a do computador */
  celular: string | null;
};

const EXTENSOES = ["jpg", "jpeg", "png", "webp"];

function acharArquivo(nome: string): string | null {
  for (const extensao of EXTENSOES) {
    const relativo = `/uploads/hero/${nome}.${extensao}`;
    if (fs.existsSync(path.join(process.cwd(), "public", relativo))) return relativo;
  }
  return null;
}

/** As artes prontas para a dobra (só as que têm a versão do computador);
 *  lista vazia = dobra padrão. */
export async function obterArtesHero(): Promise<ArteHero[]> {
  const configuradas = await obterArtesHeroConfiguradas();
  const artes: ArteHero[] = [];
  configuradas.forEach((c, i) => {
    const desktop = c.desktop ?? (i === 0 ? acharArquivo("desktop") : null);
    if (!desktop) return;
    artes.push({ desktop, celular: c.celular ?? (i === 0 ? acharArquivo("celular") : null) });
  });
  return artes;
}
