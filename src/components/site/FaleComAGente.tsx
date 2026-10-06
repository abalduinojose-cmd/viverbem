"use client";
// "Fale com a gente", no topo do rodapé. Modernizado em 05/10/2026:
// a loja aberta ou fechada numa pílula ao vivo, o título com o itálico do
// site e os contatos em cartões clicáveis (WhatsApp, receita, telefone e
// lojas), com o horário da semana em lista compacta.
import Link from "next/link";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { HORARIOS, useEstadoLoja } from "./HorarioAtendimento";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;
const TELEFONE_FIXO = UNIDADES.find((u) => u.telefone)?.telefone ?? null;

function IconeWhatsApp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

function IconeTelefone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h3.5l1.8 4.4-2.3 1.4a11 11 0 0 0 6.2 6.2l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeLoja() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

// Chip da seta no canto do cartão: acende e gira ao passar o mouse
function ChipSeta() {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center transition group-hover:bg-white group-hover:text-noite"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition group-hover:-rotate-45">
        <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// Miolo de cada cartão: rótulo pequeno, o contato em destaque e uma linha de apoio
function Miolo({ rotulo, valor, apoio }: { rotulo: string; valor: string; apoio: string }) {
  return (
    <span className="flex-1 min-w-0">
      <span className="block text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-white/55">{rotulo}</span>
      <span className="block font-display text-xl md:text-[1.45rem] font-semibold leading-tight mt-1.5 tabular-nums">
        {valor}
      </span>
      <span className="block text-sm text-white/55 leading-snug mt-1">{apoio}</span>
    </span>
  );
}

const classeCartao =
  "group w-full flex items-start gap-4 text-left rounded-[1.4rem] border p-4 md:p-5 transition hover:-translate-y-0.5 active:scale-[0.99]";
const cartaoNeutro = "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20";
const classeIcone = "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center";

export function FaleComAGente() {
  const estado = useEstadoLoja();

  return (
    <section aria-labelledby="fale-com-a-gente" className="pt-14 md:pt-16">
      <div className="relative overflow-hidden bg-white/[0.04] border border-white/10 rounded-[2rem] px-5 py-7 md:px-10 md:py-10 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-x-12 gap-y-8 lg:gap-y-6">
        {/* Luz azul no canto, para o cartão não ficar chapado */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-24 w-96 h-96 rounded-full bg-royal/25 blur-3xl"
        />

        {/* ---------- Texto e estado ao vivo ---------- */}
        <div className="relative lg:col-span-5 lg:row-start-1 flex flex-col">
          <p className="selo-secao text-white/60">fale com a gente</p>
          <h2
            id="fale-com-a-gente"
            className="font-display text-[2.1rem] md:text-[2.9rem] font-extrabold tracking-[-0.035em] leading-[1.03] mt-3"
          >
            WhatsApp, telefone <span className="italic text-[#8ab8ea]">ou na loja</span>
          </h2>
          <p className="text-white/60 leading-relaxed mt-4 max-w-md">
            Tire uma dúvida, envie a sua receita ou combine a retirada. A gente responde
            pelo WhatsApp no horário de atendimento.
          </p>

          {/* Aberto ou fechado agora, ao vivo */}
          <p className="self-start inline-flex items-center gap-2.5 min-h-10 rounded-full bg-white/[0.06] border border-white/10 pl-3.5 pr-4 mt-6 text-sm">
            {estado ? (
              <>
                <span className="relative flex w-2.5 h-2.5 shrink-0" aria-hidden="true">
                  {estado.aberto && (
                    <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex w-2.5 h-2.5 rounded-full ${
                      estado.aberto ? "bg-green-400" : "bg-white/30"
                    }`}
                  />
                </span>
                <span className={`font-semibold ${estado.aberto ? "text-green-400" : "text-white/80"}`}>
                  {estado.aberto ? "Aberto agora" : "Fechado agora"}
                </span>
                <span className="text-white/55">· {estado.detalhe}</span>
              </>
            ) : (
              <span className="text-white/55">Horário de atendimento</span>
            )}
          </p>
        </div>

        {/* ---------- Contatos ---------- */}
        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 grid grid-cols-1 gap-3 content-start">
          <a
            href={LINK_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className={`${classeCartao} bg-[#25D366]/[0.12] border-[#25D366]/30 hover:bg-[#25D366]/[0.18] hover:border-[#25D366]/45`}
          >
            <span className={`${classeIcone} bg-[#25D366] text-white`}>
              <IconeWhatsApp />
            </span>
            <Miolo rotulo="WhatsApp" valor={WHATSAPP_LOJA} apoio="Respondemos no horário de atendimento" />
            <ChipSeta />
          </a>

          <BotaoEnviarReceita comIcone={false} className={`${classeCartao} ${cartaoNeutro}`}>
            <span className={`${classeIcone} bg-royal text-white`}>
              <IconeReceita tamanho={22} />
            </span>
            <Miolo rotulo="Receita" valor="Enviar a foto" apoio="O farmacêutico confere e passa o valor" />
            <ChipSeta />
          </BotaoEnviarReceita>

          {TELEFONE_FIXO && (
            <a href={`tel:+55${TELEFONE_FIXO.replace(/\D/g, "")}`} className={`${classeCartao} ${cartaoNeutro}`}>
              <span className={`${classeIcone} bg-white/10 text-white`}>
                <IconeTelefone />
              </span>
              <Miolo rotulo="Telefone fixo" valor={TELEFONE_FIXO} apoio="Loja do Centro" />
              <ChipSeta />
            </a>
          )}

          <Link href="/lojas" className={`${classeCartao} ${cartaoNeutro}`}>
            <span className={`${classeIcone} bg-white/10 text-white`}>
              <IconeLoja />
            </span>
            <Miolo
              rotulo="Nossas lojas"
              valor={`${UNIDADES.map((u) => u.bairro).slice(0, -1).join(", ")} e ${UNIDADES[UNIDADES.length - 1].bairro}`}
              apoio="Endereços, horários e como chegar"
            />
            <ChipSeta />
          </Link>
        </div>

        {/* Semana, com o dia de hoje marcado. No celular vem depois dos
            contatos, que são o que a pessoa procura primeiro */}
        <div className="relative lg:col-span-5 lg:row-start-2">
          <ul className="flex flex-col gap-1 max-w-sm text-sm">
            {HORARIOS.map((linha) => {
              const hoje = estado ? linha.dias.includes(estado.dia) : false;
              return (
                <li
                  key={linha.rotulo}
                  className={`flex items-center justify-between gap-4 rounded-xl px-3.5 py-2 ${
                    hoje ? "bg-white/[0.07] text-white" : "text-white/55"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {linha.rotulo}
                    {hoje && (
                      <span className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-white/55">
                        hoje
                      </span>
                    )}
                  </span>
                  <span className={`tabular-nums ${hoje ? "font-semibold" : ""}`}>{linha.horas}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
