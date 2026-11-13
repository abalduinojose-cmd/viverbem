"use client";
// Vitrine dos vídeos do Instagram da farmácia, no formato vertical dos
// reels. Os arquivos ficam em public/videos/, com a capa de cada um ao
// lado (reel-N.jpg, gerada por scripts/gerar-posteres.js).
//
// Versão interativa (07/10/2026, "modernize a seção e o botão do
// Instagram, faça algo em JavaScript"): quatro reels numa fileira (faixa
// que arrasta no celular e no tablet, com o ativo no centro e vídeos dos
// dois lados; lado a lado no computador). Um deles é o "ativo": maior, com
// o anel de ouro e a barra de progresso que enche enquanto toca, como nos
// stories; quando termina, o próximo entra sozinho (e a faixa centraliza
// nele no celular). Botão de som no cartão que está tocando. No
// computador, sem "reduzir movimento", o ativo começa mudo quando a seção
// entra na tela e para quando sai; quem pausou não é interrompido de novo.
// O botão do Instagram é uma pílula azul-noite com o anel dos stories
// (13/11/2026).
//
// Terceira passada (07/10/2026, "modernize mas deixe clean"): o cabeçalho
// ficou em duas colunas no computador, com o botão do Instagram ao lado
// do título (como o selo do Google nas avaliações); os cartões perderam o
// ícone do Instagram repetido e a caixa de vidro da legenda: só a capa, um
// véu escuro embaixo, o título em branco e o botão de tocar.
//
// Som (10/10/2026, "os vídeos do Instagram estão sem áudio, acerte isso"):
// antes tudo começava mudo e o som só vinha pelo botãozinho. Agora o
// clique em "tocar" (um gesto da pessoa, que o navegador aceita com som)
// já abre COM áudio; só a reprodução automática do computador, quando a
// seção entra na tela, continua muda, porque o navegador não deixa tocar
// som sem gesto. Depois do primeiro clique, o que a pessoa escolher no
// botão de som vale para os próximos.
//
// Cada vídeo só é baixado quando toca (preload="none"), para a home não
// pesar. Antes de colocar um reel novo aqui, o farmacêutico precisa ver (e
// ouvir) o vídeo inteiro: manipulado não pode ser anunciado com promessa
// de efeito, nome de marca em destaque ou preço (RDC 67/2007, item 5.14;
// RE 3.547/2026). Os reels 3 e 4 entraram a pedido do usuário em
// 07/10/2026 e falam de produtos: essa conferência ainda está pendente.

import { useCallback, useEffect, useRef, useState } from "react";
import { INSTAGRAM_PERFIL, INSTAGRAM_URL } from "@/lib/tipos";
import { asset } from "@/lib/asset";
import { IconeInstagram } from "./icones";
import { SegurarParaVer } from "./SegurarParaVer";
import { VisorReels, type ControleVisor } from "./VisorReels";

const REELS = [
  { arquivo: "/videos/reel-1.mp4", capa: "/videos/reel-1.webp", titulo: "Curiosidades da manipulação" },
  { arquivo: "/videos/reel-2.mp4", capa: "/videos/reel-2.webp", titulo: "Quem faz a Viver Bem" },
  { arquivo: "/videos/reel-3.mp4", capa: "/videos/reel-3.webp", titulo: "Área dos olhos" },
  { arquivo: "/videos/reel-4.mp4", capa: "/videos/reel-4.webp", titulo: "Pads faciais" },
];

