"use client";
// Peças do painel que se mexem (14/10/2026, "quero um dashboard de alta
// qualidade e premium"). São detalhes de acabamento, não de informação:
// sem JavaScript tudo aparece pronto e parado. Rodam também com "reduzir
// movimento" ligado (o Windows do usuário está com as animações
// desligadas e ele quer ver o movimento), por isso são curtas e contidas.
import { useEffect, useRef } from "react";

const SAIDA = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Quantas casas decimais e se há separador de milhar num número escrito
 *  à brasileira ("1.234,56" -> 2 casas, com milhar) */
function formatarComo(modelo: string, valor: number) {
  const casas = modelo.includes(",") ? modelo.split(",")[1].length : 0;
  const [inteiro, fracao] = valor.toFixed(casas).split(".");
  const comMilhar = modelo.includes(".") || inteiro.length > 3 ? inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : inteiro;
  return fracao ? `${comMilhar},${fracao}` : comMilhar;
}

/** O número de destaque conta de zero até o valor quando aparece, uma vez.
 *  Recebe o texto já formatado ("R$ 1.234,56", "12", "4 de 39"): só os
 *  números andam, o resto fica como está. */
export function NumeroAnimado({ texto, className = "" }: { texto: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const partes = texto.split(/(\d[\d.,]*\d|\d)/);
    const alvos = partes.map((p) => (/^\d/.test(p) ? parseFloat(p.replace(/\./g, "").replace(",", ".")) : null));
    if (alvos.every((a) => a === null || a === 0)) return;
    let quadro = 0;
    let inicio = 0;
    const DURACAO = 1100;
    const passo = (agora: number) => {
      if (!inicio) inicio = agora;
      const p = Math.min(1, (agora - inicio) / DURACAO);
      const k = 1 - (1 - p) ** 4;
      el.textContent = partes.map((parte, i) => (alvos[i] === null ? parte : formatarComo(parte, alvos[i] * k))).join("");
      if (p < 1) quadro = requestAnimationFrame(passo);
      else el.textContent = texto;
    };
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
      el.textContent = texto;
    };
  }, [texto]);

  return (
    <span ref={ref} className={className}>
      {texto}
    </span>
  );
}

/** Barra de proporção que enche da esquerda quando aparece. `pct` de 0 a 100. */
export function BarraViva({ pct, className = "", style }: { pct: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const largura = Math.max(0, Math.min(100, pct));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let animacao: Animation | null = null;
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        animacao = el.animate([{ width: "0%" }, { width: `${largura}%` }], { duration: 1000, easing: SAIDA, fill: "both" });
      },
      { threshold: 0.5 }
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      animacao?.cancel();
    };
  }, [largura]);

  return <div ref={ref} className={className} style={{ ...style, width: `${largura}%` }} />;
}

/** A data de hoje por extenso ("Quarta-feira, 14 de outubro"). Nasce vazia
 *  no servidor e o navegador preenche, para o HTML gerado não discordar
 *  do relógio de quem abre. */
export function DataHoje({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const texto = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    el.textContent = texto.charAt(0).toUpperCase() + texto.slice(1);
  }, []);
  return <span ref={ref} className={className} />;
}

/** Faísca: o mini-gráfico de linha dos cartões de número (14 dias, 6
 *  meses). Se desenha da esquerda para a direita quando aparece. */
export function Faisca({ valores, cor = "azul", className = "" }: { valores: number[]; cor?: "azul" | "ouro"; className?: string }) {
  const linha = useRef<SVGPathElement>(null);
  const area = useRef<SVGPathElement>(null);
  const L = 120;
  const A = 36;
  const maior = Math.max(...valores, 1);
  const pontos = valores.map((v, i) => [(i / Math.max(1, valores.length - 1)) * L, A - 3 - (v / maior) * (A - 6)] as const);
  const d = pontos.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const fechada = `${d} L${L},${A} L0,${A} Z`;
  const tinta = cor === "ouro" ? "#e1c68f" : "#1c69b5";
  const [ux, uy] = pontos[pontos.length - 1] ?? [L, A];

  useEffect(() => {
    const el = linha.current;
    const fundo = area.current;
    if (!el) return;
    const comprimento = el.getTotalLength();
    el.style.strokeDasharray = `${comprimento}`;
    el.style.strokeDashoffset = `${comprimento}`;
    if (fundo) fundo.style.opacity = "0";
    const animacoes: Animation[] = [];
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        animacoes.push(el.animate([{ strokeDashoffset: comprimento }, { strokeDashoffset: 0 }], { duration: 1300, easing: SAIDA, fill: "both" }));
        if (fundo) animacoes.push(fundo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 500, fill: "both" }));
      },
      { threshold: 0.4 }
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      animacoes.forEach((a) => a.cancel());
    };
  }, [d]);

  return (
    <svg viewBox={`0 0 ${L} ${A}`} preserveAspectRatio="none" aria-hidden="true" className={`block overflow-visible ${className}`}>
      <path ref={area} d={fechada} fill={tinta} opacity="0.14" />
      <path ref={linha} d={d} fill="none" stroke={tinta} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={ux} cy={uy} r="2.6" fill={tinta} stroke={cor === "ouro" ? "#0d2340" : "#ffffff"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Anel de proporção (0 a 100), com o número no meio; o traço se desenha
 *  quando aparece. */
export function Anel({ pct, rotulo, cor = "azul", className = "" }: { pct: number; rotulo?: string; cor?: "azul" | "ouro"; className?: string }) {
  const ref = useRef<SVGCircleElement>(null);
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const r = 15.5;
  const volta = 2 * Math.PI * r;
  const tinta = cor === "ouro" ? "#e1c68f" : "#1c69b5";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.strokeDashoffset = `${volta}`;
    let animacao: Animation | null = null;
    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        animacao = el.animate([{ strokeDashoffset: volta }, { strokeDashoffset: volta * (1 - p / 100) }], { duration: 1200, easing: SAIDA, fill: "both" });
      },
      { threshold: 0.4 }
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      animacao?.cancel();
    };
  }, [p, volta]);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title={rotulo}>
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" className="block -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3.5" />
        <circle ref={ref} cx="20" cy="20" r={r} fill="none" stroke={tinta} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={volta} strokeDashoffset={volta * (1 - p / 100)} />
      </svg>
      <span className="text-[0.78rem] font-semibold tabular-nums leading-tight">
        {p}%{rotulo && <span className="block text-[0.6875rem] font-normal opacity-70">{rotulo}</span>}
      </span>
    </span>
  );
}

/** A hora de agora no cabeçalho, viva (atualiza a cada minuto; no servidor
 *  não há relógio, então nasce vazia e o navegador preenche). */
export function RelogioAgora({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const escrever = () => {
      el.textContent = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };
    escrever();
    const id = window.setInterval(escrever, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span ref={ref} className={className} />;
}
