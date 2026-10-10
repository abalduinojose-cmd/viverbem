// LOJAS: as 3 unidades da Viver Bem em Petrópolis.
//
// Terceira versão (10/10/2026, pedido: "quero a foto da fachada, e não a
// foto da fachada com os proprietários; deixe a página mais moderna,
// conceitual e clean"): a página abre com UMA imagem, a fachada da loja,
// larga e sem fio (public/fotos/lojas/fachada.webp, recortada da foto dos
// 20 anos acima da porta, onde não há pessoas), e as três lojas vêm numa
// lista tipográfica com fios: o número em ouro, o bairro grande, o
// endereço, o telefone fixo (só o Centro tem) e as duas ações. Nada de
// cartão com foto por loja (a farmácia não tem foto de cada fachada; se
// mandar, é só trocar a imagem). Embaixo, o horário com o estado ao vivo.
// Sistema "Branco, azul e ouro" (06/10/2026).
import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { ANOS_TRADICAO, UNIDADES, linkMapaUnidade, WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { IconeWhatsApp } from "@/components/site/icones";

export const metadata: Metadata = {
  title: "Lojas · Manipulação Viver Bem",
  description:
    "As 3 lojas da Viver Bem em Petrópolis: Centro, Corrêas e Posse. Endereços, horário e como chegar.",
};

function IconePino() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

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

          {/* A fachada, larga e sem fio: a única imagem da página */}
          <figure className="revelar relative mt-8 md:mt-10 overflow-hidden rounded-[2rem] bg-gelo aspect-[16/9] sm:aspect-[2.1/1] md:aspect-[2.4/1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/fotos/lojas/fachada.webp")}
              alt="Fachada da Manipulação Viver Bem: manipulação, cosméticos, homeopatia e florais"
              width={1400}
              height={607}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
            />
            <figcaption className="absolute left-4 top-4 inline-flex items-center gap-2 h-8 pl-2.5 pr-3.5 rounded-full bg-white/92 text-navy text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
              há {ANOS_TRADICAO} anos em Petrópolis
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- As lojas, em lista com fio ---------- */}
      <section aria-label="As lojas" className="px-5 md:px-8 pt-10 md:pt-14">
        <ol className="escalonado max-w-6xl mx-auto border-y border-fio divide-y divide-fio">
          {UNIDADES.map((u, i) => (
            <li
              key={u.bairro}
              className="grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr_auto] items-center gap-x-4 md:gap-x-8 gap-y-4 py-7 md:py-9"
            >
              <span aria-hidden="true" className="numero-tinta text-[2rem] md:text-[2.6rem] leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h2 className="text-[1.6rem] md:text-[2rem] font-semibold tracking-[-0.035em] text-navy leading-tight">
                  {u.bairro}
                </h2>
                <p className="mt-1.5 text-cinza leading-relaxed">{u.endereco}</p>
                {u.telefone && <p className="mt-1 text-sm text-cinza tabular-nums">Telefone {u.telefone}</p>}
              </div>

              {/* As ações: o mapa é a principal; o WhatsApp é o mesmo das três */}
              <div className="col-start-2 md:col-start-3 flex items-center gap-2.5">
                <a
                  href={linkMapaUnidade(u.bairro, u.endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="botao botao-principal botao-compacto !min-h-11 !gap-2"
                >
                  <IconePino />
                  Como chegar
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMERO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Falar no WhatsApp sobre a loja ${u.bairro}`}
                  className="botao botao-secundario !min-h-11 w-11 !px-0"
                >
                  <IconeWhatsApp tamanho={19} className="text-[#25D366]" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Horário e o pedido pela receita ---------- */}
      <section className="px-5 md:px-8 max-w-6xl mx-auto pt-12 md:pt-16 pb-14 md:pb-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div>
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
          <HorarioAtendimento />
        </div>
      </section>
    </main>
  );
}
