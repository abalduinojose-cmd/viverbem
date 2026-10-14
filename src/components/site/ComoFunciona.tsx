"use client";
// "Como funciona": a trilha do pedido pela receita, da foto da prescrição
// até a retirada ou a entrega, em quatro passos. Aparece na home, na
// página A Viver Bem e na página /como-funciona (sem o cabeçalho).
//
// Oitava versão (11/10/2026, pedido: "modernize ainda mais"): os passos
// EM STORIES. No computador, quatro barras de ouro no alto (as mesmas que
// contam os passos no letreiro da dobra) e quatro cartões; um passo de
// cada vez ACENDE em azul-noite, com a luz de ouro e a malha, enquanto a
// barra dele se enche em uns 4 s; depois passa ao próximo, em laço, só
// com a seção à vista. O mouse em cima pausa; tocar num cartão escolhe.
// Cada cartão leva o número grande em ouro itálico, o ícone num quadrado
// (gelo no claro, vidro no escuro), o título, o texto e o detalhe. Até o
// tablet, os cartões arrastam para o lado (pedido de 10/10/2026), todos
// claros, com a barra de ouro embaixo acompanhando a faixa. Depois dos
// passos, o convite da receita em azul-noite, largo (inalterado).
//
// Nona versão (14/10/2026, "deixe o Como funciona mais moderno; na
// versão mobile continue arrastando para o lado"): cartões mais baixos,
// sem o vazio embaixo; o número grande virou marca d'água no canto e, no
// alto, o ícone com "Passo 01"; o detalhe ganhou o visto de ouro; as
// barras dos stories saíram do alto e entraram no pé de cada cartão. Até
// o tablet a faixa continua arrastando para o lado, agora com pontos que
// acompanham o cartão à vista e levam a cada passo.
//
// Versões anteriores: 11/10 stepper com a linha de ouro e nós (sétima);
// 10/10 lista num cartão com o convite preso ao lado (sexta); 08/10 quatro
// cartões com traço e faixa (quinta); 07/10 um cartão dividido por fios
// (quarta). Esta seção absorveu as duas que contavam o mesmo processo.
//
// Texto de processo, não de resultado: manipulado não pode ter promessa
// de efeito (RDC 67/2007 e RDC 96/2008). Antes de mexer no texto, confirme
// com o farmacêutico responsável.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { UNIDADES, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { IconeLoja } from "./IconesVantagens";
import { IconeMoto } from "./IconeMoto";
import { IconeWhatsApp } from "./icones";

// Quanto tempo cada passo fica aceso no computador
const DURACAO_PASSO = 4200;

// Prancheta com o visto: o farmacêutico confere
function IconeConfere() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5H7.5A1.5 1.5 0 0 0 6 6.5v13A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 5H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M9 5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1H9V5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 14l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Frasco de laboratório: o preparo
function IconeFrasco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M10 3v6.5L4.6 19a1.5 1.5 0 0 0 1.3 2.2h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.2 16h9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

// Escudo com o visto: só com receita válida
function IconeEscudo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 5.8v5.4c0 4.4 3 8.3 7 9.8 4-1.5 7-5.4 7-9.8V5.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9.3 12 1.9 1.9 3.6-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Cadeado: a receita e os dados ficam com a equipe
function IconeCadeado() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const PASSOS = [
  {
    titulo: "Envie a receita",
    texto: "Envie a foto pelo WhatsApp ou traga a receita na loja.",
    detalhe: "Pelo site, o pedido já vai com o seu código.",
    icone: <IconeReceita tamanho={22} />,
  },
  {
    titulo: "O farmacêutico confere",
    texto: "Ele confere a receita e informa o valor e o prazo.",
    detalhe: "Você confirma só se estiver de acordo.",
    icone: <IconeConfere />,
  },
  {
    titulo: "Preparo",
    texto: "A fórmula é preparada no laboratório depois do pedido. Nada fica pronto na prateleira.",
    detalhe: "O rótulo sai com o seu nome, a fórmula e a validade.",
    icone: <IconeFrasco />,
  },
  {
    titulo: "Retire ou receba",
    texto: `Sem custo em uma das ${UNIDADES.length} lojas, ou em casa, pelo Delivery, em Petrópolis e Região.`,
    detalhe: "A taxa e o prazo da entrega são combinados pelo WhatsApp.",
    icone: <IconeMoto tamanho={22} />,
    lojas: true,
  },
];

// A linha de confiança, no convite: o aviso legal em dois pontos curtos
const CONFIANCA = [
  { icone: <IconeEscudo />, texto: "Manipulação com receita válida." },
  { icone: <IconeCadeado />, texto: "Sua receita e seus dados ficam só com a nossa equipe." },
];

// Só o computador acende os passos; até o tablet a pessoa arrasta
const CONSULTA_COMPUTADOR = "(min-width: 64rem)";
function assinarLargura(avisar: () => void) {
  const consulta = window.matchMedia(CONSULTA_COMPUTADOR);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}
