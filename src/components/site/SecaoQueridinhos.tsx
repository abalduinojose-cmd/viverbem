// Vitrine dos mais procurados: os produtos que têm foto de verdade, na
// única folha escura do site (azul-noite com a luz dourada). Cada produto
// é um ladrilho de vidro com o pote recortado, a luz quente embaixo, o
// índice em ouro, o nome e o botão secundário "Adicionar".
//
// A categoria não aparece: na home todos os produtos da faixa são da
// mesma área, então a linha se repetiria em todos.
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { FaixaProdutos } from "./FaixaProdutos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { SecaoTitulo } from "./SecaoTitulo";

function CartaoQueridinho({ produto, indice }: { produto: ProdutoDTO; indice: number }) {
  const href = `/produto/${produto.slug}`;

  return (
    <article className="group ladrilho-vidro flex h-full w-full flex-col p-4 pb-5">
      {/* A foto repete o link do nome: fica fora da ordem do Tab */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative aspect-square flex items-end justify-center px-4 pb-4">
          {/* A luz dourada do tampo */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[8%] bottom-1 h-12 bg-[radial-gradient(50%_60%_at_50%_60%,rgba(192,160,96,0.45),transparent_70%)]"
          />
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="relative h-[84%] w-auto max-w-full !object-contain drop-shadow-[0_22px_20px_rgba(3,12,30,0.55)] transition-transform duration-500 group-hover:-translate-y-2"
          />
        </div>
      </Link>

      <div className="mt-2 flex flex-1 flex-col">
        <p className="numero-tinta text-base" aria-hidden="true">
          {String(indice + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-1.5 text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-white">
          <Link href={href} className="transition-colors hover:text-ouro-claro">
            {produto.nome}
          </Link>
        </h3>
        <div className="mt-auto pt-4">
          <BotaoAdicionar produto={produto} />
        </div>
      </div>
    </article>
  );
}

export function SecaoQueridinhos({ produtos }: { produtos: ProdutoDTO[] }) {
  if (produtos.length === 0) return null;

  return (
    <section aria-labelledby="titulo-queridinhos" className="secao max-w-7xl mx-auto px-5 md:px-8">
      <div className="revelar">
        <SecaoTitulo
          id="titulo-queridinhos"
          selo="os queridinhos"
          titulo={
            <>
              Mais <span className="italic">procurados</span>
            </>
          }
          descricao="Adicione ao carrinho e o farmacêutico passa o valor pelo WhatsApp."
          verTudo="/produtos"
          rotuloVerTudo="Ver o catálogo"
        />
      </div>

      <div className="vao-titulo revelar">
        <FaixaProdutos className="cascata">
          {produtos.map((p, i) => (
            <CartaoQueridinho key={p.id} produto={p} indice={i} />
          ))}
        </FaixaProdutos>
      </div>
    </section>
  );
}
