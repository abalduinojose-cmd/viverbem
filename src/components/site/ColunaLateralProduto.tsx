"use client";
// Coluna lateral da página do produto (07/10/2026, pedido: "coloque uma
// coluna de os mais procurados e os que a pessoa já visitou"): dois blocos
// compactos, "Mais procurados" (do catálogo, com foto, sem o produto
// atual) e "Você viu recentemente" (histórico do navegador, via
// useVistosRecentemente). No computador largo (xl) fica presa ao lado do
// produto; abaixo disso a página mostra os mesmos dois blocos lado a
// lado, embaixo do produto.
//
// Segunda versão (07/10/2026, "melhore os mais procurados e o você viu
// recentemente"): cada item é uma linha inteira clicável, com a foto num
// ladrilho de gelo com a luz dourada embaixo, o nome e a área, e o
// "adicionar" suave (contorno, que vira ouro no hover) em vez do botão de
// ouro cheio repetido quatro vezes; a linha acende de leve no hover e o
// bloco fecha com "Ver todos os produtos".
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { useVistosRecentemente } from "@/lib/useVistosRecentemente";
import { SetaDireita } from "./icones";

function ItemCompacto({ produto }: { produto: ProdutoDTO }) {
  return (
    <li className="group relative -mx-2 flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-gelo/50">
      <span className="relative shrink-0 w-14 h-14 rounded-xl bg-gradient-to-b from-gelo to-gelo/30 flex items-center justify-center p-1.5 overflow-hidden">
        <span
          aria-hidden="true"
          className="absolute inset-x-[15%] bottom-0.5 h-4 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(201,165,107,0.3),transparent_70%)]"
        />
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="relative max-w-full max-h-full !object-contain drop-shadow-[0_5px_7px_rgba(16,42,74,0.26)] transition-transform duration-500 group-hover:-translate-y-0.5"
        />
      </span>
      <div className="min-w-0 flex-1">
        {/* O link se estende sobre a linha inteira */}
        <Link
          href={`/produto/${produto.slug}`}
          className="block text-[0.92rem] font-medium text-navy leading-snug line-clamp-2 transition-colors group-hover:text-tinta after:absolute after:inset-0 after:rounded-2xl"
        >
          {produto.nome}
        </Link>
        {produto.categoriaNome && <span className="block mt-0.5 text-xs text-cinza truncate">{produto.categoriaNome}</span>}
      </div>
      <BotaoAdicionar produto={produto} compacto suave className="relative z-[1]" />
    </li>
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
    <section aria-label={titulo} className="rounded-[1.75rem] border border-fio bg-white p-4 md:p-5 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
      <p className="rotulo-pilula !text-[0.64rem]">{rotulo}</p>
      <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.025em] text-navy">{titulo}</h2>
      <ul className="mt-2 lista-fichas">
        {itens.map((p) => (
          <ItemCompacto key={p.id} produto={p} />
        ))}
      </ul>
      {verMais && (
        <Link href={verMais.href} className="botao-link !min-h-11 !text-sm mt-2">
          {verMais.texto}
          <SetaDireita tamanho={14} />
        </Link>
      )}
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
  /** Como a coluna se dispõe (presa ao lado, ou dois blocos lado a lado) */
  className?: string;
}) {
  const vistos = useVistosRecentemente(slugAtual, catalogo);
  return (
    <aside className={className} aria-label="Mais procurados e vistos recentemente">
      <Bloco rotulo="os mais pedidos" titulo="Mais procurados" itens={maisProcurados} verMais={{ href: "/produtos", texto: "Ver todos os produtos" }} />
      <Bloco rotulo="continue de onde parou" titulo="Você viu recentemente" itens={vistos.slice(0, 4)} />
    </aside>
  );
}
