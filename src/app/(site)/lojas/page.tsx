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
import { UNIDADES, WHATSAPP_LOJA } from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
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
      {/* ---------- Abertura: o título e as três vitrines ---------- */}
      <section aria-labelledby="lojas-titulo" className="halo-marca px-5 md:px-8 pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
            <div className="lg:col-span-7">
              <p className="rotulo-pilula">onde nos encontrar</p>
              <h1 id="lojas-titulo" className="titulo-secao vao-rotulo">
                {UNIDADES.length} lojas em <span className="italic">Petrópolis</span>
              </h1>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4 lg:items-end lg:pb-1.5">
              <p className="texto-apoio max-w-md lg:text-right">
                Retire sem custo na loja que preferir ou receba em casa: enviamos para todo o Brasil. O horário de
                atendimento é o mesmo nas três.
              </p>
              <SeloAoVivo className="self-start lg:self-end" />
            </div>
          </div>

          {/* Atalhos para cada loja (no celular, onde as vitrines empilham) */}
          <nav aria-label="Ir para a loja" className="mt-6 flex flex-wrap gap-2 md:hidden">
            {UNIDADES.map((u) => (
              <a
                key={u.bairro}
                href={`#${ancoraLoja(u.bairro)}`}
                className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-navy ring-1 ring-inset ring-fio transition-colors hover:ring-tinta/40"
              >
                {u.bairro}
              </a>
            ))}
          </nav>

          <ol className="escalonado mt-6 md:mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {UNIDADES.map((u, i) => (
              <li key={u.bairro}>
                <VitrineLoja unidade={u} indice={i} prioridade={i === 0} />
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
