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

  // Um link para "#avaliacoes" (o selo embaixo do nome) abre a aba e rola até ela
  const raiz = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const abrirPelaAncora = () => {
      const alvo = window.location.hash.slice(1);
      const i = abas.findIndex((a) => a.id === alvo);
      if (i < 0) return;
      setAtiva(i);
      requestAnimationFrame(() => raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };
    abrirPelaAncora();
    window.addEventListener("hashchange", abrirPelaAncora);
    return () => window.removeEventListener("hashchange", abrirPelaAncora);
  }, [abas]);

  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const prox = (ativa + (e.key === "ArrowRight" ? 1 : -1) + abas.length) % abas.length;
    setAtiva(prox);
    botoes.current[prox]?.focus();
  };

  return (
    <div ref={raiz} className="scroll-mt-[calc(var(--altura-cabecalho)+1rem)]">
      {/* 23/10/2026 (terceira volta): as abas viraram um SELETOR EM PÍLULA,
          como nos marketplaces: a trilha em gelo, a aba ativa numa pílula
          branca com sombra curta e um fio de ouro na base, que desliza até
          a aba escolhida; no celular a trilha rola de lado. */}
      <div className="-mx-5 overflow-x-auto rolagem-sem-barra px-5 md:mx-0 md:px-0">
        <div ref={lista} role="tablist" aria-label="Detalhes do produto" onKeyDown={aoTeclar} className="relative inline-flex min-w-full gap-1 rounded-full bg-gelo p-1 md:min-w-0">
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-0 rounded-full bg-white shadow-[0_10px_24px_-14px_rgba(13,35,64,0.5)] ring-1 ring-inset ring-fio/70 transition-[transform,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(${marca.x}px)`, width: marca.w }}
          >
            <span className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[image:var(--ouro-degrade)]" />
          </span>
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
              className={`relative z-[1] h-11 shrink-0 flex-1 px-4 text-[0.92rem] font-semibold whitespace-nowrap rounded-full transition-colors ${
                i === ativa ? "text-navy" : "text-cinza hover:text-navy"
              }`}
            >
              {a.rotulo}
            </button>
          ))}
        </div>
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
