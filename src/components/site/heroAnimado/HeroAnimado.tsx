"use client";

// As animações em canvas (ver cena.ts e roteiros.ts): a da dobra e a do
// banner da Saúde da Mulher, no celular e no desktop. O canvas fica atrás
// do texto em HTML, ocupando o banner inteiro; o fundo azul é o próprio
// .banner-noite, o canvas só desenha por cima.
//
// Roda também com "reduzir movimento" ligado: foi pedida pelo usuário e o
// Windows dele está com as animações desligadas (sem isso ele não veria
// nada). Só carrega as fotos quando o banner chega perto da tela, e pausa
// fora da tela e com a aba escondida (com dois banners na página, só o
// que está à vista anima).
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { criarCena, DURACAO } from "./cena";
import { criarFases } from "./fases";
import { FONTES_PADRAO, JOGOS_DE_FONTES, fontesParaCarregar } from "./fontes";
import { ROTEIROS, type NomeRoteiro } from "./roteiros";

function carregar(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Ganchos de conferência, só no desenvolvimento: heroQuadro("3.2") congela
// todas as animações da página naquele instante (null solta); cenas[nome]
// dá acesso direto à cena
type Depuracao = {
  heroQuadro?: (t: string | null) => void;
  heroCena?: unknown;
  cenas?: Record<string, unknown>;
  __congeladores?: Set<(t: string | null) => void>;
};

export function CenaAnimada({ roteiro: nome }: { roteiro: NomeRoteiro }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const roteiro = ROTEIROS[nome];
    let vivo = true;
    let quadro = 0;
    let visivel = true;
    let inicio = 0;
    let pausadoEm = 0;
    let rodando = false;
    let cena: ReturnType<typeof criarCena> | null = null;

    // ?heroT=3.2 congela ali; ?heroFonte=jakarta troca o jogo de fontes
    const dev = process.env.NODE_ENV !== "production";
    const busca = new URLSearchParams(location.search);
    let congelado = dev ? busca.get("heroT") : null;
    const pedida = dev ? busca.get("heroFonte") : null;
    const fontes = JOGOS_DE_FONTES[pedida && JOGOS_DE_FONTES[pedida] ? pedida : FONTES_PADRAO];
    const congelar = (t: string | null) => (congelado = t);
    const depuracao = window as unknown as Depuracao;
    if (dev) {
      depuracao.__congeladores ??= new Set();
      depuracao.__congeladores.add(congelar);
      depuracao.heroQuadro = (t) => depuracao.__congeladores?.forEach((f) => f(t));
    }

    const passo = (agora: number) => {
      if (!cena) return;
      cena.desenhar(congelado !== null ? Number(congelado) : (agora - inicio) / 1000);
      quadro = requestAnimationFrame(passo);
    };
    const tocar = () => {
      if (rodando || !cena || !visivel || document.hidden) return;
      rodando = true;
      inicio += performance.now() - pausadoEm;
      quadro = requestAnimationFrame(passo);
    };
    const parar = () => {
      if (!rodando) return;
      rodando = false;
      pausadoEm = performance.now();
      cancelAnimationFrame(quadro);
    };
    const reavaliar = () => (visivel && !document.hidden ? tocar() : parar());

    // Só refaz a tela quando o tamanho muda de verdade: refazer limpa o
    // canvas e reaquece as fontes
    let medida = "";
    const medir = () => {
      if (!cena) return;
      const r = canvas.getBoundingClientRect();
      const nova = `${Math.round(r.width)}x${Math.round(r.height)}@${window.devicePixelRatio}`;
      if (nova === medida) return;
      medida = nova;
      cena.medirTela(r.width, r.height);
    };
    const observadorTamanho = new ResizeObserver(() => {
      medir();
      if (!rodando && cena) cena.desenhar((pausadoEm - inicio) / 1000);
    });
    const observadorTela = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      reavaliar();
    });

    const preparar = () => {
      Promise.all([
        Promise.all(roteiro.potes.map((p) => carregar(asset(p.src)))),
        // As fontes precisam estar prontas antes de medir as letras
        ...fontesParaCarregar(fontes).map((f) => document.fonts.load(f)),
      ])
        .then(([imagens]) => {
          if (!vivo) return;
          const comecar = () => {
            if (!vivo) return;
            cena = criarCena(canvas, imagens, fontes, roteiro, roteiro.coreografia === "fases" ? criarFases : undefined);
            if (dev) {
              depuracao.cenas ??= {};
              depuracao.cenas[nome] = cena;
              if (nome === "dobra") depuracao.heroCena = cena;
            }
            medir();
            inicio = performance.now();
            pausadoEm = inicio;
            canvas.dataset.pronto = "";
            observadorTamanho.observe(canvas);
            observadorTela.observe(canvas);
            document.addEventListener("visibilitychange", reavaliar);
            reavaliar();
          };
          // Começa num respiro do navegador: no carregamento a página ainda
          // está montando (hidratação), e a animação disputaria os mesmos
          // quadros. O primeiro quadro é só o ponto de ouro, então esperar
          // até meio segundo não se vê
          if ("requestIdleCallback" in window) window.requestIdleCallback(comecar, { timeout: 500 });
          else setTimeout(comecar, 60);
        })
        .catch(() => {
          // Sem as fotos, o banner fica só com o fundo azul e o texto em HTML
        });
    };

    // As fotos e as fontes só descem quando o banner está a uma tela de
    // distância (a dobra já nasce à vista, então começa na hora). Em dev,
    // ?agora começa sem esperar (para medir com a página escondida, quando
    // o IntersectionObserver não dispara)
    const aproximacao = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        aproximacao.disconnect();
        preparar();
      },
      { rootMargin: "100% 0px" },
    );
    if (dev && busca.has("agora")) preparar();
    else aproximacao.observe(canvas);

    return () => {
      vivo = false;
      cancelAnimationFrame(quadro);
      aproximacao.disconnect();
      observadorTamanho.disconnect();
      observadorTela.disconnect();
      document.removeEventListener("visibilitychange", reavaliar);
      depuracao.__congeladores?.delete(congelar);
    };
  }, [nome]);

  return <canvas ref={ref} aria-hidden="true" data-duracao={DURACAO} className="absolute inset-0 h-full w-full" />;
}

/** A animação da dobra (a abertura da home) */
export function HeroAnimado() {
  return <CenaAnimada roteiro="dobra" />;
}
