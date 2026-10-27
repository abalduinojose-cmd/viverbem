"use client";
// O mapa de verdade com os três pontos, sozinho (27/10/2026). Nasceu do
// CartaoLojas de 14/10 (o enquadramento pelo tamanho da caixa, as peças do
// OpenStreetMap desbotadas, os pinos que caem um depois do outro, o anel
// que pulsa na loja em destaque), sem a lista e o cartão em volta, para
// entrar como uma peça do bento do "Fale com a gente". Quem usa passa a
// (a posição vem de quem usa pelo className: "relative" ou "absolute
// inset-0" dentro de uma peça) loja em destaque (`ativa`) e recebe o aviso quando o mouse passa num
// pino (`aoDestacar`), para a pílula do bairro acender junto.
//
// As animações rodam pela Web Animations API, então aparecem também com
// "reduzir movimento" ligado, como o resto do site.
import { useEffect, useRef, useState } from "react";
import { UNIDADES, linkMapaUnidade } from "@/lib/tipos";

// De que lado do pino vai o nome: Centro e Corrêas ficam perto um do
// outro no mapa, então os nomes vão para lados opostos
const LADO_DO_NOME: Record<string, "esquerda" | "direita"> = {
  Centro: "esquerda",
  "Corrêas": "direita",
  Posse: "direita",
};
const PECA = 256;
// O pino tem massa e quica um pouco ao cair, mas pouco
const MOLA = "cubic-bezier(0.34, 1.25, 0.64, 1)";

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
// folgaBaixo: altura, em px, de uma faixa por cima da base do mapa (os pinos
// ficam acima dela). Vem da variável CSS --folga-baixo de quem usa.
function enquadrar(largura: number, altura: number, folgaBaixo = 0): Quadro | null {
  if (largura < 10 || altura < 10) return null;
  const pontos = UNIDADES.map((u) => [u.lat, u.lon] as const);
  // Folga: dos lados 80px (o nome ao lado do pino), em cima 44 (o pino),
  // embaixo 24
  const livreX = largura - 160;
  const livreY = altura - 68 - folgaBaixo;
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
  const oy = cy - altura / 2 + folgaBaixo / 2;
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

export function MapaTresLojas({
  ativa,
  aoDestacar,
  className = "relative",
}: {
  ativa: number | null;
  aoDestacar: (i: number | null) => void;
  className?: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState<Quadro | null>(null);
  const [visto, setVisto] = useState(false);

  // O enquadramento acompanha o tamanho da caixa
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => {
      const r = el.getBoundingClientRect();
      const folga = parseFloat(getComputedStyle(el).getPropertyValue("--folga-baixo")) || 0;
      setQuadro(enquadrar(Math.round(r.width), Math.round(r.height), folga));
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // As peças do mapa só descem quando a caixa chega perto da tela
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
    <div ref={caixa} className={`overflow-hidden bg-[#eef0ec] ${className}`}>
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
            onMouseEnter={() => aoDestacar(i)}
            onMouseLeave={() => aoDestacar(null)}
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
            <span data-pino className="absolute left-0 top-0 block" style={{ transform: "translate(-50%, -100%)", opacity: visto ? 1 : 0 }}>
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
  );
}
