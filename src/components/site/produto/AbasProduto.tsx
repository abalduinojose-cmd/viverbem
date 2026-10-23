"use client";
// As abas de detalhes da página do produto (23/10/2026, "quero a página do
// produto mais completa, como um marketplace famoso"): Descrição, Como
// pedir, Entrega e retirada e Dúvidas, numa barra de abas com o sublinhado
// de ouro que desliza até a aba escolhida. O conteúdo vem montado do
// servidor (elementos, não funções). Teclado: setas trocam de aba, como
// pede o padrão de tablist.
import { useEffect, useId, useRef, useState } from "react";

export interface Aba {
  id: string;
  rotulo: string;
  conteudo: React.ReactNode;
}

export function AbasProduto({ abas }: { abas: Aba[] }) {
  const base = useId();
  const [ativa, setAtiva] = useState(0);
  const lista = useRef<HTMLDivElement>(null);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  const [marca, setMarca] = useState({ x: 0, w: 0 });

  // O sublinhado de ouro acompanha a aba ativa
  useEffect(() => {
    const b = botoes.current[ativa];
    const l = lista.current;
    if (!b || !l) return;
    const medir = () => setMarca({ x: b.offsetLeft, w: b.offsetWidth });
    // no quadro seguinte, para não renderizar de novo dentro do efeito
    const quadro = requestAnimationFrame(medir);
    const obs = new ResizeObserver(medir);
    obs.observe(l);
    return () => {
      cancelAnimationFrame(quadro);
      obs.disconnect();
    };
  }, [ativa]);

  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const prox = (ativa + (e.key === "ArrowRight" ? 1 : -1) + abas.length) % abas.length;
    setAtiva(prox);
    botoes.current[prox]?.focus();
  };

  return (
    <div>
      <div ref={lista} role="tablist" aria-label="Detalhes do produto" onKeyDown={aoTeclar} className="relative flex gap-1 overflow-x-auto rolagem-sem-barra border-b border-fio">
        {abas.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              botoes.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-aba-${a.id}`}
            aria-selected={i === ativa}
            aria-controls={`${base}-painel-${a.id}`}
            tabIndex={i === ativa ? 0 : -1}
            onClick={() => setAtiva(i)}
            className={`relative shrink-0 h-12 px-4 text-[0.95rem] font-semibold whitespace-nowrap transition-colors ${
              i === ativa ? "text-navy" : "text-cinza hover:text-navy"
            }`}
          >
            {a.rotulo}
          </button>
        ))}
        <span
          aria-hidden="true"
          className="absolute bottom-[-1px] left-0 h-[3px] rounded-full bg-[image:var(--ouro-degrade)] transition-[transform,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(${marca.x}px)`, width: marca.w }}
        />
      </div>
      {abas.map((a, i) => (
        <div
          key={a.id}
          role="tabpanel"
          id={`${base}-painel-${a.id}`}
          aria-labelledby={`${base}-aba-${a.id}`}
          hidden={i !== ativa}
          className="pt-7 animar-surgir"
        >
          {a.conteudo}
        </div>
      ))}
    </div>
  );
}
