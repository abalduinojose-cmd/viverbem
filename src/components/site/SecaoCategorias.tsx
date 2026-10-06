// Categorias da home: um cartão por área, levando para a página da
// categoria. Mostra o que a farmácia prepara em cada área, nunca para
// que serve (manipulado não pode ter promessa de efeito).
//
// Revisão de 05/10/2026 ("tirar a cara de genérico"): saíram os cartões
// grandes com ilustração chapada. O cartão agora é tipográfico: índice em
// itálico, o nome com a segunda parte no itálico do site, quantos produtos
// tem e a ilustração pequena, em traço fino.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { CategoriaDTO } from "@/lib/tipos";
import { infoCategoria } from "@/lib/categorias";
import { SecaoTitulo } from "./SecaoTitulo";

/** "Dermatologia & Estética" vira Dermatologia + "& Estética" em itálico.
 *  Sem "&", a última palavra vai em itálico ("Saúde da Mulher"). */
function NomeComItalico({ nome }: { nome: string }) {
  const e = nome.indexOf(" & ");
  if (e > 0) {
    return (
      <>
        {nome.slice(0, e)} <span className="italic text-royal">&amp; {nome.slice(e + 3)}</span>
      </>
    );
  }
  const corte = nome.lastIndexOf(" ");
  if (corte > 0) {
    return (
      <>
        {nome.slice(0, corte)} <span className="italic text-royal">{nome.slice(corte + 1)}</span>
      </>
    );
  }
  return <>{nome}</>;
}

export function SecaoCategorias({
  categorias,
  totais = {},
}: {
  categorias: CategoriaDTO[];
  /** Quantos produtos cada categoria tem no site (id -> total) */
  totais?: Record<number, number>;
}) {
  if (categorias.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
      <SecaoTitulo
        selo="o que manipulamos"
        titulo={
          <>
            Nossas <span className="italic text-royal">categorias</span>
          </>
        }
        descricao="Escolha a área e veja o que preparamos a partir da receita."
        verTudo="/produtos"
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {categorias.map((c, i) => {
          const info = infoCategoria(c.slug);
          const total = totais[c.id] ?? 0;
          return (
            <li key={c.id}>
              <Link
                href={`/produtos/${c.slug}`}
                className="group relative h-full overflow-hidden bg-white border border-linha rounded-[1.75rem] p-4 sm:p-6 flex items-center sm:items-start sm:flex-col gap-4 hover:border-royal/25 hover:sombra-card-hover hover:-translate-y-1 active:scale-[0.99] transition duration-300"
              >
                {/* Índice em itálico, bem leve, no canto */}
                <span
                  aria-hidden="true"
                  className="hidden sm:block absolute top-4 right-6 italic text-[3rem] leading-none text-royal/15 [font-family:var(--font-destaque)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-royal-nevoa border border-linha">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(info.imagem)}
                    alt=""
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover scale-[1.35] group-hover:scale-[1.45] transition-transform duration-500"
                  />
                </span>

                <span className="flex-1 min-w-0 sm:w-full flex flex-col">
                  <span className="font-display text-xl md:text-2xl font-semibold text-grafite leading-tight">
                    <NomeComItalico nome={c.nome} />
                  </span>
                  <span className="hidden sm:block text-grafite-medio text-[0.95rem] leading-relaxed mt-2">
                    {info.descricao}
                  </span>
                  <span className="mt-2 sm:mt-6 flex items-center justify-between gap-3">
                    <span className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-grafite-claro">
                      {total} {total === 1 ? "produto" : "produtos"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-9 h-9 rounded-full bg-royal-claro text-royal group-hover:bg-royal group-hover:text-white flex items-center justify-center transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition group-hover:-rotate-45">
                        <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
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
