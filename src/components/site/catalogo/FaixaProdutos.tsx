"use client";
// Faixa horizontal de produtos.
//
// No celular a rolagem é a nativa do toque, que já funciona bem. No
// computador, onde arrastar com o mouse não faz nada por padrão, ligamos o
// "clique e arraste" (useArrasteHorizontal), só para mouse.
//
// As setas tiveram duas versões: redondas nas bordas, por cima dos cartões
// (07/10/2026), e uma barra acima da faixa com linha de progresso e as duas
// setas lado a lado (29/10/2026, "coloque pra cima"). A barra foi recusada
// no mesmo dia ("não gostei disso na versão desktop, tire"), e a faixa
// ficou sem setas: no computador ela rola arrastando com o mouse.

import { Children, useRef } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { useArrasteHorizontal } from "@/lib/useArrasteHorizontal";
import { ProdutoCard, type VarianteCartao } from "./ProdutoCard";

export function FaixaProdutos({
  produtos,
  largura = "padrao",
  className = "",
  comCategoria = true,
  antes,
  depois,
  variante = "cartao",
  children,
}: {
  produtos?: ProdutoDTO[];
  /** O desenho dos cartões (o catálogo usa o "limpa", sem caixa) */
  variante?: VarianteCartao;
  /** Falso quando o título da seção já diz a categoria */
  comCategoria?: boolean;
  /** "estreita" nas grades do catálogo, "padrao" nas vitrines da home
   *  (18rem no computador: 20 ficou "muito grande", 06/10/2026) */
  largura?: "padrao" | "estreita";
  /** Classes extras na própria fileira (ex.: "cascata") */
  className?: string;
  /** Cartão que abre a faixa, com a largura dele mesmo */
  antes?: React.ReactNode;
  /** Cartão que fecha a faixa (o banner da área, depois dos produtos) */
  depois?: React.ReactNode;
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
    <div className="relative">
      <div
        ref={faixaRef}
        {...arraste.props}
        // -mx-4 px-4 + scroll-px-4 (13/10/2026): os cartões continuam
        // alinhados com a coluna do título, mas o recorte da faixa ganhou
        // 16px de folga dos dois lados. Com 4px, a sombra e o levante do
        // cartão no hover eram cortados na borda.
        className={`flex gap-4 md:gap-5 overflow-x-auto rolagem-sem-barra pt-1 pb-3 -mt-1 -mx-4 px-4 scroll-px-4 snap-x md:cursor-grab ${
          arraste.arrastando ? "md:cursor-grabbing select-none snap-none" : ""
        } ${className}`}
      >
        {antes && <div className="shrink-0 snap-start flex">{antes}</div>}
        {children
          ? Children.map(children, (filho) => <div className={classeItem}>{filho}</div>)
          : produtos?.map((p) => (
              <div key={p.id} className={classeItem}>
                <ProdutoCard produto={p} mostrarCategoria={comCategoria} variante={variante} />
              </div>
            ))}
        {depois && <div className="shrink-0 snap-start flex">{depois}</div>}
      </div>
    </div>
  );
}
