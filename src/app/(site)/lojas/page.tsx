// LOJAS: as 3 unidades da Viver Bem em Petrópolis.
//
// Terceira versão (10/10/2026, pedido: "quero a foto da fachada, e não a
// foto da fachada com os proprietários; deixe a página mais moderna,
// conceitual e clean"): a página abre com UMA imagem, a fachada da loja,
// larga e sem fio (public/fotos/lojas/fachada.webp, recortada da foto dos
// 20 anos acima da porta, onde não há pessoas).
// 11/10/2026 ("modernize e deixe mais dinâmica"): lista com o mapa do
// Google da loja escolhida ao lado (LojasInterativas).
// 21/10/2026 ("melhore a parte das lojas, mais moderna e clean"): a lista
// com o mapa embutido saiu (o Google Maps pesava e abria em branco) e as
// três lojas viraram TRÊS CARTÕES lado a lado (CartaoLoja), cada um com o
// mapa da própria região (peças do OpenStreetMap, sem script), o pino, o
// número em ouro, o bairro grande, o endereço, o telefone e as ações. O
// "aberto agora" fica uma vez só, no cabeçalho da seção. Embaixo, o
// horário e o pedido pela receita. O "Fale com a gente" do pé não aparece
// nesta página (repetia as lojas e o horário).
// 12/11/2026 ("melhore a página da loja", com as fotos das três fachadas
// que a farmácia mandou): a foto larga do topo (recorte da fachada antiga)
// saiu e cada loja virou uma VITRINE com a própria fachada (VitrineLoja):
// a foto alta com o bairro em branco, o endereço, um mapa curto da rua e
// as ações. O título, o "aberto agora" e as três vitrines ficam numa
// abertura só; no celular, atalhos para cada loja logo abaixo do título.
import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";
import { HorarioLojas } from "@/components/site/HorarioLojas";
import { IconeWhatsApp } from "@/components/site/icones";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { VitrineLoja, ancoraLoja } from "@/components/site/VitrineLoja";
import { SeloAoVivo } from "@/components/site/SeloAoVivo";

export const metadata: Metadata = {
  title: "Lojas · Manipulação Viver Bem",
  description:
    "As 3 lojas da Viver Bem em Petrópolis: Centro, Corrêas e Posse. Endereços, mapa, horário e como chegar.",
  alternates: { canonical: "/lojas" },
};

export default function PaginaLojas() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura: um cartão azul-noite com as três fachadas ----------
          13/11/2026 ("modernize essa parte das lojas e toda a página"): o
          título, o texto e o "aberto agora" num cartão azul-noite com a luz
          da marca (o mesmo da dobra da home); à direita (embaixo no
          celular) as TRÊS FACHADAS em miniatura, que levam à loja. Saíram os
          atalhos em pílulas brancas. A ordem é a de sempre: Centro, Corrêas
          e Posse. */}
      <section aria-labelledby="lojas-titulo" className="max-w-[90rem] mx-auto px-3 md:px-5 pt-3 md:pt-4">
        <div className="banner-noite em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-inset ring-white/10 text-white px-5 py-8 md:px-12 md:py-12">
          <span aria-hidden="true" className="malha-banner" />
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-6">
              <p className="rotulo-pilula">onde nos encontrar</p>
              <h1 id="lojas-titulo" className="titulo-secao vao-rotulo !text-white">
                {UNIDADES.length} lojas em <span className="italic">Petrópolis</span>
              </h1>
              <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-white/75">
                Retire sem custo na loja que preferir ou receba em casa: enviamos para todo o Brasil. O horário é o
                mesmo nas três.
              </p>
              <SeloAoVivo className="mt-6" />
            </div>

            {/* As três fachadas: um toque leva à loja */}
            <nav aria-label="Ir para a loja" className="lg:col-span-6">
              <ul className="grid grid-cols-3 gap-2.5 md:gap-4">
                {UNIDADES.map((u, i) => (
                  <li key={u.bairro}>
                    <a
                      href={`#${ancoraLoja(u.bairro)}`}
                      className="group relative block aspect-[3/4] overflow-hidden rounded-[1.1rem] ring-1 ring-inset ring-white/20 shadow-[0_24px_40px_-24px_rgba(0,0,0,0.7)] transition duration-300 hover:-translate-y-1 hover:ring-ouro/70 md:rounded-[1.5rem]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset(`${u.foto}-520.webp`)}
                        alt=""
                        width={520}
                        height={600}
                        fetchPriority={i === 0 ? "high" : "auto"}
                        decoding="async"
                        draggable={false}
                        style={{ objectPosition: u.focoFoto }}
                        className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-noite/90 via-noite/40 to-transparent" />
                      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 p-2.5 md:p-4">
                        <span className="min-w-0">
                          <span className="block numero-tinta text-[0.85rem] leading-none md:text-[1rem]">{String(i + 1).padStart(2, "0")}</span>
                          <span className="mt-1 block truncate text-[0.88rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.15rem]">{u.bairro}</span>
                        </span>
                        <span aria-hidden="true" className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-sm transition group-hover:bg-white group-hover:text-navy md:flex">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* ---------- As três lojas ---------- */}
      <section aria-label="As lojas" className="px-5 md:px-8 pt-10 md:pt-14">
        <div className="max-w-6xl mx-auto">
          <ol className="escalonado grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {UNIDADES.map((u, i) => (
              <li key={u.bairro}>
                <VitrineLoja unidade={u} indice={i} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Horário e o pedido pela receita ----------
          13/11/2026: um cartão claro só, com o horário em três cartões de
          dias (o de hoje aceso em azul-noite, HorarioLojas) e, ao lado, o
          pedido pela receita e o WhatsApp. */}
      <section aria-labelledby="horario-titulo" className="px-5 md:px-8 max-w-6xl mx-auto pt-12 md:pt-16 pb-14 md:pb-20">
        <div className="revelar rounded-[2rem] bg-gradient-to-br from-gelo/80 via-white to-white p-6 ring-1 ring-inset ring-fio shadow-[0_30px_60px_-46px_rgba(13,35,64,0.6)] md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="rotulo-pilula">horário de atendimento</p>
              <h2 id="horario-titulo" className="titulo-bloco vao-rotulo">
                O mesmo nas <span className="italic">{UNIDADES.length} lojas</span>
              </h2>
              <div className="mt-6">
                <HorarioLojas />
              </div>
            </div>
            <div className="flex flex-col justify-end gap-4 border-t border-fio pt-7 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="text-[1.15rem] font-semibold tracking-[-0.02em] text-navy">Prefere pedir de casa?</p>
              <p className="text-cinza leading-relaxed">
                Envie a foto da receita pelo site: o farmacêutico confere e responde no WhatsApp com o valor e o prazo.
                Enviamos para todo o Brasil ou separamos na loja que você escolher.
              </p>
              <div className="mt-2 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                <BotaoEnviarReceita className="botao botao-principal" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMERO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="botao botao-secundario !gap-2"
                >
                  <IconeWhatsApp tamanho={18} className="text-[#25D366]" />
                  {WHATSAPP_LOJA}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
