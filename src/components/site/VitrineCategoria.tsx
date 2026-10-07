// Vitrine de produtos no modelo de loja (referência biovittare.com.br):
// título com o fio e a pílula "ver mais" na mesma linha e, embaixo, UMA
// faixa que arrasta para o lado com o banner da área como primeiro
// cartão (estreito) e os produtos grandes em seguida.
//
// Proporção (06/10/2026, pedidos do usuário em três rodadas: "diminua o
// espaço do quadrado azul", "diminua mais", "coloque as categorias com os
// produtos maiores e arrastando para o lado"; 07/10: "pode diminuir, quero
// os produtos em mais destaque"): o banner deixou de ser uma coluna da
// grade e virou o ÚLTIMO cartão da faixa, com 11/12rem de largura, só a
// pílula, o título e o botão, e a mesma altura dos cartões de produto
// (15/18rem).
// No celular ele também entra na faixa, em vez de ocupar a tela inteira.
//
// O banner aceita uma foto (public/fotos/banners/*.jpg). Sem ela, é a
// peça em azul-noite com a malha fina de laboratório, a luz dourada, a
// inicial da área como marca d'água em paralaxe, a pílula de vidro com o
// total, o título em duas vozes (a parte entre *asteriscos* sai em
// itálico ouro) e o botão "Ver produtos" em vidro com a seta no círculo
// de ouro.
//
// Sem preço (pedido do cliente em 05/10/2026). O texto do banner descreve
// a área, nunca um efeito: manipulado não pode ter promessa (RDC 67/2007).
import { Fragment } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ProdutoDTO } from "@/lib/tipos";
import { FaixaProdutos } from "./FaixaProdutos";
import { BotaoVerMais } from "./BotaoVerMais";
import { SetaDireita } from "./icones";

export type BannerVitrine = {
  /** Título do banner; a parte entre *asteriscos* sai em itálico ouro */
  titulo: string;
  texto?: string;
  /** Imagem em public/fotos/banners/*.jpg; sem ela o banner é a peça em azul-noite */
  imagem?: string | null;
  /** Letra gigante como marca d'água (a inicial da área) */
  inicial?: string;
};

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
      className="paralaxe-vista pointer-events-none select-none absolute -right-5 -top-6"
      style={{ "--paralaxe": "2rem" } as React.CSSProperties}
    >
      <svg viewBox="0 0 100 110" className="block h-[8rem] md:h-[9rem] w-auto transition-transform duration-700 group-hover:-translate-y-2">
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

// O banner da área, como primeiro cartão da faixa
function BannerCartao({ banner, href }: { banner: BannerVitrine; href: string }) {
  return (
    <Link
      href={href}
      className="group banner-noite em-noite relative flex h-full w-44 md:w-48 flex-col justify-between overflow-hidden rounded-[1.75rem] ring-1 ring-inset ring-white/10 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(13,35,64,0.6)]"
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(192,160,96,0.32),transparent_62%)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -bottom-16 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(63,146,224,0.35),transparent_62%)]"
          />
          {banner.inicial && <InicialMarca letra={banner.inicial} />}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
        </>
      )}

      <span className="relative z-[1] flex-1 flex flex-col text-white">
        <span className="titulo-banner text-[1.3rem] md:text-[1.45rem] font-semibold leading-[1.06] tracking-[-0.03em] text-balance">
          <TituloDuasVozes texto={banner.titulo} />
        </span>
        {/* "Ver produtos", um fio de ouro e a seta, no pé */}
        <span className="mt-auto pt-6 flex flex-col gap-2.5">
          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white/70">Ver produtos</span>
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-ouro/15 via-ouro/55 to-ouro-claro" />
            <span className="w-10 h-10 shrink-0 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:translate-x-1">
              <SetaDireita tamanho={15} />
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export function VitrineCategoria({
  id,
  titulo,
  href,
  produtos,
  banner,
}: {
  id: string;
  titulo: React.ReactNode;
  href: string;
  produtos: ProdutoDTO[];
  banner?: BannerVitrine;
}) {
  if (produtos.length === 0) return null;

  return (
    <section aria-labelledby={id} className="secao-vitrine max-w-7xl mx-auto px-5 md:px-8">
      {/* Cabeçalho: título, fio e "ver mais" na mesma linha */}
      <div className="revelar flex items-center gap-4 md:gap-6">
        <h2 id={id} className="titulo-bloco">
          {titulo}
        </h2>
        <span aria-hidden="true" className="hidden sm:block h-px flex-1 bg-gradient-to-r from-ouro/50 via-fio to-fio" />
        <BotaoVerMais href={href} className="shrink-0 ml-auto sm:ml-0" />
      </div>

      {/* A faixa: os produtos primeiro e o banner da área como último cartão
          (07/10/2026, "para os produtos ficarem em evidência") */}
      <div className="revelar mt-5 md:mt-6">
        <FaixaProdutos
          produtos={produtos}
          comCategoria={false}
          className="cascata"
          depois={banner ? <BannerCartao banner={banner} href={href} /> : undefined}
        />
      </div>
    </section>
  );
}
