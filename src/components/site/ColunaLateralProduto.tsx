"use client";
// "Mais procurados" e "Você viu recentemente" na página do produto
// (07/10/2026, pedido: "coloque uma coluna de os mais procurados e os que
// a pessoa já visitou"). O histórico vem do navegador, via
// useVistosRecentemente.
//
// Quarta versão (21/10/2026, "os mais procurados nesse mesmo tamanho mas
// arrastando para o lado; embaixo, continue de onde parou arrastando para
// o lado também"): a coluna presa ao lado do produto saiu; os dois blocos
// ficam embaixo do produto, um sobre o outro, cada um com a sua FAIXA que
// arrasta para o lado (a mesma das vitrines: toque no celular, clique e
// arraste no computador, setas nas bordas). Cada produto é um cartão em pé
// (foto grande no ladrilho de gelo com a luz dourada, o "adicionar" em
// contorno no canto da foto, o nome e a área).
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { FaixaProdutos } from "./FaixaProdutos";
import { useVistosRecentemente } from "@/lib/useVistosRecentemente";
import { SetaDireita } from "./icones";

function CartaoCompacto({ produto }: { produto: ProdutoDTO }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl p-2 transition-colors hover:bg-gelo/50">
      <span className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-gelo to-gelo/30 flex items-center justify-center p-3 md:p-4">
        <span
          aria-hidden="true"
          className="absolute inset-x-[15%] bottom-1 h-6 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(201,165,107,0.3),transparent_70%)]"
        />
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="relative max-w-full max-h-full !object-contain drop-shadow-[0_8px_10px_rgba(16,42,74,0.26)] transition-transform duration-500 group-hover:-translate-y-1"
        />
        {/* O "adicionar" no canto da foto, para o nome ter a largura toda */}
        <BotaoAdicionar produto={produto} compacto suave className="absolute right-2 top-2 z-[1]" />
      </span>
      <div className="mt-2.5 min-w-0">
        {/* O link se estende sobre o cartão inteiro */}
        <Link
          href={`/produto/${produto.slug}`}
          className="block text-[0.9rem] md:text-[0.98rem] font-medium text-navy leading-snug line-clamp-2 transition-colors group-hover:text-tinta after:absolute after:inset-0 after:rounded-2xl"
        >
          {produto.nome}
        </Link>
        {produto.categoriaNome && <span className="mt-0.5 block truncate text-xs text-cinza">{produto.categoriaNome}</span>}
      </div>
    </article>
  );
}

function Bloco({
  rotulo,
  titulo,
  itens,
  verMais,
}: {
  rotulo: string;
  titulo: string;
  itens: ProdutoDTO[];
  verMais?: { href: string; texto: string };
}) {
  if (itens.length === 0) return null;
  return (
    <section aria-label={titulo} className="rounded-[1.75rem] border border-fio bg-white p-4 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="rotulo-pilula !text-[0.6875rem]">{rotulo}</p>
          <h2 className="mt-2 text-[1.2rem] md:text-[1.5rem] font-semibold tracking-[-0.03em] text-navy">{titulo}</h2>
        </div>
        {verMais && (
          <Link href={verMais.href} className="botao-link !min-h-11 !text-sm">
            {verMais.texto}
            <SetaDireita tamanho={14} />
          </Link>
        )}
      </div>
      <div className="mt-4">
        <FaixaProdutos largura="estreita">
          {itens.map((p) => (
            <CartaoCompacto key={p.id} produto={p} />
          ))}
        </FaixaProdutos>
      </div>
    </section>
  );
}

export function ColunaLateralProduto({
  slugAtual,
  catalogo,
  maisProcurados,
  className = "",
}: {
  slugAtual: string;
  catalogo: ProdutoDTO[];
  /** Já escolhidos pela página: com foto e sem o produto atual */
  maisProcurados: ProdutoDTO[];
  className?: string;
}) {
  const vistos = useVistosRecentemente(slugAtual, catalogo);
  return (
    // 25/10/2026 ("antes dos mais pedidos coloque o Você viu recentemente,
    // com os produtos que a pessoa já clicou no site"): o histórico vem
    // primeiro; ele só aparece quando a pessoa já abriu outro produto
    <aside className={`flex flex-col gap-5 md:gap-6 ${className}`} aria-label="Vistos recentemente e mais procurados">
      <Bloco rotulo="continue de onde parou" titulo="Você viu recentemente" itens={vistos.slice(0, 10)} />
      <Bloco rotulo="os mais pedidos" titulo="Mais procurados" itens={maisProcurados} verMais={{ href: "/produtos", texto: "Ver todos os produtos" }} />
    </aside>
  );
}
