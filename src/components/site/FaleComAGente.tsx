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
import { usePathname } from "next/navigation";
import { CartaoReceita } from "./CartaoReceita";
import { CartaoWhatsApp } from "./CartaoWhatsApp";
import { HORARIOS, useEstadoLoja, type EstadoLoja } from "./HorarioAtendimento";
import { IconeWhatsApp, SetaDireita } from "./icones";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";
import { UNIDADES, WHATSAPP_NUMERO } from "@/lib/tipos";

// (A lista da semana, DIAS_SEMANA, saiu com o cartão do horário em 25/10/2026;
// a semana em círculos segue em HorarioAtendimento, nas páginas de lojas e contato)

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

// 21/10/2026: nas páginas de lojas e de contato o bloco não aparece (elas
// já mostram as lojas, o WhatsApp e o horário; repetir tudo no pé era o
// que deixava as duas páginas carregadas)
// 21/10/2026: também não aparece na página do produto ("tire a localização
// e horários, deixe com menos coisas")
const ROTAS_SEM_O_BLOCO = ["/lojas", "/contato"];
const PREFIXOS_SEM_O_BLOCO = ["/produto/"];

export function FaleComAGente() {
  const estado = useEstadoLoja();
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;
  // A linha de horário de hoje e o detalhe ("fecha às 19h") em minúscula
  const linhaHoje = estado ? HORARIOS.find((l) => l.dias.includes(estado.dia)) : undefined;
  const detalheHoje = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  // 25/10/2026 ("as páginas estão muito longas; passa o WhatsApp, passa
  // endereço, horário, em todas as páginas"): o bloco inteiro, com as lojas
  // e o horário, ficou só nas páginas de Lojas e Contato (que já o têm no
  // próprio corpo). Na HOME ficam a receita e o WhatsApp, com uma linha para
  // as lojas e o horário. Nas OUTRAS páginas vira uma FAIXA de uma linha:
  // título, estado da loja e os três botões. Nada saiu do site: lojas e
  // horário completos continuam em /lojas e /contato.
  if (rota !== "/") return <FaixaFaleComAGente estado={estado} />;

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

          {/* 25/10/2026: as lojas e o horário saíram daqui (estão em /lojas e
              /contato); fica uma linha que leva para lá */}
          <Link
            href="/lojas"
            className="group sm:col-span-2 lg:col-span-12 flex flex-col gap-3 rounded-[1.5rem] bg-gelo/70 ring-1 ring-fio px-5 py-4 md:px-6 md:py-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:ring-ouro/50"
          >
            <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span className="text-[0.95rem] font-semibold text-navy">
                {UNIDADES.length} lojas em Petrópolis: {UNIDADES.map((u) => u.bairro).join(", ")}
              </span>
              <span className="text-sm text-cinza">
                {estado ? `${estado.aberto ? "Aberto agora" : "Fechado agora"}, ${detalheHoje}` : `Hoje, ${linhaHoje?.horas ?? HORARIOS[0].horas}`}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-tinta">
              Endereços, horários e como chegar
              <SetaDireita tamanho={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// A faixa de uma linha (25/10/2026): o mesmo convite, sem cartões
function FaixaFaleComAGente({ estado }: { estado: EstadoLoja }) {
  const detalhe = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";
  return (
    <section aria-labelledby="fale-com-a-gente" className="relative bg-white border-t border-fio">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-9 md:py-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="revelar">
          <p className="rotulo-pilula">fale com a gente</p>
          <h2 id="fale-com-a-gente" className="mt-3 text-[1.45rem] md:text-[1.8rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
            Pelo WhatsApp, pela receita{" "}
            <span className="italic font-[family-name:var(--font-destaque)] font-normal text-ouro-escuro">ou na loja</span>
          </h2>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-cinza">
            {estado ? (
              <span role="status" className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className={`size-2 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                <span>
                  <span className={`font-semibold ${estado.aberto ? "text-green-700" : "text-navy"}`}>{estado.aberto ? "Aberto agora" : "Fechado agora"}</span>, {detalhe}
                </span>
              </span>
            ) : (
              <span>Horário de atendimento</span>
            )}
            <span aria-hidden="true" className="size-1 rounded-full bg-ouro" />
            <span>{UNIDADES.length} lojas em Petrópolis</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 lg:shrink-0">
          <BotaoEnviarReceita className="botao botao-principal !min-h-12" />
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botao !min-h-12 bg-[#1DA851] text-white hover:bg-[#178a43]"
          >
            <IconeWhatsApp tamanho={19} />
            WhatsApp
          </a>
          <Link href="/lojas" className="botao botao-secundario !min-h-12">
            Lojas e horários
            <SetaDireita tamanho={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
