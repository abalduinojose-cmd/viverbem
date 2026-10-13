"use client";
// Os reels em tela cheia (adendo 69, 13/10/2026), no jeito dos stories:
// o vídeo ocupa a tela, as barrinhas no alto mostram qual dos reels está
// tocando e quanto falta, e arrastar para o lado passa para o próximo ou o
// anterior. O deslize é o nativo do navegador (faixa com scroll-snap, um
// reel por tela), que já tem a física certa no dedo.
//
// No celular abre com o toque no reel; no computador, pelo botão de
// expandir do cartão (lá o toque continua tocando no próprio cartão).
// Fecha pelo X, por arrastar para baixo, pelo Esc e pelo voltar do
// Android: o visor entra no histórico, para o voltar fechar o visor em vez
// de sair do site.
//
// Som: o toque que abre o visor é um gesto da pessoa, então o primeiro
// reel toca com som. O iPhone pode recusar som nos seguintes, que entram
// por arraste e não por toque; por isso o mesmo toque que abre "destrava"
// os outros vídeos (play() e pause() na hora, sem chegar a tocar). Se o
// navegador ainda assim recusar, o vídeo toca mudo e o botão de som pisca,
// em vez de ficar em silêncio sem explicação.
//
// O visor fica montado e invisível, para os vídeos existirem no instante
// do toque (o destravamento precisa acontecer dentro dele). Com
// preload="none", nada é baixado antes de abrir.
//
// Ele vai direto para o body (portal): dentro da seção dos reels, um
// ancestral com transform (os efeitos de rolagem) prendia o position:
// fixed à seção, e o cabeçalho do site aparecia por cima do visor.
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { asset } from "@/lib/asset";
import { INSTAGRAM_PERFIL, INSTAGRAM_URL } from "@/lib/tipos";
import { IconeInstagram } from "./icones";

export type ReelDoVisor = { arquivo: string; capa: string; titulo: string };
export type ControleVisor = { abrir: (i: number) => void };

/** Arrastar para baixo mais que isto fecha */
const FECHA_PX = 120;

