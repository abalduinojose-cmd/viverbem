"use client";
// Histórico de produtos que a pessoa abriu, guardado no próprio
// navegador (nada vai para o servidor). Serve para ela retomar de
// onde parou e fechar o pedido.
//
// Guardamos só os slugs; os dados vêm do catálogo que a página passa.
// Cada item tem o "adicionar ao carrinho" direto, sem preço.
//
// A leitura do localStorage é um "store externo" (useSyncExternalStore):
// no servidor é sempre vazio, e no navegador vem o que está guardado, sem
// setState dentro de efeito. O registro do produto atual é a única
// escrita, feita depois de montar.

import { useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";

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

function ItemVisto({ produto }: { produto: ProdutoDTO }) {
  return (
    <div className="ladrilho shrink-0 w-[15rem] md:w-[17rem] snap-start p-3 flex gap-3">
      <Link
        href={`/produto/${produto.slug}`}
        className="shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center p-1.5"
      >
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="max-w-full max-h-full !object-contain drop-shadow-[0_8px_8px_rgba(16,42,74,0.18)]"
        />
      </Link>

      <div className="min-w-0 flex-1 flex flex-col">
        <Link href={`/produto/${produto.slug}`} className="min-w-0">
          <p className="text-sm font-medium text-navy leading-snug line-clamp-2 hover:text-tinta transition-colors">
            {produto.nome}
          </p>
        </Link>
        <div className="flex justify-end mt-auto pt-2">
          <BotaoAdicionar produto={produto} compacto />
        </div>
      </div>
    </div>
  );
}

export function VistosRecentemente({
  slugAtual,
  catalogo,
}: {
  slugAtual: string;
  catalogo: ProdutoDTO[];
}) {
  const bruto = useSyncExternalStore(assinar, lerBruto, () => "[]");

  // Mostra o que a pessoa já tinha visto ANTES de abrir esta página
  const vistos = useMemo(() => {
    const porSlug = new Map(catalogo.map((p) => [p.slug, p]));
    return paraLista(bruto)
      .filter((s) => s !== slugAtual)
      .map((s) => porSlug.get(s))
      .filter((p): p is ProdutoDTO => Boolean(p));
  }, [bruto, slugAtual, catalogo]);

  // E registra o produto atual no topo da lista
  useEffect(() => {
    try {
      const anteriores = paraLista(lerBruto());
      const atualizado = [slugAtual, ...anteriores.filter((s) => s !== slugAtual)];
      localStorage.setItem(CHAVE, JSON.stringify(atualizado.slice(0, LIMITE)));
    } catch {
      // Sem storage não dá para lembrar, e tudo bem
    }
  }, [slugAtual]);

  if (vistos.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-4">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <p className="rotulo">continue de onde parou</p>
          <h2 className="text-xl md:text-2xl font-semibold tracking-[-0.03em] text-navy mt-1">
            Você viu recentemente
          </h2>
        </div>
        <span className="hidden sm:block text-cinza text-sm">
          {vistos.length} {vistos.length === 1 ? "produto" : "produtos"}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto rolagem-sem-barra snap-x -mx-1 px-1 pb-1">
        {vistos.map((p) => (
          <ItemVisto key={p.id} produto={p} />
        ))}
      </div>
    </section>
  );
}
