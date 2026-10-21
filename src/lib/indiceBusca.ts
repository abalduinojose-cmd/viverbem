// O índice da busca ao vivo do cabeçalho (21/10/2026, "quero que ative a
// pesquisa quando eu colocar uma letra ou palavra"): uma lista enxuta dos
// produtos do site, montada no servidor e entregue ao cabeçalho, para a
// busca responder a cada letra sem pedir nada ao servidor (funciona igual
// na prévia estática). O alvo é o mesmo texto que a página de resultados
// usa: nome, descrição, área, composição e indicações, sem acento.
import type { ProdutoDTO } from "./tipos";
import { normalizar } from "./texto";

export interface ItemDoIndice {
  nome: string;
  slug: string;
  categoria: string | null;
  fotoUrl: string | null;
  /** O texto comparável (sem acento, em caixa baixa) */
  alvo: string;
}

export function montarIndiceBusca(produtos: ProdutoDTO[]): ItemDoIndice[] {
  return produtos.map((p) => ({
    nome: p.nome,
    slug: p.slug,
    categoria: p.categoriaNome ?? null,
    fotoUrl: p.fotoUrl,
    alvo: normalizar([p.nome, p.descricao, p.categoriaNome ?? "", p.composicao ?? "", p.indicacoes ?? ""].join(" ")),
  }));
}

/** Os termos da busca, já normalizados. Na busca ao vivo uma palavra curta
 *  (1 ou 2 letras) vale como COMEÇO de palavra ("vi" acha Vitamina), não
 *  como palavra inteira: é o que se espera enquanto se digita. */
export function procurarNoIndice(indice: ItemDoIndice[], busca: string, maximo = 6): { itens: ItemDoIndice[]; total: number } {
  const termos = normalizar(busca).split(/\s+/).filter(Boolean);
  if (termos.length === 0) return { itens: [], total: 0 };
  const testes = termos.map((t) => {
    if (t.length > 2) return (alvo: string) => alvo.includes(t);
    const re = new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
    return (alvo: string) => re.test(alvo);
  });
  // O nome que começa com a busca vem primeiro; depois o nome que contém;
  // por fim o resto (descrição, composição)
  const inteira = normalizar(busca).trim();
  const pontuar = (i: ItemDoIndice) => {
    const nome = normalizar(i.nome);
    return nome.startsWith(inteira) ? 0 : nome.includes(inteira) ? 1 : 2;
  };
  const achados = indice.filter((i) => testes.every((t) => t(i.alvo))).sort((a, b) => pontuar(a) - pontuar(b));
  return { itens: achados.slice(0, maximo), total: achados.length };
}
