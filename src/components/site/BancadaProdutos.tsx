// A BANCADA (26/10/2026): a segunda linha de produtos da home, abaixo da
// faixa de Dermatologia & Estética, "de outra forma, com outros
// movimentos, mantendo o nosso padrão". A esteira que andava sozinha
// (passarela) foi reprovada ("não quero esse efeito vitrine"); a peça da
// área em azul-noite ao lado da grade também ("tire isso e melhore os
// produtos"). Ficou a GRADE, parada e editorial, com os potes maiores:
// ladrilhos brancos com fio, a foto grande no gelo com a luz de ouro, o
// nome, uma linha da descrição e o "Adicionar" em ouro, como numa bancada
// de laboratório. Nada arrasta nem anda sozinho.
//
// Movimento (doutrina): só o que a rolagem da pessoa comanda. Os potes
// entram em CASCATA conforme a seção aparece (.escalonado, os vãos
// encolhendo); no hover o pote sobe de leve, o ladrilho ganha o fio de
// ouro e o nome acende em azul. Roda igual com movimento reduzido.
import Link from "next/link";
import type { ReactNode } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { SetaDireita } from "./icones";

const MAXIMO_DE_POTES = 6;

function Pote({ produto }: { produto: ProdutoDTO }) {
  return (
    <li>
      <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-fio bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:border-ouro/50 hover:shadow-[0_28px_44px_-32px_rgba(16,42,74,0.45)]">
        {/* A foto: quadrada no celular, um pouco mais baixa no computador, para a grade não virar uma torre */}
        {/* 27/10/2026 ("a sombra dourada tá longe do produto; tire e aumente o
            produto um pouco"): a luz de ouro na base saiu e a foto ganhou
            espaço (menos respiro em volta) */}
        <span className="relative flex aspect-square md:aspect-[5/4] items-center justify-center overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-gelo to-gelo/30 p-3.5 md:p-4">
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="relative max-h-full max-w-full !object-contain drop-shadow-[0_10px_12px_rgba(16,42,74,0.26)] transition-transform duration-500 group-hover:-translate-y-1.5"
          />
        </span>
        <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
          <Link
            href={`/produto/${produto.slug}`}
            className="block text-[1rem] md:text-[1.05rem] font-semibold tracking-[-0.02em] leading-snug text-navy line-clamp-2 transition-colors group-hover:text-tinta after:absolute after:inset-0 after:rounded-[1.75rem]"
          >
            {produto.nome}
          </Link>
          {produto.descricao && <p className="mt-1 text-[0.82rem] leading-snug text-cinza line-clamp-2">{produto.descricao}</p>}
          {/* O botão fica acima do link que cobre o cartão */}
          <div className="relative z-[1] mt-auto pt-3">
            <BotaoAdicionar produto={produto} className="!min-h-11 !text-[0.9rem]" />
          </div>
        </div>
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
}: {
  id: string;
  rotulo: string;
  titulo: ReactNode;
  href: string;
  produtos: ProdutoDTO[];
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

      {/* A grade: 3 x 2 no computador; no celular 2 x 2 (os dois últimos ficam para "ver tudo") */}
      <ul className="escalonado mt-8 md:mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 [&>li:nth-child(n+5)]:hidden md:[&>li:nth-child(n+5)]:block">
        {potes.map((p) => (
          <Pote key={p.id} produto={p} />
        ))}
      </ul>
    </section>
  );
}
