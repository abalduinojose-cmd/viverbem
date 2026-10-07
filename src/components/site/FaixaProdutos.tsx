"use client";
// Faixa horizontal de produtos.
//
// No celular a rolagem é a nativa do toque, que já funciona bem. No
// computador, onde arrastar com o mouse não faz nada por padrão, ligamos o
// "clique e arraste" (useArrasteHorizontal), só para mouse, e duas setas
// redondas nas bordas que avançam ou voltam uma tela (07/10/2026,
// "modernize essa área"); cada seta some quando a faixa já está naquela
// ponta, para não prometer o que não existe.

import { Children, useEffect, useRef, useState } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { useArrasteHorizontal } from "@/lib/useArrasteHorizontal";
import { ProdutoCard } from "./ProdutoCard";

function Seta({ direcao }: { direcao: "esquerda" | "direita" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direcao === "direita" ? "M5 12h14m0 0-6-6m6 6-6 6" : "M19 12H5m0 0 6-6m-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaixaProdutos({
  produtos,
  largura = "padrao",
  className = "",
  comCategoria = true,
  antes,
  setas = true,
  children,
}: {
  produtos?: ProdutoDTO[];
  /** Falso quando o título da seção já diz a categoria */
  comCategoria?: boolean;
  /** "estreita" nas grades do catálogo, "padrao" nas vitrines da home
   *  (18rem no computador: 20 ficou "muito grande", 06/10/2026) */
  largura?: "padrao" | "estreita";
  /** Classes extras na própria fileira (ex.: "cascata") */
  className?: string;
  /** Cartão que abre a faixa (o banner da área), com a largura dele mesmo */
  antes?: React.ReactNode;
  /** Setas nas bordas, no computador */
  setas?: boolean;
  /**
   * Cartões próprios da seção, já montados (a vitrine escura usa os dela).
   * Vêm como elementos, e não como função: função não atravessa a
   * fronteira de um Server Component para este, que é client.
   */
  children?: React.ReactNode;
}) {
  const faixaRef = useRef<HTMLDivElement>(null);
  const arraste = useArrasteHorizontal(faixaRef);

  // Em qual ponta a faixa está, para esconder a seta que não faria nada.
  // Começa "nas duas pontas" (sem setas) até a primeira medida.
  const [pontas, setPontas] = useState({ inicio: true, fim: true });
  useEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa) return;
    const medir = () => {
      const folga = 4;
      setPontas({
        inicio: faixa.scrollLeft <= folga,
        fim: faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - folga,
      });
    };
    const quadro = requestAnimationFrame(medir);
    faixa.addEventListener("scroll", medir, { passive: true });
    const observador = new ResizeObserver(medir);
    observador.observe(faixa);
    return () => {
      cancelAnimationFrame(quadro);
      faixa.removeEventListener("scroll", medir);
      observador.disconnect();
    };
  }, []);

  function rolar(sentido: 1 | -1) {
    const faixa = faixaRef.current;
    if (!faixa) return;
    faixa.scrollBy({ left: sentido * faixa.clientWidth * 0.8, behavior: "smooth" });
  }

  const classeItem =
    largura === "estreita" ? "w-52 md:w-64 shrink-0 snap-start" : "w-60 md:w-72 shrink-0 snap-start";
  const classeSeta =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-[2] w-11 h-11 rounded-full bg-white/95 text-navy ring-1 ring-fio shadow-[0_14px_30px_-14px_rgba(13,35,64,0.5)] items-center justify-center transition hover:bg-navy hover:text-white active:scale-95";

  return (
    <div className="relative">
      <div
        ref={faixaRef}
        {...arraste.props}
        className={`flex gap-4 md:gap-5 overflow-x-auto rolagem-sem-barra pb-2 -mx-1 px-1 snap-x md:cursor-grab ${
          arraste.arrastando ? "md:cursor-grabbing select-none snap-none" : ""
        } ${className}`}
      >
        {antes && <div className="shrink-0 snap-start flex">{antes}</div>}
        {children
          ? Children.map(children, (filho) => <div className={classeItem}>{filho}</div>)
          : produtos?.map((p) => (
              <div key={p.id} className={classeItem}>
                <ProdutoCard produto={p} mostrarCategoria={comCategoria} />
              </div>
            ))}
      </div>

      {setas && !pontas.inicio && (
        <button type="button" onClick={() => rolar(-1)} aria-label="Ver os anteriores" className={`${classeSeta} left-2`}>
          <Seta direcao="esquerda" />
        </button>
      )}
      {setas && !pontas.fim && (
        <button type="button" onClick={() => rolar(1)} aria-label="Ver os próximos" className={`${classeSeta} right-2`}>
          <Seta direcao="direita" />
        </button>
      )}
    </div>
  );
}
