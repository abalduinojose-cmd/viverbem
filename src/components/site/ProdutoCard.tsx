// Card de produto: foto, categoria, nome e "Adicionar ao carrinho".
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
    <article className="group animar-surgir bg-white rounded-3xl border border-linha hover:border-royal/25 hover:sombra-card-hover hover:-translate-y-1 overflow-hidden transition duration-300 flex flex-col w-full h-full">
      {/* A foto repete o link do nome: fica fora da ordem do Tab */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block p-3 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-royal-nevoa aspect-square">
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="w-full h-full group-hover:scale-[1.06] transition-transform duration-500"
          />

          {industrializado && produto.novidade && (
            <span className="absolute top-2.5 left-2.5 bg-escarlate text-white text-[0.6rem] font-semibold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              NOVIDADE
            </span>
          )}

          {/* Convite que aparece ao passar o mouse (no toque não atrapalha) */}
          <span className="hidden md:flex absolute inset-x-2.5 bottom-2.5 items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm text-royal text-xs font-semibold rounded-xl py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
            Ver detalhes
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-1 flex-1">
        {mostrarCategoria && produto.categoriaNome && (
          <p className="text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-grafite-claro truncate">
            {produto.categoriaNome}
          </p>
        )}
        <h3 className="font-semibold text-grafite leading-snug line-clamp-2">
          <Link href={href} className="hover:text-royal transition-colors">
            {produto.nome}
          </Link>
        </h3>
        {industrializado && (
          <p className="text-sm text-grafite-claro line-clamp-2 mt-0.5">{produto.descricao}</p>
        )}
        <div className="mt-auto pt-3">
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}
