// Cartão de produto no modelo de loja (referência biovittare.com.br): a
// foto grande sobre o gelo, a categoria (quando a seção não a diz), o
// nome e o botão "Adicionar ao carrinho".
//
// Sem preço em nenhum produto (pedido do cliente em 05/10/2026): o pedido
// vai pelo carrinho e o farmacêutico passa o valor pelo WhatsApp. A foto e
// o nome levam à página do produto; o botão fica fora do link, porque
// botão dentro de link não é HTML válido.
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
    <article className="group flex h-full w-full flex-col rounded-[1.5rem] border border-fio bg-white p-3 pb-4 transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)]">
      {/* A foto repete o link do nome: fica fora da ordem do Tab */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative aspect-square rounded-[1.1rem] bg-gelo/70 flex items-center justify-center p-5">
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="max-h-full w-auto max-w-full !object-contain drop-shadow-[0_16px_14px_rgba(16,42,74,0.2)] transition-transform duration-500 group-hover:-translate-y-1.5"
          />
          {industrializado && produto.novidade && (
            <span className="absolute top-2.5 left-2.5 rotulo !text-ouro text-[0.6rem] bg-white border border-ouro/40 rounded-full px-2.5 py-1">
              Novidade
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1 px-1">
        {mostrarCategoria && produto.categoriaNome && (
          <p className="rotulo !text-cinza text-[0.62rem] truncate">{produto.categoriaNome}</p>
        )}
        <h3 className="text-[1rem] font-medium leading-snug tracking-[-0.015em] text-navy line-clamp-2">
          <Link href={href} className="transition-colors hover:text-tinta">
            {produto.nome}
          </Link>
        </h3>
        {industrializado && <p className="text-sm text-cinza line-clamp-2 mt-0.5">{produto.descricao}</p>}
        <div className="mt-auto pt-3">
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}
