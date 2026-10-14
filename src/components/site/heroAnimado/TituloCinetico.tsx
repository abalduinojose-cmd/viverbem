"use client";
// O título do banner da Saúde da Mulher em tipografia cinética (14/10/2026).
// Pedido: "a cena animada não está boa, quero letra cinética, movimentos
// suaves e uma animação em JavaScript de alta qualidade, feita pelo melhor
// editor de After Effects do mundo" e "quero a fonte em alta qualidade
// também, vetorizada".
//
// Até aqui o texto era desenhado no canvas, junto dos potes: virava pixel,
// e no canvas cada letra precisava de truques (placas, cópias desfocadas)
// para se mexer. Agora o texto é HTML de verdade, nas fontes do site
// (Bricolage no "Saúde", Instrument Sans na ligação, Instrument Serif
// itálica em ouro no "mulher"): vetor, nítido em qualquer tela. O canvas
// ficou só com a cena (a lua, os potes, a luz, a poeira).
//
// A coreografia, toda em Web Animations, com curvas de motion (expo e
// quint de saída, sem nada linear):
//   - a cápsula do rótulo se abre do ponto de ouro para a direita e as
//     palavras entram deslizando de dentro dela;
//   - "Saúde" sobe letra a letra de trás de uma máscara, girando de leve e
//     assentando, como um bloco de After Effects com "text animator";
//   - "em cada fase da" sobe palavra a palavra, logo atrás;
//   - "mulher" se revela da esquerda para a direita e uma luz corre pelo
//     ouro; a mesma luz volta a cada volta do letreiro;
//   - o letreiro dos passos é um rolo vertical que anda com o tempo da cena,
//     quadro a quadro, e a cada troca uma ola passa pelos potes (vitrine.ts).
// O bloco de texto se mede (sem as transformações da entrada) e conta à
// cena onde termina: os potes ocupam o resto do cartão.
// Tudo entra uma vez, quando o banner aparece, e fica. Roda também com
// "reduzir movimento" ligado, como o resto do site.
import { useEffect, useRef } from "react";
import { CenaAnimada } from "./HeroAnimado";
import { DURACAO } from "./cena";
import { BRILHO_DO_TITULO, LETREIRO_INICIO, areaDoTexto, passoDoLetreiro } from "./vitrine";
import { FONTES_PADRAO, JOGOS_DE_FONTES } from "./fontes";
import { ROTEIROS } from "./roteiros";

const ROTEIRO = ROTEIROS.mulher;
const FONTES = JOGOS_DE_FONTES[FONTES_PADRAO];
const CURVA = {
  expo: "cubic-bezier(0.16, 1, 0.3, 1)",
  quint: "cubic-bezier(0.22, 1, 0.36, 1)",
  meio: "cubic-bezier(0.65, 0, 0.35, 1)",
  mola: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};
// O ouro do "mulher": o degradê do site com uma faixa clara no meio, que
// passa pela palavra quando a posição do fundo anda
const OURO_COM_LUZ =
  "linear-gradient(100deg, #b48f55 0%, #e0c48f 16%, #c9a56b 32%, #fff4dc 46%, #fffaf0 50%, #fff4dc 54%, #c9a56b 68%, #e8d4a6 84%, #b48f55 100%)";

const limitar = (v: number) => Math.min(1, Math.max(0, v));
const trecho = (t: number, a: number, b: number) => limitar((t - a) / (b - a));
const suave = (p: number) => p * p * (3 - 2 * p);

