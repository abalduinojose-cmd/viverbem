// As tarjas sobre a foto do produto (27/10/2026, "em alguns produtos
// coloque uma tarja de mais vendido e de novidade, simples, por cima do
// produto"). Saem das chaves do painel: "Destaque" vira MAIS VENDIDO (ouro,
// com a estrela) e "Novidade" vira NOVIDADE (branca com o ponto azul).
// Ficam no canto de cima, à esquerda, empilhadas, em todos os cartões e na
// foto grande da página do produto. O gestor liga e desliga em Produtos.
import type { ProdutoDTO } from "@/lib/tipos";

export function TarjaProduto({
  produto,
  tamanho = "normal",
  className = "",
}: {
  produto: Pick<ProdutoDTO, "destaque" | "novidade">;
  tamanho?: "pequena" | "normal" | "grande";
  className?: string;
}) {
  if (!produto.destaque && !produto.novidade) return null;
  const texto = { pequena: "text-[0.56rem] px-2 py-[0.2rem] gap-1", normal: "text-[0.62rem] px-2.5 py-1 gap-1.5", grande: "text-[0.6875rem] px-3 py-1.5 gap-1.5" }[tamanho];
  const estrela = tamanho === "pequena" ? 8 : tamanho === "grande" ? 11 : 9;
  return (
    <span className={`pointer-events-none absolute left-2.5 top-2.5 z-[2] flex flex-col items-start gap-1 ${className}`}>
      {produto.destaque && (
        <span className={`inline-flex items-center rounded-full bg-[image:var(--ouro-degrade)] font-semibold uppercase tracking-[0.12em] text-navy shadow-[0_8px_18px_-10px_rgba(201,165,107,0.9)] ${texto}`}>
          <svg width={estrela} height={estrela} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
          </svg>
          Mais vendido
        </span>
      )}
      {produto.novidade && (
        <span className={`inline-flex items-center rounded-full bg-white font-semibold uppercase tracking-[0.12em] text-navy ring-1 ring-inset ring-fio shadow-[0_8px_18px_-12px_rgba(13,35,64,0.4)] ${texto}`}>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-tinta" />
          Novidade
        </span>
      )}
    </span>
  );
}
