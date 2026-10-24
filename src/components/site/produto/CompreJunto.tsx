"use client";
// "Compre junto" (23/10/2026, estudo das páginas da Amazon e do Mercado
// Livre; desde 24/10 com UM companheiro): o produto da página mais um da mesma área, lado a lado com o
// "+" entre eles, e UM botão que põe os três no carrinho. É o "comprados
// juntos" dos marketplaces, mas sem inventar dado: os dois companheiros
// são os primeiros da mesma categoria com foto real, e cada um tem o
// próprio link. Sem preço (manipulado não expõe preço).
import { Fragment, useState } from "react";
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

  // 23/10/2026 ("melhore e modernize o compre junto"): ladrilhos brancos com
  // fio que sobem no hover, o "+" em navy, o produto da página com um selo
  // de ouro em cima ("este produto"), e a ação separada por um fio à direita
  return (
    <section aria-labelledby="titulo-compre-junto" className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-white to-gelo/60 p-5 ring-1 ring-fio md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
      <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.18),transparent_65%)]" />
      <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="rotulo-pilula !text-[0.6875rem]">compre junto</p>
          <h2 id="titulo-compre-junto" className="mt-2 text-[1.2rem] md:text-[1.5rem] font-semibold tracking-[-0.03em] text-navy">
            Quem pede este, costuma levar <span className="italic">também</span>
          </h2>
        </div>
        <p className="text-[0.78rem] font-medium text-cinza">
          <span className="tabular-nums font-semibold text-navy">{todos.length}</span> produtos, um pedido só
        </p>
      </div>

      <div className="relative mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-7">
        {/* Os três, com o "+" entre eles */}
        <ul className="mx-auto flex w-full max-w-[26rem] items-stretch justify-center gap-3 pt-2 sm:gap-4 lg:mx-0 lg:max-w-sm lg:flex-none">
          {todos.map((p, i) => (
            <Fragment key={p.id}>
              {i > 0 && (
                <li aria-hidden="true" className="flex shrink-0 items-center">
                  <span className="flex size-8 items-center justify-center rounded-full bg-navy text-white shadow-[0_6px_14px_-8px_rgba(13,35,64,0.8)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </li>
              )}
              <li className="flex min-w-0 flex-1">
              <Link
                href={`/produto/${p.slug}`}
                aria-current={i === 0 ? "page" : undefined}
                className={`group relative flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-2 ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(13,35,64,0.5)] ${
                  i === 0 ? "ring-ouro/60 shadow-[0_12px_26px_-18px_rgba(201,165,107,0.9)]" : "ring-fio hover:ring-ouro/50"
                }`}
              >
                {i === 0 && (
                  <span className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[image:var(--ouro-degrade)] px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy shadow-[0_6px_14px_-8px_rgba(201,165,107,0.9)]">
                    este produto
                  </span>
                )}
                <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-gelo to-gelo/30 p-2">
                  <span aria-hidden="true" className="absolute inset-x-[15%] bottom-0.5 h-4 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(201,165,107,0.3),transparent_70%)]" />
                  {p.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(p.fotoUrl)} alt="" width={160} height={160} loading="lazy" decoding="async" className="relative max-h-full max-w-full object-contain drop-shadow-[0_6px_8px_rgba(16,42,74,0.25)] transition-transform duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <FotoProduto fotoUrl={null} nome={p.nome} className="relative" />
                  )}
                </span>
                <span className="mt-2 line-clamp-2 px-0.5 text-center text-[0.8rem] font-medium leading-snug text-navy">{p.nome}</span>
              </Link>
              </li>
            </Fragment>
          ))}
        </ul>

        {/* A ação única */}
        <div className="flex flex-col items-stretch gap-2.5 lg:max-w-sm lg:flex-1 lg:border-l lg:border-fio lg:pl-7">
          <p className="text-sm leading-snug text-cinza">
            Os {todos.length} vão juntos para o carrinho. O farmacêutico passa o valor de tudo pelo WhatsApp.
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
