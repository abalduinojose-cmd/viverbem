"use client";
// "Fale com a gente", o bloco claro logo antes do rodapé escuro.
//
// Terceira versão (06/10/2026, noite, "modernize a seção toda", com a
// skill ui-ux-pro-max: estilo "Trust & Authority" para saúde, contato
// nunca escondido, uma só ação principal por tela e o estado do sistema
// visível). Cabeçalho com o título em duas vozes e, ao lado, o selo ao
// vivo "Aberto agora · Fecha às 19h". Depois a grade: a RECEITA em
// azul-noite (a ação principal) com a folha de receita em vidro como
// ilustração; o WhatsApp com o número grande e a mensagem que já vai
// pronta, num balão; embaixo, as 3 lojas com o endereço completo e "Como
// chegar" (antes eram só chips) e o horário da semana com o dia de hoje
// marcado. O telefone fixo segue fora (pedido do usuário); ele fica na
// página das lojas.
import Link from "next/link";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { HORARIOS, useEstadoLoja, type EstadoLoja } from "./HorarioAtendimento";
import { IconeLoja } from "./IconesVantagens";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";

// A mensagem que já vai pronta no WhatsApp: a pessoa só aperta enviar
// A semana, no índice do getDay() (0 = domingo)
const DIAS_SEMANA = [
  { curto: "D", nome: "Domingo" },
  { curto: "S", nome: "Segunda" },
  { curto: "T", nome: "Terça" },
  { curto: "Q", nome: "Quarta" },
  { curto: "Q", nome: "Quinta" },
  { curto: "S", nome: "Sexta" },
  { curto: "S", nome: "Sábado" },
];

const MENSAGEM_WHATSAPP = "Olá, Viver Bem! Vim pelo site e queria tirar uma dúvida.";
const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM_WHATSAPP)}`;

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

// Seta de navegação (como chegar)
function IconeRota() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 4.5 20.5l7.5-3.6 7.5 3.6L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconeRelogio() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

// A folha de receita em vidro, ilustração do cartão da receita (só decoração)
function FolhaReceita() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none hidden md:flex absolute right-8 lg:right-12 -bottom-10 w-40 h-52 rotate-6 flex-col gap-3 rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur-sm p-5 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3"
    >
      <span className="h-2.5 w-12 rounded-full bg-[image:var(--ouro-degrade)]" />
      <span className="mt-2 h-1.5 w-full rounded-full bg-white/30" />
      <span className="h-1.5 w-[85%] rounded-full bg-white/30" />
      <span className="h-1.5 w-[70%] rounded-full bg-white/30" />
      <span className="mt-2 h-1.5 w-[55%] rounded-full bg-white/20" />
    </span>
  );
}

// "Aberto agora · Fecha às 19h", ao vivo (null no servidor: sem horário
// congelado no HTML)
function SeloAberto({ estado }: { estado: EstadoLoja }) {
  if (!estado) {
    return (
      <p className="inline-flex items-center h-11 rounded-full bg-white ring-1 ring-fio px-4 text-sm text-cinza shadow-sm">
        Horário de atendimento
      </p>
    );
  }
  return (
    <p role="status" className="inline-flex items-center gap-2.5 h-11 rounded-full bg-white ring-1 ring-fio pl-3.5 pr-4 text-sm shadow-sm">
      <span aria-hidden="true" className="relative flex w-2.5 h-2.5">
        {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/50 motion-safe:animate-ping" />}
        <span className={`relative w-2.5 h-2.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/60"}`} />
      </span>
      <span className={`font-semibold ${estado.aberto ? "text-green-700" : "text-navy"}`}>
        {estado.aberto ? "Aberto agora" : "Fechado agora"}
      </span>
      <span className="text-cinza">· {estado.detalhe}</span>
    </p>
  );
}

// Cartão branco da grade (WhatsApp, lojas): mesma elevação e o mesmo hover
const classeCartao =
  "group h-full w-full flex flex-col text-left rounded-[1.75rem] border border-fio bg-white shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)] transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)] active:scale-[0.99]";

