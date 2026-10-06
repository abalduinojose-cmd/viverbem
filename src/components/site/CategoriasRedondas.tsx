// "Compre por área": as categorias em círculos com foto (modelo de loja,
// referência biovittare.com.br). A foto de cada área fica em
// public/fotos/categorias/<slug>.jpg; sem ela, entra o pote de um produto
// da categoria sobre o gelo e, sem pote, um círculo em ouro com a inicial.
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
    <section aria-labelledby="titulo-categorias" className="secao max-w-7xl mx-auto px-5 md:px-8">
      <div className="revelar text-center">
        <p className="rotulo">compre por área</p>
        <h2 id="titulo-categorias" className="titulo-secao vao-rotulo">
          Nossas <span className="italic">categorias</span>
        </h2>
      </div>

      <ul className="escalonado vao-titulo grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-7 md:gap-6">
        {categorias.map((c) => {
          const img = imagens[c.id];
          return (
            <li key={c.id}>
              <Link href={`/produtos/${c.slug}`} className="group flex flex-col items-center gap-3 text-center">
                <span className="relative block w-full aspect-square rounded-full overflow-hidden ring-1 ring-fio shadow-[0_18px_30px_-22px_rgba(16,42,74,0.45)] transition duration-300 group-hover:ring-2 group-hover:ring-ouro/60 group-hover:-translate-y-1">
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
                        className="max-w-full max-h-full object-contain drop-shadow-[0_12px_12px_rgba(16,42,74,0.2)] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    </span>
                  ) : (
                    <span className="flex w-full h-full items-center justify-center bg-[image:var(--ouro-degrade)] text-white text-4xl font-[family-name:var(--font-destaque)] italic">
                      {c.nome.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="font-medium text-navy text-[0.9rem] md:text-base leading-tight transition-colors group-hover:text-tinta">
                  {c.nome}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
