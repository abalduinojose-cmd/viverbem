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
import { criarCena, DURACAO, type Cena } from "./cena";
import { criarFases } from "./fases";
import { FONTES_PADRAO, JOGOS_DE_FONTES, fontesParaCarregar } from "./fontes";
import { ROTEIROS, type NomeRoteiro, type Roteiro } from "./roteiros";

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

/** Quanto dura o ciclo de verdade (o ritmo do roteiro pode encurtar os 7 s) */
function duracaoReal(r: Roteiro) {
  return r.ritmo ? r.ritmo[r.ritmo.length - 1][0] : DURACAO;
}

/** A curva do ritmo: interpolação cúbica monotônica (Fritsch e Carlson)
 *  pelos pontos [tempo real, tempo da coreografia]. Com retas, a velocidade
 *  mudava de uma vez na emenda de dois trechos; com a curva ela muda em
 *  rampa, e o tempo nunca anda para trás. As pontas têm a mesma
 *  inclinação, para o laço emendar sem tranco. */
type Curva = { x: number[]; y: number[]; m: number[] };
const curvas = new WeakMap<Roteiro, Curva>();

function curvaDoRitmo(r: Roteiro): Curva | null {
  if (!r.ritmo) return null;
  const pronta = curvas.get(r);
  if (pronta) return pronta;
  const x = r.ritmo.map((p) => p[0]);
  const y = r.ritmo.map((p) => p[1]);
  const n = x.length;
  const d = x.slice(0, -1).map((_, i) => (y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  const m = new Array<number>(n);
  m[0] = m[n - 1] = (d[0] + d[n - 2]) / 2;
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const soma = a * a + b * b;
    if (soma > 9) {
      const k = 3 / Math.sqrt(soma);
      m[i] = k * a * d[i];
      m[i + 1] = k * b * d[i];
    }
  }
  const curva = { x, y, m };
  curvas.set(r, curva);
  return curva;
}

/** Do tempo real (segundos desde o início) para o tempo da coreografia, que
 *  sempre vai de 0 a 7 s: com ritmo, cada trecho corre na sua velocidade */
function tempoDaCoreografia(r: Roteiro, segundos: number) {
  const curva = curvaDoRitmo(r);
  if (!curva) return segundos;
  const { x, y, m } = curva;
  const ciclo = x[x.length - 1];
  const t = ((segundos % ciclo) + ciclo) % ciclo;
  let i = 0;
  while (i < x.length - 2 && t > x[i + 1]) i++;
  const h = x[i + 1] - x[i];
  const u = (t - x[i]) / h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * y[i] +
    (u3 - 2 * u2 + u) * h * m[i] +
    (-2 * u3 + 3 * u2) * y[i + 1] +
    (u3 - u2) * h * m[i + 1]
  );
}

export function CenaAnimada({ roteiro: nome }: { roteiro: NomeRoteiro }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const roteiro: Roteiro = ROTEIROS[nome];
    let vivo = true;
    let quadro = 0;
    let visivel = true;
    let inicio = 0;
    let pausadoEm = 0;
    let rodando = false;
    let cena: Cena | null = null;

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

    // Enquanto a página rola, a animação desenha um quadro sim, outro não
    // (08/10/2026, "site 100% fluindo"): no celular cada quadro dela custa
    // uns 15 ms mais o envio da imagem para a tela, e quem precisa dos
    // quadros inteiros é a rolagem. Parada a página, volta a desenhar todos
    let ultimaRolagem = -1e9;
    let pulaEste = false;
    const aoRolarPagina = () => {
      ultimaRolagem = performance.now();
    };
    window.addEventListener("scroll", aoRolarPagina, { passive: true });

    const passo = (agora: number) => {
      if (!cena) return;
      // O próximo quadro já fica pedido: um erro no desenho não para o laço
      quadro = requestAnimationFrame(passo);
      if (agora - ultimaRolagem < 160) {
        pulaEste = !pulaEste;
        if (pulaEste) return;
      }
      cena.desenhar(congelado !== null ? Number(congelado) : tempoDaCoreografia(roteiro, (agora - inicio) / 1000));
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

    // A vez do navegador entre um pedaço da preparação e outro: espera o
    // próximo quadro ser pintado (com a aba escondida não há quadros, então
    // só devolve a vez)
    const pausa = () =>
      new Promise<void>((r) => {
        if (document.hidden) setTimeout(r, 0);
        else requestAnimationFrame(() => setTimeout(r, 0));
      });

    // Só refaz a tela quando o tamanho muda de verdade: refazer limpa o
    // canvas e reaquece as fontes (aos pedaços, com a animação tocando)
    let medida = "";
    const medir = (reaquecer = true) => {
      if (!cena) return;
      const r = canvas.getBoundingClientRect();
      const nova = `${Math.round(r.width)}x${Math.round(r.height)}@${window.devicePixelRatio}`;
      if (nova === medida) return;
      medida = nova;
      cena.medirTela(r.width, r.height);
      if (reaquecer) void cena.aquecer(pausa);
    };
    const observadorTamanho = new ResizeObserver(() => {
      medir();
      if (!rodando && cena) cena.desenhar(tempoDaCoreografia(roteiro, (pausadoEm - inicio) / 1000));
    });
    // Só anima com pelo menos 15% do banner à vista: entrando ou saindo pela
    // borda da tela, ele fica parado e não disputa quadros com a rolagem
    const observadorTela = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting && e.intersectionRatio >= 0.15;
        reavaliar();
      },
      { threshold: [0, 0.15] },
    );

    const preparar = () => {
      Promise.all([
        Promise.all(roteiro.potes.map((p) => carregar(asset(p.src)))),
        // As fontes precisam estar prontas antes de medir as letras
        ...fontesParaCarregar(fontes).map((f) => document.fonts.load(f)),
      ])
        .then(async ([imagens]) => {
          if (!vivo) return;
          // A preparação vai aos pedaços, um por quadro (os potes, a medida,
          // o aquecimento): numa tarefa só ela travava a rolagem por uns
          // 300 ms perto do banner, e na carga disputava com a hidratação
          await pausa();
          const nova = await criarCena(
            canvas,
            imagens,
            fontes,
            roteiro,
            roteiro.coreografia === "fases" ? criarFases : undefined,
            pausa,
          );
          if (!vivo) return;
          cena = nova;
          if (dev) {
            depuracao.cenas ??= {};
            depuracao.cenas[nome] = nova;
            if (nome === "dobra") depuracao.heroCena = nova;
          }
          medir(false);
          await pausa();
          await nova.aquecer(pausa);
          if (!vivo) return;
          inicio = performance.now();
          pausadoEm = inicio;
          canvas.dataset.pronto = "";
          observadorTamanho.observe(canvas);
          observadorTela.observe(canvas);
          document.addEventListener("visibilitychange", reavaliar);
          reavaliar();
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
      window.removeEventListener("scroll", aoRolarPagina);
      depuracao.__congeladores?.delete(congelar);
    };
  }, [nome]);

  return <canvas ref={ref} aria-hidden="true" data-duracao={duracaoReal(ROTEIROS[nome] as Roteiro)} className="absolute inset-0 h-full w-full" />;
}

/** A animação da dobra (a abertura da home) */
export function HeroAnimado() {
  return <CenaAnimada roteiro="dobra" />;
}
