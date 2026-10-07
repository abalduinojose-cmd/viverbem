// A arte da dobra (abertura da home).
//
// A ideia (usuário, 07/10/2026): o cliente faz a própria arte e manda pelo
// painel; na dobra ficam só os botões, por cima da arte. Duas fontes, nesta
// ordem:
//   1. o que foi enviado pelo painel (Painel > Site > Arte da dobra), que
//      fica na tabela Configuracao com a URL da imagem;
//   2. os arquivos soltos em public/uploads/hero/ (para quem prefere copiar
//      a imagem direto no servidor):
//        desktop.(jpg|png|webp)  ~1920x760 (a dobra do computador)
//        celular.(jpg|png|webp)  ~1080x1350 (a dobra do celular), opcional
// Sem nada, a dobra mostra a composição padrão (texto e potes). Roda só
// no servidor (ou no build da vitrine estática).
import fs from "fs";
import path from "path";
import { obterArteHeroConfigurada } from "@/lib/configuracao";

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

/** A arte enviada pela farmácia, ou null para a dobra padrão. */
export async function obterArteHero(): Promise<ArteHero | null> {
  const configurada = await obterArteHeroConfigurada();
  const desktop = configurada.desktop ?? acharArquivo("desktop");
  if (!desktop) return null;
  return { desktop, celular: configurada.celular ?? acharArquivo("celular") };
}
