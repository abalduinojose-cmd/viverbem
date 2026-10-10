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
//
// 08/10/2026 ("modernize a seção fale com a gente"): os ícones em círculo
// no alto dos cartões viraram o rótulo em pílula do site; o WhatsApp ganhou
// o botão verde dele, no lugar da seta no círculo de ouro; a semana do
// horário ficou mais leve (só hoje em ouro, os outros dias sem contorno).
//
// 10/10/2026 ("melhore essa seção, modernize ela", com o print do cartão
// do WhatsApp): o cartão do WhatsApp mostra a conversa como ela é, com a
// mensagem pronta num balão verde de "enviada" e o estado ao vivo (online
// agora / responde no horário) ao lado do rótulo; as lojas trocaram o
// número em ouro por um pino num quadrado gelo; os textos ficaram curtos e
// diretos ("escrita leve, que converse com todos os públicos").
import Link from "next/link";
import { CartaoReceita } from "./CartaoReceita";
import { GRADE, HORARIOS, useEstadoLoja, type EstadoLoja } from "./HorarioAtendimento";
import { IconeWhatsApp, SetaDireita } from "./icones";
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

const MENSAGEM_WHATSAPP = "Olá! Vim pelo site e gostaria de tirar uma dúvida.";
const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM_WHATSAPP)}`;

// Pino do mapa (as lojas)
function IconePino() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
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

// (A régua do dia, das 7h às 21h, saiu em 10/10/2026: "modernize o cartão
// do horário". O estado ao vivo, a hora de hoje grande, a semana e as
// linhas já dizem tudo; a régua só pesava.)

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
      <div className="max-w-7xl mx-auto px-5 md:px-8 secao pb-12 md:pb-16">
        {/* ---------- Cabeçalho: título em duas vozes e o selo ao vivo ---------- */}
        <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 lg:items-end">
          <div className="lg:col-span-8">
            <p className="rotulo-pilula">fale com a gente</p>
            <h2 id="fale-com-a-gente" className="titulo-secao vao-rotulo">
              Pelo WhatsApp, pela receita <span className="italic">ou na loja</span>
            </h2>
            <p className="texto-apoio mt-4 max-w-xl">
              Tire dúvidas, envie a receita ou combine a retirada. Respondemos pelo WhatsApp
              no horário de atendimento.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end lg:pb-1.5">
            <SeloAberto estado={estado} />
          </div>
        </div>

        {/* ---------- A grade: receita, WhatsApp, as 3 lojas e o horário ---------- */}
        <div className="escalonado mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
          {/* A receita: a ação principal, em azul-noite, animada (10/10/2026,
              ver CartaoReceita) */}
          <CartaoReceita />

          {/* WhatsApp: o número grande e a mensagem que já vai pronta */}
          <a
            href={LINK_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className={`${classeCartao} sm:col-span-2 lg:col-span-5 p-6 md:p-7`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="rotulo-pilula">whatsapp</span>
              {estado && (
                <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold">
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                  <span className={estado.aberto ? "text-green-700" : "text-cinza"}>
                    {estado.aberto ? "Online agora" : "Responde no horário"}
                  </span>
                </span>
              )}
            </span>
            <span className="mt-5 block text-[1.6rem] md:text-[1.8rem] font-semibold text-navy tracking-[-0.03em] tabular-nums leading-none">
              {WHATSAPP_LOJA}
            </span>
            <span className="mt-2 block text-sm text-cinza leading-snug">Dúvidas, pedidos e retirada.</span>
            {/* A conversa como ela é: a mensagem pronta num balão de "enviada" */}
            <span className="mt-5 block rounded-2xl bg-gelo/70 p-3">
              <span className="flex items-center gap-2 text-[0.7rem] font-medium text-cinza">
                <span className="flex size-5 items-center justify-center rounded-full bg-white text-[#25D366] ring-1 ring-fio">
                  <IconeWhatsApp tamanho={11} />
                </span>
                Viver Bem · mensagem pronta
              </span>
              <span className="mt-2 ml-auto block w-fit max-w-[28ch] rounded-2xl rounded-br-md bg-[#dcf8c6] px-3.5 py-2.5 text-[0.9rem] text-grafite leading-snug shadow-sm">
                {MENSAGEM_WHATSAPP}
              </span>
            </span>
            <span className="mt-2 block text-xs text-cinza">Basta enviar.</span>
            <span className="mt-auto pt-6 block">
              <span className="inline-flex items-center gap-2.5 h-12 px-5 rounded-full bg-[#1DA851] text-white text-[0.95rem] font-semibold shadow-[0_14px_28px_-16px_rgba(29,168,81,0.8)] transition-colors group-hover:bg-[#178a43]">
                <IconeWhatsApp tamanho={18} />
                Chamar no WhatsApp
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <SetaDireita tamanho={15} />
                </span>
              </span>
            </span>
          </a>

          {/* As 3 lojas num só cartão (07/10/2026, "modernize as localidades"):
              número em ouro itálico, bairro e endereço, e a seta do mapa que
              vira ouro no hover. Sem o telefone fixo aqui (pedido): ele fica
              na página das lojas. */}
          <div className="sm:col-span-2 lg:col-span-9 h-full flex flex-col rounded-[1.75rem] border border-fio bg-white p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
            <span className="rotulo-pilula">{UNIDADES.length} lojas em Petrópolis</span>
            <ul className="mt-3 lista-fichas">
              {UNIDADES.map((u) => (
                <li key={u.bairro}>
                  <a
                    href={linkMapaUnidade(u.bairro, u.endereco)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 py-4"
                  >
                    <span aria-hidden="true" className="shrink-0 flex size-11 items-center justify-center rounded-2xl bg-gelo text-tinta transition-colors group-hover:bg-tinta group-hover:text-white">
                      <IconePino />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.05rem] md:text-[1.15rem] font-semibold text-navy tracking-[-0.02em] leading-tight transition-colors group-hover:text-tinta">
                        {u.bairro}
                      </span>
                      <span className="mt-0.5 block text-sm text-cinza leading-snug">{u.endereco}</span>
                    </span>
                    <span className="shrink-0 flex items-center gap-3">
                      <span className="hidden sm:inline text-sm font-semibold text-navy">Como chegar</span>
                      <span className="w-10 h-10 rounded-full border border-fio text-navy flex items-center justify-center transition duration-300 group-hover:border-transparent group-hover:bg-[image:var(--ouro-degrade)] group-hover:translate-x-1">
                        <IconeRota />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-xs text-cinza leading-relaxed">
              Retirada grátis em qualquer loja. Entrega de moto em toda Petrópolis.
            </p>
          </div>

          {/* O horário (07/10/2026, "modernize"): o estado ao vivo no alto, o
              horário de hoje grande, a régua do dia com a hora de agora, a
              semana em sete círculos (hoje em ouro) e as linhas */}
          <div className="sm:col-span-2 lg:col-span-3 h-full flex flex-col rounded-[1.75rem] border border-fio bg-white p-5 md:p-6 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]">
            <span className="flex items-center justify-between gap-3">
              <span className="rotulo-pilula">horário</span>
              {estado ? (
                <span role="status" className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
                  <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                  <span className={estado.aberto ? "text-green-700" : "text-cinza"}>{estado.aberto ? "Aberto" : "Fechado"}</span>
                </span>
              ) : null}
            </span>
            <span className="mt-4 block text-[1.7rem] font-semibold text-navy tracking-[-0.03em] leading-none tabular-nums">
              {linhaHoje ? linhaHoje.horas : HORARIOS[0].horas}
            </span>
            <span className="mt-1.5 block text-sm text-cinza">
              {estado ? `Hoje, ${GRADE[estado.dia].curto} · ${detalheHoje}` : HORARIOS[0].rotulo}
            </span>

            {/* A semana: hoje em ouro, dias fechados apagados */}
            <ul className="mt-6 grid grid-cols-7 gap-1" aria-label="Dias da semana">
              {DIAS_SEMANA.map((d, i) => {
                const linha = HORARIOS.find((l) => l.dias.includes(i));
                const fechado = !linha || linha.horas === "Fechado";
                const hoje = estado?.dia === i;
                return (
                  <li
                    key={d.nome}
                    title={`${d.nome}: ${linha?.horas ?? "Fechado"}`}
                    className={`aspect-square rounded-full flex items-center justify-center text-[0.72rem] font-semibold ${
                      hoje
                        ? "bg-[image:var(--ouro-degrade)] text-navy"
                        : fechado
                          ? "text-cinza/40"
                          : "bg-gelo/70 text-navy"
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
                    <span className="flex items-center gap-2">
                      {hoje && <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />}
                      {linha.rotulo}
                    </span>
                    <span className="tabular-nums">{linha.horas}</span>
                  </li>
                );
              })}
            </ul>
            <Link href="/lojas" className="botao-link !min-h-11 !text-sm mt-auto pt-2 self-start">
              Página das lojas
              <SetaDireita tamanho={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
