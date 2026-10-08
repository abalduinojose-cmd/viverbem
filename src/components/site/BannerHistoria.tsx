// Banner da história, só no celular (08/10/2026, pedido: "entre quem já é
// cliente e fale com a gente coloque um banner retangular apenas na versão
// mobile"): a fachada da loja (foto do Instagram da farmácia, a mesma da
// página A Viver Bem), levando para A Viver Bem. No computador a página
// está no menu de cima; no celular ela fica atrás do menu, e este banner é
// o convite.
//
// Segunda versão (08/10/2026, "modernize a seção"): a foto ocupa o cartão
// inteiro e a tipografia faz o trabalho: o "20" grande em ouro itálico com
// "anos construindo cuidado" ao lado, a etiqueta "desde 1999" no alto e um
// botão redondo branco com a seta no canto (o convite em texto fica para
// leitores de tela). Sem desfoque de fundo, que custa caro no celular.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO } from "@/lib/tipos";
import { SetaDireita } from "./icones";

export function BannerHistoria() {
  return (
    <section aria-label="A nossa história" className="md:hidden max-w-7xl mx-auto px-5 pt-3">
      <Link
        href="/sobre"
        className="group em-noite relative block overflow-hidden rounded-[1.75rem] aspect-[4/3] bg-navy text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/fotos/sobre/vinte-anos.webp")}
          alt=""
          width={692}
          height={490}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* Véu: a foto escurece de baixo para cima, onde fica o texto */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/0" />

        <span className="absolute left-4 top-4 inline-flex items-center h-8 px-3.5 rounded-full bg-navy/60 ring-1 ring-inset ring-white/20 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/90">
          desde 1999 · Petrópolis
        </span>

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <span className="flex items-end gap-3">
            <span className="numero-tinta text-[4.75rem] leading-[0.8]">{ANOS_TRADICAO}</span>
            <span className="pb-0.5 text-[1.05rem] font-semibold leading-[1.12] tracking-[-0.02em]">
              anos
              <br />
              construindo
              <br />
              <span className="font-[family-name:var(--font-destaque)] italic font-normal text-[1.18em] text-ouro-claro">cuidado</span>
            </span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 w-12 h-12 rounded-full bg-white text-navy flex items-center justify-center shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:translate-x-0.5 group-active:scale-95"
          >
            <SetaDireita tamanho={18} />
          </span>
        </span>
        <span className="sr-only">Conheça a nossa história</span>
      </Link>
    </section>
  );
}
