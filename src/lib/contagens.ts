// Quantos produtos o site tem, no total e por área: os números dos chips
// de categoria na página de produtos (08/10/2026). Fica no servidor, que
// enxerga o catálogo inteiro mesmo na página de uma área só.
import type { ProdutoDTO } from "@/lib/tipos";

export function contarPorArea(produtos: ProdutoDTO[]) {
  const porCategoria: Record<number, number> = {};
  for (const p of produtos) {
    if (p.categoriaId != null) porCategoria[p.categoriaId] = (porCategoria[p.categoriaId] ?? 0) + 1;
  }
  return { total: produtos.length, porCategoria };
}
