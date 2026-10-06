// Categorias da home: uma linha por área, levando para a página da
// categoria. Mostra o que a farmácia prepara em cada área, nunca para
// que serve (manipulado não pode ter promessa de efeito).
//
// Lista tipográfica com fios: índice em ouro, nome grande em navy com a
// segunda parte no itálico de ouro, descrição, quantos produtos tem e a
// seta. No computador, ao passar o mouse, o pote de um produto da
// categoria aparece flutuando à direita (nas que têm foto). As linhas
// entram uma depois da outra, ao rolar.
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
        {nome.slice(0, e)} <span className="tinta">&amp; {nome.slice(e + 3)}</span>
      </>
    );
  }
  const corte = nome.lastIndexOf(" ");
  if (corte > 0) {
    return (
      <>
        {nome.slice(0, corte)} <span className="tinta">{nome.slice(corte + 1)}</span>
      </>
    );
  }
  return <>{nome}</>;
}

export function SecaoCategorias({
  categorias,
  totais = {},
  fotos = {},
}: {
  categorias: CategoriaDTO[];
  /** Quantos produtos cada categoria tem no site (id -> total) */
  totais?: Record<number, number>;
  /** Foto de um produto de cada categoria, para o pote que espreita (id -> url) */
  fotos?: Record<number, string>;
}) {
  if (categorias.length === 0) return null;

  return (
    <section aria-labelledby="titulo-categorias" className="secao max-w-7xl mx-auto px-5 md:px-8">
      <div className="revelar">
        <SecaoTitulo
          id="titulo-categorias"
          selo="o que manipulamos"
          titulo={
            <>
              Nossas <span className="italic">categorias</span>
            </>
          }
          descricao="Escolha a área e veja o que preparamos a partir da receita."
          verTudo="/produtos"
        />
      </div>

      <ul className="vao-titulo escalonado lista-fichas lista-fichas-fechada">
        {categorias.map((c, i) => {
          const info = infoCategoria(c.slug);
          const total = totais[c.id] ?? 0;
          const foto = fotos[c.id];
          return (
            <li key={c.id}>
              <Link
                href={`/produtos/${c.slug}`}
                className="group relative grid grid-cols-[2.25rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-center gap-x-3 md:gap-x-8 py-6 md:py-8"
              >
                <span aria-hidden="true" className="numero-tinta text-lg md:text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="block text-[1.5rem] md:text-[2.1rem] font-semibold leading-tight tracking-[-0.035em] text-navy transition-colors group-hover:text-tinta">
                    <NomeComItalico nome={c.nome} />
                  </span>
                  <span className="hidden sm:block text-cinza text-[0.95rem] leading-relaxed mt-1.5 max-w-xl">
                    {info.descricao}
                  </span>
                </span>

                <span className="flex items-center gap-4 md:gap-6">
                  <span className="rotulo !text-cinza hidden sm:block">
                    {total} {total === 1 ? "produto" : "produtos"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border fio-ouro text-ouro transition duration-300 group-hover:border-tinta group-hover:bg-tinta group-hover:text-white"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>

                {/* O pote que espreita, só no computador e só com foto */}
                {foto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(foto)}
                    alt=""
                    width={500}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[16rem] top-1/2 hidden h-28 w-auto -translate-y-1/2 translate-x-3 opacity-0 drop-shadow-[0_14px_14px_rgba(16,42,74,0.18)] transition duration-500 group-hover:translate-x-0 group-hover:opacity-100 lg:block"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
