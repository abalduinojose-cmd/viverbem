"use client";
// O título do banner da Saúde da Mulher em tipografia cinética (14/10/2026).
// Pedido: "a cena animada não está boa, quero letra cinética, movimentos
// suaves e uma animação em JavaScript de alta qualidade, feita pelo melhor
// editor de After Effects do mundo" e "quero a fonte em alta qualidade
// também, vetorizada".
//
// O texto é HTML de verdade, nas fontes do site (Bricolage no "Saúde",
// Instrument Sans na ligação, Instrument Serif itálica em ouro no
// "mulher"): vetor, nítido em qualquer tela. O canvas fica só com a cena
// (os potes, o espelho, a luz, a poeira).
//
// 17/11/2026 ("assim como reformulamos a primeira hero, reformule esse,
// melhore 1000%"): a mesma linguagem da dobra da home (adendo 144), em Web
// Animations, curvas de motion (expo e quint de saída, nada linear):
//   - o sobretítulo SEM a cápsula de vidro: o ponto de ouro acende com um
//     halo e as palavras fecham o espaçamento (tracking-in);
//   - "Saúde": um fio de ouro se desenha do centro para as pontas e as
//     letras se LEVANTAM dele, como cartas que abrem (dobradiça na base,
//     mais escuras deitadas), e o fio se apaga;
//   - uma PENA DE OURO (um cursor fino com luz) digita "em cada fase da"
//     letra a letra, cada letra entrando em foco; desce numa curva e
//     ESCREVE "mulher", as letras saindo da névoa (desfoque) atrás dela; no
//     fim da palavra ela vira uma estrela de brilho e a luz corre pelo ouro;
//   - o letreiro é o mesmo rolo vertical, em sincronia com a cena.
// (Antes: cápsula com as palavras deslizando, "Saúde" subindo de trás de
// uma máscara e "mulher" revelado por uma cortina da esquerda para a
// direita, o mesmo tipo de revelação que ele recusou na dobra em 22/10.)
// As letras da ligação e do "mulher" são caixas em linha (não blocos), para
// o kerning da fonte continuar valendo; por isso elas só mudam de foco e
// opacidade, sem transformação.
// O bloco de texto se mede (sem as transformações da entrada) e conta à
// cena onde termina: os potes ocupam o resto do cartão.
// Tudo entra uma vez, quando o banner aparece, e fica. Roda também com
// "reduzir movimento" ligado, como o resto do site.
//
// 14/10/2026, mais tarde ("coloque o Saúde em cada fase da mulher
// centralizado e maior um pouco"): o bloco do título fica centrado (no
// celular, na largura do cartão; no computador, na coluna da esquerda, de
// 48%) e as três linhas cresceram uns 12%. O rótulo e o letreiro
// acompanham o centro.
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
  entra: "cubic-bezier(0.55, 0, 0.75, 0.2)",
};
/** Atraso do i-ésimo item de uma cascata cujos vãos encolhem (x0,86) */
const escalona = (inicio: number, vao: number, i: number) => inicio + (vao * (1 - 0.86 ** i)) / (1 - 0.86);
// O ouro do "mulher": o degradê do site com uma faixa clara no meio, que
// passa pela palavra quando a posição do fundo anda
const OURO_COM_LUZ =
  "linear-gradient(100deg, #b48f55 0%, #e0c48f 16%, #c9a56b 32%, #fff4dc 46%, #fffaf0 50%, #fff4dc 54%, #c9a56b 68%, #e8d4a6 84%, #b48f55 100%)";
/** A faixa de luz anda pelo fundo de 280% da largura da palavra */
const LARGURA_DO_OURO = 2.8;

// Os tempos da entrada (ms, a partir de quando o banner aparece)
const T_FIO = 240;
const T_SAUDE = 380;
const T_DIGITA = 1080;
const COMPASSO = 46;
const PAUSA_PALAVRA = 46;
const DESCIDA = 380;
const VAO_MULHER = 88;

const limitar = (v: number) => Math.min(1, Math.max(0, v));
const trecho = (t: number, a: number, b: number) => limitar((t - a) / (b - a));
const suave = (p: number) => p * p * (3 - 2 * p);

/** Uma estrela de quatro pontas, a do brilho no fim do "mulher" */
function Estrela() {
  return (
    <svg viewBox="-10 -10 20 20" className="h-full w-full" aria-hidden="true">
      <path d="M0 -10 Q0 0 7 0 Q0 0 0 10 Q0 0 -7 0 Q0 0 0 -10Z" fill="#fff6dc" />
    </svg>
  );
}

