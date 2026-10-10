// "Compre por área": as categorias em círculos com foto (modelo de loja,
// referência biovittare.com.br). A foto de cada área fica em
// public/fotos/categorias/<slug>.jpg; sem ela, entra o pote de um produto
// da categoria sobre o gelo e, sem pote, um círculo em azul-noite com a
// inicial em ouro.
// Sem o respiro de seção em cima: fica colada nas vantagens (pedido do
// usuário em 06/10/2026, "tire a parte em branco").
// 08/10/2026 ("diminua o tamanho em 10%"): o título sai a 90% do tamanho
// de título de seção e a grade dos círculos ocupa 90% da largura.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { CategoriaDTO } from "@/lib/tipos";

export type ImagemCategoria = { tipo: "foto" | "produto"; src: string };

export function CategoriasRedondas({
  categorias,
  imagens = {},
}: {
  categorias: CategoriaDTO[];
  imagens?: Record<number, ImagemCategoria>;
}) {
  if (categorias.length === 0) return null;

  return (
    <section aria-labelledby="titulo-categorias" className="pt-0.5 md:pt-1 max-w-7xl mx-auto px-5 md:px-8">
      <div className="revelar text-center">
        <h2 id="titulo-categorias" className="titulo-secao text-[calc(var(--tam-titulo)*0.9)]">
          Nossas <span className="italic">categorias</span>
        </h2>
      </div>

      <ul className="escalonado vao-titulo mx-auto w-[90%] grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-7 md:gap-6">
        {categorias.map((c) => {
          const img = imagens[c.id];
          return (
            <li key={c.id}>
              <Link href={`/produtos/${c.slug}`} className="group flex flex-col items-center gap-3 text-center">
                <span className="relative block w-full aspect-square rounded-full overflow-hidden ring-1 ring-ouro/30 shadow-[0_18px_30px_-22px_rgba(54,52,107,0.45)] transition duration-300 group-hover:ring-2 group-hover:ring-ouro/60 group-hover:-translate-y-1">
                  {img?.tipo === "foto" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(img.src)}
                      alt=""
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : img?.tipo === "produto" ? (
                    <span className="flex w-full h-full items-center justify-center bg-gelo p-[14%]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset(img.src)}
                        alt=""
                        width={400}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full object-contain drop-shadow-[0_6px_8px_rgba(54,52,107,0.28)] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    </span>
                  ) : (
                    <span className="banner-noite flex w-full h-full items-center justify-center text-ouro-claro text-[3.5rem] font-[family-name:var(--font-destaque)] italic">
                      {c.nome.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-navy text-[0.9rem] md:text-base transition-colors group-hover:text-tinta">
                    {c.nome}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
