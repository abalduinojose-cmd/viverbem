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
import { UNIDADES, WHATSAPP_LOJA } from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { VitrineLoja, ancoraLoja } from "@/components/site/VitrineLoja";
import { IconeCaixa } from "@/components/site/IconeCaixa";
import { IconeFachada } from "@/components/site/IconesVantagens";
import { IconeRelogio } from "@/components/site/icones";

export const metadata: Metadata = {
  title: "Lojas · Manipulação Viver Bem",
  description:
    "As 3 lojas da Viver Bem em Petrópolis: Centro, Corrêas e Posse. Endereços, mapa, horário e como chegar.",
  alternates: { canonical: "/lojas" },
};

export default function PaginaLojas() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura: o título e as três fachadas em leque ----------
          13/11/2026, segunda versão ("melhore, não gostei" do cartão
          azul-noite): a abertura volta a ser CLARA, no padrão das páginas
          do site (rótulo, título com a palavra em ouro, texto e o "aberto
          agora"), e ao lado (embaixo no celular) as três fachadas viram um
          LEQUE de fotos, uma sobre a outra, levemente giradas, como fotos
          sobre a mesa. O toque leva à loja; no mouse a foto endireita e
          sobe. Ordem: Centro, Corrêas e Posse. */}
      <section aria-labelledby="lojas-titulo" className="halo-marca px-5 md:px-8 pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            {/* 13/11/2026 ("modernize o título e o texto abaixo; sem
                numeração, as três são importantes; tire o aberto, fecha às
                19h"): o título passou a falar das três lojas como uma coisa
                só, com a voz em ouro; o texto diz os três bairros em
                destaque; e no lugar do selo ao vivo entram as três
                vantagens numa fileira de ícones em ouro. */}
            <p className="rotulo-pilula">onde nos encontrar</p>
            <h1 id="lojas-titulo" className="titulo-secao vao-rotulo">
              Três lojas, <span className="italic whitespace-nowrap">um só cuidado</span>
            </h1>
            <p className="texto-apoio mt-4 max-w-md">
              No <b className="font-semibold text-navy">Centro</b>, em <b className="font-semibold text-navy">Corrêas</b> e
              na <b className="font-semibold text-navy">Posse</b>, em Petrópolis. Escolha a mais perto de você ou receba
              em casa.
            </p>
            <ul className="mt-6 flex max-w-md flex-col gap-3 border-t border-fio pt-5">
              {[
                { icone: <IconeFachada tamanho={18} />, texto: "Retirada grátis" },
                { icone: <IconeCaixa tamanho={18} />, texto: "Enviamos para todo o Brasil" },
                { icone: <IconeRelogio tamanho={18} />, texto: "Mesmo horário nas três" },
              ].map((v) => (
                <li key={v.texto} className="flex items-center gap-2.5 text-[0.92rem] font-medium text-navy">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gelo text-ouro-escuro ring-1 ring-inset ring-ouro/30">
                    {v.icone}
                  </span>
                  {v.texto}
                </li>
              ))}
            </ul>
          </div>

          {/* As três fachadas em leque */}
          <nav aria-label="Ir para a loja" className="lg:col-span-6">
            <ul className="relative mx-auto h-[15.5rem] max-w-[26rem] sm:h-[19rem] lg:h-[23rem] lg:max-w-none">
              {UNIDADES.map((u, i) => {
                // Esquerda, meio (na frente) e direita
                const leque = [
                  "left-0 top-6 -rotate-[7deg] z-[1]",
                  "left-1/2 top-0 -translate-x-1/2 z-[3]",
                  "right-0 top-6 rotate-[7deg] z-[2]",
                ][i];
                return (
                  <li key={u.bairro} className={`absolute w-[42%] lg:w-[40%] ${leque} transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-[4] hover:rotate-0 hover:-translate-y-2 ${i === 1 ? "hover:-translate-x-1/2" : ""}`}>
                    <a
                      href={`#${ancoraLoja(u.bairro)}`}
                      className="group block overflow-hidden rounded-[1.4rem] bg-white p-1.5 shadow-[0_28px_50px_-26px_rgba(13,35,64,0.55)] ring-1 ring-fio"
                    >
                      <span className="relative block aspect-[3/4] overflow-hidden rounded-[1.05rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset(`${u.foto}-520.webp`)}
                          alt=""
                          width={520}
                          height={600}
                          fetchPriority={i === 1 ? "high" : "auto"}
                          decoding="async"
                          draggable={false}
                          style={{ objectPosition: u.focoFoto }}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noite/85 via-noite/30 to-transparent" />
                        {/* Na foto da direita o nome vai para a direita: o lado
                            esquerdo dela fica por baixo da foto do meio */}
                        <span className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white md:p-4 ${i === 2 ? "flex-row-reverse text-right" : ""}`}>
                          <span className="min-w-0">
                            <span className="block truncate text-[0.95rem] font-semibold leading-tight tracking-[-0.02em] md:text-[1.2rem]">{u.bairro}</span>
                          </span>
                          <span aria-hidden="true" className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-sm transition-transform duration-300 group-hover:translate-y-0.5 sm:flex">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      {/* ---------- As três lojas ---------- */}
      <section aria-label="As lojas" className="px-5 md:px-8 pt-10 md:pt-14">
        <div className="max-w-6xl mx-auto">
          <ol className="escalonado grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {UNIDADES.map((u) => (
              <li key={u.bairro}>
                <VitrineLoja unidade={u} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Horário e o pedido pela receita ----------
          13/11/2026: os cartões de dias (HorarioLojas) foram recusados
          ("fora do padrão do site"); voltou a ficha de sempre. */}
      <section className="px-5 md:px-8 max-w-6xl mx-auto pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div className="revelar">
            <p className="rotulo-pilula">horário de atendimento</p>
            <h2 className="titulo-bloco vao-rotulo">
              O mesmo nas <span className="italic">{UNIDADES.length} lojas</span>
            </h2>
            <p className="text-cinza leading-relaxed mt-4 max-w-md">
              Prefere pedir de casa? Envie a foto da receita pelo site e finalize no WhatsApp, no{" "}
              {WHATSAPP_LOJA}. Enviamos para todo o Brasil ou separamos na loja que você escolher.
            </p>
            <BotaoEnviarReceita className="botao botao-principal mt-7" />
          </div>

          {/* Horário com o estado ao vivo, em ficha clara */}
          <div className="revelar">
            <HorarioAtendimento />
          </div>
        </div>
      </section>
    </main>
  );
}
