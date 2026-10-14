// A imagem de cada linha nos círculos "Conheça nossas linhas de produtos"
// (home). Veio de src/app/(site)/page.tsx em 14/10/2026, quando o painel
// passou a trocar essas fotos ("quero a opção de poder mudar as fotos e
// ícones dali"): a home e o painel precisam da mesma conta. Fontes, nesta
// ordem:
//   1. a foto enviada pelo painel (Configuracao "linhasFotos", por slug);
//   2. a foto da área em public/fotos/categorias/<slug>.jpg;
//   3. o pote de um produto que combina com a área (lista abaixo);
//   4. o pote do primeiro produto da área com foto.
// Sem nada, o círculo sai em azul-noite com a inicial em ouro.
import fs from "fs";
import path from "path";
import type { ImagemCategoria } from "@/components/site/CategoriasRedondas";

/** Caminho público da imagem, se o arquivo existir em public/ */
export function imagemSeExistir(caminho: string): string | null {
  return fs.existsSync(path.join(process.cwd(), "public", caminho)) ? caminho : null;
}

// Fotos que já temos, para os círculos das áreas sem foto própria, só
// onde o frasco combina com o nome da área (pedido do usuário em
// 06/10/2026). Cabelos & Unhas e Homeopatia & Florais ainda não têm
// produto com foto: entram, PROVISÓRIOS, o frasco de loção do ZincBlock e
// o conta-gotas do Firm Defense. Vitaminas & Suplementos: a Creatina Gummy
// no lugar do Ômega 3 (pedido de 14/10/2026).
export const FOTO_REPRESENTATIVA: Record<string, string> = {
  "vitaminas-suplementos": "/uploads/creatina-gummy.png",
  "saude-da-mulher": "/uploads/citorepair.png",
  "saude-do-homem": "/uploads/vitaflex.png",
  "cabelos-unhas": "/uploads/zincblock-fps.png",
  "homeopatia-florais": "/uploads/firm-defense-serum.png",
};

// Foto de verdade é a que não é um dos desenhos neutros (.svg)
export const temFoto = (fotoUrl: string | null) => Boolean(fotoUrl && !fotoUrl.toLowerCase().endsWith(".svg"));

export type ImagemDaLinha = ImagemCategoria & {
  /** Veio do painel (dá para tirar) */
  propria: boolean;
};

/** A imagem de cada categoria, por id */
export function imagensDasLinhas(
  categorias: { id: number; slug: string }[],
  produtos: { categoriaId: number | null; fotoUrl: string | null }[],
  linhasFotos: Record<string, string>
): Record<number, ImagemDaLinha> {
  const resultado: Record<number, ImagemDaLinha> = {};
  for (const c of categorias) {
    const propria = linhasFotos[c.slug];
    const foto = imagemSeExistir(`/fotos/categorias/${c.slug}.jpg`);
    const representativa = FOTO_REPRESENTATIVA[c.slug];
    const produto = produtos.find((p) => p.categoriaId === c.id && temFoto(p.fotoUrl));
    if (propria) resultado[c.id] = { tipo: "produto", src: propria, propria: true };
    else if (foto) resultado[c.id] = { tipo: "foto", src: foto, propria: false };
    else if (representativa) resultado[c.id] = { tipo: "produto", src: representativa, propria: false };
    else if (produto?.fotoUrl) resultado[c.id] = { tipo: "produto", src: produto.fotoUrl, propria: false };
  }
  return resultado;
}
