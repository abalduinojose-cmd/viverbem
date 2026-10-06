"use client";
// "Fale com a gente", o bloco claro logo antes do rodapé escuro.
//
// Reformulado em 06/10/2026 na língua da loja. À esquerda, o título em
// duas vozes, o texto, a pílula "Aberto agora" ao vivo e a semana num
// cartão claro. À direita, três cartões, com hierarquia de ação (uma só
// ação principal por tela): a RECEITA em azul-noite ocupando a linha
// inteira, com a pílula "Começar"; embaixo, WhatsApp (no verde dele) e
// Nossas lojas (com os bairros em chips), ambos com a seta num círculo de
// ouro. O telefone fixo saiu a pedido do usuário; ele segue na página das
// lojas.
import Link from "next/link";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { HORARIOS, useEstadoLoja } from "./HorarioAtendimento";
import { IconeLoja } from "./IconesVantagens";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;

function IconeWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

function SetaDireita({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Seta num círculo de ouro, que anda ao passar o mouse
function SetaOuro() {
  return (
    <span className="shrink-0 w-10 h-10 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
      <SetaDireita />
    </span>
  );
}

const classeCartao =
  "group h-full w-full flex flex-col text-left rounded-[1.75rem] border border-fio bg-white p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)] transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)] active:scale-[0.99]";

export function FaleComAGente() {
  const estado = useEstadoLoja();

  return (
    <section aria-labelledby="fale-com-a-gente" className="relative bg-white border-t border-fio">
      <div className="max-w-7xl mx-auto px-5 md:px-8 secao pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
          {/* ---------- Texto, estado ao vivo e horário ---------- */}
          <div className="revelar lg:col-span-5 flex flex-col">
            <p className="rotulo">fale com a gente</p>
            <h2 id="fale-com-a-gente" className="titulo-secao vao-rotulo">
              WhatsApp, receita <span className="italic">ou na loja</span>
            </h2>
            <p className="texto-apoio mt-5 max-w-md">
              Tire uma dúvida, envie a sua receita ou combine a retirada. A gente responde
              pelo WhatsApp no horário de atendimento.
            </p>

            {/* Aberto ou fechado agora, e a semana, num cartão claro */}
            <div className="mt-8 max-w-sm rounded-[1.5rem] border border-fio bg-gradient-to-b from-white to-gelo/70 p-5">
              <p className="inline-flex items-center gap-2.5 min-h-9 rounded-full bg-white border border-fio pl-3 pr-3.5 text-sm shadow-sm">
                {estado ? (
                  <>
                    <span
                      aria-hidden="true"
                      className={`inline-flex w-2.5 h-2.5 shrink-0 rounded-full ${
                        estado.aberto ? "bg-green-500" : "bg-fio"
                      }`}
                    />
                    <span className={`font-semibold ${estado.aberto ? "text-green-700" : "text-grafite"}`}>
                      {estado.aberto ? "Aberto agora" : "Fechado agora"}
                    </span>
                    <span className="text-cinza">· {estado.detalhe}</span>
                  </>
                ) : (
                  <span className="text-cinza">Horário de atendimento</span>
                )}
              </p>

              <ul className="mt-4 text-sm lista-fichas">
                {HORARIOS.map((linha) => {
                  const hoje = estado ? linha.dias.includes(estado.dia) : false;
                  return (
                    <li
                      key={linha.rotulo}
                      className={`flex items-center justify-between gap-4 py-2.5 ${hoje ? "text-navy" : "text-cinza"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        {linha.rotulo}
                        {hoje && <span className="rotulo text-[0.68rem] !text-ouro-escuro">hoje</span>}
                      </span>
                      <span className={`tabular-nums ${hoje ? "font-semibold" : ""}`}>{linha.horas}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ---------- Os três cartões: a receita em destaque, depois WhatsApp e lojas ---------- */}
          <ul className="escalonado lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 self-start">
            <li className="sm:col-span-2">
              <BotaoEnviarReceita
                comIcone={false}
                className="group relative w-full flex flex-col sm:flex-row sm:items-center gap-5 text-left rounded-[1.75rem] banner-noite em-noite text-white p-6 md:p-7 overflow-hidden shadow-[0_24px_50px_-30px_rgba(13,35,64,0.6)] transition duration-300 hover:-translate-y-1 active:scale-[0.99]"
              >
                <span className="shrink-0 w-14 h-14 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
                  <IconeReceita tamanho={26} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="rotulo block">receita</span>
                  <span className="block mt-1.5 text-[1.35rem] md:text-[1.5rem] font-semibold leading-tight tracking-[-0.03em]">
                    Enviar a foto da receita
                  </span>
                  <span className="block mt-1.5 text-sm text-white/70 leading-snug max-w-[40ch]">
                    Abre o seu pedido. A foto vai pela conversa do WhatsApp; o farmacêutico
                    confere e passa o valor.
                  </span>
                </span>
                <span className="inline-flex items-center gap-2.5 h-12 pl-5 pr-1.5 rounded-full bg-white text-navy text-[0.95rem] font-semibold self-start sm:self-center shrink-0 transition-colors group-hover:bg-gelo">
                  Começar
                  <span className="w-9 h-9 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
                    <SetaDireita tamanho={15} />
                  </span>
                </span>
              </BotaoEnviarReceita>
            </li>

            <li>
              <a href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer" className={classeCartao}>
                <span className="w-12 h-12 rounded-full flex items-center justify-center bg-[#25D366]/12 text-[#1DA851]">
                  <IconeWhatsApp />
                </span>
                <span className="mt-5 block">
                  <span className="rotulo block">WhatsApp</span>
                  <span className="block mt-1.5 text-[1.2rem] md:text-[1.3rem] font-semibold text-navy leading-tight tabular-nums tracking-[-0.02em]">
                    {WHATSAPP_LOJA}
                  </span>
                  <span className="block mt-1 text-sm text-cinza leading-snug">
                    Dúvidas, pedidos e retirada, no horário de atendimento
                  </span>
                </span>
                <span className="mt-auto pt-6 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-navy">Chamar no WhatsApp</span>
                  <SetaOuro />
                </span>
              </a>
            </li>

            <li>
              <Link href="/lojas" className={classeCartao}>
                <span className="w-12 h-12 rounded-full flex items-center justify-center bg-ouro/10 text-ouro-escuro">
                  <IconeLoja tamanho={22} />
                </span>
                <span className="mt-5 block">
                  <span className="rotulo block">Nossas lojas</span>
                  <span className="block mt-1.5 text-[1.2rem] md:text-[1.3rem] font-semibold text-navy leading-tight tracking-[-0.02em]">
                    {UNIDADES.length} unidades em Petrópolis
                  </span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {UNIDADES.map((u) => (
                      <span
                        key={u.bairro}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-gelo text-navy text-[0.78rem] font-medium"
                      >
                        <span className="text-ouro">
                          <IconeLoja tamanho={12} />
                        </span>
                        {u.bairro}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="mt-auto pt-6 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-navy">Endereços e como chegar</span>
                  <SetaOuro />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
