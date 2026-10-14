"use client";
// As 3 lojas em "Fale com a gente" (14/10/2026, "modernize", com o cartão
// selecionado). A lista segue a mesma (o pino, o bairro, o endereço e
// "Como chegar", que abre o Google Maps); em cima dela, um mapa.
//
// O mapa passou por três versões no mesmo dia. Primeiro um trajeto de ouro
// desenhado; depois o desenho com ruas, rio e setas ("coloque o mapa mais
// real com as setas"); por fim, o pedido "não tá bom, quero mais simples,
// mas com os pontos e o mapa real". Agora é o mapa de verdade (OpenStreetMap)
// com só os três pontos:
//
//   - o enquadramento se ajusta ao tamanho da caixa: escolhe o maior zoom
//     em que as três lojas cabem, com folga para os pinos;
//   - as peças do mapa vêm do OpenStreetMap (com o crédito no canto, como a
//     licença pede), um pouco desbotadas para o azul da marca aparecer;
//   - quando o cartão entra na tela, os pinos caem um depois do outro;
//     passar o mouse ou o foco numa loja da lista acende o pino dela, com
//     um anel que pulsa; tocar num pino abre o Google Maps da loja.
//
// As animações rodam pela Web Animations API, então aparecem também com
// "reduzir movimento" ligado, como o resto do site.
import { useEffect, useRef, useState } from "react";
import { UNIDADES, linkMapaUnidade } from "@/lib/tipos";

// Onde fica cada loja (latitude, longitude), pelo bairro de UNIDADES
const COORDENADAS: Record<string, [number, number]> = {
  Centro: [-22.5092, -43.1772],
  "Corrêas": [-22.4454, -43.1354],
  Posse: [-22.2521, -43.0737],
};
// De que lado do pino vai o nome: Centro e Corrêas ficam perto um do
// outro no mapa, então os nomes vão para lados opostos
const LADO_DO_NOME: Record<string, "esquerda" | "direita"> = {
  Centro: "esquerda",
  "Corrêas": "direita",
  Posse: "direita",
};
const PECA = 256;
const MOLA = "cubic-bezier(0.34, 1.5, 0.64, 1)";

/** Latitude e longitude para pixels do mundo no zoom z (Web Mercator) */
function projetar(lat: number, lon: number, z: number) {
  const n = PECA * 2 ** z;
  const rad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n,
  };
}

type Quadro = {
  pecas: { chave: string; src: string; x: number; y: number }[];
  pinos: { x: number; y: number }[];
};

