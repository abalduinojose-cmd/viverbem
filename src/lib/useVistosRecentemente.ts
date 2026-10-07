// Histórico de produtos que a pessoa abriu, guardado no próprio navegador
// (nada vai para o servidor). Serve para ela retomar de onde parou e
// fechar o pedido. Guardamos só os slugs; os dados vêm do catálogo que a
// página passa.
//
// A leitura do localStorage é um "store externo" (useSyncExternalStore):
// no servidor é sempre vazio, e no navegador vem o que está guardado, sem
// setState dentro de efeito. O registro do produto atual é a única
// escrita, feita depois de montar. Usado pela coluna lateral da página do
// produto (ColunaLateralProduto).
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { ProdutoDTO } from "@/lib/tipos";

const CHAVE = "viverbem:vistos";
const LIMITE = 12;

/** O histórico como texto cru (string estável, para o store não piscar). */
function lerBruto(): string {
  try {
    return localStorage.getItem(CHAVE) ?? "[]";
  } catch {
    // Modo privado ou storage cheio: seguimos sem histórico
    return "[]";
  }
}

function paraLista(bruto: string): string[] {
  try {
    const lista = JSON.parse(bruto);
    return Array.isArray(lista) ? lista.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

// Só muda em outra aba (evento storage); nesta aba a lista exibida não
// depende da escrita que fazemos (o produto atual é filtrado de qualquer jeito)
function assinar(avisar: () => void) {
  window.addEventListener("storage", avisar);
  return () => window.removeEventListener("storage", avisar);
}

/** O que a pessoa viu ANTES desta página (sem o produto atual), já
 *  registrando o atual no topo do histórico. */
export function useVistosRecentemente(slugAtual: string, catalogo: ProdutoDTO[]) {
  const bruto = useSyncExternalStore(assinar, lerBruto, () => "[]");

  const vistos = useMemo(() => {
    const porSlug = new Map(catalogo.map((p) => [p.slug, p]));
    return paraLista(bruto)
      .filter((s) => s !== slugAtual)
      .map((s) => porSlug.get(s))
      .filter((p): p is ProdutoDTO => Boolean(p));
  }, [bruto, slugAtual, catalogo]);

  useEffect(() => {
    try {
      const anteriores = paraLista(lerBruto());
      const atualizado = [slugAtual, ...anteriores.filter((s) => s !== slugAtual)];
      localStorage.setItem(CHAVE, JSON.stringify(atualizado.slice(0, LIMITE)));
    } catch {
      // Sem storage não dá para lembrar, e tudo bem
    }
  }, [slugAtual]);

  return vistos;
}
