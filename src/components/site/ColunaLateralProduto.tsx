"use client";
// Coluna lateral da página do produto (07/10/2026, pedido: "coloque uma
// coluna de os mais procurados e os que a pessoa já visitou"): dois blocos
// compactos, "Mais procurados" (do catálogo, com foto, sem o produto
// atual) e "Você viu recentemente" (histórico do navegador, via
// useVistosRecentemente). No computador largo (xl) fica presa ao lado do
// produto; abaixo disso a página mostra os mesmos dois blocos lado a
// lado, embaixo do produto. Cada item tem o "adicionar" compacto.
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { useVistosRecentemente } from "@/lib/useVistosRecentemente";
import { SetaDireita } from "./icones";

function ItemCompacto({ produto }: { produto: ProdutoDTO }) {
  const href = `/produto/${produto.slug}`;
  return (
    <li className="flex items-center gap-3 py-3">
      <Link
        href={href}
        className="shrink-0 w-14 h-14 rounded-xl bg-gelo/70 flex items-center justify-center p-1.5 transition-colors hover:bg-gelo"
        aria-label={produto.nome}
      >
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="max-w-full max-h-full !object-contain drop-shadow-[0_5px_7px_rgba(16,42,74,0.26)]"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={href}
          className="block text-[0.9rem] font-medium text-navy leading-snug line-clamp-2 transition-colors hover:text-tinta"
        >
          {produto.nome}
        </Link>
        {produto.categoriaNome && <span className="block mt-0.5 text-xs text-cinza truncate">{produto.categoriaNome}</span>}
      </div>
      <BotaoAdicionar produto={produto} compacto />
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
    <section aria-label={titulo} className="rounded-[1.5rem] border border-fio bg-white p-4 md:p-5 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
      <p className="rotulo !text-cinza text-[0.66rem]">{rotulo}</p>
      <h2 className="mt-1 text-[1.05rem] font-semibold tracking-[-0.02em] text-navy">{titulo}</h2>
      <ul className="mt-1 lista-fichas">
        {itens.map((p) => (
          <ItemCompacto key={p.id} produto={p} />
        ))}
      </ul>
      {verMais && (
        <Link
          href={verMais.href}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-tinta underline-offset-4 hover:underline"
        >
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
      <Bloco rotulo="os mais pedidos" titulo="Mais procurados" itens={maisProcurados} verMais={{ href: "/produtos", texto: "Ver todos" }} />
      <Bloco rotulo="continue de onde parou" titulo="Você viu recentemente" itens={vistos.slice(0, 4)} />
    </aside>
  );
}
