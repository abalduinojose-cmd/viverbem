// CONTATOS: o WhatsApp como ação principal, o horário ao vivo e as 3
// unidades em lista com fio. Sistema "Branco, azul e ouro" (06/10/2026).
// As unidades vêm de lib/tipos.ts, a mesma lista do rodapé e das lojas.
import type { Metadata } from "next";
import Link from "next/link";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";

export const metadata: Metadata = {
  title: "Contatos · Manipulação Viver Bem",
  description:
    "Fale com a Manipulação Viver Bem pelo WhatsApp e visite as nossas 3 unidades em Petrópolis: Centro, Corrêas e Posse.",
};

export default function PaginaContato() {
  return (
    <main className="flex-1">
      {/* Abertura */}
      <section className="halo-marca px-5 md:px-8 pt-12 md:pt-16 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo">fale com a gente</p>
            <h1 className="titulo-secao vao-rotulo">
              Estamos <span className="italic">pertinho de você</span>
            </h1>
            <p className="texto-apoio mt-4 max-w-xl">
              Atendimento pelo WhatsApp no horário das lojas, e {UNIDADES.length} unidades em
              Petrópolis para você visitar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="botao botao-principal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                </svg>
                Falar no {WHATSAPP_LOJA}
              </a>
              <BotaoEnviarReceita className="botao-link self-center sm:self-auto" />
            </div>
          </div>

          {/* Horário com o estado ao vivo */}
          <div className="lg:col-span-5">
            <HorarioAtendimento />
          </div>
        </div>
      </section>

      {/* As unidades, em lista com fio */}
      <section className="px-5 md:px-8 max-w-6xl mx-auto pt-12 md:pt-16 pb-20 md:pb-24">
        <p className="rotulo">onde nos encontrar</p>
        <h2 className="titulo-bloco mt-2">
          {UNIDADES.length} lojas em <span className="italic">Petrópolis</span>
        </h2>

        <ul className="escalonado lista-fichas lista-fichas-fechada mt-8">
          {UNIDADES.map((u, i) => (
            <li key={u.bairro} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr_auto] items-center gap-x-4 sm:gap-x-8 gap-y-4 py-6 md:py-7">
              <span aria-hidden="true" className="numero-tinta text-xl md:text-2xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1.35rem] md:text-2xl font-semibold tracking-[-0.03em] text-navy leading-tight">{u.bairro}</h3>
                <p className="text-cinza leading-relaxed mt-1">{u.endereco}, Petrópolis/RJ</p>
                {u.telefone && (
                  <p className="text-cinza text-sm mt-1 tabular-nums">Telefone {u.telefone}</p>
                )}
              </div>
              <a
                href={linkMapaUnidade(u.bairro, u.endereco)}
                target="_blank"
                rel="noopener noreferrer"
                className="botao-link col-start-2 sm:col-start-3 justify-self-start"
              >
                Ver no mapa
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-cinza mt-8">
          Horários, como chegar e mais detalhes de cada unidade na{" "}
          <Link href="/lojas" className="text-tinta font-medium hover:underline">
            página das lojas
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
