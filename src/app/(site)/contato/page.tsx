// CONTATOS. Sistema "Branco, azul e ouro" (06/10/2026). As unidades vêm de
// lib/tipos.ts, a mesma lista do rodapé e das lojas.
//
// 11/10/2026 ("melhore a página de contato"): formulário de verdade que
// abre a mensagem pronta no WhatsApp (FormularioContato).
// 21/10/2026 ("melhore a parte dos contatos"): a página ficou com cada
// coisa uma vez só. A abertura segue com o WhatsApp como ação principal e
// o horário ao vivo; depois o formulário com, ao lado, UM cartão com os
// canais (WhatsApp, Instagram e o telefone fixo do Centro, cada um numa
// linha com ícone e seta) e o convite da receita em azul-noite; no fim, as
// três lojas em cartões com o mapa de cada uma (CartaoLoja, os mesmos da
// página das lojas). O "Fale com a gente" do pé não aparece aqui: repetia
// o WhatsApp, as lojas e o horário que a página já mostra.
import type { Metadata } from "next";
import Link from "next/link";
import {
  INSTAGRAM_PERFIL,
  INSTAGRAM_URL,
  UNIDADES,
  WHATSAPP_LOJA,
  WHATSAPP_NUMERO,
} from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita, IconeReceita } from "@/components/site/BotaoEnviarReceita";
import { FormularioContato } from "@/components/site/FormularioContato";
import { CartaoLoja } from "@/components/site/CartaoLoja";
import { IconeInstagram, IconeWhatsApp, SetaDireita } from "@/components/site/icones";

export const metadata: Metadata = {
  title: "Contatos · Manipulação Viver Bem",
  description:
    "Fale com a Manipulação Viver Bem pelo WhatsApp e visite as nossas 3 unidades em Petrópolis: Centro, Corrêas e Posse.",
  alternates: { canonical: "/contato" },
};

