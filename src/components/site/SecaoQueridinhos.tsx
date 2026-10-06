// Vitrine dos mais procurados.
//
// Era a faixa clara de cartões brancos em linha, que é o desenho padrão
// de qualquer loja virtual. Virou uma vitrine na noite, no mesmo
// vocabulário da faixa de números e da seção de entrega: fundo profundo
// com malha de laboratório, ladrilho claro só atrás da foto (os potes
// são fotografados em fundo branco) e o nome em cima do escuro.
//
// A categoria saiu do cartão: na home todos os produtos da faixa são da
// mesma categoria, então a linha se repetia em todos e não informava
// nada. No lugar entrou o índice 01, 02, 03, que dá ritmo à fileira.
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FaixaProdutos } from "./FaixaProdutos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";

function CartaoQueridinho({ produto, indice }: { produto: ProdutoDTO; indice: number }) {
  const href = `/produto/${produto.slug}`;

  return (
    <article className="group flex h-full w-full flex-col">
      {/* A foto repete o link do nome: fica fora da ordem do Tab */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-white/10 transition duration-500 group-hover:ring-white/35">
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.07]"
          />

          {produto.novidade && (
            <span className="absolute left-3 top-3 rounded-full bg-escarlate px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-white">
              NOVIDADE
            </span>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        {/* Índice no itálico serifado da marca, o mesmo da faixa de números */}
        <p
          className="font-display leading-none text-[#8ab8ea]/70 tabular-nums"
          aria-hidden="true"
        >
          <span className="italic" style={{ fontSize: "1.05rem" }}>
            {String(indice + 1).padStart(2, "0")}
          </span>
        </p>

        <h3 className="mt-2 font-display text-[1.05rem] font-semibold leading-snug text-white">
          <Link href={href} className="transition-colors hover:text-[#8ab8ea]">
            {produto.nome}
          </Link>
        </h3>

        <div className="mt-auto pt-4">
          <BotaoAdicionar produto={produto} tema="noite" />
        </div>
      </div>
    </article>
  );
}

export function SecaoQueridinhos({ produtos }: { produtos: ProdutoDTO[] }) {
  if (produtos.length === 0) return null;

  return (
    <section className="relative mt-20 overflow-hidden bg-noite text-white">
      {/* Atmosfera: luz azul no alto, brasa vermelha embaixo e a malha */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 85% 0%, rgba(47,124,196,0.38), transparent 62%), radial-gradient(55% 50% at 0% 100%, rgba(224,33,41,0.17), transparent 60%)",
        }}
      />
      <div aria-hidden="true" className="malha-lab absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="selo-secao flex items-center gap-3 text-[#8ab8ea]">
              <span aria-hidden="true" className="h-px w-9 bg-[#8ab8ea]/45" />
              os queridinhos
            </p>
            {/* Contraste de tamanho: o selo é 0,72rem e o título passa de
                4rem no computador, com a 2ª palavra no itálico serifado */}
            <h2 className="mt-3 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.035em] md:text-[4rem]">
              Mais <span className="italic text-[#8ab8ea]">procurados</span>
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/60">
              Adicione ao carrinho e o farmacêutico passa o valor pelo WhatsApp.
            </p>
          </div>

          <Link
            href="/produtos"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-white/15 py-2 pl-5 pr-2 font-semibold transition-colors hover:border-white/40 md:self-auto"
          >
            Ver o catálogo
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition duration-300 group-hover:bg-white group-hover:text-noite">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m0 0-6-6m6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        <div className="mt-11">
          <FaixaProdutos className="cascata">
            {produtos.map((p, i) => (
              <CartaoQueridinho key={p.id} produto={p} indice={i} />
            ))}
          </FaixaProdutos>
        </div>
      </div>
    </section>
  );
}
