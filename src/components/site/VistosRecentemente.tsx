"use client";
// Histórico de produtos que a pessoa abriu, guardado no próprio
// navegador (nada vai para o servidor). Serve para ela retomar de
// onde parou e fechar o pedido.
//
// Guardamos só os slugs; os dados vêm do catálogo que a página passa.
// Cada item tem o "adicionar ao carrinho" direto, sem preço.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";

const CHAVE = "viverbem:vistos";
const LIMITE = 12;

function lerHistorico(): string[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista.filter((s) => typeof s === "string") : [];
  } catch {
    // Modo privado ou storage cheio: seguimos sem histórico
    return [];
  }
}

function ItemVisto({ produto }: { produto: ProdutoDTO }) {
  return (
    <div className="shrink-0 w-[15rem] md:w-[17rem] snap-start bg-white border border-linha rounded-2xl p-3 flex gap-3 hover:sombra-card transition-shadow">
      <Link
        href={`/produto/${produto.slug}`}
        className="shrink-0 w-16 h-16 rounded-xl bg-royal-nevoa overflow-hidden flex items-center justify-center p-1.5"
      >
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="max-w-full max-h-full !object-contain"
        />
      </Link>

      <div className="min-w-0 flex-1 flex flex-col">
        <Link href={`/produto/${produto.slug}`} className="min-w-0">
          <p className="text-sm font-semibold text-grafite leading-snug line-clamp-2 hover:text-royal transition-colors">
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
  const [vistos, setVistos] = useState<ProdutoDTO[]>([]);

  useEffect(() => {
    const anteriores = lerHistorico();

    // Mostra o que a pessoa já tinha visto ANTES de abrir esta página
    const porSlug = new Map(catalogo.map((p) => [p.slug, p]));
    setVistos(
      anteriores
        .filter((s) => s !== slugAtual)
        .map((s) => porSlug.get(s))
        .filter((p): p is ProdutoDTO => Boolean(p))
    );

    // E registra o produto atual no topo da lista
    try {
      const atualizado = [slugAtual, ...anteriores.filter((s) => s !== slugAtual)];
      localStorage.setItem(CHAVE, JSON.stringify(atualizado.slice(0, LIMITE)));
    } catch {
      // Sem storage não dá para lembrar, e tudo bem
    }
  }, [slugAtual, catalogo]);

  if (vistos.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-4">
      <div className="bg-royal-nevoa border border-linha rounded-[1.75rem] px-5 md:px-7 py-6">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="selo-secao text-royal">continue de onde parou</p>
            <h2 className="font-display text-xl md:text-2xl font-semibold text-grafite mt-1">
              Você viu recentemente
            </h2>
          </div>
          <span className="hidden sm:block text-grafite-claro text-sm">
            {vistos.length} {vistos.length === 1 ? "produto" : "produtos"}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto rolagem-sem-barra snap-x -mx-1 px-1 pb-1">
          {vistos.map((p) => (
            <ItemVisto key={p.id} produto={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
