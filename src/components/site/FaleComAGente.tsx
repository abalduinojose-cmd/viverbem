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
import { CartaoLojas } from "./CartaoLojas";
import { CartaoWhatsApp } from "./CartaoWhatsApp";
import { GRADE, HORARIOS, useEstadoLoja, type EstadoLoja } from "./HorarioAtendimento";
import { SetaDireita } from "./icones";

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

          {/* WhatsApp: o número grande e a conversa que já vai pronta
              (14/10/2026, ver CartaoWhatsApp) */}
          <CartaoWhatsApp estado={estado} className="sm:col-span-2 lg:col-span-5" />

          {/* As 3 lojas (14/10/2026, ver CartaoLojas): o mapa desenhado com o
              trajeto e os pinos, e a lista com "Como chegar". Sem o telefone
              fixo aqui (pedido): ele fica na página das lojas. */}
          <CartaoLojas className="sm:col-span-2 lg:col-span-9" />

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
