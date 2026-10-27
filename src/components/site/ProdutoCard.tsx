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
//
// 21/10/2026 ("melhore a apresentação dos produtos, modernize os botões de
// adicionar"): na limpa o ladrilho ganhou um degradê suave de cima para
// baixo e um fio quase invisível (ouro no hover), a categoria ficou menor
// e mais leve, o nome em 600. (A linha "Manipulado · sob receita" e o
// botão em contorno foram feitos e tirados na mesma hora: "tire o
// manipulado sob receita, quero o botão dourado com um degradê mais leve,
// mais clean".) O botão é o .botao-carrinho do sistema.
import Link from "next/link";
import { ProdutoDTO, ehIndustrializado, precoVisivel } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { SegurarParaVer } from "./SegurarParaVer";
import { TarjaProduto } from "./TarjaProduto";

export type VarianteCartao = "cartao" | "limpa";

// O que aparece no centro da tela quando a pessoa segura o cartão no
// celular (adendo 69): só para ver, sem botões. A foto já está no cache,
// porque é a mesma do cartão.
function PreviaProduto({ produto }: { produto: ProdutoDTO }) {
  return (
    <div className="rounded-[2rem] bg-white p-3 pb-6 shadow-[0_40px_80px_-30px_rgba(5,17,33,0.75)]">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-b from-gelo to-gelo/30 p-6">
        <FotoProduto fotoUrl={produto.fotoUrl} nome={produto.nome} className="max-h-full w-auto max-w-full !object-contain" />
      </div>
      <div className="mt-5 px-3 text-center">
        {produto.categoriaNome && <p className="rotulo !text-cinza text-[0.6875rem]">{produto.categoriaNome}</p>}
        <p className="mt-1.5 text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-navy">{produto.nome}</p>
      </div>
    </div>
  );
}

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
    <SegurarParaVer className="h-full w-full" previa={<PreviaProduto produto={produto} />}>
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
              ? "rounded-[1.6rem] bg-[linear-gradient(180deg,#f3f6fa_0%,#eef2f8_100%)] ring-1 ring-inset ring-navy/[0.05] p-5 transition duration-300 group-hover:ring-ouro/40 group-hover:bg-[linear-gradient(180deg,#f6f8fb_0%,#f0f4f9_100%)]"
              : "rounded-[1.35rem] bg-gradient-to-b from-gelo to-gelo/30 p-3"
          }`}
        >
          {/* Sem sombra nem luz sob o pote (11/10/2026, "tire a sombra debaixo
              dos produtos"; a luz dourada e a sombra quente de 10/10 saíram) e
              a foto 4% maior, a pedido */}
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="relative max-h-full w-auto max-w-full !object-contain scale-[1.04] transition-transform duration-500 group-hover:-translate-y-1.5"
          />
          {/* 27/10/2026: Mais vendido e Novidade em todos (antes a Novidade
              era só dos industrializados) */}
          <TarjaProduto produto={produto} />
        </div>

        {/* Nome, categoria e descrição centrados (11/10/2026, "quero o nome dos
            produtos centralizados, no celular e no computador") */}
        <div className={`flex flex-1 flex-col items-center gap-1 text-center ${limpa ? "mt-3.5 px-1" : "mt-3 px-1.5"}`}>
          {mostrarCategoria && produto.categoriaNome && (
            <p className={`rotulo !text-cinza truncate max-w-full ${limpa ? "text-[0.64rem] !tracking-[0.14em] opacity-80" : "text-[0.6875rem]"}`}>
              {produto.categoriaNome}
            </p>
          )}
          <h3 className={`text-[1rem] leading-snug tracking-[-0.015em] text-navy line-clamp-2 ${limpa ? "font-semibold" : "font-medium"}`}>
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
          <div data-sem-segurar className="relative z-[1] mt-auto w-full pt-3">
            <BotaoAdicionar produto={produto} />
          </div>
        </div>
      </article>
    </SegurarParaVer>
  );
}
