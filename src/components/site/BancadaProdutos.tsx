// A BANCADA (26/10/2026): a segunda linha de produtos da home, abaixo da
// faixa de Dermatologia & Estética, "de outra forma, com outros
// movimentos, mantendo o nosso padrão". A esteira que andava sozinha
// (passarela) foi reprovada no mesmo dia ("não quero esse efeito
// vitrine"). Esta é parada e editorial: à esquerda a peça da área em
// azul-noite (o mesmo banner-noite das faixas, com a malha e a luz de ouro,
// o título em duas vozes e o convite), e à direita uma GRADE de potes em
// ladrilhos brancos, como numa bancada de laboratório. Nada arrasta nem
// anda sozinho.
//
// Movimento (doutrina): só o que a rolagem da pessoa comanda. A peça e os
// potes entram em CASCATA conforme a seção aparece (.escalonado, os vãos
// encolhendo), cada pote "pousa" no ladrilho; no hover o pote sobe de
// leve e o nome acende em azul. Roda igual com movimento reduzido.
import Link from "next/link";
import type { ReactNode } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { SetaDireita } from "./icones";

const MAXIMO_DE_POTES = 6;

/** "Vitaminas, *em fórmula individual.*": a parte entre asteriscos sai em
 *  itálico ouro (a mesma convenção dos banners das faixas) */
function comItalico(titulo: string): ReactNode {
  const partes = titulo.split("*");
  return partes.map((parte, i) => (i % 2 === 1 ? <span key={i} className="italic">{parte}</span> : <span key={i}>{parte}</span>));
}

function Pote({ produto }: { produto: ProdutoDTO }) {
  return (
    <li>
      <article className="group relative flex h-full flex-col rounded-[1.5rem] border border-fio bg-white p-2 transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)]">
        <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.1rem] bg-gelo/60 p-4 md:p-5">
          <span aria-hidden="true" className="absolute inset-x-[18%] bottom-1 h-6 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(201,165,107,0.32),transparent_70%)]" />
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="relative max-h-full max-w-full !object-contain drop-shadow-[0_8px_10px_rgba(16,42,74,0.24)] transition-transform duration-500 group-hover:-translate-y-1"
          />
          <BotaoAdicionar produto={produto} compacto suave className="absolute right-2 top-2 z-[1]" />
        </span>
        <Link
          href={`/produto/${produto.slug}`}
          className="mt-2.5 block px-1.5 pb-1.5 text-[0.9rem] font-medium leading-snug text-navy line-clamp-2 transition-colors group-hover:text-tinta after:absolute after:inset-0 after:rounded-[1.5rem]"
        >
          {produto.nome}
        </Link>
      </article>
    </li>
  );
}

export function BancadaProdutos({
  id,
  rotulo,
  titulo,
  href,
  produtos,
  banner,
}: {
  id: string;
  rotulo: string;
  titulo: ReactNode;
  href: string;
  produtos: ProdutoDTO[];
  banner: { titulo: string; texto?: string };
}) {
  if (produtos.length === 0) return null;
  const potes = produtos.slice(0, MAXIMO_DE_POTES);

  return (
    <section aria-labelledby={id} className="secao-vitrine max-w-7xl mx-auto px-5 md:px-8">
      <div className="revelar flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="rotulo-pilula">{rotulo}</p>
          <h2 id={id} className="titulo-secao vao-rotulo">
            {titulo}
          </h2>
        </div>
        <Link href={href} className="botao-link !min-h-11 !text-sm">
          ver tudo
          <SetaDireita tamanho={14} />
        </Link>
      </div>

      <div className="escalonado mt-8 md:mt-10 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">
        {/* A peça da área, em azul-noite */}
        <Link
          href={href}
          className="banner-noite em-noite group relative flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-[2rem] p-6 text-white ring-1 ring-inset ring-white/10 shadow-[0_24px_50px_-30px_rgba(13,35,64,0.6)] transition duration-300 hover:-translate-y-1 md:p-8 lg:col-span-4 lg:min-h-0"
        >
          <span aria-hidden="true" className="malha-banner" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.3),transparent_62%)]" />
          <span className="relative rotulo-pilula">{rotulo}</span>
          <span className="relative mt-4 block text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[2rem]">{comItalico(banner.titulo)}</span>
          {banner.texto && <span className="relative mt-3 block max-w-[30ch] text-[0.95rem] leading-relaxed text-white/75">{banner.texto}</span>}
          <span className="relative mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-white">
            Ver a linha completa
            <SetaDireita tamanho={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* A grade de potes */}
        {/* No celular, quatro potes (2 x 2); de sm para cima, os seis */}
        <ul className="escalonado grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:col-span-8 [&>li:nth-child(n+5)]:hidden sm:[&>li:nth-child(n+5)]:block">
          {potes.map((p) => (
            <Pote key={p.id} produto={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
