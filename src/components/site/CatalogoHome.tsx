// Seção do catálogo na home (08/10/2026, pedido: "entre a seção Acompanhe
// a gente e Como funciona, adicione uma seção do catálogo com produtos"):
// uma grade com um produto de cada área por vez (os com foto primeiro),
// para quem rolou até aqui ver que o catálogo vai além das faixas de cima,
// e o convite para o catálogo completo. Sem preço: o farmacêutico passa o
// valor pelo WhatsApp (RDC 67/2007). Quem escolhe os produtos é a home.
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { ProdutoCard } from "./ProdutoCard";
import { SetaDireita } from "./icones";

export function CatalogoHome({
  produtos,
  totalProdutos,
  totalAreas,
}: {
  produtos: ProdutoDTO[];
  /** Quantos produtos o site tem ao todo (vai no texto de apoio) */
  totalProdutos: number;
  /** Quantas áreas têm produto no site */
  totalAreas: number;
}) {
  if (produtos.length === 0) return null;

  return (
    <section
      id="catalogo"
      aria-labelledby="titulo-catalogo"
      className="secao max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)]"
    >
      {/* Cabeçalho: título em duas vozes e o apoio ao lado */}
      <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
        <div className="lg:col-span-7">
          <p className="rotulo-pilula">o catálogo</p>
          <h2 id="titulo-catalogo" className="titulo-secao vao-rotulo">
            Explore <span className="italic">o catálogo</span>
          </h2>
        </div>
        <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5">
          {totalProdutos} fórmulas e produtos em {totalAreas} áreas, entre manipulados e
          industrializados com registro. O farmacêutico confere cada pedido e passa o valor
          pelo WhatsApp.
        </p>
      </div>

      {/* A grade: 2 colunas no celular, 3 no tablet, 4 no computador */}
      <ul className="revelar vao-titulo escalonado grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {produtos.map((p) => (
          <li key={p.id} className="min-w-0">
            <ProdutoCard produto={p} />
          </li>
        ))}
      </ul>

      <div className="revelar mt-8 md:mt-10 flex justify-center">
        <Link href="/produtos" className="botao botao-secundario !gap-2.5">
          Ver o catálogo completo
          <SetaDireita tamanho={16} />
        </Link>
      </div>
    </section>
  );
}