// O que aparece no centro quando a pessoa segura um reel no celular
// (adendo 69): o vídeo tocando mudo, em laço, enquanto o dedo está em cima.
// O play é dado aqui, e não pelo autoPlay: o React marca o mudo só pela
// propriedade, sem o atributo `muted`, e sem o atributo o navegador
// carregava o cabeçalho do vídeo e parava (o iPhone exige o atributo).
function PreviaReel({ reel }: { reel: (typeof REELS)[number] }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.play().catch(() => {});
  }, []);
  return (
    <div className="aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
      <video
        ref={video}
        src={asset(reel.arquivo)}
        poster={asset(reel.capa)}
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function IconeSom({ mudo }: { mudo: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {mudo ? (
        <path d="m16 9.5 4 5m0-5-4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

// O botão do Instagram (13/11/2026, "o botão do Instagram não está legal,
// poderia melhorar; melhore a seção por dentro"): uma pílula AZUL-NOITE,
// de alto contraste no fundo branco, como um cartão de perfil. À esquerda
// o ícone num círculo branco cercado pelo ANEL DOS STORIES em ouro e
// no vermelho da onda da logo, que gira devagar com o mouse em
// cima; no meio "Seguir no Instagram" e o @ do perfil; à direita a seta
// num círculo de vidro, que avança no hover. Sem o "ímã" de antes.
function BotaoInstagram({ className = "" }: { className?: string }) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/ig inline-flex h-[3.75rem] items-center gap-3 rounded-full bg-navy pl-1.5 pr-1.5 text-white shadow-[0_22px_44px_-24px_rgba(13,35,64,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-inset ring-white/10 transition hover:-translate-y-0.5 hover:shadow-[0_26px_48px_-22px_rgba(13,35,64,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-[0.98] ${className}`}
    >
      {/* O anel dos stories, girando só no hover */}
      <span className="relative flex size-12 shrink-0 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#c9a56b,#efe2b8,#e02129,#e8d4a6,#c9a56b)] motion-safe:group-hover/ig:animate-[spin_2.6s_linear_infinite]"
        />
        {/* O vão azul-noite entre o anel e o círculo branco, como nos stories */}
        <span className="relative flex size-[2.6rem] items-center justify-center rounded-full bg-navy">
          <span className="flex size-[2.15rem] items-center justify-center rounded-full bg-white text-navy">
            <IconeInstagram tamanho={18} />
          </span>
        </span>
      </span>
      <span className="flex min-w-0 flex-col items-start leading-none">
        <span className="text-[1rem] font-semibold tracking-[-0.015em]">Seguir no Instagram</span>
        <span className="mt-1.5 text-[0.76rem] font-medium text-white/60">@{INSTAGRAM_PERFIL}</span>
      </span>
      <span
        aria-hidden="true"
        className="ml-2 flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-ouro-claro ring-1 ring-inset ring-white/15 transition group-hover/ig:bg-white/20"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover/ig:translate-x-0.5 group-hover/ig:-translate-y-0.5">
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

export function ReelsInstagram() {
  const secaoRef = useRef<HTMLElement>(null);
  const faixaRef = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const barras = useRef<(HTMLSpanElement | null)[]>([]);
  const cartoes = useRef<(HTMLDivElement | null)[]>([]);
  const ativoRef = useRef(0);
  // A pessoa pausou de propósito: a seção não volta a tocar sozinha
  const pausouPorConta = useRef(false);

  const [ativo, setAtivo] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [mudo, setMudo] = useState(true);
  // A pessoa já clicou para tocar: dali em diante vale a escolha dela de som
  const somLiberado = useRef(false);
  // O visor em tela cheia (adendo 69) e o tipo do último toque no cartão:
  // dedo abre o visor; mouse e teclado tocam no próprio cartão, como antes
  const visor = useRef<ControleVisor>(null);
  const tipoToque = useRef("");

  function abrirVisor(i: number) {
    pausouPorConta.current = true;
    videos.current.forEach((v) => v && !v.paused && v.pause());
    setTocando(false);
    visor.current?.abrir(i);
  }

  // Centraliza o cartão na faixa (celular); no computador não há rolagem
  function centralizar(i: number) {
    const faixa = faixaRef.current;
    const cartao = cartoes.current[i];
    if (!faixa || !cartao || faixa.scrollWidth <= faixa.clientWidth) return;
    const alvo = cartao.offsetLeft - (faixa.clientWidth - cartao.clientWidth) / 2;
    faixa.scrollTo({ left: Math.max(0, alvo), behavior: "smooth" });
  }

  const pausarTodos = useCallback(() => {
    videos.current.forEach((v) => {
      if (v && !v.paused) v.pause();
    });
    setTocando(false);
  }, []);

  // `silencio` força mudo (reprodução automática) ou com som (primeiro
  // clique); sem ele vale o estado do botão de som
  const tocar = useCallback(
    (i: number, silencio?: boolean) => {
      videos.current.forEach((v, k) => {
        if (v && k !== i && !v.paused) v.pause();
      });
      const video = videos.current[i];
      if (!video) return;
      video.muted = silencio ?? mudo;
      ativoRef.current = i;
      setAtivo(i);
      centralizar(i);
      video
        .play()
        .then(() => setTocando(true))
        .catch(() => setTocando(false));
    },
    [mudo]
  );

  function alternar(i: number) {
    if (i === ativo && tocando) {
      pausouPorConta.current = true;
      pausarTodos();
      return;
    }
    pausouPorConta.current = false;
    // O primeiro clique abre com som; depois vale o botão de som
    if (!somLiberado.current) {
      somLiberado.current = true;
      setMudo(false);
      tocar(i, false);
      return;
    }
    tocar(i);
  }

  // Terminou: zera a barra e passa para o próximo
  function aoTerminar(i: number) {
    const barra = barras.current[i];
    if (barra) barra.style.transform = "scaleX(0)";
    if (i !== ativoRef.current) return;
    tocar((i + 1) % REELS.length);
  }

  // A barra enche com o tempo do vídeo (sem passar pelo estado do React)
  function aoProgresso(i: number) {
    const video = videos.current[i];
    const barra = barras.current[i];
    if (!video || !barra || !video.duration) return;
    barra.style.transform = `scaleX(${(video.currentTime / video.duration).toFixed(4)})`;
  }

  function alternarSom() {
    const novo = !mudo;
    videos.current.forEach((v) => {
      if (v) v.muted = novo;
    });
    setMudo(novo);
  }

  // No computador (sem "reduzir movimento") o ativo começa quando a seção
  // aparece (mudo, até a pessoa clicar: o navegador não toca som sem
  // gesto), e tudo para quando ela sai da tela
  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) {
          pausarTodos();
          return;
        }
        const computador = window.matchMedia("(min-width: 1024px)").matches;
        const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (computador && !semMovimento && !pausouPorConta.current) {
          tocar(ativoRef.current, somLiberado.current ? undefined : true);
        }
      },
      { threshold: 0.5 }
    );
    observador.observe(secao);
    return () => observador.disconnect();
  }, [tocar, pausarTodos]);

  // No celular a faixa abre com o SEGUNDO reel no centro, para já haver
  // vídeo dos dois lados (07/10/2026); só mexe na rolagem, sem estado
  useEffect(() => {
    const faixa = faixaRef.current;
    const cartao = cartoes.current[1];
    if (!faixa || !cartao || faixa.scrollWidth <= faixa.clientWidth + 4) return;
    faixa.scrollTo({ left: Math.max(0, cartao.offsetLeft - (faixa.clientWidth - cartao.clientWidth) / 2) });
  }, []);

  // No celular, o cartão que a pessoa deixou no centro vira o ativo
  useEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        // Só vale quando a faixa rola (celular): no computador os quatro
        // cabem na tela e todos "entram" de uma vez
        if (faixa.scrollWidth <= faixa.clientWidth + 4) return;
        if (videos.current.some((v) => v && !v.paused)) return;
        const maisVisivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!maisVisivel) return;
        const i = cartoes.current.indexOf(maisVisivel.target as HTMLDivElement);
        if (i >= 0) {
          ativoRef.current = i;
          setAtivo(i);
        }
      },
      { root: faixa, threshold: 0.75 }
    );
    cartoes.current.forEach((c) => c && observador.observe(c));
    return () => observador.disconnect();
  }, []);

  return (
    <section ref={secaoRef} aria-labelledby="titulo-reels" className="secao max-w-7xl mx-auto px-5 md:px-8">
      {/* ---------- Cabeçalho: título à esquerda, o Instagram à direita ---------- */}
      <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 lg:items-end">
        <div className="lg:col-span-7 max-w-2xl">
          <p className="rotulo-pilula">acompanhe a gente</p>
          <h2 id="titulo-reels" className="titulo-secao vao-rotulo">
            Por dentro da <span className="italic">Viver Bem</span>
          </h2>
          <p className="texto-apoio mt-4 max-w-md">
            Conheça nosso laboratório, nossas lojas e a equipe Viver Bem, direto do
            Instagram.
          </p>
        </div>
        <div className="hidden lg:flex lg:col-span-5 lg:justify-end lg:pb-1.5">
          <BotaoInstagram />
        </div>
      </div>

      {/* ---------- Os reels: faixa no celular e no tablet, fileira no computador ---------- */}
      <div
        ref={faixaRef}
        className="revelar vao-titulo flex items-end gap-3 md:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none rolagem-sem-barra px-[calc(50%-min(7.5rem,35vw))] pb-2 lg:px-0 lg:pb-0 lg:justify-center"
      >
        {REELS.map((reel, i) => {
          const ehAtivo = i === ativo;
          const estaTocando = ehAtivo && tocando;
          return (
            <div
              key={reel.arquivo}
              ref={(el) => {
                cartoes.current[i] = el;
              }}
              className={`group relative shrink-0 snap-center w-[min(15rem,70vw)] lg:w-[14rem] xl:w-[16rem] aspect-[9/16] overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem] bg-navy ring-1 transition duration-500 ${
                ehAtivo
                  ? "ring-2 ring-ouro shadow-[0_30px_60px_-30px_rgba(13,35,64,0.6)]"
                  : "ring-fio lg:scale-[0.94] lg:opacity-80 lg:hover:opacity-100"
              }`}
            >
              <SegurarParaVer
                className="absolute inset-0"
                largura="min(78vw, 20rem, calc((100dvh - 7rem) * 0.5625))"
                previa={<PreviaReel reel={reel} />}
              >
                {/* Sem `el.muted = true` aqui: esta função roda de novo a cada
                    renderização e silenciava o vídeo logo depois do clique no
                    som (era a causa do "sem áudio"). Quem decide o mudo é
                    tocar(), antes de cada play. */}
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={asset(reel.arquivo)}
                  poster={asset(reel.capa)}
                  preload="none"
                  playsInline
                  onTimeUpdate={() => aoProgresso(i)}
                  onEnded={() => aoTerminar(i)}
                  className="w-full h-full object-cover"
                />

                {/* Barra de progresso fina no alto, como nos stories */}
                <span aria-hidden="true" className="absolute top-3 left-4 right-4 h-[3px] rounded-full bg-white/30 overflow-hidden">
                  <span
                    ref={(el) => {
                      barras.current[i] = el;
                    }}
                    className="block h-full w-full origin-left bg-[image:var(--ouro-degrade)]"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>

                {/* Tocar e pausar: o cartão inteiro */}
                <button
                  type="button"
                  onPointerDown={(e) => (tipoToque.current = e.pointerType)}
                  onClick={() => {
                    const dedo = tipoToque.current === "touch";
                    tipoToque.current = "";
                    if (dedo) abrirVisor(i);
                    else alternar(i);
                  }}
                  aria-label={estaTocando ? `Pausar: ${reel.titulo}` : `Assistir: ${reel.titulo}`}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* O véu escuro embaixo, para o título ler bem; some enquanto toca */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-t from-noite/75 via-noite/10 to-noite/15 transition-opacity duration-300 ${
                      estaTocando ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`relative w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-navy flex items-center justify-center shadow-[0_14px_30px_-12px_rgba(16,42,74,0.55)] transition duration-300 ${
                      estaTocando
                        ? "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                        : "opacity-100 group-hover:scale-105"
                    }`}
                  >
                    {estaTocando ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" rx="1.2" />
                        <rect x="14" y="5" width="4" height="14" rx="1.2" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="translate-x-px">
                        <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
                      </svg>
                    )}
                  </span>
                </button>

                {/* Som, só no que está tocando */}
                {estaTocando && (
                  <button
                    type="button"
                    data-sem-segurar
                    onClick={alternarSom}
                    aria-label={mudo ? "Ativar o som" : "Silenciar"}
                    aria-pressed={!mudo}
                    className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 flex items-center justify-center transition"
                  >
                    <IconeSom mudo={mudo} />
                  </button>
                )}

                {/* O título, em branco sobre o véu; some enquanto toca */}
                <span
                  className={`pointer-events-none absolute left-4 right-4 bottom-4 text-white text-[0.95rem] sm:text-[1rem] font-semibold leading-snug tracking-[-0.015em] transition-opacity duration-300 ${
                    estaTocando ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-claro mb-1">
                    Reel
                  </span>
                  {reel.titulo}
                </span>

                {/* Computador: abre o mesmo visor em tela cheia */}
                <button
                  type="button"
                  data-sem-segurar
                  onClick={() => abrirVisor(i)}
                  aria-label={`Ver em tela cheia: ${reel.titulo}`}
                  className="absolute right-3 top-6 hidden h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition hover:bg-white/35 focus-visible:opacity-100 group-hover:opacity-100 lg:flex"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </SegurarParaVer>
            </div>
          );
        })}
      </div>

      {/* Bolinhas: qual reel está ativo (e atalho para ele) */}
      <div className="mt-4 flex justify-center gap-1" role="tablist" aria-label="Qual vídeo mostrar">
        {REELS.map((reel, i) => (
          <button
            key={reel.arquivo}
            type="button"
            role="tab"
            aria-selected={i === ativo}
            aria-label={reel.titulo}
            onClick={() => {
              pausouPorConta.current = true;
              pausarTodos();
              ativoRef.current = i;
              setAtivo(i);
              centralizar(i);
            }}
            className="group/ponto flex h-11 min-w-8 items-center justify-center px-1"
          >
            {/* A bolinha é pequena; a área de toque é o botão inteiro (44px) */}
            <span
              aria-hidden="true"
              className={`block h-2.5 rounded-full transition-[width,background-color] duration-300 ease-out ${
                i === ativo ? "w-7 bg-[image:var(--ouro-degrade)]" : "w-2.5 bg-fio group-hover/ponto:bg-ouro/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Abaixo do computador o botão do Instagram fica embaixo, centralizado */}
      <div className="revelar mt-5 flex justify-center lg:hidden">
        <BotaoInstagram />
      </div>

      <VisorReels reels={REELS} ref={visor} />
    </section>
  );
}
