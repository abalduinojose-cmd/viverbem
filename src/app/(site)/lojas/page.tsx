// LOJAS: as 3 unidades da Viver Bem em Petrópolis, em lista com fio,
// cada uma com o mapa e o WhatsApp, e o horário com o estado ao vivo.
// Sistema "Branco, azul e ouro" (06/10/2026).
import type { Metadata } from "next";
import {
  UNIDADES,
  linkMapaUnidade,
  WHATSAPP_LOJA,
  WHATSAPP_NUMERO,
} from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";

export const metadata: Metadata = {
  title: "Lojas · Manipulação Viver Bem",
  description:
    "As 3 unidades da Viver Bem em Petrópolis: Centro, Corrêas e Posse. Endereços, horários e como chegar.",
};

export default function PaginaLojas() {
  return (
    <main className="flex-1">
      {/* Abertura */}
      <section className="halo-marca px-5 md:px-8 pt-12 md:pt-16 pb-8">
        <div className="max-w-5xl mx-auto">
          <p className="rotulo">onde nos encontrar</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 vao-rotulo">
            <h1 className="titulo-secao">
              {UNIDADES.length} lojas em
              <br />
              <span className="italic">Petrópolis</span>
            </h1>
            <p className="texto-apoio md:text-right md:max-w-xs">
              Retire sem taxa em qualquer unidade, ou receba em casa de moto.
            </p>
          </div>
        </div>
      </section>

      {/* As unidades, em linhas */}
      <section className="px-5 md:px-8 max-w-5xl mx-auto">
        <ul className="escalonado lista-fichas lista-fichas-fechada">
          {UNIDADES.map((u, i) => (
            <li
              key={u.bairro}
              className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr_auto] items-center gap-x-4 sm:gap-x-8 gap-y-4 py-7 md:py-8"
            >
              <span aria-hidden="true" className="numero-tinta text-2xl md:text-3xl">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-[-0.03em] text-navy">{u.bairro}</h2>
                <p className="text-cinza leading-relaxed mt-1">{u.endereco}</p>
                {u.telefone && (
                  <p className="text-grafite-claro text-sm mt-1.5 tabular-nums">Telefone {u.telefone}</p>
                )}
              </div>

              {/* Ações na ponta */}
              <div className="flex flex-wrap gap-2.5 col-start-2 sm:col-start-3">
                <a
                  href={linkMapaUnidade(u.bairro, u.endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="botao botao-secundario botao-compacto !min-h-12"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ouro">
                    <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  Como chegar
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMERO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Falar no WhatsApp sobre a unidade ${u.bairro}`}
                  className="botao botao-secundario !min-h-12 w-12 !px-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#25D366]">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Horário e atalho */}
      <section className="px-5 md:px-8 max-w-5xl mx-auto pt-12 md:pt-16 pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div>
            <p className="rotulo">horário de atendimento</p>
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-[1.06] mt-2">
              O mesmo nas <span className="italic">{UNIDADES.length} unidades</span>
            </h2>
            <p className="text-cinza leading-relaxed mt-4">
              Prefere pedir sem sair de casa? Envie a foto da receita pelo site e finalize
              no WhatsApp, no {WHATSAPP_LOJA}. A gente entrega de moto ou separa na loja que
              você escolher.
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
