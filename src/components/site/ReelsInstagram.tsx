"use client";
// Vitrine dos vídeos do Instagram da farmácia, no formato vertical dos
// reels. Os arquivos ficam em public/videos/, com a capa de cada um ao
// lado (reel-N.jpg, gerada por scripts/gerar-posteres.js).
//
// Versão interativa (07/10/2026, "modernize a seção e o botão do
// Instagram, faça algo em JavaScript"): quatro reels numa fileira (faixa
// que arrasta no celular, lado a lado no computador). Um deles é o
// "ativo": maior, com o anel de ouro e a barra de progresso que enche
// enquanto toca, como nos stories; quando termina, o próximo entra
// sozinho (e a faixa centraliza nele no celular). Botão de som no cartão
// que está tocando. No computador, sem "reduzir movimento", o ativo começa
// mudo quando a seção entra na tela e para quando sai; quem pausou não é
// interrompido de novo. O botão do Instagram tem o anel de ouro que gira e
// um leve "ímã" que segue o mouse.
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

const REELS = [
  { arquivo: "/videos/reel-1.mp4", capa: "/videos/reel-1.jpg", titulo: "Curiosidades da manipulação" },
  { arquivo: "/videos/reel-2.mp4", capa: "/videos/reel-2.jpg", titulo: "Quem faz a Viver Bem" },
  { arquivo: "/videos/reel-3.mp4", capa: "/videos/reel-3.jpg", titulo: "Área dos olhos" },
  { arquivo: "/videos/reel-4.mp4", capa: "/videos/reel-4.jpg", titulo: "Pads faciais" },
];

