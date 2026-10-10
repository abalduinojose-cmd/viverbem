"use client";
// Avaliações do Google em faixa horizontal (rola para o lado; no
// computador também arrasta com o mouse). A faixa abre com o cartão da
// nota em azul-noite (a média com as estrelas em ouro, as fotos de quem
// avaliou e o total do perfil) e segue com os cartões dos clientes: aspas
// em ouro, o texto na sans do site e, embaixo, a foto, o nome e as
// estrelas. (Pedidos do usuário em 06/10/2026: sem o itálico serifado
// aqui, visual mais limpo e moderno; o cartão da nota preenchido, "estava
// muito vago".)

import { useRef } from "react";
import {
  DepoimentoDTO,
  AVALIACOES_GOOGLE_NOTA,
  AVALIACOES_GOOGLE_TOTAL,
  PERFIL_GOOGLE_URL,
} from "@/lib/tipos";
import { useArrasteHorizontal } from "@/lib/useArrasteHorizontal";
import { Estrelas } from "./Estrelas";
import { SetaDireita } from "./icones";
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

// Aspas de abertura, em ouro, no alto de cada cartão
function Aspas() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="currentColor" aria-hidden="true" className="text-ouro-claro">
      <path d="M0 22V12.6C0 5.4 3.9 1.3 11.7 0l1.1 2.6C8.4 3.9 6.2 6.3 6 10h5.8v12H0Zm16.2 0V12.6C16.2 5.4 20.1 1.3 27.9 0L29 2.6c-4.4 1.3-6.6 3.7-6.8 7.4H28v12H16.2Z" />
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

const NOTA = AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 });

export function CarrosselAvaliacoes({ avaliacoes }: { avaliacoes: DepoimentoDTO[] }) {
  const faixaRef = useRef<HTMLDivElement>(null);
  const arraste = useArrasteHorizontal(faixaRef);

  // Rola uma "página" de cartões para o lado
  function rolar(direcao: -1 | 1) {
    const faixa = faixaRef.current;
    if (!faixa) return;
    faixa.scrollBy({ left: direcao * (faixa.clientWidth * 0.8), behavior: "smooth" });
  }

  // As fotos de quem avaliou, empilhadas no cartão da nota
  const rostos = avaliacoes.filter((a) => a.fotoUrl).slice(0, 4);

  return (
    <section aria-labelledby="titulo-avaliacoes" className="secao">
      <div className="revelar px-5 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="rotulo-pilula">quem já é cliente</p>
          <h2 id="titulo-avaliacoes" className="titulo-secao vao-rotulo">
            O que dizem <span className="italic">sobre a gente</span>
          </h2>
        </div>
        {/* Quem avaliou (07/10/2026, "modernize"): os rostos empilhados, o
            total num círculo de ouro e a nota, sem caixa. Leva ao perfil. */}
        <a
          href={PERFIL_GOOGLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group self-start md:self-auto flex items-center gap-4 md:pb-1"
        >
          <span className="flex -space-x-3 shrink-0">
            {rostos.map((a) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={a.id}
                src={asset(a.fotoUrl as string)}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="w-11 h-11 rounded-full object-cover ring-[3px] ring-white shadow-[0_6px_14px_-8px_rgba(54,52,107,0.5)]"
                draggable={false}
              />
            ))}
            <span className="w-11 h-11 rounded-full bg-[image:var(--ouro-degrade)] text-navy ring-[3px] ring-white flex items-center justify-center text-[0.72rem] font-semibold tabular-nums">
              +{AVALIACOES_GOOGLE_TOTAL - rostos.length}
            </span>
          </span>
          <span className="leading-tight">
            <span className="flex items-center gap-2">
              <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={13} />
              <span className="text-sm font-semibold text-navy tabular-nums">{NOTA} no Google</span>
            </span>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm text-cinza transition-colors group-hover:text-tinta">
              {AVALIACOES_GOOGLE_TOTAL} avaliações · ver todas
              <SetaDireita tamanho={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </span>
        </a>
      </div>

      {/* Faixa rolável (e arrastável com o mouse) */}
      <div
        ref={faixaRef}
        {...arraste.props}
        className={`vao-titulo flex gap-4 md:gap-5 overflow-x-auto rolagem-sem-barra px-5 md:px-8 scroll-pl-5 md:scroll-pl-8 pb-3 snap-x snap-mandatory md:cursor-grab ${
          arraste.arrastando ? "md:cursor-grabbing select-none snap-none" : ""
        }`}
      >
        {/* espaçador para alinhar com o container central em telas largas */}
        <div className="shrink-0 w-0 md:w-[max(0px,calc((100vw-80rem)/2))]" aria-hidden="true" />

        {/* O cartão da nota, abrindo a faixa */}
        <a
          href={PERFIL_GOOGLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="banner-noite em-noite snap-start shrink-0 w-[15rem] md:w-[17rem] rounded-[1.75rem] p-5 md:p-6 flex flex-col text-white transition duration-300 hover:-translate-y-1"
        >
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-medium">
            <IconeGoogle tamanho={14} />
            Avaliações no Google
          </span>

          {/* A nota, grande, com a escala ao lado e as estrelas embaixo */}
          <span className="mt-6 flex items-end gap-3">
            <span className="text-[4rem] md:text-[4.5rem] font-semibold leading-none tracking-[-0.05em] tabular-nums">{NOTA}</span>
            <span className="pb-2 text-white/60 text-sm leading-tight">
              de 5<br />
              nota máxima
            </span>
          </span>
          <span className="mt-3 inline-flex">
            <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={20} />
          </span>

          {/* Quem avaliou: fotos empilhadas e o total do perfil */}
          <span className="mt-auto pt-7 flex items-center gap-3">
            {rostos.length > 0 && (
              <span className="flex -space-x-2.5 shrink-0">
                {rostos.map((a) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={a.id}
                    src={asset(a.fotoUrl as string)}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-navy"
                    draggable={false}
                  />
                ))}
              </span>
            )}
            <span className="text-xs text-white/65 leading-snug">
              <b className="block text-white text-sm font-semibold tabular-nums">{AVALIACOES_GOOGLE_TOTAL} avaliações</b>
              de quem já é cliente
            </span>
          </span>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ouro-claro">
            Ver todas no Google
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>

        {avaliacoes.map((a) => (
          <figure
            key={a.id}
            className="snap-start shrink-0 w-[17rem] md:w-[19.5rem] rounded-[1.75rem] border border-fio bg-gradient-to-b from-white to-gelo/50 p-5 flex flex-col gap-3.5 transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(54,52,107,0.45)]"
          >
            <Aspas />
            <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-grafite">{a.texto}</blockquote>
            <figcaption className="flex items-center gap-3 pt-4 border-t border-fio/70">
              {a.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset(a.fotoUrl)}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                  draggable={false}
                />
              ) : (
                <span className="w-10 h-10 rounded-full bg-gelo text-tinta flex items-center justify-center font-semibold">
                  {a.nome.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy text-[0.95rem] truncate">{a.nome}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-cinza">
                  <Estrelas nota={a.nota} tamanho={11} />
                  {a.fonte === "Google" && <span>no Google</span>}
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
