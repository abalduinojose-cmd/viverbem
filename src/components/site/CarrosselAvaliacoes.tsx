"use client";
// Avaliações do Google em faixa horizontal (rola para o lado).
//
// Sistema "Receita e rótulo" (06/10/2026): a frase do cliente é a
// protagonista, no itálico serifado (a voz humana), e a foto, o nome e as
// estrelas ficam pequenos embaixo. Fio à esquerda no lugar do cartão com
// sombra. Acima, só a média e a quantidade de avaliações do perfil
// (pedido do cliente em 05/10/2026).

import { useRef } from "react";
import {
  DepoimentoDTO,
  AVALIACOES_GOOGLE_NOTA,
  AVALIACOES_GOOGLE_TOTAL,
  PERFIL_GOOGLE_URL,
} from "@/lib/tipos";
import { Estrelas } from "./Estrelas";
import { asset } from "@/lib/asset";

// Logotipo "G" do Google
function IconeGoogle({ tamanho = 20 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-3l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC04" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.4 6.8 9 4.8 12 4.8z" />
    </svg>
  );
}

// Seta de rolar a faixa (fora do componente, para não ser recriada a
// cada renderização)
function SetaBotao({
  direcao,
  rotulo,
  aoClicar,
}: {
  direcao: -1 | 1;
  rotulo: string;
  aoClicar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-label={rotulo}
      className="botao botao-secundario w-12 !px-0"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direcao === -1 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function CarrosselAvaliacoes({ avaliacoes }: { avaliacoes: DepoimentoDTO[] }) {
  const faixaRef = useRef<HTMLDivElement>(null);

  // Rola uma "página" de fichas para o lado
  function rolar(direcao: -1 | 1) {
    const faixa = faixaRef.current;
    if (!faixa) return;
    faixa.scrollBy({ left: direcao * (faixa.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section aria-labelledby="titulo-avaliacoes" className="secao">
      <div className="revelar px-5 md:px-8 max-w-6xl mx-auto md:text-center">
        <p className="rotulo">quem já é cliente</p>
        <h2 id="titulo-avaliacoes" className="titulo-secao vao-rotulo">
          O que dizem <span className="italic">sobre a gente</span>
        </h2>

        {/* A média e a quantidade de avaliações, levando ao perfil do Google */}
        <a
          href={PERFIL_GOOGLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="botao botao-secundario mt-6 !gap-2.5 text-grafite"
        >
          <IconeGoogle tamanho={20} />
          <b className="font-semibold tabular-nums">
            {AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
          </b>
          <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={13} />
          <span className="text-cinza">
            <b className="font-semibold text-grafite tabular-nums">{AVALIACOES_GOOGLE_TOTAL}</b>{" "}
            avaliações<span className="hidden sm:inline"> no Google</span>
          </span>
        </a>
      </div>

      {/* Faixa rolável */}
      <div
        ref={faixaRef}
        className="vao-titulo flex gap-8 md:gap-10 overflow-x-auto rolagem-sem-barra px-5 md:px-8 pb-3 snap-x snap-mandatory"
      >
        {/* espaçador para alinhar com o container central em telas largas */}
        <div className="shrink-0 w-0 md:w-[max(0px,calc((100vw-72rem)/2))]" aria-hidden="true" />

        {avaliacoes.map((a) => (
          <figure
            key={a.id}
            className="snap-start shrink-0 w-[17.5rem] md:w-[22rem] border-l fio-ouro pl-5 md:pl-7 flex flex-col"
          >
            <blockquote className="citacao flex-1">{a.texto}</blockquote>

            <figcaption className="mt-6 flex items-center gap-3">
              {/* Foto do cliente ou inicial do nome */}
              {a.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset(a.fotoUrl)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full object-cover"
                  draggable={false}
                />
              ) : (
                <span className="w-10 h-10 rounded-full bg-gelo text-tinta flex items-center justify-center font-medium">
                  {a.nome.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="min-w-0">
                <span className="block font-medium text-grafite truncate">{a.nome}</span>
                <span className="flex items-center gap-1.5 mt-0.5">
                  <Estrelas nota={a.nota} tamanho={12} />
                  {a.fonte === "Google" && <IconeGoogle tamanho={12} />}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}

        <div className="shrink-0 w-2" aria-hidden="true" />
      </div>

      {/* Setas embaixo e centralizadas. No celular a pessoa arrasta, então
          elas nem aparecem. */}
      <div className="hidden sm:flex justify-center gap-3 mt-8">
        <SetaBotao direcao={-1} rotulo="Ver avaliações anteriores" aoClicar={() => rolar(-1)} />
        <SetaBotao direcao={1} rotulo="Ver próximas avaliações" aoClicar={() => rolar(1)} />
      </div>
    </section>
  );
}
