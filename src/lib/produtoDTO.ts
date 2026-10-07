// Converte produto e categoria do banco para o formato que as telas
// recebem. Antes esse mapeamento estava copiado em três arquivos, e cada
// campo novo precisava ser lembrado nos três.
import type { Categoria, Produto } from "@prisma/client";
import { CategoriaDTO, ProdutoDTO, VENDA_MANIPULADO } from "./tipos";

/** O que incluir no findMany/findUnique de produto para montar o DTO. */
export const INCLUIR_PRODUTO = {
  categoria: { select: { nome: true } },
  fotos: { orderBy: { ordem: "asc" as const } },
};

type ProdutoComRelacoes = Produto & {
  categoria?: { nome: string } | null;
  fotos?: { url: string; ordem: number }[];
};

export function produtoParaDTO(p: ProdutoComRelacoes): ProdutoDTO {
  // A galeria; produto antigo (só com fotoUrl) vira uma galeria de uma foto
  const galeria = p.fotos ? [...p.fotos].sort((a, b) => a.ordem - b.ordem).map((f) => f.url) : [];
  const fotos = galeria.length > 0 ? galeria : p.fotoUrl ? [p.fotoUrl] : [];

  return {
    id: p.id,
    nome: p.nome,
    slug: p.slug,
    descricao: p.descricao,
    precoCentavos: p.precoCentavos,
    tipo: p.tipo,
    venda: p.venda || VENDA_MANIPULADO,
    aprovado: p.aprovado,
    fotoUrl: fotos[0] ?? null,
    fotos,
    mostrarPreco: p.mostrarPreco,
    ativo: p.ativo,
    novidade: p.novidade,
    destaque: p.destaque,
    ordem: p.ordem,
    categoriaId: p.categoriaId,
    categoriaNome: p.categoria?.nome ?? null,
    dosagens: p.dosagens,
    composicao: p.composicao,
    modoUso: p.modoUso,
    indicacoes: p.indicacoes,
    apresentacao: p.apresentacao,
  };
}

export function categoriaParaDTO(c: Categoria): CategoriaDTO {
  return {
    id: c.id,
    nome: c.nome,
    slug: c.slug,
    ordem: c.ordem,
    visivel: c.visivel,
    vitrineHome: c.vitrineHome,
  };
}
