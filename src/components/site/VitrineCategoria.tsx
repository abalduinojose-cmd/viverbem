// Vitrine de produtos no modelo de loja (referência biovittare.com.br):
// título com o fio e a pílula "ver mais" na mesma linha, um banner em
// azul-noite ao lado e a faixa de produtos que rola para o lado. O banner
// fica à esquerda ou à direita, alternando entre as vitrines.
//
// O banner (06/10/2026, duas rodadas de "deixe mais moderno"): aceita uma
// foto (public/fotos/banners/*.jpg). Sem ela, é uma peça em azul-noite com
// a malha fina de laboratório, a luz dourada no canto, a inicial da área
// como marca d'água (preenchida, translúcida, com um fio de ouro) que
// desce mais devagar que a página, uma pílula de vidro com o total, o
// título em duas vozes (a parte entre *asteriscos* sai em itálico ouro) e
// o botão "Ver produtos" em vidro com a seta num círculo de ouro, o irmão
// noturno do BotaoVerMais. (O rótulo em vidro "Preparado para..." saiu do
// site inteiro a pedido do usuário em 06/10/2026.)
//
// Sem preço (pedido do cliente em 05/10/2026). O texto do banner descreve
// a área, nunca um efeito: manipulado não pode ter promessa (RDC 67/2007).
import { Fragment } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ProdutoDTO } from "@/lib/tipos";
import { FaixaProdutos } from "./FaixaProdutos";
import { BotaoVerMais } from "./BotaoVerMais";

export type BannerVitrine = {
  /** Título do banner; a parte entre *asteriscos* sai em itálico ouro */
  titulo: string;
  texto?: string;
  /** Imagem em public/fotos/banners/*.jpg; sem ela o banner é a peça em azul-noite */
  imagem?: string | null;
  /** Letra gigante como marca d'água (a inicial da área) */
  inicial?: string;
  /** Texto da pílula de vidro no alto, ex.: "10 produtos" */
  pilula?: string;
};

function SetaDireita() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Título em duas vozes: a sans branca e, entre *asteriscos*, o itálico
// serifado em ouro (mesma regra dos títulos de seção)
function TituloDuasVozes({ texto }: { texto: string }) {
  const partes = texto.split("*");
  return (
    <>
      {partes.map((parte, i) =>
        i % 2 === 1 ? (
          <span key={i} className="italic">
            {parte}
          </span>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        )
      )}
    </>
  );
}

// A inicial da área como marca d'água: preenchida e translúcida, com um
// fio de ouro, cortada pela borda. Desce mais devagar que a página
// enquanto o banner atravessa a tela (scroll-driven, roda com "reduzir
// movimento") e sobe um pouco no hover.
function InicialMarca({ letra }: { letra: string }) {
  return (
    <span
      aria-hidden="true"
      className="paralaxe-vista pointer-events-none select-none absolute -right-6 -top-7 lg:-right-8 lg:-top-9"
      style={{ "--paralaxe": "2.5rem" } as React.CSSProperties}
    >
      <svg viewBox="0 0 100 110" className="block h-[11rem] sm:h-[13rem] lg:h-[16rem] w-auto transition-transform duration-700 group-hover:-translate-y-2">
        <text
          x="50"
          y="96"
          textAnchor="middle"
          fontSize="118"
          fontStyle="italic"
          fill="rgba(255,255,255,0.07)"
          stroke="#c0a060"
          strokeWidth="1"
          strokeOpacity="0.45"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          {letra}
        </text>
      </svg>
    </span>
  );
}

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
        <h2 id={id} className="text-[1.75rem] md:text-[2.5rem] font-semibold tracking-[-0.04em] text-navy leading-[1.02]">
          {titulo}
        </h2>
        <span aria-hidden="true" className="hidden sm:block h-px flex-1 bg-gradient-to-r from-ouro/50 via-fio to-fio" />
        <BotaoVerMais href={href} className="shrink-0 ml-auto sm:ml-0" />
      </div>

      <div className="revelar mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {banner && (
          <Link
            href={href}
            className={`group banner-noite em-noite relative flex flex-col justify-between overflow-hidden rounded-[2rem] ring-1 ring-inset ring-white/10 min-h-[19rem] sm:min-h-[20rem] lg:min-h-[26rem] p-5 sm:p-6 lg:p-8 lg:col-span-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(13,35,64,0.6)] ${
              ladoBanner === "direita" ? "lg:order-2" : ""
            }`}
          >
            {banner.imagem ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(banner.imagem)}
                  alt=""
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* Véu: a imagem some para o azul-noite embaixo, onde fica o texto */}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/5" />
              </>
            ) : (
              <>
                {/* Malha fina de laboratório, só no alto à direita */}
                <span aria-hidden="true" className="malha-banner" />
                {/* Luz dourada no canto de cima e azul no pé */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(192,160,96,0.32),transparent_62%)] transition-opacity duration-500 group-hover:opacity-70"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-12 -bottom-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(63,146,224,0.35),transparent_62%)]"
                />
                {/* Um anel fino, como uma cápsula vista de cima */}
                <span aria-hidden="true" className="pointer-events-none absolute right-8 bottom-14 w-56 h-56 rounded-full border border-white/[0.07]" />
                {banner.inicial && <InicialMarca letra={banner.inicial} />}
                {/* Véu só no pé, para o texto */}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
              </>
            )}

            {/* Pílula de vidro com o total */}
            {banner.pilula && (
              <span className="relative z-[1] self-start inline-flex items-center gap-2 h-8 pl-2.5 pr-3 rounded-full bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur-sm text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/90">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
                {banner.pilula}
              </span>
            )}

            <span className="relative z-[1] mt-10 flex flex-col items-start gap-3 lg:gap-4 text-white">
              <span className="titulo-banner text-[1.55rem] sm:text-[1.75rem] lg:text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] text-balance max-w-[16ch]">
                <TituloDuasVozes texto={banner.titulo} />
              </span>
              {banner.texto && <span className="text-white/70 text-[0.95rem] leading-snug max-w-[30ch]">{banner.texto}</span>}
              {/* O botão em vidro, com a seta no círculo de ouro */}
              <span className="mt-1 inline-flex items-center gap-3 h-12 pl-5 pr-1.5 rounded-full bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur-sm text-[0.95rem] font-semibold transition-colors duration-300 group-hover:bg-white/15">
                Ver produtos
                <span className="w-9 h-9 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  <SetaDireita />
                </span>
              </span>
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
