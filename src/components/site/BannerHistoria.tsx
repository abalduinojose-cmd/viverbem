// Banner da história, só no celular (08/10/2026, pedido: "entre quem já é
// cliente e fale com a gente coloque um banner retangular apenas na versão
// mobile"), levando para A Viver Bem. No computador a página está no menu
// de cima; no celular ela fica atrás do menu, e este banner é o convite.
//
// Quarta versão (08/10/2026, "modernize mais"): a foto dos sócios dentro da
// loja (public/fotos/sobre/equipe-loja.webp, recortada e ampliada com
// nitidez) ocupa o cartão inteiro, limpa, e um painel branco flutua sobre a
// base, como um cartão de aplicativo: o "20" em ouro itálico, "anos
// construindo cuidado" e o botão redondo azul-noite com a seta. A etiqueta
// "desde 2006" fica no alto, com uma sombra leve atrás para ler sobre a foto
// (era "desde 1999", a drogaria; a história passou a começar na manipulação,
// 10/10/2026).
// O convite em texto fica para leitores de tela. Sem desfoque de fundo, que
// custa caro no celular.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO } from "@/lib/tipos";
import { SetaDireita } from "./icones";

export function BannerHistoria() {
  return (
    <section aria-label="A nossa história" className="md:hidden max-w-7xl mx-auto px-5 pt-3">
      <Link
        href="/sobre"
        className="group relative block overflow-hidden rounded-[1.75rem] aspect-[5/4] bg-navy ring-1 ring-fio shadow-[0_30px_60px_-36px_rgba(13,35,64,0.55)] transition-transform duration-300 active:scale-[0.99]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/fotos/sobre/equipe-loja.webp")}
          alt=""
          width={1200}
          height={740}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%] transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-navy/30 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/90 text-navy text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
          desde 2006
        </span>

        {/* O painel que flutua sobre a base da foto */}
        <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[1.25rem] bg-white/95 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(13,35,64,0.65)]">
          <span className="flex items-end gap-2.5">
            <span className="numero-tinta text-[3.1rem] leading-[0.82]">{ANOS_TRADICAO}</span>
            <span className="pb-0.5 leading-[1.1]">
              <span className="block text-[0.95rem] font-semibold text-navy tracking-[-0.02em]">anos construindo</span>
              <span className="block font-[family-name:var(--font-destaque)] italic text-[1.15rem] text-ouro-escuro">cuidado</span>
            </span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <SetaDireita tamanho={17} />
          </span>
        </span>
        <span className="sr-only">Conheça a nossa história</span>
      </Link>
    </section>
  );
}