export function CenaMulher() {
  const raiz = useRef<HTMLDivElement>(null);
  const letreiro = useRef<HTMLDivElement>(null);
  const itens = useRef<(HTMLSpanElement | null)[]>([]);
  const fio = useRef<HTMLSpanElement>(null);
  const ultimoT = useRef(-1);
  /** Faz a luz correr de novo pelo "mulher" (a cada volta do letreiro) */
  const brilhar = useRef<(() => void) | null>(null);

  // A entrada: monta tudo parado no começo (depois das fontes, porque a pena
  // anda pelas medidas das letras) e toca quando o banner aparece
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let vivo = true;
    /** Refaz o ouro do "mulher" quando o tamanho muda (ver montar) */
    let pintarOuro: (() => void) | null = null;
    const animacoes: Animation[] = [];
    let observador: IntersectionObserver | null = null;
    const anima = (alvo: Element | null, quadros: Keyframe[], opcoes: KeyframeAnimationOptions) => {
      if (!alvo) return;
      animacoes.push(alvo.animate(quadros, { fill: "both", ...opcoes }));
    };

    const montar = () => {
      if (!vivo) return;

      // ---- o sobretítulo: o ponto acende, as palavras fecham o espaçamento
      anima(el.querySelector("[data-ponto]"), [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 620, delay: 60, easing: CURVA.expo });
      anima(
        el.querySelector("[data-halo]"),
        [
          { transform: "scale(0.3)", opacity: 0 },
          { opacity: 0.95, offset: 0.3 },
          { transform: "scale(1)", opacity: 0.5 },
        ],
        { duration: 1300, delay: 60, easing: CURVA.expo },
      );
      el.querySelectorAll("[data-rotulo]").forEach((p, i) =>
        anima(
          p,
          [
            { letterSpacing: "0.6em", opacity: 0 },
            { opacity: 1, offset: 0.3 },
            { letterSpacing: "0.16em", opacity: 1 },
          ],
          { duration: 1050, delay: 150 + i * 120, easing: CURVA.expo },
        ),
      );
      anima(
        el.querySelector("[data-e]"),
        [
          { transform: "translateY(0.25em) scale(0.6)", opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 760, delay: 330, easing: CURVA.expo },
      );

      // ---- "Saúde": o fio se desenha e as letras se levantam dele
      anima(
        el.querySelector("[data-fio-titulo]"),
        [
          { transform: "scaleX(0)", opacity: 1, easing: CURVA.expo },
          { transform: "scaleX(1)", opacity: 1, offset: 0.45, easing: CURVA.entra },
          { transform: "scaleX(0.6)", opacity: 0 },
        ],
        { duration: 1700, delay: T_FIO },
      );
      const letras = Array.from(el.querySelectorAll("[data-letra]"));
      const meio = (letras.length - 1) / 2;
      letras.forEach((l, i) =>
        anima(
          l,
          [
            { transform: `translateX(${((i - meio) * 0.06).toFixed(3)}em) scaleY(0.02)`, filter: "brightness(0.42)", opacity: 0 },
            { opacity: 1, offset: 0.02 },
            { transform: "none", filter: "brightness(1)", opacity: 1 },
          ],
          { duration: 920, delay: escalona(T_SAUDE, 72, i), easing: CURVA.expo },
        ),
      );

      // ---- a pena digita "em cada fase da"
      const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-char]"));
      const quando = chars.map((c, i) => T_DIGITA + i * COMPASSO + Number(c.dataset.palavra ?? 0) * PAUSA_PALAVRA);
      chars.forEach((c, i) =>
        anima(
          c,
          [
            { filter: "blur(5px)", opacity: 0 },
            { opacity: 1, offset: 0.1 },
            { filter: "blur(0px)", opacity: 1 },
          ],
          { duration: 420, delay: quando[i], easing: CURVA.quint },
        ),
      );

      // ---- e escreve "mulher": cada letra sai da névoa
      const fimDigita = (quando[quando.length - 1] ?? T_DIGITA) + 110;
      const tMulher = fimDigita + DESCIDA;
      const letrasM = Array.from(el.querySelectorAll<HTMLElement>("[data-m]"));
      const quandoM = letrasM.map((_, i) => escalona(tMulher, VAO_MULHER, i));
      // O ouro contínuo pela palavra inteira: cada letra mostra o pedaço do
      // degradê que cai sobre ela (medido de novo a cada uso: a fonte muda
      // de tamanho com a tela)
      const primeira = letrasM[0];
      const ultima = letrasM[letrasM.length - 1];
      const larguraDoOuro = () => (primeira && ultima ? ultima.offsetLeft + ultima.offsetWidth - primeira.offsetLeft : 0);
      const posOuro = (m: HTMLElement) => (primeira ? primeira.offsetLeft - m.offsetLeft : 0);
      pintarOuro = () => {
        const largura = larguraDoOuro();
        letrasM.forEach((m) => {
          m.style.backgroundSize = `${(largura * LARGURA_DO_OURO).toFixed(1)}px 100%`;
          m.style.backgroundPosition = `${posOuro(m).toFixed(1)}px 0`;
        });
      };
      pintarOuro();
      letrasM.forEach((m, i) =>
        anima(
          m,
          [
            { filter: "blur(12px)", opacity: 0 },
            { filter: "blur(5px)", opacity: 0.8, offset: 0.3 },
            { filter: "blur(0px)", opacity: 1 },
          ],
          { duration: 980, delay: quandoM[i], easing: CURVA.quint },
        ),
      );
      const fimMulher = (quandoM[quandoM.length - 1] ?? tMulher) + 380;
      /** A luz que corre pelo ouro: a mesma faixa em todas as letras */
      const luzNoOuro = (atraso: number) => {
        const largura = larguraDoOuro();
        return letrasM.map((m) =>
          m.animate(
            [
              { backgroundPosition: `${(posOuro(m) - largura * (LARGURA_DO_OURO - 1)).toFixed(1)}px 0` },
              { backgroundPosition: `${posOuro(m).toFixed(1)}px 0` },
            ],
            { duration: 1500, delay: atraso, easing: CURVA.meio },
          ),
        );
      };
      brilhar.current = () => void luzNoOuro(0);

      // ---- a pena: anda pelas medidas das letras
      const pena = el.querySelector<HTMLElement>("[data-pena]");
      if (pena && chars.length && letrasM.length) {
        type Pouso = { t: number; x: number; y: number; h: number; inclina: number };
        const pousos: Pouso[] = [];
        const naLinha = (c: HTMLElement, x: number, inclina: number) => ({ x, y: c.offsetTop + c.offsetHeight * 0.14, h: c.offsetHeight * 0.74, inclina });
        const c0 = chars[0];
        pousos.push({ t: quando[0] - 90, ...naLinha(c0, c0.offsetLeft - 3, 0) });
        chars.forEach((c, i) => pousos.push({ t: quando[i] + 40, ...naLinha(c, c.offsetLeft + c.offsetWidth + 2, 0) }));
        const ult = chars[chars.length - 1];
        pousos.push({ t: fimDigita, ...naLinha(ult, ult.offsetLeft + ult.offsetWidth + 2, 0) });
        // A descida, numa curva por dentro
        const m0 = letrasM[0];
        const destino = naLinha(m0, m0.offsetLeft + m0.offsetWidth * 0.12, -12);
        const origem = pousos[pousos.length - 1];
        // No meio do caminho ela se recolhe num ponto de luz (a pena sai do
        // papel) e cresce de novo ao pousar no "m"
        pousos.push({
          t: fimDigita + DESCIDA * 0.5,
          x: (origem.x + destino.x) / 2 + c0.offsetHeight * 0.6,
          y: (origem.y + destino.y) / 2 + origem.h * 0.4,
          h: origem.h * 0.22,
          inclina: -6,
        });
        pousos.push({ t: tMulher, ...destino });
        letrasM.forEach((m, i) => pousos.push({ t: quandoM[i] + 120, ...naLinha(m, m.offsetLeft + m.offsetWidth * 0.9, -12) }));
        // Fica parada no fim da palavra até sumir (sem o quadro final, o
        // navegador voltaria ao ponto de partida)
        pousos.push({ ...pousos[pousos.length - 1], t: fimMulher });
        const t0 = pousos[0].t;
        const t1 = fimMulher;
        const h0 = pousos[0].h || 1;
        anima(
          pena,
          pousos.map((p) => ({
            transform: `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) skewX(${p.inclina}deg) scaleY(${(p.h / h0).toFixed(3)})`,
            offset: limitar((p.t - t0) / (t1 - t0)),
            easing: CURVA.meio,
          })),
          { duration: t1 - t0, delay: t0 },
        );
        pena.style.height = `${h0.toFixed(1)}px`;
        anima(
          pena,
          [
            { opacity: 0 },
            { opacity: 1, offset: 0.04 },
            { opacity: 1, offset: 0.93 },
            { opacity: 0 },
          ],
          { duration: t1 - t0 + 120, delay: t0, easing: "linear" },
        );
        // A estrela no fim da palavra
        const estrela = el.querySelector<HTMLElement>("[data-estrela]");
        if (estrela) {
          // No terminal do "r", à altura do x (a folga lateral da letra
          // guarda o itálico: o desenho termina antes da borda da caixa)
          const tam = m0.offsetHeight * 0.36;
          const folga = parseFloat(getComputedStyle(ultima).paddingRight) || 0;
          estrela.style.width = estrela.style.height = `${tam.toFixed(1)}px`;
          estrela.style.left = `${(ultima.offsetLeft + ultima.offsetWidth - folga * 0.9 - tam / 2).toFixed(1)}px`;
          estrela.style.top = `${(ultima.offsetTop + ultima.offsetHeight * 0.4 - tam / 2).toFixed(1)}px`;
          anima(
            estrela,
            [
              { transform: "scale(0) rotate(0deg)", opacity: 0 },
              { transform: "scale(1) rotate(45deg)", opacity: 1, offset: 0.45 },
              { transform: "scale(0) rotate(90deg)", opacity: 0 },
            ],
            { duration: 620, delay: fimMulher - 140, easing: CURVA.meio },
          );
        }
      }
      // A luz corre pelo ouro quando a palavra fica pronta
      animacoes.push(...luzNoOuro(fimMulher + 60));

      animacoes.forEach((a) => a.pause());
      el.style.visibility = "visible";
      observador = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          observador?.disconnect();
          animacoes.forEach((a) => a.play());
        },
        { threshold: 0.3 },
      );
      observador.observe(el);
    };
    // As medidas das letras só valem com as fontes carregadas
    void document.fonts.ready.then(() => requestAnimationFrame(montar));

    // Onde o texto termina, em px do cartão, pelas medidas do layout
    // (offset*, que ignoram as transformações da entrada): a cena põe os
    // potes no espaço que sobra (a pena e a estrela não contam)
    const medir = () => {
      let direita = 0;
      let base = 0;
      for (const filho of Array.from(el.children) as HTMLElement[]) {
        if (filho.dataset.fora !== undefined) continue;
        // O sobretítulo muda de largura na entrada (o espaçamento fecha) e,
        // pronto, é mais estreito que o título: só conta na altura, senão
        // os potes andariam junto
        if (filho.dataset.soAltura === undefined) direita = Math.max(direita, el.offsetLeft + filho.offsetLeft + filho.offsetWidth);
        base = Math.max(base, el.offsetTop + filho.offsetTop + filho.offsetHeight);
      }
      areaDoTexto.direita = Math.round(direita);
      areaDoTexto.base = Math.round(base);
      pintarOuro?.();
    };
    medir();
    const medida = new ResizeObserver(medir);
    medida.observe(el);
    Array.from(el.children).forEach((filho) => medida.observe(filho));
    return () => {
      vivo = false;
      observador?.disconnect();
      medida.disconnect();
      animacoes.forEach((a) => a.cancel());
      brilhar.current = null;
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
    if (laco > 0 && antes >= 0 && antes < BRILHO_DO_TITULO && t >= BRILHO_DO_TITULO) brilhar.current?.();
  };

  const [l1, l2, l3] = ROTEIRO.linhas;
  const [r1, r2, r3] = ROTEIRO.rotulo;
  const palavras = l2.split(" ");

  return (
    <>
      <CenaAnimada roteiro="mulher" aoQuadro={aoQuadro} />

      <div
        ref={raiz}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex flex-col items-center text-center px-5 pt-5 md:inset-y-0 md:right-auto md:w-[48%] md:justify-center md:px-10 md:pt-0 md:pb-14"
        style={{ visibility: "hidden" }}
      >
        {/* O sobretítulo, sem cápsula: o ponto de ouro e as palavras */}
        <span data-so-altura className="inline-flex h-8 items-center gap-2.5">
          <span className="relative inline-flex size-1.5">
            <span data-halo className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(232,204,146,0.75),transparent_70%)]" />
            <span data-ponto className="relative size-1.5 rounded-full bg-[#e1c68f]" />
          </span>
          <span data-rotulo className="text-[0.72rem] uppercase tracking-[0.16em] text-white/90" style={{ fontFamily: FONTES.rotulo, fontWeight: FONTES.pesoRotulo }}>
            {r1}
          </span>
          <span data-e className="inline-block text-[0.98rem] leading-none italic text-[#e1c68f]" style={{ fontFamily: FONTES.destaque }}>
            {r2}
          </span>
          <span data-rotulo className="text-[0.72rem] uppercase tracking-[0.16em] text-white/90" style={{ fontFamily: FONTES.rotulo, fontWeight: FONTES.pesoRotulo }}>
            {r3}
          </span>
        </span>

        {/* "Saúde": as letras se levantam do fio de ouro (a dobradiça é a
            linha de base, a 84% da caixa da letra; o fio corre rente a ela). A folga em cima guarda o acento; a da direita,
            o desenho do "e" (29/10/2026, "o e do Saúde tá quebrado") */}
        <span
          className="relative mt-4 md:mt-5 block pt-[0.14em] pr-[0.12em] -mb-[0.04em] text-white text-[3.7rem] md:text-[4.3rem] lg:text-[4.9rem] xl:text-[5.5rem] leading-[0.95] tracking-[-0.03em]"
          style={{ fontFamily: FONTES.display, fontWeight: FONTES.pesoDisplay }}
        >
          {[...l1].map((c, i) => (
            <span key={i} data-letra className="inline-block origin-[50%_84%]">
              {c}
            </span>
          ))}
          <span
            data-fio-titulo
            className="absolute inset-x-[-0.12em] bottom-[0.13em] h-[2px] origin-center rounded-full bg-[linear-gradient(90deg,transparent,#c9a56b_18%,#f0dcae_50%,#c9a56b_82%,transparent)] opacity-0"
          />
        </span>

        {/* "em cada fase da": digitada pela pena, letra a letra (caixas em
            linha, para manter o kerning) */}
        <span
          className="block pb-[0.12em] text-white/90 text-[1.95rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.8rem] leading-[1.05] tracking-[-0.01em]"
          style={{ fontFamily: FONTES.conector, fontWeight: FONTES.pesoConector }}
        >
          {palavras.map((p, k) => (
            <span key={k} className="whitespace-nowrap">
              {[...p].map((c, i) => (
                <span key={i} data-char data-palavra={k}>
                  {c}
                </span>
              ))}
              {k < palavras.length - 1 ? " " : null}
            </span>
          ))}
        </span>

        {/* "mulher": o ouro itálico, escrito pela pena, letra a letra saindo
            da névoa; o degradê é contínuo pela palavra (ver montar) e a luz
            corre por ele */}
        <span
          className="block -mt-[0.06em] px-[0.07em] italic leading-[1] text-[4rem] md:text-[4.8rem] lg:text-[5.4rem] xl:text-[6rem]"
          style={{ fontFamily: FONTES.destaque }}
        >
          {[...l3].map((c, i) => (
            <span
              key={i}
              data-m
              className="-mx-[0.12em] px-[0.12em] text-transparent bg-clip-text"
              style={{ backgroundImage: OURO_COM_LUZ, backgroundSize: `${LARGURA_DO_OURO * 100}% 100%`, backgroundRepeat: "no-repeat" }}
            >
              {c}
            </span>
          ))}
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
                className="absolute inset-x-0 top-0 flex h-[1.6rem] items-center justify-center gap-2.5 whitespace-nowrap will-change-transform"
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

        {/* A pena de ouro e a estrela (fora da medida do texto) */}
        <span
          data-pena
          data-fora
          className="absolute left-0 top-0 w-[2px] origin-top-left rounded-full bg-[linear-gradient(180deg,#f3e2b6,#c9a56b)] opacity-0 shadow-[0_0_10px_2px_rgba(232,204,146,0.65),0_0_22px_6px_rgba(232,204,146,0.25)]"
        />
        <span data-estrela data-fora className="absolute opacity-0 drop-shadow-[0_0_8px_rgba(255,236,190,0.9)]">
          <Estrela />
        </span>
      </div>
    </>
  );
}
