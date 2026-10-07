"use client";
// Faixa horizontal de produtos.
//
// No celular a rolagem é a nativa do toque, que já funciona bem e não
// precisa de setas. No computador, onde arrastar com o mouse não faz
// nada por padrão, ligamos o "clique e arraste" (useArrasteHorizontal),
// só para mouse, para não atrapalhar o toque.

import { Children, useRef } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { useArrasteHorizontal } from "@/lib/useArrasteHorizontal";
import { ProdutoCard } from "./ProdutoCard";

export function FaixaProdutos({
  produtos,
  largura = "padrao",
  className = "",
  comCategoria = true,
  antes,
  children,
}: {
  produtos?: ProdutoDTO[];
  /** Falso quando o título da seção já diz a categoria */
  comCategoria?: boolean;
  /** "estreita" nas grades do catálogo, "padrao" nas vitrines da home
   *  (18rem no computador: 20 ficou "muito grande", 06/10/2026) */
  largura?: "padrao" | "estreita";
  /** Cartão que abre a faixa (o banner da área), com a largura dele mesmo */
  antes?: React.ReactNode;
  /** Classes extras na própria fileira (ex.: "cascata") */
  className?: string;
  /**
   * Cartões próprios da seção, já montados (a vitrine escura usa os dela).
   * Vêm como elementos, e não como função: função não atravessa a
   * fronteira de um Server Component para este, que é client.
   */
  children?: React.ReactNode;
}) {
  const faixaRef = useRef<HTMLDivElement>(null);
  const arraste = useArrasteHorizontal(faixaRef);

  const classeItem =
    largura === "estreita" ? "w-52 md:w-64 shrink-0 snap-start" : "w-60 md:w-72 shrink-0 snap-start";

  return (
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
  );
}
