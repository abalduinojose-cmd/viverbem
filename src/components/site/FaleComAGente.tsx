"use client";
// "Fale com a gente", no topo do rodapé (o único bloco escuro do site).
//
// Sistema "Receita e rótulo" (06/10/2026): saíram o cartão grande e os 4
// cartões de contato. Ficou uma lista com fios: WhatsApp, receita,
// telefone fixo e lojas, cada linha com o rótulo em caixa alta, o contato
// em destaque e uma linha de apoio. A loja aberta ou fechada numa pílula
// ao vivo, e o horário da semana em lista compacta.
import Link from "next/link";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { HORARIOS, useEstadoLoja } from "./HorarioAtendimento";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;
const TELEFONE_FIXO = UNIDADES.find((u) => u.telefone)?.telefone ?? null;

function IconeWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

function IconeTelefone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h3.5l1.8 4.4-2.3 1.4a11 11 0 0 0 6.2 6.2l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeLoja() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// Seta na ponta da linha: desliza ao passar o mouse
function Seta() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-white/40 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
    >
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Miolo de cada linha: rótulo pequeno, o contato em destaque e o apoio
function Miolo({ rotulo, valor, apoio }: { rotulo: string; valor: string; apoio: string }) {
  return (
    <span className="flex-1 min-w-0">
      <span className="rotulo block !text-white/50">{rotulo}</span>
      <span className="block text-xl md:text-[1.45rem] font-medium leading-tight mt-1 tabular-nums tracking-[-0.02em]">
        {valor}
      </span>
      <span className="block text-sm text-white/55 leading-snug mt-1">{apoio}</span>
    </span>
  );
}

const classeLinha =
  "group w-full flex items-center gap-5 text-left py-5 md:py-6 transition-colors hover:text-white";
const classeIcone =
  "shrink-0 w-12 h-12 rounded-2xl border border-white/12 text-white/80 flex items-center justify-center transition duration-300 group-hover:border-white/35 group-hover:text-white";

export function FaleComAGente() {
  const estado = useEstadoLoja();

  return (
    <section aria-labelledby="fale-com-a-gente" className="secao">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
        {/* ---------- Texto, estado ao vivo e horário ---------- */}
        <div className="lg:col-span-5 flex flex-col">
          <p className="rotulo">fale com a gente</p>
          <h2 id="fale-com-a-gente" className="titulo-secao vao-rotulo text-white">
            WhatsApp, telefone <span className="italic">ou na loja</span>
          </h2>
          <p className="texto-apoio mt-5 max-w-md text-white/60">
            Tire uma dúvida, envie a sua receita ou combine a retirada. A gente responde
            pelo WhatsApp no horário de atendimento.
          </p>

          {/* Aberto ou fechado agora, ao vivo */}
          <p className="self-start inline-flex items-center gap-2.5 min-h-10 rounded-full border border-white/12 pl-3.5 pr-4 mt-7 text-sm">
            {estado ? (
              <>
                <span
                  aria-hidden="true"
                  className={`inline-flex w-2.5 h-2.5 shrink-0 rounded-full ${
                    estado.aberto ? "bg-green-400" : "bg-white/30"
                  }`}
                />
                <span className={`font-semibold ${estado.aberto ? "text-green-400" : "text-white/80"}`}>
                  {estado.aberto ? "Aberto agora" : "Fechado agora"}
                </span>
                <span className="text-white/55">· {estado.detalhe}</span>
              </>
            ) : (
              <span className="text-white/55">Horário de atendimento</span>
            )}
          </p>

          {/* Semana, com o dia de hoje marcado */}
          <ul className="mt-8 max-w-sm text-sm lista-fichas [&>*+*]:border-white/10">
            {HORARIOS.map((linha) => {
              const hoje = estado ? linha.dias.includes(estado.dia) : false;
              return (
                <li
                  key={linha.rotulo}
                  className={`flex items-center justify-between gap-4 py-2.5 ${
                    hoje ? "text-white" : "text-white/55"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {linha.rotulo}
                    {hoje && <span className="rotulo text-[0.62rem] !text-ouro-claro">hoje</span>}
                  </span>
                  <span className={`tabular-nums ${hoje ? "font-semibold" : ""}`}>{linha.horas}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Contatos, em lista com fios ---------- */}
        <ul className="lg:col-span-7 lista-fichas lista-fichas-fechada [&>*+*]:border-white/10 border-white/10 self-start">
          <li>
            <a href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer" className={classeLinha}>
              <span className={`${classeIcone} text-[#25D366] group-hover:text-[#25D366]`}>
                <IconeWhatsApp />
              </span>
              <Miolo rotulo="WhatsApp" valor={WHATSAPP_LOJA} apoio="Respondemos no horário de atendimento" />
              <Seta />
            </a>
          </li>

          <li>
            <BotaoEnviarReceita comIcone={false} className={classeLinha}>
              <span className={classeIcone}>
                <IconeReceita tamanho={20} />
              </span>
              <Miolo rotulo="Receita" valor="Enviar a foto" apoio="O farmacêutico confere e passa o valor" />
              <Seta />
            </BotaoEnviarReceita>
          </li>

          {TELEFONE_FIXO && (
            <li>
              <a href={`tel:+55${TELEFONE_FIXO.replace(/\D/g, "")}`} className={classeLinha}>
                <span className={classeIcone}>
                  <IconeTelefone />
                </span>
                <Miolo rotulo="Telefone fixo" valor={TELEFONE_FIXO} apoio="Loja do Centro" />
                <Seta />
              </a>
            </li>
          )}

          <li>
            <Link href="/lojas" className={classeLinha}>
              <span className={classeIcone}>
                <IconeLoja />
              </span>
              <Miolo
                rotulo="Nossas lojas"
                valor={`${UNIDADES.map((u) => u.bairro).slice(0, -1).join(", ")} e ${UNIDADES[UNIDADES.length - 1].bairro}`}
                apoio="Endereços, horários e como chegar"
              />
              <Seta />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
