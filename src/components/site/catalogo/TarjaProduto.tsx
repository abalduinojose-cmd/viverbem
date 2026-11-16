// As tarjas sobre a foto do produto (27/10/2026, "em alguns produtos
// coloque uma tarja de mais vendido e de novidade, simples, por cima do
// produto"). Saem das chaves do painel: "Destaque" vira MAIS VENDIDO (ouro,
// com a cápsula) e "Novidade" vira NOVIDADE (branca com o ponto azul).
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
  // 27/10/2026 ("tire a estrela e coloque um remédio, um pouquinho maior
  // que a estrela"): a cápsula, uns 30% maior que a estrela de antes
  const icone = tamanho === "pequena" ? 11 : tamanho === "grande" ? 15 : 12;
  return (
    <span className={`pointer-events-none absolute left-2.5 top-2.5 z-[2] flex flex-col items-start gap-1 ${className}`}>
      {produto.destaque && (
        <span className={`inline-flex items-center rounded-full bg-[image:var(--ouro-degrade)] font-semibold uppercase tracking-[0.12em] text-navy shadow-[0_8px_18px_-10px_rgba(201,165,107,0.9)] ${texto}`}>
          {/* A cápsula, inclinada, com uma metade cheia e a outra vazada */}
          <svg width={icone} height={icone} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <g transform="rotate(-45 12 12)">
              <rect x="3.5" y="8" width="17" height="8" rx="4" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8h4.5a4 4 0 0 1 0 8H12V8Z" fill="currentColor" />
            </g>
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
