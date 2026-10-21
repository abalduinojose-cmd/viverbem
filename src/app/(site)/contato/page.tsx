// CONTATOS. Sistema "Branco, azul e ouro" (06/10/2026). As unidades vêm de
// lib/tipos.ts, a mesma lista do rodapé e das lojas.
//
// 11/10/2026 ("melhore a página de contato"): a página ganhou um formulário
// de verdade, que abre a mensagem pronta no WhatsApp (FormularioContato),
// ao lado do Instagram e das três lojas com o mapa de cada uma. A abertura
// segue com o WhatsApp como ação principal (agora no verde dele, como no
// resto do site) e o horário ao vivo. A lista numerada das lojas saiu: as
// três ficam no cartão ao lado do formulário, com o telefone fixo do
// Centro, e no "Fale com a gente" do fim da página.
import type { Metadata } from "next";
import Link from "next/link";
import {
  INSTAGRAM_PERFIL,
  INSTAGRAM_URL,
  UNIDADES,
  WHATSAPP_LOJA,
  WHATSAPP_NUMERO,
  linkMapaUnidade,
} from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { FormularioContato } from "@/components/site/FormularioContato";
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

const classeCartao =
  "rounded-[1.75rem] border border-fio bg-white p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]";

// Pino do mapa (as lojas)
function IconePino() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function PaginaContato() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura: o WhatsApp como ação principal e o horário ao vivo ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-10 md:pt-12 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end">
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

      {/* ---------- O formulário, o Instagram e as lojas ---------- */}
      <section className="px-5 md:px-8 pt-8 md:pt-10 pb-14 md:pb-18">
        <div className="max-w-7xl mx-auto escalonado grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 lg:items-stretch">
          <div className="lg:col-span-7">
            <FormularioContato />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-5">
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${classeCartao} group flex flex-col transition duration-300 hover:-translate-y-1 hover:border-ouro/40`}
            >
              <span className="rotulo-pilula">instagram</span>
              <span className="mt-4 flex items-center gap-3">
                <span className="shrink-0 flex size-11 items-center justify-center rounded-2xl bg-gelo text-tinta transition-colors group-hover:bg-tinta group-hover:text-white">
                  <IconeInstagram tamanho={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[1.1rem] font-semibold text-navy tracking-[-0.02em] leading-tight">
                    @{INSTAGRAM_PERFIL}
                  </span>
                  <span className="mt-0.5 block text-sm text-cinza leading-snug">
                    Novidades, bastidores do laboratório e direct.
                  </span>
                </span>
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors group-hover:text-tinta">
                Seguir a Viver Bem
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <SetaDireita tamanho={15} />
                </span>
              </span>
            </a>

            {/* As 3 lojas, cada uma com o seu mapa */}
            <div className={`${classeCartao} flex-1 flex flex-col`}>
              <span className="rotulo-pilula">{UNIDADES.length} lojas em Petrópolis</span>
              <ul className="mt-3 lista-fichas">
                {UNIDADES.map((u) => (
                  <li key={u.bairro}>
                    <a
                      href={linkMapaUnidade(u.bairro, u.endereco)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 py-3.5"
                    >
                      <span aria-hidden="true" className="shrink-0 flex size-10 items-center justify-center rounded-xl bg-gelo text-tinta transition-colors group-hover:bg-tinta group-hover:text-white">
                        <IconePino />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[1.02rem] font-semibold text-navy tracking-[-0.02em] leading-tight transition-colors group-hover:text-tinta">
                          {u.bairro}
                        </span>
                        <span className="mt-0.5 block text-sm text-cinza leading-snug">
                          {u.endereco}
                          {u.telefone && <span className="tabular-nums"> · {u.telefone}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                        Mapa
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          <SetaDireita tamanho={14} />
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <Link href="/lojas" className="botao-link !min-h-11 !text-sm mt-auto pt-3 self-start">
                Fotos, horário e como chegar
                <SetaDireita tamanho={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
