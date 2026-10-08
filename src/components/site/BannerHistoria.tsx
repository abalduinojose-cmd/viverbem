// Banner da história, só no celular (08/10/2026, pedido: "entre quem já é
// cliente e fale com a gente coloque um banner retangular apenas na versão
// mobile"): a fachada da loja (foto do Instagram da farmácia, a mesma da
// página A Viver Bem) com "20 anos construindo cuidado", levando para A
// Viver Bem. No computador a página está no menu de cima; no celular ela
// fica atrás do menu, e este banner é o convite.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO } from "@/lib/tipos";
import { SetaDireita } from "./icones";

export function BannerHistoria() {
  return (
    <section aria-label="A nossa história" className="md:hidden max-w-7xl mx-auto px-5 pt-3">
      <Link
        href="/sobre"
        className="group em-noite relative block overflow-hidden rounded-[1.75rem] aspect-[16/10] bg-navy ring-1 ring-inset ring-white/10 text-white shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/fotos/sobre/vinte-anos.webp")}
          alt=""
          width={692}
          height={490}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* Véu: a foto some para o azul-noite embaixo, onde fica o texto */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/10" />
        <span className="relative z-[1] flex h-full flex-col justify-end p-5">
          <span className="rotulo-pilula">desde 1999 em Petrópolis</span>
          <span className="titulo-banner mt-2 text-[1.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
            {ANOS_TRADICAO} anos <span className="italic">construindo cuidado.</span>
          </span>
          <span className="mt-3 inline-flex items-center gap-2 text-[0.9rem] font-medium text-white/85 transition-colors group-hover:text-white">
            Conheça a nossa história
            <SetaDireita tamanho={15} />
          </span>
        </span>
      </Link>
    </section>
  );
}
