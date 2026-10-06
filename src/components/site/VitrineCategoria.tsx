// Vitrine de produtos no modelo de loja (referência biovittare.com.br):
// título com o fio e o "ver mais" na mesma linha, um banner de imagem com
// o degradê da marca ao lado e a faixa de produtos que rola para o lado.
// O banner fica à esquerda ou à direita, alternando entre as vitrines.
//
// Sem preço (pedido do cliente em 05/10/2026). O texto do banner descreve
// a área, nunca um efeito: manipulado não pode ter promessa (RDC 67/2007).
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ProdutoDTO } from "@/lib/tipos";
import { FaixaProdutos } from "./FaixaProdutos";

export type BannerVitrine = {
  titulo: React.ReactNode;
  texto?: string;
  /** Imagem em public/fotos/banners/*.jpg; sem ela o banner é só o degradê */
  imagem?: string | null;
};

export function VitrineCategoria({
  id,
  titulo,
  href,
  produtos,
  banner,
  ladoBanner = "esquerda",
}: {
  id: string;
  titulo: React.ReactNode;
  href: string;
  produtos: ProdutoDTO[];
  banner?: BannerVitrine;
  ladoBanner?: "esquerda" | "direita";
}) {
  if (produtos.length === 0) return null;

  return (
    <section aria-labelledby={id} className="secao max-w-7xl mx-auto px-5 md:px-8">
      {/* Cabeçalho: título, fio e "ver mais" na mesma linha */}
      <div className="revelar flex items-center gap-4 md:gap-6">
        <h2 id={id} className="text-[1.6rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-none">
          {titulo}
        </h2>
        <span aria-hidden="true" className="hidden sm:block h-px flex-1 bg-fio" />
        <Link href={href} className="botao-link !min-h-0 shrink-0 text-[0.95rem] ml-auto sm:ml-0">
          ver mais
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="revelar mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {banner && (
          <Link
            href={href}
            className={`group banner-noite relative block overflow-hidden rounded-[1.75rem] aspect-[16/9] lg:aspect-auto lg:min-h-[26rem] lg:col-span-4 ${
              ladoBanner === "direita" ? "lg:order-2" : ""
            }`}
          >
            {banner.imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset(banner.imagem)}
                alt=""
                width={800}
                height={1000}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}
            {/* Véu: a imagem some para o azul-noite embaixo, onde fica o texto */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/5"
            />
            <span className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-start gap-4 text-white">
              <span className="text-[1.6rem] md:text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
                {banner.titulo}
              </span>
              {banner.texto && <span className="text-white/75 text-[0.95rem] leading-snug max-w-[26ch]">{banner.texto}</span>}
              <span className="botao botao-compacto bg-white text-navy group-hover:bg-gelo">veja os produtos</span>
            </span>
          </Link>
        )}

        <div className={`min-w-0 ${banner ? "lg:col-span-8" : "lg:col-span-12"}`}>
          <FaixaProdutos produtos={produtos} comCategoria={false} className="cascata" />
        </div>
      </div>
    </section>
  );
}