const lerLargura = () => window.matchMedia(CONSULTA_COMPUTADOR).matches;
const lerLarguraNoServidor = () => false;

export function ComoFunciona({
  className = "secao",
  cabecalho = true,
}: {
  className?: string;
  /** Falso na página /como-funciona, que já tem o próprio título */
  cabecalho?: boolean;
}) {
  const computador = useSyncExternalStore(assinarLargura, lerLargura, lerLarguraNoServidor);
  const faixa = useRef<HTMLOListElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  // Conta as retomadas: a barra remonta e recomeça junto com o tempo
  const [rodada, setRodada] = useState(0);

  // Só anda com a fileira à vista
  useEffect(() => {
    const el = faixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.3 });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // O próximo passo, depois da duração (pausa com o mouse em cima)
  useEffect(() => {
    if (!computador || !visivel || pausado) return;
    const tempo = setTimeout(() => setAtivo((a) => (a + 1) % PASSOS.length), DURACAO_PASSO);
    return () => clearTimeout(tempo);
  }, [ativo, rodada, computador, visivel, pausado]);

  const escolher = (i: number) => {
    setAtivo(i);
    setRodada((r) => r + 1);
  };

  // Até o tablet: qual cartão está à vista na faixa (pelo arrasto) e o
  // ponto que leva a cada um
  const [noCelular, setNoCelular] = useState(0);
  const aoRolarFaixa = () => {
    const el = faixa.current;
    if (!el || computador) return;
    const primeiro = el.firstElementChild as HTMLElement | null;
    if (!primeiro) return;
    const passo = primeiro.offsetWidth + 14;
    const i = Math.max(0, Math.min(PASSOS.length - 1, Math.round(el.scrollLeft / passo)));
    if (i !== noCelular) setNoCelular(i);
  };
  const irPara = (i: number) => {
    const el = faixa.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (!el || !alvo) return;
    el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft - 20, behavior: "smooth" });
  };

  return (
    <section
      id="como-funciona"
      aria-labelledby={cabecalho ? "titulo-como-funciona" : "titulo-passos"}
      className={`max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)] ${className}`}
    >
      {/* Sem o cabeçalho visível (na página Como funciona, o h1 da página
          faz o papel dele), o h2 fica só para leitor de tela: sem ele a
          página pulava do h1 direto para o h3 dos passos (13/10/2026) */}
      {!cabecalho && (
        <h2 id="titulo-passos" className="sr-only">
          Os quatro passos do pedido
        </h2>
      )}

      {/* ---------- Cabeçalho: rótulo, título em duas vozes e o apoio ---------- */}
      {cabecalho && (
        <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">como funciona</p>
            <h2 id="titulo-como-funciona" className="titulo-secao vao-rotulo">
              Do envio da receita <span className="italic">à entrega</span>
            </h2>
          </div>
          <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5 lg:text-right">
            Quatro passos, pelo WhatsApp e com o farmacêutico. Cada fórmula é preparada depois
            do pedido, conforme a receita.
          </p>
        </div>
      )}

      {/* ---------- Os quatro passos: stories no computador, faixa arrastável até o tablet ---------- */}
      <div className={`passos-escopo ${cabecalho ? "vao-titulo" : ""}`}>
        <ol
          ref={faixa}
          onScroll={aoRolarFaixa}
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => {
            setPausado(false);
            setRodada((r) => r + 1);
          }}
          className="passos-faixa relative flex gap-3.5 overflow-x-auto rolagem-sem-barra snap-x snap-mandatory scroll-pl-5 -mx-5 px-5 pb-2 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0"
        >
          {PASSOS.map((p, i) => {
            const aceso = computador && i === ativo;
            const feito = computador && i < ativo;
            return (
              <li
                key={p.titulo}
                onClick={() => escolher(i)}
                className={`passo-cartao group relative flex w-[min(19rem,80vw)] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] p-5 md:p-6 transition-[background-color,box-shadow,transform] duration-500 lg:w-auto lg:shrink lg:cursor-pointer ${
                  aceso
                    ? "bg-noite text-white shadow-[0_30px_60px_-34px_rgba(13,35,64,0.7)] ring-1 ring-inset ring-white/10 lg:-translate-y-1.5"
                    : "bg-white text-navy ring-1 ring-inset ring-fio shadow-[0_24px_50px_-42px_rgba(16,42,74,0.45)] lg:hover:ring-ouro/45 lg:hover:-translate-y-0.5"
                }`}
              >
                {/* A atmosfera do cartão aceso: a malha e a luz de ouro, em fade */}
                <span aria-hidden="true" className={`malha-banner transition-opacity duration-500 ${aceso ? "opacity-100" : "opacity-0"}`} />
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.34),transparent_62%)] transition-opacity duration-500 ${
                    aceso ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* O número em marca d'água, grande, no canto de cima */}
                <span
                  aria-hidden="true"
                  className={`numero-tinta pointer-events-none absolute right-5 top-2 text-[4.6rem] md:text-[5rem] leading-none transition-opacity duration-500 ${
                    aceso ? "opacity-40" : "opacity-30"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* O ícone e o "Passo 01" */}
                <span className="relative flex items-center gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                      aceso ? "bg-white/10 text-[#e1c68f] ring-1 ring-white/15" : "bg-gelo text-tinta"
                    }`}
                  >
                    {p.icone}
                  </span>
                  <span className={`text-[0.6875rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 ${aceso ? "text-white/60" : "text-cinza"}`}>
                    Passo {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <h3 className="relative mt-5 text-[1.2rem] md:text-[1.28rem] font-semibold tracking-[-0.03em] leading-snug">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {p.titulo}
                </h3>
                <p className={`relative mt-2 text-[0.93rem] leading-relaxed transition-colors duration-500 ${aceso ? "text-white/80" : "text-grafite"}`}>{p.texto}</p>

                {/* O detalhe, com o visto */}
                <p className={`relative mt-3.5 flex gap-2 text-[0.82rem] leading-snug transition-colors duration-500 ${aceso ? "text-white/60" : "text-cinza"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`shrink-0 mt-px ${aceso ? "text-[#e1c68f]" : "text-ouro-escuro"}`}>
                    <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p.detalhe}
                </p>

                {/* Passo 04: as lojas, em chips com o mapa */}
                {p.lojas && (
                  <ul className="relative flex flex-wrap gap-1.5 pt-3.5">
                    {UNIDADES.map((u) => (
                      <li key={u.bairro}>
                        <a
                          href={linkMapaUnidade(u.bairro, u.endereco)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="chip !min-h-8 !px-3 text-[0.78rem]"
                          title={u.endereco}
                        >
                          <span className="mr-1.5 -ml-0.5 text-ouro">
                            <IconeLoja tamanho={13} />
                          </span>
                          {u.bairro}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* A barra do passo (só no computador): cheia nos que já
                    passaram, enchendo no aceso, vazia nos próximos */}
                <span aria-hidden="true" className="relative mt-auto hidden lg:block pt-5">
                <span className={`block h-[3px] w-full overflow-hidden rounded-full ${aceso ? "bg-white/15" : "bg-fio"}`}>
                  {feito && <span className="block h-full w-full rounded-full bg-[image:var(--ouro-degrade)]" />}
                  {aceso && (
                    <span
                      key={`${ativo}-${rodada}`}
                      className="passo-barra-enche block h-full w-full rounded-full bg-[image:var(--ouro-degrade)]"
                      style={{ animationDuration: `${DURACAO_PASSO}ms`, animationPlayState: pausado ? "paused" : "running" }}
                    />
                  )}
                </span>
                </span>
              </li>
            );
          })}
        </ol>

        {/* Até o tablet: os pontos que acompanham o arrasto e levam ao passo */}
        <div className="lg:hidden mt-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            {PASSOS.map((p, i) => (
              <button
                key={p.titulo}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ir para o passo ${i + 1}`}
                aria-current={i === noCelular ? "step" : undefined}
                className="flex h-6 items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === noCelular ? "w-7 bg-[image:var(--ouro-degrade)]" : "w-1.5 bg-fio"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-cinza tabular-nums">
            {noCelular + 1}/{PASSOS.length}
          </span>
        </div>
      </div>

      {/* ---------- O convite da receita, largo ---------- */}
      <div className="revelar relative mt-10 md:mt-14 overflow-hidden rounded-[2rem] banner-noite em-noite p-6 md:p-8 lg:px-10 lg:py-9 text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
        <span aria-hidden="true" className="malha-banner" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.3),transparent_62%)]"
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 lg:items-center">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">receita em mãos?</p>
            <p className="titulo-banner mt-3 text-[1.6rem] md:text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
              Envie a foto <span className="italic">da sua receita.</span>
            </p>
            <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-white/70">
              A foto vai pelo WhatsApp. O farmacêutico confere e responde com o valor e o
              prazo.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row lg:justify-end">
            <BotaoEnviarReceita comIcone={false} className="botao botao-vivo !gap-2.5">
              <span className="text-ouro-escuro">
                <IconeReceita tamanho={20} />
              </span>
              Enviar receita
            </BotaoEnviarReceita>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="botao botao-vidro !gap-2.5"
            >
              <IconeWhatsApp tamanho={18} className="text-[#25D366]" />
              Tirar uma dúvida
            </a>
          </div>
        </div>
        {/* A linha de confiança */}
        <ul className="relative mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-[0.8rem] leading-snug text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {CONFIANCA.map((c) => (
            <li key={c.texto} className="flex items-center gap-2.5">
              <span className="shrink-0 text-ouro-claro">{c.icone}</span>
              {c.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
