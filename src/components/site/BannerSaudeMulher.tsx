// Banner da Saúde da Mulher (08/10/2026, pedido: "uma animação no mesmo
// estilo, com os medicamentos em anexo, voltada para a saúde da mulher"):
// o mesmo cartão escuro do banner da história, com a animação da dobra por
// dentro (roteiro "mulher" em heroAnimado/roteiros.ts: "Saúde em cada fase
// da mulher", os quatro potes da linha em carrossel e uma luz rosada sobre
// o azul-noite). O cartão inteiro leva à categoria; o único texto em HTML
// é o convite na base, e a frase da animação fica para leitores de tela.
// No celular e no computador.
import Link from "next/link";
import { CenaAnimada } from "./heroAnimado/HeroAnimado";
import { SetaDireita } from "./icones";

export function BannerSaudeMulher() {
  return (
    <section aria-label="Saúde da mulher" className="max-w-7xl mx-auto px-5 md:px-8 pt-3">
      <Link
        href="/produtos/saude-da-mulher"
        className="group banner-noite em-noite relative block overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-inset ring-white/10 text-white shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)] h-[min(calc((100vw-2.5rem)*1.444),34rem)] md:h-[24rem] lg:h-[26rem] xl:h-[28rem]"
      >
        <CenaAnimada roteiro="mulher" />
        <span className="sr-only">Saúde em cada fase da mulher. Beleza e autoestima.</span>
        {/* Véu na base: o convite lê sobre o reflexo dos potes */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy/85 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 z-[1] px-5 pb-5 md:px-12 md:pb-8">
          <span className="inline-flex items-center gap-2 text-[0.95rem] md:text-[1.05rem] font-medium text-white/90 transition-colors group-hover:text-white">
            Ver a linha Saúde da Mulher
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <SetaDireita tamanho={16} />
            </span>
          </span>
        </span>
      </Link>
    </section>
  );
}
