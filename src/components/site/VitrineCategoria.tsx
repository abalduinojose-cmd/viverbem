// Vitrine de produtos no modelo de loja (referência biovittare.com.br):
// título com o fio e a pílula "ver mais" na mesma linha e, embaixo, UMA
// faixa que arrasta para o lado com os produtos grandes e o banner da
// área como um cartão estreito.
//
// Proporção (06/10/2026, pedidos do usuário em três rodadas: "diminua o
// espaço do quadrado azul", "diminua mais", "coloque as categorias com os
// produtos maiores e arrastando para o lado"; 07/10: "pode diminuir, quero
// os produtos em mais destaque"): o banner deixou de ser uma coluna da
// grade e virou um cartão da faixa, com a mesma altura dos cartões de
// produto. No celular ele também entra na faixa.
//
// Posição (08/10/2026): o banner fecha a faixa, depois dos produtos, em
// todas as vitrines. Ele chegou a abrir as faixas das áreas, um pouco
// menor ("coloque ele primeiro"), e voltou para o fim no mesmo dia ("mude
// para o final, assim como no Mais procurados").
//
// O banner (08/10/2026, "tire o M por trás, coloque o escrito mais
// centralizado e modernize"): a peça em azul-noite com a malha fina, as
// luzes dourada e azul, um fio curto de ouro, o título em duas vozes (a
// parte entre *asteriscos* sai em itálico ouro) e o texto centralizados, e
// o botão "Ver produtos" em contorno que fica branco no hover. A inicial
// da área em marca d'água e a seta no círculo de ouro saíram. Aceita uma
// foto (public/fotos/banners/*.jpg) atrás de um véu azul-noite.
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

// O banner da área, o último cartão da faixa
function BannerCartao({ banner, href }: { banner: BannerVitrine; href: string }) {
  return (
    <Link
      href={href}
      className={`group banner-noite em-noite relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.75rem] ring-1 ring-inset ring-white/10 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(54,52,107,0.6)] w-44 md:w-48 p-5`}
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
          {/* Véu: a imagem some para o azul-noite, para o texto ler bem */}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/35" />
        </>
      ) : (
        <>
          <span aria-hidden="true" className="malha-banner" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.32),transparent_62%)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -bottom-16 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(80,160,235,0.35),transparent_62%)]"
          />
        </>
      )}

      <span className="relative z-[1] flex flex-col items-center gap-3 text-white">
        <span aria-hidden="true" className="h-px w-8 bg-[image:var(--ouro-degrade)]" />
        <span
          className="titulo-banner font-semibold leading-[1.08] tracking-[-0.03em] text-balance text-[1.3rem] md:text-[1.4rem]"
        >
          <TituloDuasVozes texto={banner.titulo} />
        </span>
        {banner.texto && <span className="text-[0.8rem] leading-snug text-white/70 text-balance">{banner.texto}</span>}
        {/* O botão cabe numa linha mesmo no cartão estreito do celular (128px de miolo) */}
        <span
          className={`mt-2 inline-flex items-center gap-1.5 h-10 rounded-full border border-white/35 font-medium text-white whitespace-nowrap transition-colors group-hover:bg-white group-hover:border-white group-hover:text-navy px-3.5 text-[0.82rem]`}
        >
          Ver produtos
          <SetaDireita tamanho={14} />
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

      {/* A faixa: os produtos e, no fim, o banner da área */}
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
