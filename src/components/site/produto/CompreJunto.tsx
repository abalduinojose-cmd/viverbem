"use client";
// "Compre junto" (23/10/2026, estudo das páginas da Amazon e do Mercado
// Livre): o produto da página mais dois da mesma área, lado a lado com o
// "+" entre eles, e UM botão que põe os três no carrinho. É o "comprados
// juntos" dos marketplaces, mas sem inventar dado: os dois companheiros
// são os primeiros da mesma categoria com foto real, e cada um tem o
// próprio link. Sem preço (manipulado não expõe preço).
import { useState } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import type { ProdutoDTO } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho, IconeFeito } from "../icones";
import { FotoProduto } from "../FotoProduto";

export function CompreJunto({ principal, companheiros }: { principal: ProdutoDTO; companheiros: ProdutoDTO[] }) {
  const { adicionar } = useCarrinho();
  const [feito, setFeito] = useState(false);
  const todos = [principal, ...companheiros];

  function adicionarTodos() {
    for (const p of todos) adicionar({ produtoId: p.id, nome: p.nome, dosagem: null, fotoUrl: p.fotoUrl }, 1);
    setFeito(true);
    window.setTimeout(() => setFeito(false), 1800);
  }

  return (
    <section aria-labelledby="titulo-compre-junto" className="rounded-[1.75rem] border border-fio bg-white p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="rotulo-pilula !text-[0.6875rem]">compre junto</p>
          <h2 id="titulo-compre-junto" className="mt-2 text-[1.2rem] md:text-[1.5rem] font-semibold tracking-[-0.03em] text-navy">
            Quem pede este, costuma levar <span className="italic">também</span>
          </h2>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
        {/* Os três, com o "+" entre eles */}
        <ul className="flex items-stretch justify-center gap-2 sm:gap-3 lg:flex-1">
          {todos.map((p, i) => (
            <li key={p.id} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gelo text-navy">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
              )}
              <Link
                href={`/produto/${p.slug}`}
                aria-current={i === 0 ? "page" : undefined}
                className={`group flex min-w-0 flex-1 flex-col rounded-2xl p-2 transition-colors hover:bg-gelo/50 ${i === 0 ? "ring-1 ring-inset ring-ouro/40 bg-ouro/5" : ""}`}
              >
                <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-gelo to-gelo/30 p-2">
                  <span aria-hidden="true" className="absolute inset-x-[15%] bottom-0.5 h-4 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(201,165,107,0.3),transparent_70%)]" />
                  {p.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(p.fotoUrl)} alt="" width={160} height={160} loading="lazy" decoding="async" className="relative max-h-full max-w-full object-contain drop-shadow-[0_6px_8px_rgba(16,42,74,0.25)] transition-transform duration-500 group-hover:-translate-y-0.5" />
                  ) : (
                    <FotoProduto fotoUrl={null} nome={p.nome} className="relative" />
                  )}
                </span>
                <span className="mt-2 line-clamp-2 text-[0.82rem] font-medium leading-snug text-navy">
                  {i === 0 && <span className="mr-1 rounded-full bg-ouro/15 px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-ouro-escuro">este</span>}
                  {p.nome}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* A ação única */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 lg:w-[16rem]">
          <p className="text-sm text-cinza">
            {todos.length} produtos. O farmacêutico passa o valor de tudo pelo WhatsApp.
          </p>
          <button type="button" onClick={adicionarTodos} className={`botao-carrinho w-full !min-h-12 ${feito ? "botao-carrinho-feito" : ""}`}>
            {feito ? (
              <>
                <IconeFeito tamanho={19} />
                Os {todos.length} no carrinho
              </>
            ) : (
              <>
                <IconeCarrinho tamanho={19} />
                Adicionar os {todos.length} ao carrinho
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
