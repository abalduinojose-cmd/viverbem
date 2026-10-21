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
import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO, UNIDADES, WHATSAPP_LOJA } from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { CartaoLoja } from "@/components/site/CartaoLoja";
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
      {/* ---------- Abertura: o título e a fachada ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
            <div className="lg:col-span-7">
              <p className="rotulo-pilula">onde nos encontrar</p>
              <h1 className="titulo-secao vao-rotulo">
                {UNIDADES.length} lojas em <span className="italic">Petrópolis</span>
              </h1>
            </div>
            <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5 lg:text-right">
              Retire sem custo na loja que preferir ou receba em casa pelo Delivery. O horário de
              atendimento é o mesmo nas três.
            </p>
          </div>

          {/* A fachada, larga e sem fio: a única foto da página */}
          <figure className="revelar relative mt-8 md:mt-10 overflow-hidden rounded-[2rem] bg-gelo aspect-[16/9] sm:aspect-[2.1/1] md:aspect-[2.6/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/fotos/lojas/fachada.webp")}
              alt="Fachada da Manipulação Viver Bem: manipulação, cosméticos, homeopatia e florais"
              width={1400}
              height={607}
              fetchPriority="high"
              decoding="async"
              className="foto-profunda absolute inset-0 h-full w-full object-cover object-[50%_40%]"
            />
            <figcaption className="absolute left-4 top-4 inline-flex items-center gap-2 h-8 pl-2.5 pr-3.5 rounded-full bg-white/92 text-navy text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
              há {ANOS_TRADICAO} anos em Petrópolis
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- As três lojas, cada uma com o seu mapa ---------- */}
      <section aria-labelledby="lojas-titulo" className="px-5 md:px-8 pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="rotulo-pilula">as lojas</p>
              <h2 id="lojas-titulo" className="titulo-bloco vao-rotulo">
                Centro, Corrêas <span className="italic">e Posse</span>
              </h2>
            </div>
            <SeloAoVivo className="self-start sm:self-auto sm:mb-1" />
          </div>
          <ol className="escalonado mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {UNIDADES.map((u, i) => (
              <li key={u.bairro}>
                <CartaoLoja unidade={u} indice={i} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Horário e o pedido pela receita ---------- */}
      <section className="px-5 md:px-8 max-w-6xl mx-auto pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div className="revelar">
            <p className="rotulo-pilula">horário de atendimento</p>
            <h2 className="titulo-bloco vao-rotulo">
              O mesmo nas <span className="italic">{UNIDADES.length} lojas</span>
            </h2>
            <p className="text-cinza leading-relaxed mt-4 max-w-md">
              Prefere pedir de casa? Envie a foto da receita pelo site e finalize no WhatsApp, no{" "}
              {WHATSAPP_LOJA}. Entregamos pelo Delivery ou separamos na loja que você escolher.
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