export function CenaMulher() {
  const raiz = useRef<HTMLDivElement>(null);
  const mulher = useRef<HTMLSpanElement>(null);
  const letreiro = useRef<HTMLDivElement>(null);
  const itens = useRef<(HTMLSpanElement | null)[]>([]);
  const fio = useRef<HTMLSpanElement>(null);
  const ultimoT = useRef(-1);

  // A entrada: monta tudo parado no começo e toca quando o banner aparece
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const animacoes: Animation[] = [];
    const anima = (alvo: Element | null, quadros: Keyframe[], opcoes: KeyframeAnimationOptions) => {
      if (alvo) animacoes.push(alvo.animate(quadros, { fill: "both", ...opcoes }));
    };

    // A cápsula do rótulo
    anima(el.querySelector("[data-ponto]"), [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 520, delay: 60, easing: CURVA.mola });
    anima(
      el.querySelector("[data-capsula]"),
      [
        { clipPath: "inset(0 calc(100% - 2rem) 0 0 round 999px)", opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { clipPath: "inset(0 0 0 0 round 999px)", opacity: 1 },
      ],
      { duration: 950, delay: 140, easing: CURVA.expo }
    );
    el.querySelectorAll("[data-rotulo]").forEach((p, i) =>
      anima(p, [{ transform: "translateX(-14px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 700, delay: 380 + i * 90, easing: CURVA.quint })
    );

    // "Saúde": letra a letra, de trás da máscara
    el.querySelectorAll("[data-letra]").forEach((l, i) =>
      anima(
        l,
        [
          { transform: "translateY(112%) rotate(7deg)", opacity: 0 },
          { opacity: 1, offset: 0.3 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 1150, delay: 280 + i * 62, easing: CURVA.expo }
      )
    );
    // "em cada fase da": palavra a palavra
    el.querySelectorAll("[data-palavra]").forEach((p, i) =>
      anima(
        p,
        [
          { transform: "translateY(110%)", opacity: 0 },
          { opacity: 1, offset: 0.35 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 1000, delay: 640 + i * 85, easing: CURVA.expo }
      )
    );
    // "mulher": a revelação da esquerda para a direita e a luz no ouro
    anima(
      mulher.current,
      [
        { clipPath: "inset(-0.3em 100% -0.3em -0.3em)", transform: "translateX(-0.14em)" },
        { clipPath: "inset(-0.3em -0.3em -0.3em -0.3em)", transform: "none" },
      ],
      { duration: 1400, delay: 950, easing: CURVA.meio }
    );
    anima(mulher.current, [{ backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0" }], { duration: 1500, delay: 1650, easing: CURVA.meio, composite: "replace" });

    animacoes.forEach((a) => a.pause());
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        animacoes.forEach((a) => a.play());
      },
      { threshold: 0.3 }
    );
    observador.observe(el);

    // Onde o texto termina, em px do cartão, pelas medidas do layout
    // (offset*, que ignoram as transformações da entrada): a cena põe os
    // potes no espaço que sobra
    const medir = () => {
      let direita = 0;
      let base = 0;
      for (const filho of Array.from(el.children) as HTMLElement[]) {
        direita = Math.max(direita, el.offsetLeft + filho.offsetLeft + filho.offsetWidth);
        base = Math.max(base, el.offsetTop + filho.offsetTop + filho.offsetHeight);
      }
      areaDoTexto.direita = Math.round(direita);
      areaDoTexto.base = Math.round(base);
    };
    medir();
    const medida = new ResizeObserver(medir);
    medida.observe(el);
    Array.from(el.children).forEach((filho) => medida.observe(filho));
    return () => {
      observador.disconnect();
      medida.disconnect();
      animacoes.forEach((a) => a.cancel());
    };
  }, []);

  // Cada quadro da cena: o letreiro anda com o tempo dela (o tempo corrido,
  // com as voltas), e a luz passa de novo pelo "mulher" a cada volta dele
  const aoQuadro = (tBruto: number) => {
    const laco = Math.max(0, Math.floor(tBruto / DURACAO));
    const t = tBruto - laco * DURACAO;
    const n = ROTEIRO.passos.length;
    const total = passoDoLetreiro(tBruto);
    // De 0 a n: o n é o primeiro de novo, chegando por baixo
    const u = total - n * Math.floor(total / n);

    const caixa = letreiro.current;
    if (caixa) {
      const entra = laco > 0 ? 1 : suave(trecho(t, LETREIRO_INICIO - 0.3, LETREIRO_INICIO + 0.05));
      caixa.style.opacity = String(entra);
      caixa.style.transform = `translateY(${(1 - entra) * 10}px)`;
    }
    itens.current.forEach((item, k) => {
      if (!item) return;
      // A distância dá a volta: o primeiro vem logo depois do último
      const d = ((((k - u) % n) + n * 1.5) % n) - n / 2;
      item.style.transform = `translateY(${d * 100}%)`;
      item.style.opacity = String(limitar(1 - Math.abs(d) * 1.4));
    });
    if (fio.current) {
      const cheio = u > 4 ? 4 - 3 * (u - 4) : Math.min(u + 1, 4);
      fio.current.style.transform = `scaleX(${cheio / 4})`;
    }

    const antes = ultimoT.current;
    ultimoT.current = t;
    if (mulher.current && laco > 0 && antes >= 0 && antes < BRILHO_DO_TITULO && t >= BRILHO_DO_TITULO) {
      mulher.current.animate([{ backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0" }], { duration: 1500, easing: CURVA.meio });
    }
  };

  const [l1, l2, l3] = ROTEIRO.linhas;
  const [r1, r2, r3] = ROTEIRO.rotulo;

  return (
    <>
      <CenaAnimada roteiro="mulher" aoQuadro={aoQuadro} />

      <div
        ref={raiz}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex flex-col items-start px-5 pt-5 md:inset-y-0 md:right-auto md:w-[54%] md:justify-center md:px-12 md:pt-0 md:pb-14"
      >
        {/* A cápsula do rótulo */}
        <span
          data-capsula
          className="inline-flex items-center gap-2 h-8 rounded-full pl-3 pr-4 bg-white/[0.09] ring-1 ring-inset ring-white/25 backdrop-blur-sm"
        >
          <span data-ponto className="size-1.5 rounded-full bg-[#e1c68f] shadow-[0_0_10px_2px_rgba(225,198,143,0.55)]" />
          <span data-rotulo className="text-[0.66rem] uppercase tracking-[0.16em] text-white/85" style={{ fontFamily: FONTES.rotulo, fontWeight: FONTES.pesoRotulo }}>
            {r1}
          </span>
          <span data-rotulo className="text-[0.95rem] leading-none italic text-[#e1c68f]" style={{ fontFamily: FONTES.destaque }}>
            {r2}
          </span>
          <span data-rotulo className="text-[0.66rem] uppercase tracking-[0.16em] text-white/85" style={{ fontFamily: FONTES.rotulo, fontWeight: FONTES.pesoRotulo }}>
            {r3}
          </span>
        </span>

        {/* "Saúde": cada letra na sua máscara (a folga em cima guarda o acento) */}
        <span
          className="mt-4 md:mt-5 block overflow-hidden pt-[0.14em] -mb-[0.04em] text-white text-[3.3rem] md:text-[3.9rem] lg:text-[4.4rem] xl:text-[4.9rem] leading-[0.95] tracking-[-0.045em]"
          style={{ fontFamily: FONTES.display, fontWeight: FONTES.pesoDisplay }}
        >
          {[...l1].map((c, i) => (
            <span key={i} data-letra className="inline-block origin-bottom-left">
              {c}
            </span>
          ))}
        </span>

        {/* "em cada fase da": cada palavra na sua máscara */}
        <span
          className="block overflow-hidden pb-[0.12em] text-white/90 text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] leading-[1.05] tracking-[-0.01em]"
          style={{ fontFamily: FONTES.conector, fontWeight: FONTES.pesoConector }}
        >
          {l2.split(" ").map((p, i) => (
            <span key={i} data-palavra className="inline-block mr-[0.26em] last:mr-0">
              {p}
            </span>
          ))}
        </span>

        {/* "mulher": o ouro itálico, com a luz que corre */}
        <span
          ref={mulher}
          className="block -mt-[0.06em] pr-[0.14em] italic leading-[1] text-transparent bg-clip-text text-[3.6rem] md:text-[4.3rem] lg:text-[4.8rem] xl:text-[5.4rem]"
          style={{ fontFamily: FONTES.destaque, backgroundImage: OURO_COM_LUZ, backgroundSize: "280% 100%", backgroundPosition: "0% 0" }}
        >
          {l3}
        </span>

        {/* O letreiro dos passos: um rolo vertical, em sincronia com a cena */}
        <div ref={letreiro} className="mt-3 md:mt-4 w-[min(17rem,80%)]" style={{ opacity: 0 }}>
          <div
            className="relative h-[1.6rem] overflow-hidden"
            style={{ maskImage: "linear-gradient(180deg, transparent, #000 28%, #000 72%, transparent)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 28%, #000 72%, transparent)" }}
          >
            {ROTEIRO.passos.map(([numero, texto], k) => (
              <span
                key={k}
                ref={(e) => {
                  itens.current[k] = e;
                }}
                className="absolute inset-x-0 top-0 flex h-[1.6rem] items-center gap-2.5 whitespace-nowrap will-change-transform"
                style={{ transform: `translateY(${k * 100}%)` }}
              >
                {numero ? (
                  <span className="text-[1.15rem] italic text-[#e1c68f]" style={{ fontFamily: FONTES.destaque }}>
                    {numero}
                  </span>
                ) : (
                  <span className="ml-1 mr-0.5 size-1.5 rounded-full bg-[#c9a56b]" />
                )}
                <span className="text-[0.95rem] text-white/88" style={{ fontFamily: FONTES.apoio, fontWeight: 500 }}>
                  {texto}
                </span>
              </span>
            ))}
          </div>
          {/* O fio de ouro enche a cada passo */}
          <span className="mt-1.5 block h-px w-full bg-white/18">
            <span ref={fio} className="block h-px w-full origin-left bg-[linear-gradient(90deg,#b48f55,#e0c48f)]" style={{ transform: "scaleX(0.25)" }} />
          </span>
        </div>
      </div>
    </>
  );
}
