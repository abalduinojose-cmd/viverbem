"use client";
// O cartão "Enviar a foto da receita" do Fale com a gente, animado.
//
// 10/10/2026, primeira versão ("fontes cinéticas e movimentos leves, algo
// bem profissional em javascript para um site de alta conversão"): título
// por palavras e uma folha de receita que se escrevia. Na mesma tarde,
// "tá muito simples, quero algo mais After Effects": a folha virou uma cena
// 3D com câmera (receita/CenaReceita.tsx: o celular fotografa a receita e a
// conversa do WhatsApp responde "Receita conferida") e o título ganhou
// entrada letra a letra em 3D, com um traço de ouro desenhado embaixo de
// "da receita".
//
// Regras de conversão que seguem valendo:
//   1. O texto é HTML de verdade (legível, acessível, indexável) e entra
//      uma vez só; depois para. O que se mexe em laço é a cena, ao lado.
//   2. O botão ganha atenção sem gritar: um brilho e um anel que se abre a
//      cada poucos segundos, a seta dá um passo, e no computador ele puxa
//      de leve para o ponteiro (magnético). Só com o cartão à vista.
//   3. Sem JavaScript o cartão aparece completo e parado.
// Roda também com "reduzir movimento": foi pedido, e o Windows do usuário
// está com as animações desligadas.
import { useEffect, useRef } from "react";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { SetaDireita } from "./icones";
import { CenaReceita } from "./receita/CenaReceita";

// O título: as palavras brancas entram letra a letra; as de ouro, inteiras
// (o degradê de ouro precisa da palavra inteira)
const TITULO: { texto: string; ouro?: boolean }[] = [
  { texto: "Enviar" },
  { texto: "a" },
  { texto: "foto" },
  { texto: "da", ouro: true },
  { texto: "receita", ouro: true },
];

/** O brilho e o anel do botão, em ms */
const CICLO_BOTAO = 5200;

// Curvas: saída longa e macia, saída com um passo além (mola) e entra-e-sai
const SAIDA = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOLA = "cubic-bezier(0.34, 1.45, 0.64, 1)";
const ENTRA_SAI = "cubic-bezier(0.65, 0, 0.35, 1)";