// A conversa direta, sem o formulário: a mensagem já vai pronta
const MENSAGEM = "Olá! Vim pelo site e gostaria de tirar uma dúvida.";
const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM)}`;
const LOJA_COM_TELEFONE = UNIDADES.find((u) => u.telefone);

function IconeTelefone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 3.5h3l1.6 4-2 1.3a11.5 11.5 0 0 0 5.1 5.1l1.3-2 4 1.6v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Os canais, cada um numa linha: ícone, nome, detalhe e seta
const CANAIS = [
  {
    nome: "WhatsApp",
    detalhe: WHATSAPP_LOJA,
    apoio: "Dúvidas, pedidos e retirada",
    href: LINK_WHATSAPP,
    externo: true,
    icone: <IconeWhatsApp tamanho={20} />,
    cor: "text-[#1DA851]",
  },
  {
    nome: "Instagram",
    detalhe: `@${INSTAGRAM_PERFIL}`,
    apoio: "Novidades e bastidores do laboratório",
    href: INSTAGRAM_URL,
    externo: true,
    icone: <IconeInstagram tamanho={20} />,
    cor: "text-tinta",
  },
  ...(LOJA_COM_TELEFONE
    ? [
        {
          nome: "Telefone",
          detalhe: LOJA_COM_TELEFONE.telefone as string,
          apoio: `Loja ${LOJA_COM_TELEFONE.bairro}, no horário das lojas`,
          href: `tel:+55${(LOJA_COM_TELEFONE.telefone as string).replace(/\D/g, "")}`,
          externo: false,
          icone: <IconeTelefone />,
          cor: "text-tinta",
        },
      ]
    : []),
];

export default function PaginaContato() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura: o WhatsApp como ação principal e o horário ao vivo ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-10 md:pt-12 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end">
          <div className="lg:col-span-7 revelar">
            <p className="rotulo-pilula">contato</p>
            <h1 className="titulo-secao vao-rotulo">
              Estamos <span className="italic">perto de você</span>
            </h1>
            <p className="texto-apoio mt-4 max-w-xl">
              Tire dúvidas, peça um orçamento ou combine a retirada. Pelo WhatsApp, a resposta
              vem no horário das lojas.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <a
                href={LINK_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 h-14 px-7 rounded-full bg-[#1DA851] text-white text-[1.02rem] font-semibold shadow-[0_18px_40px_-16px_rgba(29,168,81,0.7)] transition-colors hover:bg-[#178a43] active:scale-[0.98]"
              >
                <IconeWhatsApp tamanho={20} />
                Falar no {WHATSAPP_LOJA}
              </a>
              <BotaoEnviarReceita className="botao-link self-center sm:self-auto" />
            </div>
          </div>

          <div className="lg:col-span-5 revelar">
            <HorarioAtendimento />
          </div>
        </div>
      </section>

      {/* ---------- O formulário e, ao lado, os canais e a receita ---------- */}
      <section className="px-5 md:px-8 pt-8 md:pt-10">
        <div className="max-w-6xl mx-auto escalonado grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 lg:items-stretch">
          <div className="lg:col-span-7">
            <FormularioContato />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-5">
            {/* Os canais, numa lista só */}
            <div className="rounded-[1.75rem] border border-fio bg-white p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
              <span className="rotulo-pilula">outros canais</span>
              <ul className="mt-2 lista-fichas">
                {CANAIS.map((c) => (
                  <li key={c.nome}>
                    <a
                      href={c.href}
                      {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className={`shrink-0 flex size-11 items-center justify-center rounded-2xl bg-gelo transition-colors group-hover:bg-navy group-hover:text-white ${c.cor}`}>
                        {c.icone}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[1.05rem] font-semibold text-navy tracking-[-0.02em] leading-tight tabular-nums transition-colors group-hover:text-tinta">
                          {c.detalhe}
                        </span>
                        <span className="mt-0.5 block text-sm text-cinza leading-snug">{c.apoio}</span>
                      </span>
                      <span className="shrink-0 flex size-9 items-center justify-center rounded-full bg-gelo text-navy transition duration-300 group-hover:bg-navy group-hover:text-white group-hover:translate-x-0.5">
                        <SetaDireita tamanho={14} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* A receita, em azul-noite: a ação principal do site */}
            <div className="banner-noite em-noite relative flex flex-1 flex-col overflow-hidden rounded-[1.75rem] p-5 text-white ring-1 ring-inset ring-white/10 shadow-[0_24px_50px_-30px_rgba(13,35,64,0.6)] md:p-6">
              <span aria-hidden="true" className="malha-banner" />
              <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.28),transparent_62%)]" />
              <span className="relative rotulo-pilula">tem receita?</span>
              <p className="relative mt-4 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[1.7rem]">
                Mande a foto e receba <span className="italic">o orçamento</span>
              </p>
              <p className="relative mt-2 max-w-[34ch] text-[0.93rem] leading-relaxed text-white/72">
                A equipe confere, informa valor e prazo, e você escolhe entre retirar na loja ou receber pelo Delivery.
              </p>
              <ol className="relative mt-5 flex flex-col gap-2.5 text-[0.9rem] text-white/85">
                {["Foto da receita pelo site ou WhatsApp", "A equipe confere e manda valor e prazo", "Retirada na loja ou Delivery"].map((passo, i) => (
                  <li key={passo} className="flex items-center gap-3">
                    <span className="numero-tinta text-[1.05rem] w-5 shrink-0">{i + 1}</span>
                    {passo}
                  </li>
                ))}
              </ol>
              <div className="relative mt-auto pt-6">
                <BotaoEnviarReceita className="botao w-full bg-white text-navy font-semibold hover:bg-[#f3ead9] sm:w-auto" comIcone={false}>
                  <IconeReceita />
                  Enviar receita
                </BotaoEnviarReceita>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- As três lojas, com o mapa de cada uma ---------- */}
      <section aria-labelledby="contato-lojas" className="px-5 md:px-8 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="rotulo-pilula">{UNIDADES.length} lojas em Petrópolis</p>
              <h2 id="contato-lojas" className="titulo-bloco vao-rotulo">
                Passe numa <span className="italic">das lojas</span>
              </h2>
            </div>
            <Link href="/lojas" className="botao-link !min-h-11 !text-sm self-start sm:self-auto sm:mb-1">
              Fachada, horário e como chegar
              <SetaDireita tamanho={14} />
            </Link>
          </div>
          <ol className="escalonado mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {UNIDADES.map((u, i) => (
              <li key={u.bairro}>
                <CartaoLoja unidade={u} indice={i} compacto />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
