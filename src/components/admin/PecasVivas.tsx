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