function IconeSomVisor({ mudo }: { mudo: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {mudo ? (
        <path d="m16 9.5 4 5m0-5-4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

function Seta({ para }: { para: "esquerda" | "direita" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={para === "esquerda" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VisorReels({ reels, ref }: { reels: ReelDoVisor[]; ref?: React.Ref<ControleVisor> }) {
  const [aberto, setAberto] = useState(false);
  const [atual, setAtual] = useState(0);
  const [mudo, setMudo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [piscaSom, setPiscaSom] = useState(false);

  const palco = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const barras = useRef<(HTMLSpanElement | null)[]>([]);
  const atualRef = useRef(0);
  const mudoRef = useRef(false);
  const inicial = useRef(0);
  const focoAntes = useRef<HTMLElement | null>(null);
  const arrasto = useRef<{ x: number; y: number; id: number; descendo: boolean; dy: number } | null>(null);
  const engolirClique = useRef(false);

  // Toca o reel i e para (e volta ao começo) os outros
  const tocar = useCallback((i: number) => {
    videos.current.forEach((v, k) => {
      if (v && k !== i && !v.paused) v.pause();
      if (v && k !== i) v.currentTime = 0;
    });
    const v = videos.current[i];
    if (!v) return;
    v.muted = mudoRef.current;
    setPausado(false);
    v.play().catch(() => {
      if (v.muted) return;
      // Som recusado pelo navegador: toca mudo e avisa no botão
      v.muted = true;
      mudoRef.current = true;
      setMudo(true);
      setPiscaSom(true);
      window.setTimeout(() => setPiscaSom(false), 1400);
      v.play().catch(() => setPausado(true));
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      abrir(i: number) {
        focoAntes.current = document.activeElement as HTMLElement | null;
        // Ainda dentro do toque: destrava os outros vídeos para tocarem com
        // som depois, quando entrarem por arraste (iPhone)
        videos.current.forEach((v, k) => {
          if (!v || k === i) return;
          v.muted = false;
          v.play().catch(() => {});
          v.pause();
        });
        inicial.current = i;
        atualRef.current = i;
        setAtual(i);
        mudoRef.current = false;
        setMudo(false);
        setAberto(true);
        tocar(i);
      },
    }),
    [tocar]
  );

  // Ao abrir: põe a faixa no reel escolhido, sem animar, antes de pintar
  useLayoutEffect(() => {
    if (!aberto) return;
    const t = trilho.current;
    if (t) t.scrollLeft = inicial.current * t.clientWidth;
    fechar.current?.focus({ preventScroll: true });
  }, [aberto]);

  const fecharDeVerdade = useCallback(() => {
    videos.current.forEach((v) => v && !v.paused && v.pause());
    setAberto(false);
    focoAntes.current?.focus?.({ preventScroll: true });
  }, []);

  // O visor entra no histórico: o voltar do Android fecha o visor
  useEffect(() => {
    if (!aberto) return;
    window.history.pushState({ ...window.history.state, visorReels: true }, "");
    const aoVoltar = () => fecharDeVerdade();
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, [aberto, fecharDeVerdade]);

  const pedirFechar = useCallback(() => {
    if (window.history.state?.visorReels) window.history.back();
    else fecharDeVerdade();
  }, [fecharDeVerdade]);

  const irPara = useCallback(
    (i: number) => {
      const t = trilho.current;
      if (!t || i < 0 || i >= reels.length) return;
      t.scrollTo({ left: i * t.clientWidth, behavior: "smooth" });
    },
    [reels.length]
  );

  // Teclado (computador): Esc fecha, setas trocam
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") pedirFechar();
      if (e.key === "ArrowRight") irPara(atualRef.current + 1);
      if (e.key === "ArrowLeft") irPara(atualRef.current - 1);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, pedirFechar, irPara]);

  // A página atrás não rola com o visor aberto
  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = antes;
    };
  }, [aberto]);

  // As barrinhas enchem com o tempo do vídeo, sem passar pelo React
  useEffect(() => {
    if (!aberto) return;
    let quadro = 0;
    const passo = () => {
      const i = atualRef.current;
      const v = videos.current[i];
      barras.current.forEach((b, k) => {
        if (!b) return;
        const f = k < i ? 1 : k > i ? 0 : v && v.duration ? v.currentTime / v.duration : 0;
        b.style.transform = `scaleX(${f.toFixed(4)})`;
      });
      quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [aberto]);

  // Qual reel está na tela, pela posição da faixa
  function aoRolar() {
    const t = trilho.current;
    if (!t || !aberto) return;
    const i = Math.round(t.scrollLeft / t.clientWidth);
    if (i === atualRef.current || i < 0 || i >= reels.length) return;
    atualRef.current = i;
    setAtual(i);
    tocar(i);
  }

  function alternarPausa() {
    const v = videos.current[atualRef.current];
    if (!v) return;
    if (v.paused) {
      setPausado(false);
      v.play().catch(() => setPausado(true));
    } else {
      v.pause();
      setPausado(true);
    }
  }

  function alternarSom() {
    const novo = !mudoRef.current;
    mudoRef.current = novo;
    setMudo(novo);
    const v = videos.current[atualRef.current];
    if (v) v.muted = novo;
  }

  // Arrastar para baixo fecha. A faixa só deixa o navegador rolar na
  // horizontal (touch-action: pan-x), então o gesto vertical chega aqui
  function aoPressionar(e: React.PointerEvent) {
    if (e.pointerType !== "touch") return;
    arrasto.current = { x: e.clientX, y: e.clientY, id: e.pointerId, descendo: false, dy: 0 };
  }
  function aoMover(e: React.PointerEvent) {
    const a = arrasto.current;
    const p = palco.current;
    if (!a || !p || e.pointerId !== a.id) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    if (!a.descendo) {
      if (dy > 10 && dy > Math.abs(dx) * 1.2) a.descendo = true;
      else return;
    }
    a.dy = Math.max(0, dy);
    p.style.transform = `translateY(${a.dy}px) scale(${(1 - Math.min(a.dy / 2000, 0.08)).toFixed(4)})`;
    p.style.opacity = String(1 - Math.min(a.dy / 600, 0.45));
  }
  function aoSoltar() {
    const a = arrasto.current;
    const p = palco.current;
    arrasto.current = null;
    if (!a || !a.descendo || !p) return;
    // Foi um arraste, não um toque: não pausa o vídeo
    engolirClique.current = true;
    window.setTimeout(() => (engolirClique.current = false), 400);
    if (a.dy > FECHA_PX) {
      p.style.transform = "";
      p.style.opacity = "";
      pedirFechar();
      return;
    }
    p.animate(
      [
        { transform: p.style.transform, opacity: p.style.opacity },
        { transform: "none", opacity: 1 },
      ],
      { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    p.style.transform = "";
    p.style.opacity = "";
  }

  const reel = reels[atual];

  // Só no navegador: no servidor não há body para o portal
  const noNavegador = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  if (!noNavegador) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reels da Viver Bem"
      aria-hidden={!aberto}
      // Montado e invisível quando fechado (ver o comentário do topo)
      className={`fixed inset-0 z-[120] bg-black transition-opacity duration-200 ${
        aberto ? "opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
      style={{ height: "100dvh" }}
    >
      <div
        ref={palco}
        className="relative h-full w-full"
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
      >
        {/* A faixa: um reel por tela, arrasta para o lado */}
        <div
          ref={trilho}
          onScroll={aoRolar}
          className="rolagem-sem-barra flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-contain"
          style={{ touchAction: "pan-x" }}
        >
          {reels.map((r, i) => (
            <div key={r.arquivo} className="relative flex h-full w-full shrink-0 snap-center items-center justify-center">
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                src={asset(r.arquivo)}
                poster={asset(r.capa)}
                preload="none"
                playsInline
                onEnded={() => {
                  if (i !== atualRef.current) return;
                  if (i < reels.length - 1) irPara(i + 1);
                  else setPausado(true);
                }}
                onClick={() => {
                  if (engolirClique.current) {
                    engolirClique.current = false;
                    return;
                  }
                  alternarPausa();
                }}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* As barrinhas dos stories, no alto */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-3 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex gap-1">
            {reels.map((r, i) => (
              <span key={r.arquivo} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                <span
                  ref={(el) => {
                    barras.current[i] = el;
                  }}
                  className="block h-full w-full origin-left bg-white"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[image:var(--ouro-degrade)] text-navy">
              <IconeInstagram tamanho={16} />
            </span>
            <span className="text-[0.9rem] font-semibold">@{INSTAGRAM_PERFIL}</span>
          </div>
        </div>

        <button
          ref={fechar}
          type="button"
          onClick={pedirFechar}
          aria-label="Fechar os reels"
          className="absolute right-2 top-[max(1.75rem,calc(env(safe-area-inset-top)+1rem))] flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Pausado: o sinal de tocar no meio */}
        {pausado && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="translate-x-px">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
        )}

        {/* Computador: setas para os lados */}
        {atual > 0 && (
          <button
            type="button"
            onClick={() => irPara(atual - 1)}
            aria-label="Reel anterior"
            className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:flex"
          >
            <Seta para="esquerda" />
          </button>
        )}
        {atual < reels.length - 1 && (
          <button
            type="button"
            onClick={() => irPara(atual + 1)}
            aria-label="Próximo reel"
            className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 md:flex"
          >
            <Seta para="direita" />
          </button>
        )}

        {/* Embaixo: o título, o Instagram e o som */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-16 text-white">
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-claro">
              Reel {atual + 1} de {reels.length}
            </p>
            <p className="mt-1 text-[1.15rem] font-semibold leading-snug tracking-[-0.015em]">{reel?.titulo}</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.85rem] font-medium text-white/85 underline-offset-4 hover:underline"
            >
              Ver no Instagram
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <button
            type="button"
            onClick={alternarSom}
            aria-label={mudo ? "Ativar o som" : "Silenciar"}
            aria-pressed={!mudo}
            className={`pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 ${
              piscaSom ? "animar-pulso ring-2 ring-ouro-claro" : ""
            }`}
          >
            <IconeSomVisor mudo={mudo} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
