"use client";
// "Combina com o seu pedido" (14/11/2026, "quero o compre junto melhor
// posicionado, talvez no carrinho"): dentro do carrinho, logo abaixo dos
// itens, até dois produtos com foto real das mesmas linhas do que já
// está no pedido (e, sem par na linha, os primeiros da lista), cada um com o
// botão de adicionar. Só produtos com foto real; nada que já esteja no
// carrinho. A lista vem pronta do servidor (layout do site).
import Link from "next/link";
import { useMemo } from "react";
import { asset } from "@/lib/asset";
import { useCarrinho } from "@/lib/carrinho";

export interface ItemSugestao {
  id: number;
  nome: string;
  slug: string;
  fotoUrl: string;
  categoriaId: number | null;
}

export function SugestoesCarrinho({ catalogo }: { catalogo: ItemSugestao[] }) {
  const { itens, adicionar } = useCarrinho();

  const sugestoes = useMemo(() => {
    if (itens.length === 0 || catalogo.length === 0) return [];
    const noCarrinho = new Set(itens.map((i) => i.produtoId));
    const linhas = new Set(catalogo.filter((p) => noCarrinho.has(p.id)).map((p) => p.categoriaId));
    const livres = catalogo.filter((p) => !noCarrinho.has(p.id));
    const mesmaLinha = livres.filter((p) => linhas.has(p.categoriaId));
    const resto = livres.filter((p) => !linhas.has(p.categoriaId));
    return [...mesmaLinha, ...resto].slice(0, 2);
  }, [itens, catalogo]);

  if (sugestoes.length === 0) return null;

  return (
    <section aria-labelledby="titulo-sugestoes" className="rounded-[1.35rem] bg-gradient-to-b from-gelo/70 to-white p-3.5 ring-1 ring-inset ring-fio">
      <h3 id="titulo-sugestoes" className="flex items-center gap-2 px-1 text-[0.82rem] font-semibold text-navy">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
        Combina com o seu pedido
      </h3>
      <ul className="mt-2.5 flex flex-col gap-2">
        {sugestoes.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-2 pr-2.5 ring-1 ring-inset ring-fio/70">
            <Link href={`/produto/${p.slug}`} className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gelo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.fotoUrl)} alt="" width={96} height={96} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain p-1" />
            </Link>
            <Link href={`/produto/${p.slug}`} className="min-w-0 flex-1 text-[0.86rem] font-semibold leading-snug text-navy line-clamp-2 hover:text-tinta">
              {p.nome}
            </Link>
            <button
              type="button"
              onClick={() => adicionar({ produtoId: p.id, nome: p.nome, dosagem: null, fotoUrl: p.fotoUrl }, 1)}
              aria-label={`Adicionar ${p.nome} ao pedido`}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-navy pl-2.5 pr-3.5 text-[0.8rem] font-semibold text-white transition hover:bg-tinta active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              Adicionar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