function IconeInstagram({ tamanho = 20 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
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

// O botão do Instagram: anel de ouro que gira enquanto o mouse está em
// cima e um leve "ímã" que acompanha o ponteiro (só mouse; no toque fica
// parado). Tudo em JavaScript, sem animação permanente.
function BotaoInstagram() {
  const anel = useRef<HTMLSpanElement>(null);
  const giro = useRef(0);
  const quadro = useRef<number | null>(null);

  function girar() {
    giro.current = (giro.current + 2.4) % 360;
    anel.current?.style.setProperty("--giro", `${giro.current}deg`);
    quadro.current = requestAnimationFrame(girar);
  }
  function parar() {
    if (quadro.current != null) cancelAnimationFrame(quadro.current);
    quadro.current = null;
  }
  useEffect(() => parar, []);

  function aoEntrar(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || quadro.current != null) return;
    quadro.current = requestAnimationFrame(girar);
  }
  function aoMover(e: React.PointerEvent) {
    const el = anel.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(dx * 0.16).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
  }
  function aoSair() {
    parar();
    if (anel.current) anel.current.style.transform = "";
  }

  return (
    <span
      ref={anel}
      onPointerEnter={aoEntrar}
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      style={{ "--giro": "0deg" } as React.CSSProperties}
      className="inline-flex rounded-full p-[2px] bg-[conic-gradient(from_var(--giro),#b3904f,#efe2b8,#b3904f,#8f7137,#b3904f)] shadow-[0_18px_40px_-26px_rgba(143,113,55,0.8)] transition-transform duration-200 ease-out will-change-transform"
    >
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 h-14 pl-2 pr-6 rounded-full bg-white text-navy font-semibold text-[1rem] transition-colors hover:bg-gelo"
      >
        <span className="w-10 h-10 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
          <IconeInstagram tamanho={20} />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span>Seguir no Instagram</span>
          <span className="mt-1 text-[0.74rem] font-medium text-cinza">@{INSTAGRAM_PERFIL}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ouro">
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </span>
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

  const tocar = useCallback(
    (i: number) => {
      videos.current.forEach((v, k) => {
        if (v && k !== i && !v.paused) v.pause();
      });
      const video = videos.current[i];
      if (!video) return;
      video.muted = mudo;
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

  // No computador (sem "reduzir movimento") o ativo começa mudo quando a
  // seção aparece, e tudo para quando ela sai da tela
  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) {
          pausarTodos();
          return;
        }
        const computador = window.matchMedia("(min-width: 768px)").matches;
        const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (computador && !semMovimento && !pausouPorConta.current) tocar(ativoRef.current);
      },
      { threshold: 0.5 }
    );
    observador.observe(secao);
    return () => observador.disconnect();
  }, [tocar, pausarTodos]);

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
      {/* Cabeçalho centralizado */}
      <div className="revelar text-center max-w-2xl mx-auto">
        <p className="rotulo-pilula">acompanhe a gente</p>
        <h2 id="titulo-reels" className="titulo-secao vao-rotulo">
          Por dentro da <span className="italic">Viver Bem</span>
        </h2>
        <p className="texto-apoio mt-4 mx-auto max-w-md">
          O laboratório, a loja e quem faz a farmácia no dia a dia, direto do nosso
          Instagram.
        </p>
      </div>

      {/* Os reels: faixa no celular, fileira centralizada no computador */}
      <div
        ref={faixaRef}
        className="revelar vao-titulo flex items-end gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none rolagem-sem-barra -mx-5 px-5 scroll-pl-5 pb-2 md:mx-0 md:px-0 md:scroll-pl-0 md:pb-0 md:justify-center"
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
              className={`group relative shrink-0 snap-center w-[68%] max-w-[16rem] md:w-[14.5rem] xl:w-[16rem] aspect-[9/16] overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem] bg-gelo ring-1 transition duration-500 ${
                ehAtivo
                  ? "ring-ouro/60 shadow-[0_30px_60px_-30px_rgba(13,35,64,0.6)]"
                  : "ring-fio md:scale-[0.94] md:opacity-80 md:hover:opacity-100"
              }`}
            >
              <video
                ref={(el) => {
                  videos.current[i] = el;
                  if (el) el.muted = true;
                }}
                src={asset(reel.arquivo)}
                poster={asset(reel.capa)}
                preload="none"
                playsInline
                onTimeUpdate={() => aoProgresso(i)}
                onEnded={() => aoTerminar(i)}
                className="w-full h-full object-cover"
              />

              {/* Barra de progresso, como nos stories */}
              <span aria-hidden="true" className="absolute top-3 left-3 right-3 h-1 rounded-full bg-white/30 overflow-hidden">
                <span
                  ref={(el) => {
                    barras.current[i] = el;
                  }}
                  className="block h-full w-full origin-left bg-[image:var(--ouro-degrade)]"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>

              {/* Tocar e pausar */}
              <button
                type="button"
                onClick={() => alternar(i)}
                aria-label={estaTocando ? `Pausar: ${reel.titulo}` : `Assistir: ${reel.titulo}`}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-t from-noite/55 via-transparent to-noite/10 transition-opacity duration-300 ${
                    estaTocando ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`relative w-14 h-14 rounded-full bg-white/95 text-tinta flex items-center justify-center shadow-[0_14px_30px_-12px_rgba(16,42,74,0.55)] transition duration-300 ${
                    estaTocando
                      ? "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                      : "opacity-100 group-hover:scale-105"
                  }`}
                >
                  {estaTocando ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1.2" />
                      <rect x="14" y="5" width="4" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </span>
              </button>

              {/* Som, só no que está tocando */}
              {estaTocando && (
                <button
                  type="button"
                  onClick={alternarSom}
                  aria-label={mudo ? "Ativar o som" : "Silenciar"}
                  aria-pressed={!mudo}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 flex items-center justify-center transition"
                >
                  <IconeSom mudo={mudo} />
                </button>
              )}

              {/* Selo do Instagram, fora do botão para poder ser clicado */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver no Instagram de @${INSTAGRAM_PERFIL}`}
                className={`absolute top-6 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 flex items-center justify-center transition duration-300 ${
                  estaTocando ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <IconeInstagram tamanho={18} />
              </a>

              {/* Legenda em vidro; some enquanto toca */}
              <span
                className={`pointer-events-none absolute left-3 right-3 bottom-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-2.5 text-white text-[0.78rem] sm:text-[0.85rem] font-medium leading-tight text-center transition-opacity duration-300 ${
                  estaTocando ? "opacity-0" : "opacity-100"
                }`}
              >
                {reel.titulo}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bolinhas: qual reel está ativo (e atalho para ele) */}
      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Qual vídeo mostrar">
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
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === ativo ? "w-7 bg-[image:var(--ouro-degrade)]" : "w-2.5 bg-fio hover:bg-ouro/50"
            }`}
          />
        ))}
      </div>

      <div className="revelar mt-8 md:mt-10 flex justify-center">
        <BotaoInstagram />
      </div>
    </section>
  );
}