/** O enquadramento: o maior zoom em que os três pontos cabem na caixa */
function enquadrar(largura: number, altura: number): Quadro | null {
  if (largura < 10 || altura < 10) return null;
  const pontos = UNIDADES.map((u) => COORDENADAS[u.bairro]).filter(Boolean);
  // Folga: dos lados 80px (o nome ao lado do pino), em cima 44 (o pino),
  // embaixo 24
  const livreX = largura - 160;
  const livreY = altura - 68;
  const caixaDe = (z: number) => {
    const ps = pontos.map(([la, lo]) => projetar(la, lo, z));
    const xs = ps.map((p) => p.x);
    const ys = ps.map((p) => p.y);
    return { ps, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };
  let z = 14;
  while (z > 8) {
    const c = caixaDe(z);
    if (c.x1 - c.x0 <= livreX && c.y1 - c.y0 <= livreY) break;
    z--;
  }
  const c = caixaDe(z);
  const cx = (c.x0 + c.x1) / 2;
  // O centro sobe a metade da diferença entre a folga de cima e a de baixo
  const cy = (c.y0 + c.y1) / 2 - 10;
  const ox = cx - largura / 2;
  const oy = cy - altura / 2;
  const pecas: Quadro["pecas"] = [];
  const max = 2 ** z;
  for (let tx = Math.floor(ox / PECA); tx <= Math.floor((ox + largura) / PECA); tx++) {
    for (let ty = Math.floor(oy / PECA); ty <= Math.floor((oy + altura) / PECA); ty++) {
      if (ty < 0 || ty >= max) continue;
      const x = ((tx % max) + max) % max;
      pecas.push({
        chave: `${z}/${x}/${ty}`,
        src: `https://tile.openstreetmap.org/${z}/${x}/${ty}.png`,
        x: tx * PECA - ox,
        y: ty * PECA - oy,
      });
    }
  }
  return { pecas, pinos: c.ps.map((p) => ({ x: p.x - ox, y: p.y - oy })) };
}

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
  const caixa = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState<Quadro | null>(null);
  const [ativa, setAtiva] = useState<number | null>(null);
  const [visto, setVisto] = useState(false);

  // O enquadramento acompanha o tamanho da caixa
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      setQuadro(enquadrar(Math.round(r.width), Math.round(r.height)));
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // As peças do mapa só descem quando o cartão chega perto da tela
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        setVisto(true);
      },
      { rootMargin: "200px 0px" }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // Os pinos caem, um depois do outro, na primeira vez que o mapa aparece
  const caiu = useRef(false);
  useEffect(() => {
    if (!visto || !quadro || caiu.current) return;
    const el = caixa.current;
    if (!el) return;
    caiu.current = true;
    el.querySelectorAll<HTMLElement>("[data-pino]").forEach((p, i) =>
      p.animate(
        [
          { opacity: 0, transform: "translate(-50%, calc(-100% - 16px)) scale(0.6)" },
          { opacity: 1, transform: "translate(-50%, -100%)" },
        ],
        { duration: 560, delay: 250 + i * 260, easing: MOLA, fill: "backwards" }
      )
    );
  }, [visto, quadro]);

  // O anel do pino da loja em destaque pulsa (só enquanto houver uma)
  const aneis = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (ativa === null) return;
    const anel = aneis.current[ativa];
    if (!anel) return;
    const pulso = anel.animate(
      [
        { opacity: 0.6, transform: "translate(-50%, -50%) scale(1)" },
        { opacity: 0, transform: "translate(-50%, -50%) scale(2.6)" },
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
        {/* O mapa de verdade, com os três pontos */}
        <div className="flex flex-col gap-3">
          <div
            ref={caixa}
            className="relative overflow-hidden rounded-2xl bg-[#eef0ec] ring-1 ring-inset ring-fio/70 h-60 lg:h-auto lg:flex-1 lg:min-h-60"
          >
            {/* As peças do mapa, um pouco desbotadas */}
            <div aria-hidden="true" className="absolute inset-0 [filter:saturate(0.55)_contrast(0.96)_brightness(1.04)]">
              {visto &&
                quadro?.pecas.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.chave}
                    src={p.src}
                    alt=""
                    width={PECA}
                    height={PECA}
                    decoding="async"
                    draggable={false}
                    className="absolute max-w-none select-none"
                    style={{ left: p.x, top: p.y, width: PECA, height: PECA }}
                  />
                ))}
            </div>
            {/* Um véu leve de azul, para o mapa conversar com o site */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#1c69b5]/[0.04]" />

            {/* Os pontos: cada um abre o Google Maps da loja */}
            {quadro?.pinos.map((p, i) => {
              const u = UNIDADES[i];
              if (!u) return null;
              const acesa = ativa === i;
              return (
                <a
                  key={u.bairro}
                  href={linkMapaUnidade(u.bairro, u.endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  onMouseEnter={() => setAtiva(i)}
                  onMouseLeave={() => setAtiva(null)}
                  className="absolute"
                  style={{ left: p.x, top: p.y, zIndex: acesa ? 3 : 2 }}
                >
                  {/* O anel que pulsa no chão do pino */}
                  <span
                    ref={(el) => {
                      aneis.current[i] = el;
                    }}
                    className="pointer-events-none absolute left-0 top-0 size-5 rounded-full border-2 border-tinta opacity-0"
                    style={{ transform: "translate(-50%, -50%)" }}
                  />
                  <span
                    data-pino
                    className="absolute left-0 top-0 block"
                    style={{ transform: "translate(-50%, -100%)", opacity: visto ? 1 : 0 }}
                  >
                    {/* O nome numa pílula branca, ao lado da cabeça do pino */}
                    <span
                      className={`absolute top-[3px] whitespace-nowrap rounded-full px-2 py-0.5 text-[0.6875rem] font-bold shadow-[0_4px_10px_-4px_rgba(13,35,64,0.45)] transition-colors ${
                        LADO_DO_NOME[u.bairro] === "esquerda" ? "right-full mr-1" : "left-full ml-1"
                      } ${acesa ? "bg-navy text-white" : "bg-white text-navy"}`}
                    >
                      {u.bairro}
                    </span>
                    <svg width="24" height="30" viewBox="0 0 24 30" aria-hidden="true" className="block drop-shadow-[0_3px_3px_rgba(13,35,64,0.35)]">
                      <path
                        d="M12 29c-6.2-7-10.4-12-10.4-17.2a10.4 10.4 0 1 1 20.8 0C22.4 17 18.2 22 12 29Z"
                        fill={acesa ? "#0d2340" : "#1c69b5"}
                        stroke="#ffffff"
                        strokeWidth="1.6"
                        style={{ transition: "fill 0.25s" }}
                      />
                      <circle cx="12" cy="11.8" r="3.8" fill="#ffffff" />
                    </svg>
                  </span>
                </a>
              );
            })}

            {/* O crédito que a licença do mapa pede */}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-1 right-1.5 z-[4] rounded bg-white/85 px-1.5 py-0.5 text-[0.625rem] leading-none text-cinza hover:text-navy"
            >
              © OpenStreetMap
            </a>
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
