// Banner da história, só no celular (08/10/2026, pedido: "entre quem já é
// cliente e fale com a gente coloque um banner retangular apenas na versão
// mobile"), levando para A Viver Bem. No computador a página está no menu
// de cima; no celular ela fica atrás do menu, e este banner é o convite.
//
// Quinta versão (11/10/2026, "modernize a parte com os 20 anos"): a foto
// dos sócios ocupa o cartão inteiro, mais alto (4:5), e o painel branco
// que flutuava saiu; no lugar, um véu escuro sobe pela base e o texto
// fica direto sobre a foto: o "20" grande em ouro, "anos construindo
// cuidado" em branco com a segunda voz em ouro, o convite pequeno e a seta
// num círculo branco. A etiqueta "desde 2006" segue no alto. Sem desfoque
// de fundo, que custa caro no celular.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO } from "@/lib/tipos";
import { SetaDireita } from "./icones";

export function BannerHistoria() {
  return (
    <section aria-label="A nossa história" className="md:hidden max-w-7xl mx-auto px-5 pt-3">
      <Link
        href="/sobre"
        className="group relative block overflow-hidden rounded-[2rem] aspect-[4/5] bg-navy shadow-[0_30px_60px_-36px_rgba(13,35,64,0.55)] transition-transform duration-300 active:scale-[0.99]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/fotos/sobre/equipe-loja.webp")}
          alt=""
          width={1200}
          height={749}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* O véu: escuro na base, para o texto, e um fio de luz no alto */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-navy/10" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/90 text-navy text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
          desde 2006
        </span>

        {/* O texto, direto sobre a foto */}
        <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
          <span className="min-w-0">
            <span className="numero-tinta block text-[4.2rem] leading-[0.85]">{ANOS_TRADICAO}</span>
            <span className="mt-2 block text-[1.1rem] font-semibold leading-tight tracking-[-0.02em]">
              anos construindo{" "}
              <span className="font-[family-name:var(--font-destaque)] italic font-normal text-[1.35rem] text-ouro-claro">cuidado</span>
            </span>
            <span className="mt-2 block text-sm text-white/70">Conheça a nossa história</span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 flex size-12 items-center justify-center rounded-full bg-white text-navy transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <SetaDireita tamanho={18} />
          </span>
        </span>
      </Link>
    </section>
  );
}