export function FaleComAGente() {
  const estado = useEstadoLoja();
  // A linha de horário de hoje e o detalhe ("fecha às 19h") em minúscula
  const linhaHoje = estado ? HORARIOS.find((l) => l.dias.includes(estado.dia)) : undefined;
  const detalheHoje = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  return (
    <section aria-labelledby="fale-com-a-gente" className="relative bg-white border-t border-fio">
      <div className="max-w-7xl mx-auto px-5 md:px-8 secao pb-16 md:pb-24">
        {/* ---------- Cabeçalho: título em duas vozes e o selo ao vivo ---------- */}
        <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 lg:items-end">
          <div className="lg:col-span-8">
            <p className="rotulo-pilula">fale com a gente</p>
            <h2 id="fale-com-a-gente" className="titulo-secao vao-rotulo">
              WhatsApp, receita <span className="italic">ou na loja</span>
            </h2>
            <p className="texto-apoio mt-4 max-w-xl">
              Tire uma dúvida, envie a sua receita ou combine a retirada. A gente responde
              pelo WhatsApp no horário de atendimento.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end lg:pb-1.5">
            <SeloAberto estado={estado} />
          </div>
        </div>

        {/* ---------- A grade: receita, WhatsApp, as 3 lojas e o horário ---------- */}
        <div className="escalonado mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
          {/* A receita: a ação principal, em azul-noite */}
          <BotaoEnviarReceita
            comIcone={false}
            className="group relative sm:col-span-2 lg:col-span-7 w-full min-h-[18rem] flex flex-col text-left rounded-[2rem] banner-noite em-noite text-white ring-1 ring-inset ring-white/10 p-6 md:p-8 overflow-hidden shadow-[0_24px_50px_-30px_rgba(13,35,64,0.6)] transition duration-300 hover:-translate-y-1 active:scale-[0.99]"
          >
            <span aria-hidden="true" className="malha-banner" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(192,160,96,0.3),transparent_62%)]"
            />
            <FolhaReceita />
            <span className="relative w-14 h-14 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
              <IconeReceita tamanho={26} />
            </span>
            <span className="relative mt-auto pt-8 block max-w-[26rem]">
              <span className="rotulo block">receita</span>
              <span className="titulo-banner block mt-2 text-[1.6rem] md:text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
                Enviar a foto <span className="italic">da receita</span>
              </span>
              <span className="block mt-3 text-white/70 text-[0.95rem] leading-snug">
                Abre o seu pedido com um código. A foto vai pela conversa do WhatsApp; o
                farmacêutico confere e passa o valor.
              </span>
            </span>
            <span className="relative mt-6 self-start inline-flex items-center gap-2.5 h-12 pl-5 pr-1.5 rounded-full bg-white text-navy text-[0.95rem] font-semibold transition-colors group-hover:bg-gelo">
              Começar
              <span className="w-9 h-9 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <SetaDireita tamanho={15} />
              </span>
            </span>
          </BotaoEnviarReceita>

          {/* WhatsApp: o número grande e a mensagem que já vai pronta */}
          <a
            href={LINK_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className={`${classeCartao} sm:col-span-2 lg:col-span-5 p-6 md:p-7`}
          >
            <span className="flex items-center justify-between gap-4">
              <span className="w-12 h-12 rounded-full flex items-center justify-center bg-[#25D366]/12 text-[#1DA851]">
                <IconeWhatsApp />
              </span>
              <span className="rotulo">WhatsApp</span>
            </span>
            <span className="mt-5 block text-[1.5rem] md:text-[1.7rem] font-semibold text-navy tracking-[-0.03em] tabular-nums leading-none">
              {WHATSAPP_LOJA}
            </span>
            <span className="mt-2 block text-sm text-cinza leading-snug">
              Dúvidas, pedidos e retirada, no horário de atendimento
            </span>
            {/* O balão com a mensagem pronta */}
            <span className="mt-5 self-start max-w-[30ch] rounded-2xl rounded-bl-md bg-gelo px-4 py-3 text-[0.92rem] text-grafite leading-snug">
              {MENSAGEM_WHATSAPP}
            </span>
            <span className="mt-2 block text-xs text-cinza">A mensagem já vai pronta. É só enviar.</span>
            <span className="mt-auto pt-6 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-navy">Chamar no WhatsApp</span>
              <SetaOuro />
            </span>
          </a>

          {/* As 3 lojas, com endereço e o mapa. No celular cada loja é uma
              linha (ícone, bairro e endereço, seta); do sm em diante, cartão */}
          {UNIDADES.map((u) => (
            <a
              key={u.bairro}
              href={linkMapaUnidade(u.bairro, u.endereco)}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full w-full flex flex-row items-center gap-4 sm:flex-col sm:items-stretch sm:gap-0 lg:col-span-3 text-left rounded-[1.75rem] border border-fio bg-white p-4 sm:p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)] transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)] active:scale-[0.99]"
            >
              <span className="flex items-center justify-between gap-3 shrink-0">
                <span className="w-11 h-11 rounded-full flex items-center justify-center bg-ouro/10 text-ouro-escuro">
                  <IconeLoja tamanho={20} />
                </span>
                <span className="hidden sm:inline rotulo !text-cinza text-[0.68rem]">loja</span>
              </span>
              <span className="flex-1 min-w-0 sm:mt-4">
                <span className="block text-[1.1rem] sm:text-[1.2rem] font-semibold text-navy tracking-[-0.02em] leading-tight">{u.bairro}</span>
                <span className="mt-0.5 sm:mt-1 block text-sm text-cinza leading-snug">{u.endereco}</span>
              </span>
              <span className="shrink-0 flex items-center justify-between gap-3 sm:mt-auto sm:pt-5">
                <span className="hidden sm:inline text-sm font-semibold text-navy">Como chegar</span>
                <span className="w-10 h-10 rounded-full bg-gelo text-navy flex items-center justify-center transition duration-300 group-hover:bg-[image:var(--ouro-degrade)] group-hover:translate-x-1">
                  <IconeRota />
                </span>
              </span>
            </a>
          ))}

          {/* O horário: hoje em destaque, a semana em sete dias e as linhas
              (07/10/2026, "modernize a parte de horários") */}
          <div className="lg:col-span-3 h-full flex flex-col rounded-[1.75rem] border border-fio bg-gradient-to-b from-white to-gelo/70 p-5 md:p-6">
            <span className="flex items-center justify-between gap-3">
              <span className="w-11 h-11 rounded-full flex items-center justify-center bg-gelo text-tinta">
                <IconeRelogio />
              </span>
              <span className="rotulo !text-cinza text-[0.68rem]">horário</span>
            </span>
            <span className="mt-4 block text-[1.6rem] font-semibold text-navy tracking-[-0.03em] leading-none tabular-nums">
              {linhaHoje ? linhaHoje.horas : HORARIOS[0].horas}
            </span>
            <span className="mt-1.5 block text-sm text-cinza">{estado ? `Hoje · ${detalheHoje}` : HORARIOS[0].rotulo}</span>

            {/* A semana: hoje em navy, dias fechados apagados */}
            <ul className="mt-4 grid grid-cols-7 gap-1" aria-label="Dias da semana">
              {DIAS_SEMANA.map((d, i) => {
                const linha = HORARIOS.find((l) => l.dias.includes(i));
                const fechado = !linha || linha.horas === "Fechado";
                const hoje = estado?.dia === i;
                return (
                  <li
                    key={d.nome}
                    title={`${d.nome}: ${linha?.horas ?? "Fechado"}`}
                    className={`h-9 rounded-xl flex items-center justify-center text-[0.72rem] font-semibold ${
                      hoje ? "bg-navy text-white" : fechado ? "bg-gelo/70 text-cinza/60" : "bg-white ring-1 ring-fio text-navy"
                    }`}
                  >
                    <span aria-hidden="true">{d.curto}</span>
                    <span className="sr-only">{d.nome}</span>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-4 text-[0.82rem] lista-fichas">
              {HORARIOS.map((linha) => {
                const hoje = estado ? linha.dias.includes(estado.dia) : false;
                return (
                  <li key={linha.rotulo} className={`flex items-center justify-between gap-3 py-2 ${hoje ? "text-navy font-semibold" : "text-cinza"}`}>
                    <span>{linha.rotulo}</span>
                    <span className="tabular-nums">{linha.horas}</span>
                  </li>
                );
              })}
            </ul>
            <Link href="/lojas" className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-tinta hover:underline underline-offset-4 self-start">
              Página das lojas
              <SetaDireita tamanho={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
