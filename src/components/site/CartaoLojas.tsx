"use client";
// As 3 lojas em "Fale com a gente" (14/10/2026, "modernize", com o cartão
// selecionado). A lista segue a mesma (o pino, o bairro, o endereço e
// "Como chegar", que abre o Google Maps); o que chegou foi um mapa
// desenhado: um trajeto de ouro que liga Centro, Corrêas e Posse, como a
// cidade sobe a serra. É ilustração, não mapa de verdade: o caminho real
// fica no link de cada loja.
//
//   - quando o cartão entra na tela, o trajeto se desenha e os três pinos
//     caem um depois do outro (uma vez só);
//   - passar o mouse ou o foco numa loja acende o pino dela no mapa, com
//     um anel que pulsa;
//   - "Retirada grátis" e o Delivery saíram da nota no pé e viraram duas
//     pílulas embaixo do mapa.
//
// Roda pela Web Animations API, então aparece também com "reduzir
// movimento" ligado, como o resto do site.
import { useEffect, useRef, useState } from "react";
import { UNIDADES, linkMapaUnidade } from "@/lib/tipos";

// O trajeto, no viewBox 320 x 120: cada loja é a ponta de um trecho, então
// o pino cai exatamente sobre a linha
const PINOS = [
  { x: 64, y: 84, rotulo: { x: 64, y: 106, ancora: "middle" } },
  { x: 170, y: 62, rotulo: { x: 170, y: 84, ancora: "middle" } },
  { x: 276, y: 34, rotulo: { x: 276, y: 58, ancora: "middle" } },
] as const;
const TRAJETO = "M14 98 C34 94 48 88 64 84 C102 74 128 52 170 62 C212 72 236 44 276 34 C290 31 300 28 308 26";
const MOLA = "cubic-bezier(0.34, 1.5, 0.64, 1)";
// Curvas de nível em volta de um morro no alto à direita (a serra), no
// viewBox 100 x 100 esticado na caixa
const CURVAS_DE_NIVEL = [0, 1, 2, 3, 4, 5, 6].map((k) => {
  const r = 12 + k * 13;
  return `M${100 - r * 1.25} -2 C${100 - r * 1.2} ${r * 0.5} ${100 - r * 0.55} ${r * 1.05} ${102} ${r * 0.95 + 4}`;
});

