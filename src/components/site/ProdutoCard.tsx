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
//
// Duas variantes (10/10/2026, "quero a página de produtos moderna e
// clean"): "cartao" é a caixa branca com fio, usada nas vitrines da home;
// "limpa" tira a caixa: só o ladrilho da foto em gelo (que acende no
// hover), o nome e o botão embaixo, sem borda. O catálogo usa a limpa.
import Link from "next/link";
import { ProdutoDTO, ehIndustrializado, precoVisivel } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";

export type VarianteCartao = "cartao" | "limpa";

export function ProdutoCard({
  produto,
  mostrarCategoria = true,
  variante = "cartao",
}: {
  produto: ProdutoDTO;
  /** Falso dentro de uma seção que já leva o nome da categoria: a
      linha se repetia igual em todos os cartões e não informava nada */
  mostrarCategoria?: boolean;
  /** O desenho: caixa branca com fio, ou só o ladrilho da foto (catálogo) */
  variante?: VarianteCartao;
}) {
  const href = `/produto/${produto.slug}`;
  const industrializado = ehIndustrializado(produto);
  // Só industrializado com a chave "Preço no site" ligada no painel
  const preco = precoVisivel(produto);
  const limpa = variante === "limpa";

  return (
    <article
      className={
        limpa
          ? "group relative flex h-full w-full flex-col"
          : "group relative flex h-full w-full flex-col rounded-[1.75rem] border border-fio bg-white p-2.5 pb-4 transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)] focus-within:border-ouro/60"
      }
    >
      <div
        className={`relative aspect-square overflow-hidden flex items-center justify-center ${
          limpa
            ? "rounded-[1.75rem] bg-gelo/60 p-5 transition-colors duration-300 group-hover:bg-gelo"
            : "rounded-[1.35rem] bg-gradient-to-b from-gelo to-gelo/30 p-3"
        }`}
      >
        {/* A luz dourada da bancada, logo abaixo do pote (10/10/2026, "a
            sombra está muito longe do produto": antes ficava colada na base
            do ladrilho; agora é um halo centrado sob o pote e a sombra do
            próprio pote é quente, grudada nele) */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[66%] h-[16%] w-[56%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(201,165,107,0.34),transparent_70%)]"
        />
        <FotoProduto
          fotoUrl={produto.fotoUrl}
          nome={produto.nome}
          className="relative max-h-full w-auto max-w-full !object-contain [filter:drop-shadow(0_10px_9px_rgba(201,165,107,0.38))_drop-shadow(0_2px_2px_rgba(16,42,74,0.14))] transition-transform duration-500 group-hover:-translate-y-1.5"
        />
        {industrializado && produto.novidade && (
          <span className="absolute top-2.5 left-2.5 rotulo !text-ouro text-[0.6rem] bg-white border border-ouro/40 rounded-full px-2.5 py-1">
            Novidade
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col gap-1 ${limpa ? "mt-3.5 px-1" : "mt-3 px-1.5"}`}>
        {mostrarCategoria && produto.categoriaNome && (
          <p className="rotulo !text-cinza text-[0.62rem] truncate">{produto.categoriaNome}</p>
        )}
        <h3 className="text-[1rem] font-medium leading-snug tracking-[-0.015em] text-navy line-clamp-2">
          {/* O link se estende sobre o cartão inteiro */}
          <Link
            href={href}
            className={`transition-colors hover:text-tinta focus-visible:outline-none after:absolute after:inset-0 ${
              limpa ? "after:rounded-[1.75rem]" : "after:rounded-[1.75rem]"
            }`}
          >
            {produto.nome}
          </Link>
        </h3>
        {preco !== null && (
          <p className="mt-1 text-[1.05rem] font-semibold text-navy tabular-nums tracking-[-0.01em]">{formatarPreco(preco)}</p>
        )}
        {industrializado && <p className="text-sm text-cinza line-clamp-2 mt-0.5">{produto.descricao}</p>}
        <div className="relative z-[1] mt-auto pt-3">
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}
