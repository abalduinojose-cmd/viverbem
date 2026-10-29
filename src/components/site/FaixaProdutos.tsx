"use client";
// Faixa horizontal de produtos.
//
// No celular a rolagem é a nativa do toque, que já funciona bem. No
// computador, onde arrastar com o mouse não faz nada por padrão, ligamos o
// "clique e arraste" (useArrasteHorizontal), só para mouse, e duas setas
// redondas nas bordas que avançam ou voltam uma tela (07/10/2026,
// "modernize essa área"); cada seta some quando a faixa já está naquela
// ponta, para não prometer o que não existe.
//
// 29/10/2026 ("o botão de arrastar para o lado não tá bom, modernize e
// coloque pra cima"): as setas saíram das bordas, onde cobriam os cartões, e
// subiram para uma barra acima da faixa (só no computador): à esquerda, uma
// linha fina de progresso que mostra a parte da faixa à vista e anda com a
// rolagem; à direita, as duas setas lado a lado. Em vez de sumir, a seta da
// ponta fica apagada (os dois botões não trocam de lugar).

import { Children, useEffect, useRef, useState } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { useArrasteHorizontal } from "@/lib/useArrasteHorizontal";
import { ProdutoCard, type VarianteCartao } from "./ProdutoCard";

function Seta({ direcao }: { direcao: "esquerda" | "direita" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  depois,
  setas = true,
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
  /** A barra de progresso e as setas, acima da faixa, no computador */
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
  // A linha de progresso: quanto da faixa está à vista e onde (0 a 1)
  const [trilho, setTrilho] = useState({ visivel: 1, posicao: 0 });
  useEffect(() => {
    const faixa = faixaRef.current;
    if (!faixa) return;
    const medir = () => {
      const folga = 4;
      setPontas({
        inicio: faixa.scrollLeft <= folga,
        fim: faixa.scrollLeft + faixa.clientWidth >= faixa.scrollWidth - folga,
      });
      const sobra = faixa.scrollWidth - faixa.clientWidth;
      setTrilho({
        visivel: faixa.scrollWidth > 0 ? Math.min(1, faixa.clientWidth / faixa.scrollWidth) : 1,
        posicao: sobra > 0 ? Math.min(1, Math.max(0, faixa.scrollLeft / sobra)) : 0,
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
    "flex size-10 items-center justify-center rounded-full bg-white text-navy ring-1 ring-inset ring-fio transition hover:bg-navy hover:text-white hover:ring-navy active:scale-95 disabled:opacity-35 disabled:pointer-events-none";
  // Só há o que rolar quando a faixa não cabe inteira
  const rola = !(pontas.inicio && pontas.fim);

  return (
    <div className="relative">
      {/* A barra de cima: progresso e setas (computador) */}
      {setas && rola && (
        <div className="hidden md:flex items-center gap-5 mb-4">
          <div aria-hidden="true" className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-fio">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-tinta transition-[translate] duration-200 ease-out"
              style={{
                width: `${trilho.visivel * 100}%`,
                translate: `${(trilho.posicao * (1 - trilho.visivel) * 100) / trilho.visivel}% 0`,
              }}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => rolar(-1)} disabled={pontas.inicio} aria-label="Ver os anteriores" className={classeSeta}>
              <Seta direcao="esquerda" />
            </button>
            <button type="button" onClick={() => rolar(1)} disabled={pontas.fim} aria-label="Ver os próximos" className={classeSeta}>
              <Seta direcao="direita" />
            </button>
          </div>
        </div>
      )}

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