function IconePino() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconeRota() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 4.5 20.5l7.5-3.6 7.5 3.6L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconeConfere() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CartaoLojas({ className = "" }: { className?: string }) {
  const mapa = useRef<SVGSVGElement>(null);
  const [ativa, setAtiva] = useState<number | null>(null);

  // O trajeto se desenha e os pinos caem, uma vez, quando o mapa aparece
  useEffect(() => {
    const svg = mapa.current;
    if (!svg) return;
    const linha = svg.querySelector<SVGPathElement>("[data-trajeto]");
    const pinos = svg.querySelectorAll<SVGGElement>("[data-pino]");
    const rotulos = svg.querySelectorAll<SVGTextElement>("[data-rotulo]");
    if (!linha) return;
    const comprimento = linha.getTotalLength();
    const animacoes: Animation[] = [];

    linha.style.strokeDasharray = `${comprimento}`;
    linha.style.strokeDashoffset = `${comprimento}`;
    pinos.forEach((p) => (p.style.opacity = "0"));
    rotulos.forEach((r) => (r.style.opacity = "0"));

    const tocar = () => {
      animacoes.push(
        linha.animate([{ strokeDashoffset: comprimento }, { strokeDashoffset: 0 }], {
          duration: 1300,
          easing: "cubic-bezier(0.45, 0, 0.2, 1)",
          fill: "both",
        })
      );
      pinos.forEach((p, i) => {
        // Cada pino cai quando a linha passa por ele
        const atraso = 260 + i * 420;
        animacoes.push(
          p.animate(
            [
              { opacity: 0, transform: "translateY(-14px) scale(0.6)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 520, delay: atraso, easing: MOLA, fill: "both" }
          )
        );
        const r = rotulos[i];
        if (r)
          animacoes.push(
            r.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: atraso + 220, easing: "ease-out", fill: "both" })
          );
      });
    };

    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        tocar();
      },
      { threshold: 0.5 }
    );
    observador.observe(svg);
    return () => {
      observador.disconnect();
      animacoes.forEach((a) => a.cancel());
    };
  }, []);

  // O anel do pino da loja em destaque pulsa (só enquanto houver uma)
  const aneis = useRef<(SVGCircleElement | null)[]>([]);
  useEffect(() => {
    if (ativa === null) return;
    const anel = aneis.current[ativa];
    if (!anel) return;
    const pulso = anel.animate(
      [
        { opacity: 0.55, transform: "scale(1)" },
        { opacity: 0, transform: "scale(2.6)" },
      ],
      { duration: 1400, iterations: Infinity, easing: "cubic-bezier(0.2, 0.6, 0.35, 1)" }
    );
    return () => pulso.cancel();
  }, [ativa]);

  return (
    <div
      className={`h-full flex flex-col rounded-[1.75rem] border border-fio bg-white p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)] ${className}`}
    >
      <span className="rotulo-pilula">{UNIDADES.length} lojas em Petrópolis</span>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 lg:gap-7 flex-1">
        {/* O mapa desenhado */}
        <div className="flex flex-col gap-3">
          <div
            className="relative overflow-hidden rounded-2xl bg-gelo ring-1 ring-inset ring-fio/70 flex-1 flex items-center"
            style={{
              backgroundImage: "radial-gradient(rgba(16,42,74,0.09) 1px, transparent 1.2px)",
              backgroundSize: "14px 14px",
            }}
          >
            {/* Um sopro de ouro onde fica o Centro e de azul no alto da serra */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -bottom-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.28),transparent_65%)]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(28,105,181,0.14),transparent_65%)]"
            />
            {/* As curvas de nível da serra, esticadas na caixa inteira: no
                computador o mapa é mais alto que o desenho e o fundo não
                fica vazio */}
            <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
              {CURVAS_DE_NIVEL.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(16,42,74,0.075)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <svg ref={mapa} viewBox="0 0 320 120" className="relative block w-full h-auto" aria-hidden="true">
              <defs>
                <linearGradient id="lojas-ouro" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#b48f55" />
                  <stop offset="0.5" stopColor="#d9bd84" />
                  <stop offset="1" stopColor="#b48f55" />
                </linearGradient>
              </defs>
              {/* A estrada por baixo, larga e clara, e o trajeto de ouro por cima */}
              <path d={TRAJETO} fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
              <path data-trajeto d={TRAJETO} fill="none" stroke="url(#lojas-ouro)" strokeWidth="2.2" strokeLinecap="round" />
              {PINOS.map((p, i) => {
                const acesa = ativa === i;
                return (
                  <g key={i} transform={`translate(${p.x} ${p.y})`}>
                    <circle
                      ref={(el) => {
                        aneis.current[i] = el;
                      }}
                      cy="-13.6"
                      r="9"
                      fill="none"
                      stroke="#1c69b5"
                      strokeWidth="1.5"
                      opacity="0"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                    <g data-pino style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
                      {/* O pino: gota em azul (ou azul-noite quando acesa) com o miolo branco */}
                      <path
                        d="M0 0c-5.2-5.6-8.4-9.4-8.4-13.6a8.4 8.4 0 1 1 16.8 0c0 4.2-3.2 8-8.4 13.6Z"
                        fill={acesa ? "#0d2340" : "#1c69b5"}
                        style={{ transition: "fill 0.25s" }}
                      />
                      <circle cy="-13.6" r="3" fill="#ffffff" />
                    </g>
                    <text
                      data-rotulo
                      x={p.rotulo.x - p.x}
                      y={p.rotulo.y - p.y}
                      textAnchor={p.rotulo.ancora}
                      fontSize="10"
                      fontWeight={acesa ? 700 : 600}
                      fill="#0d2340"
                      letterSpacing="0.02em"
                    >
                      {UNIDADES[i]?.bairro}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 h-8 rounded-full bg-gelo px-3 text-[0.75rem] font-semibold text-navy">
              <span className="text-[#1DA851]">
                <IconeConfere />
              </span>
              Retirada grátis
            </span>
            <span className="inline-flex items-center gap-1.5 h-8 rounded-full bg-gelo px-3 text-[0.75rem] font-semibold text-navy">
              <span className="text-[#1DA851]">
                <IconeConfere />
              </span>
              Delivery em Petrópolis e Região
            </span>
          </div>
        </div>

        {/* A lista: cada loja abre o caminho no Google Maps */}
        <ul className="lista-fichas self-center w-full">
          {UNIDADES.map((u, i) => (
            <li key={u.bairro}>
              <a
                href={linkMapaUnidade(u.bairro, u.endereco)}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setAtiva(i)}
                onMouseLeave={() => setAtiva(null)}
                onFocus={() => setAtiva(i)}
                onBlur={() => setAtiva(null)}
                className="group flex items-center gap-4 py-4"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 flex size-11 items-center justify-center rounded-2xl bg-gelo text-tinta transition-colors group-hover:bg-tinta group-hover:text-white group-focus-visible:bg-tinta group-focus-visible:text-white"
                >
                  <IconePino />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.05rem] md:text-[1.15rem] font-semibold text-navy tracking-[-0.02em] leading-tight transition-colors group-hover:text-tinta">
                    {u.bairro}
                  </span>
                  <span className="mt-0.5 block text-sm text-cinza leading-snug">{u.endereco}</span>
                </span>
                <span className="shrink-0 flex items-center gap-3">
                  <span className="hidden sm:inline text-sm font-semibold text-navy">Como chegar</span>
                  <span className="w-10 h-10 rounded-full border border-fio text-navy flex items-center justify-center transition duration-300 group-hover:border-transparent group-hover:bg-[image:var(--ouro-degrade)] group-hover:translate-x-1">
                    <IconeRota />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