export function CartaoReceita() {
  const palco = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cartao = palco.current?.parentElement;
    if (!cartao || typeof cartao.animate !== "function") return;
    const um = <T extends Element>(sel: string) => cartao.querySelector<T>(sel);
    const todos = <T extends Element>(sel: string) => Array.from(cartao.querySelectorAll<T>(sel));

    // ---------- A entrada: uma vez, quando o cartão aparece ----------
    const entrada: Animation[] = [];
    const entrar = (el: Element | null, quadros: Keyframe[], opcoes: KeyframeAnimationOptions) => {
      if (!el) return;
      const a = el.animate(quadros, { fill: "both", ...opcoes });
      a.pause();
      entrada.push(a);
    };

    // O rótulo abre com o espaçamento fechando
    entrar(
      um("[data-rotulo]"),
      [
        { opacity: 0, transform: "translateY(10px)", letterSpacing: "0.5em" },
        { opacity: 1, transform: "none", letterSpacing: "0.24em" },
      ],
      { duration: 900, easing: SAIDA },
    );
    // As letras brancas giram de deitadas para de pé, em 3D, uma depois da
    // outra, saindo do desfoque
    todos<HTMLElement>("[data-letra]").forEach((l, i) => {
      entrar(
        l,
        [
          { opacity: 0, transform: "translateY(55%) rotateX(-95deg) scale(0.9)", filter: "blur(6px)" },
          { opacity: 1, offset: 0.4 },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        { duration: 1000, delay: 120 + i * 32, easing: MOLA },
      );
    });
    // As de ouro chegam inteiras, girando e ganhando foco, e depois um
    // brilho corre por elas
    todos<HTMLElement>("[data-ouro]").forEach((p, i) => {
      entrar(
        p,
        [
          { opacity: 0, transform: "translateY(60%) rotateX(-80deg) skewX(-12deg)", filter: "blur(8px)" },
          { opacity: 1, offset: 0.4 },
          { opacity: 1, transform: "none", filter: "blur(0px)" },
        ],
        { duration: 1100, delay: 520 + i * 110, easing: MOLA },
      );
      entrar(
        p,
        [{ backgroundPosition: "135% 0, 0 0" }, { backgroundPosition: "-35% 0, 0 0" }],
        { duration: 1300, delay: 1450 + i * 100, easing: ENTRA_SAI },
      );
    });
    // O traço de ouro se desenha embaixo de "da receita"
    entrar(um("[data-traco]"), [{ strokeDashoffset: "100" }, { strokeDashoffset: "0" }], {
      duration: 900,
      delay: 1150,
      easing: SAIDA,
    });
    entrar(
      um("[data-apoio]"),
      [
        { opacity: 0, transform: "translateY(14px)", filter: "blur(8px)", clipPath: "inset(0 100% 0 0)" },
        { opacity: 1, offset: 0.3 },
        { opacity: 1, transform: "none", filter: "blur(0px)", clipPath: "inset(0 0% 0 0)" },
      ],
      { duration: 1100, delay: 800, easing: SAIDA },
    );
    // O botão chega com uma mola curta
    entrar(
      um("[data-cta]"),
      [
        { opacity: 0, transform: "translateY(16px) scale(0.88)" },
        { opacity: 1, transform: "translateY(0) scale(1.04)", offset: 0.55 },
        { transform: "scale(0.99)", offset: 0.78 },
        { opacity: 1, transform: "none" },
      ],
      { duration: 1000, delay: 1100, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
    );

    // ---------- O botão em laço: brilho, anel e o passo da seta ----------
    const laco: Animation[] = [];
    const lacar = (el: Element | null, quadros: Keyframe[]) => {
      if (!el) return;
      const a = el.animate(quadros, { duration: CICLO_BOTAO, iterations: Infinity, fill: "both" });
      a.pause();
      laco.push(a);
    };
    lacar(um("[data-brilho]"), [
      { transform: "translateX(-120%) skewX(-18deg)", offset: 0 },
      { transform: "translateX(-120%) skewX(-18deg)", offset: 0.02, easing: ENTRA_SAI },
      { transform: "translateX(320%) skewX(-18deg)", offset: 0.2 },
      { transform: "translateX(320%) skewX(-18deg)", offset: 1 },
    ]);
    lacar(um("[data-anel]"), [
      { transform: "scale(1)", opacity: 0, offset: 0 },
      { transform: "scale(1)", opacity: 0.55, offset: 0.2, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
      { transform: "scale(1.22, 1.5)", opacity: 0, offset: 0.48 },
      { transform: "scale(1)", opacity: 0, offset: 1 },
    ]);
    lacar(um("[data-seta]"), [
      { transform: "translateX(0)", offset: 0 },
      { transform: "translateX(0)", offset: 0.08, easing: SAIDA },
      { transform: "translateX(5px)", offset: 0.14, easing: ENTRA_SAI },
      { transform: "translateX(0)", offset: 0.22 },
      { transform: "translateX(0)", offset: 1 },
    ]);

    // ---------- O botão magnético (só com ponteiro fino, no computador) ----------
    const cta = um<HTMLElement>("[data-cta-ima]");
    let ima: Animation | null = null;
    const puxar = (x: number, y: number) => {
      if (!cta) return;
      ima?.cancel();
      ima = cta.animate([{ transform: `translate(${x}px, ${y}px)` }], { duration: 380, fill: "forwards", easing: SAIDA });
    };
    const aoMover = (e: PointerEvent) => {
      if (!cta || e.pointerType !== "mouse") return;
      const b = cta.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      const perto = Math.hypot(dx, dy) < 140;
      puxar(perto ? dx * 0.16 : 0, perto ? dy * 0.22 : 0);
    };
    const aoSair = () => puxar(0, 0);
    cartao.addEventListener("pointermove", aoMover);
    cartao.addEventListener("pointerleave", aoSair);

    // ---------- Quando tocar ----------
    let entrou = false;
    let visivel = false;
    let lacoLigado = false;
    let espera = 0;
    const atualizarLaco = () => {
      const tocar = lacoLigado && visivel && !document.hidden;
      for (const a of laco) {
        if (tocar && a.playState !== "running") a.play();
        else if (!tocar && a.playState === "running") a.pause();
      }
    };
    const observador = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel && !entrou) {
          entrou = true;
          for (const a of entrada) a.play();
          espera = window.setTimeout(() => {
            lacoLigado = true;
            atualizarLaco();
          }, 2300);
        }
        atualizarLaco();
      },
      { threshold: 0.3 },
    );
    observador.observe(cartao);
    document.addEventListener("visibilitychange", atualizarLaco);

    return () => {
      observador.disconnect();
      document.removeEventListener("visibilitychange", atualizarLaco);
      cartao.removeEventListener("pointermove", aoMover);
      cartao.removeEventListener("pointerleave", aoSair);
      window.clearTimeout(espera);
      ima?.cancel();
      for (const a of [...entrada, ...laco]) a.cancel();
    };
  }, []);

  return (
    <BotaoEnviarReceita
      comIcone={false}
      className="group relative sm:col-span-2 lg:col-span-7 w-full min-h-[18rem] md:min-h-[21rem] flex flex-col text-left rounded-[2rem] banner-noite em-noite text-white ring-1 ring-inset ring-white/10 p-6 md:p-8 overflow-hidden shadow-[0_24px_50px_-30px_rgba(13,35,64,0.6)] transition duration-300 hover:-translate-y-1 active:scale-[0.99]"
    >
      <span ref={palco} aria-hidden="true" className="malha-banner" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.3),transparent_62%)]"
      />
      {/* A cena 3D: no celular em cima, larga; do tablet para cima à direita */}
      <CenaReceita className="inset-x-0 top-[3.25rem] h-[15rem] md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:h-auto md:w-[48%] lg:w-[46%] xl:w-[45%]" />

      <span data-rotulo="" className="relative rotulo-pilula">
        receita
      </span>
      <span className="relative mt-auto pt-[15.25rem] md:pt-10 block max-w-[26rem] md:max-w-[22rem] lg:max-w-[16.5rem] xl:max-w-[21.5rem]">
        <span className="titulo-banner block text-[1.7rem] md:text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-balance">
          <span className="sr-only">Enviar a foto da receita</span>
          {/* As letras e palavras animadas (os leitores de tela leem a frase acima) */}
          <span aria-hidden="true" className="relative">
            {TITULO.map((p, i) => (
              <span key={p.texto}>
                <span
                  className="relative inline-block align-top pt-[0.06em] -mt-[0.06em] pb-[0.16em] -mb-[0.16em] pr-[0.06em] -mr-[0.06em]"
                  style={{ perspective: "500px" }}
                >
                  {p.ouro ? (
                    <span
                      data-ouro=""
                      className="italic inline-block"
                      style={{
                        transformOrigin: "50% 100%",
                        // Uma faixa de luz por cima do ouro, que corre uma vez
                        // quando a palavra pousa
                        backgroundImage:
                          "linear-gradient(105deg, transparent 38%, rgba(255, 246, 222, 0.95) 50%, transparent 62%), var(--ouro-degrade)",
                        backgroundSize: "260% 100%, 100% 100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "-35% 0, 0 0",
                      }}
                    >
                      {p.texto}
                    </span>
                  ) : (
                    Array.from(p.texto).map((c, k) => (
                      <span key={k} data-letra="" className="inline-block" style={{ transformOrigin: "50% 100%" }}>
                        {c}
                      </span>
                    ))
                  )}
                  {/* O traço de ouro, desenhado embaixo de "receita" */}
                  {i === TITULO.length - 1 && (
                    <svg
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute left-[2%] bottom-[-0.02em] h-[0.3em] w-[96%]"
                      fill="none"
                    >
                      <defs>
                        <linearGradient id="traco-ouro" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="#c9a56b" stopOpacity="0.25" />
                          <stop offset="0.5" stopColor="#e8d4a6" />
                          <stop offset="1" stopColor="#c9a56b" stopOpacity="0.45" />
                        </linearGradient>
                      </defs>
                      <path
                        data-traco=""
                        d="M2 7 C 22 2, 48 2, 64 5 S 90 8, 98 3"
                        pathLength={100}
                        strokeDasharray="100 100"
                        stroke="url(#traco-ouro)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}
                </span>
                {i < TITULO.length - 1 ? " " : null}

              </span>
            ))}
          </span>
        </span>
        <span data-apoio="" className="block mt-3 text-white/70 text-[0.95rem] leading-snug">
          Abre o seu pedido com um código. A foto vai pela conversa do WhatsApp; o farmacêutico
          confere e passa o valor.
        </span>
      </span>
      <span data-cta="" className="relative mt-7 self-start">
        <span data-cta-ima="" className="relative block">
          {/* O anel que se abre de tempos em tempos */}
          <span
            data-anel=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#e8d4a6]/70 opacity-0"
          />
          <span className="relative inline-flex items-center gap-2.5 h-12 px-6 rounded-full bg-white text-navy text-[0.95rem] font-semibold shadow-[0_16px_32px_-18px_rgba(201,165,107,0.7)] transition-colors group-hover:bg-gelo overflow-hidden isolate">
            {/* O brilho que passa pelo botão */}
            <span
              data-brilho=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -z-10 bg-[linear-gradient(90deg,transparent,rgba(201,165,107,0.3),transparent)]"
              style={{ transform: "translateX(-120%) skewX(-18deg)" }}
            />
            <span className="text-ouro-escuro">
              <IconeReceita tamanho={18} />
            </span>
            Começar
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <span data-seta="" className="block">
                <SetaDireita tamanho={15} />
              </span>
            </span>
          </span>
        </span>
      </span>
    </BotaoEnviarReceita>
  );
}
