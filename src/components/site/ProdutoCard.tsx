// Cartão de produto no modelo de loja (referência biovittare.com.br): a
// foto grande sobre o gelo, com a luz dourada da bancada no pé do pote, a
// categoria (quando a seção não a diz), o nome e o botão do carrinho em
// ouro (.botao-carrinho).
//
// O cartão inteiro leva à página do produto: o link do nome se estende
// sobre o cartão (pseudo-elemento), então a área de toque é grande e há
// um único link na ordem do Tab. O botão fica por cima (z-index), fora do
// link, porque botão dentro de link não é HTML válido.
//
// Sem preço em nenhum produto (pedido do cliente em 05/10/2026): o pedido
// vai pelo carrinho e o farmacêutico passa o valor pelo WhatsApp.
import Link from "next/link";
import { ProdutoDTO, ehIndustrializado } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";

export function ProdutoCard({
  produto,
  mostrarCategoria = true,
}: {
  produto: ProdutoDTO;
  /** Falso dentro de uma seção que já leva o nome da categoria: a
      linha se repetia igual em todos os cartões e não informava nada */
  mostrarCategoria?: boolean;
}) {
  const href = `/produto/${produto.slug}`;
  const industrializado = ehIndustrializado(produto);

  return (
    <article className="group relative flex h-full w-full flex-col rounded-[1.75rem] border border-fio bg-white p-2.5 pb-4 transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)] focus-within:border-ouro/60">
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-gelo to-gelo/30 flex items-center justify-center p-3">
        {/* A luz dourada da bancada, no pé do pote */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[12%] bottom-1 h-12 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(192,160,96,0.32),transparent_70%)]"
        />
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="relative max-h-full w-auto max-w-full !object-contain drop-shadow-[0_6px_8px_rgba(16,42,74,0.3)] transition-transform duration-500 group-hover:-translate-y-1.5"
        />
        {industrializado && produto.novidade && (
          <span className="absolute top-2.5 left-2.5 rotulo !text-ouro text-[0.6rem] bg-white border border-ouro/40 rounded-full px-2.5 py-1">
            Novidade
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1 px-1.5">
        {mostrarCategoria && produto.categoriaNome && (
          <p className="rotulo !text-cinza text-[0.62rem] truncate">{produto.categoriaNome}</p>
        )}
        <h3 className="text-[1rem] font-medium leading-snug tracking-[-0.015em] text-navy line-clamp-2">
          {/* O link se estende sobre o cartão inteiro */}
          <Link
            href={href}
            className="transition-colors hover:text-tinta focus-visible:outline-none after:absolute after:inset-0 after:rounded-[1.75rem]"
          >
            {produto.nome}
          </Link>
        </h3>
        {industrializado && <p className="text-sm text-cinza line-clamp-2 mt-0.5">{produto.descricao}</p>}
        <div className="relative z-[1] mt-auto pt-3">
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}
