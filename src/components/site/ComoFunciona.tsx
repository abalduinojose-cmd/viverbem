// "Como funciona": a trilha do pedido pela receita, da foto da prescrição
// até a retirada ou a entrega, em quatro passos. Aparece na home e na
// página A Viver Bem.
//
// Quarta versão (07/10/2026, "modernize a seção, deixe clean"): os quatro
// passos deixaram de ser quatro cartões pendurados num fio e viraram UM
// cartão branco dividido por fios finos, um passo por coluna no
// computador (duas por linha no tablet, empilhados no celular). Cada passo
// abre com o número grande em ouro itálico (a mesma voz dos números da
// página A Viver Bem) e o ícone pequeno; a linha de ouro que cresce com a
// rolagem passou para a borda de cima do cartão (scroll-driven, roda também
// com "reduzir movimento"). Fecha com o convite da receita em azul-noite.
// (O painel inteiro em azul-noite tinha sido reprovado antes, "tire o azul
// forte do fundo": o azul segue só no convite.)
//
// Esta seção já tinha absorvido as duas que contavam o mesmo processo
// ("Cada pessoa tem sua fórmula" virou o passo 03 e o aviso legal;
// "Receba em casa ou retire na loja" virou o passo 04, com as 3 lojas em
// chips). O processo é contado uma vez.
//
// Texto de processo, não de resultado: manipulado não pode ter promessa
// de efeito (RDC 67/2007 e RDC 96/2008). Antes de mexer no texto, confirme
// com o farmacêutico responsável.
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { IconeLoja } from "./IconesVantagens";
import { IconeMoto } from "./IconeMoto";
import { IconeWhatsApp } from "./icones";

// Prancheta com o visto: o farmacêutico confere
function IconeConfere() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5H7.5A1.5 1.5 0 0 0 6 6.5v13A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 5H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M9 5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1H9V5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 14l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Frasco de laboratório: o preparo
function IconeFrasco() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M10 3v6.5L4.6 19a1.5 1.5 0 0 0 1.3 2.2h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.2 16h9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const PASSOS = [
  {
    titulo: "Envie a receita",
    texto: "Mande a foto da prescrição pelo WhatsApp, ou traga na loja.",
    detalhe: "Pelo site, o pedido já chega com o seu código.",
    icone: <IconeReceita tamanho={20} />,
  },
  {
    titulo: "O farmacêutico confere",
    texto: "Ele avalia a receita e passa o valor e o prazo de preparo.",
    detalhe: "Você só confirma se estiver de acordo.",
    icone: <IconeConfere />,
  },
  {
    titulo: "Preparo",
    texto:
      "A fórmula é preparada no laboratório, a partir da receita, depois do pedido. Nada fica pronto na prateleira.",
    detalhe: "O rótulo sai com o seu nome, a composição e a validade.",
    icone: <IconeFrasco />,
  },
  {
    titulo: "Retire ou receba",
    texto: `Sem taxa, numa das ${UNIDADES.length} lojas, ou em casa, de moto, por toda Petrópolis.`,
    detalhe: "A taxa e o prazo da entrega são combinados pelo WhatsApp antes de sair.",
    icone: <IconeMoto tamanho={20} />,
    lojas: true,
  },
];

// Os fios entre os passos: um passo por linha no celular, 2x2 no tablet e
// quatro colunas no computador
function fiosDoPasso(i: number) {
  const celular = i > 0 ? "border-t border-fio" : "";
  const tablet = `${i % 2 === 1 ? "md:border-l" : "md:border-l-0"} ${i >= 2 ? "md:border-t" : "md:border-t-0"}`;
  const computador = `lg:border-t-0 ${i > 0 ? "lg:border-l" : "lg:border-l-0"}`;
  return `${celular} ${tablet} ${computador}`;
}

export function ComoFunciona({ className = "secao" }: { className?: string }) {
  return (
    <section
      id="como-funciona"
      aria-labelledby="titulo-como-funciona"
      className={`max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)] ${className}`}
    >
      {/* ---------- Cabeçalho: título em duas vozes e o apoio ao lado ---------- */}
      <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
        <div className="lg:col-span-7">
          <p className="rotulo-pilula">como funciona</p>
          <h2 id="titulo-como-funciona" className="titulo-secao vao-rotulo">
            Da receita <span className="italic">até a sua mão</span>
          </h2>
        </div>
        <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5">
          Quatro passos, do envio da prescrição à retirada ou entrega. Cada fórmula é
          preparada depois do pedido, conforme a receita.
        </p>
      </div>

      {/* ---------- Os quatro passos num só cartão ---------- */}
      <div className="revelar vao-titulo relative overflow-hidden rounded-[2rem] border border-fio bg-white shadow-[0_28px_60px_-44px_rgba(16,42,74,0.4)]">
        {/* A linha de ouro na borda de cima, que cresce com a rolagem */}
        <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[3px] bg-fio" />
        <span aria-hidden="true" className="trilha-topo" />

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className={`relative flex flex-col p-5 sm:p-6 md:p-7 border-fio ${fiosDoPasso(i)}`}>
              {/* O número em ouro itálico e o ícone do passo */}
              <div className="flex items-start justify-between gap-3">
                <span aria-hidden="true" className="numero-tinta text-[2.4rem] md:text-[2.75rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 w-10 h-10 rounded-full bg-ouro/10 text-ouro-escuro flex items-center justify-center">
                  {p.icone}
                </span>
              </div>
              <h3 className="mt-4 text-[1.15rem] md:text-[1.2rem] font-semibold tracking-[-0.03em] text-navy leading-snug">
                <span className="sr-only">Passo {i + 1}: </span>
                {p.titulo}
              </h3>
              <p className="mt-2 text-grafite text-[0.95rem] leading-relaxed">{p.texto}</p>
              <p className="mt-1.5 text-cinza text-sm leading-relaxed">{p.detalhe}</p>

              {/* Passo 04: as lojas, em chips com o mapa */}
              {p.lojas && (
                <ul className="flex flex-wrap gap-2 mt-auto pt-4">
                  {UNIDADES.map((u) => (
                    <li key={u.bairro}>
                      <a
                        href={linkMapaUnidade(u.bairro, u.endereco)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip !min-h-10 !px-3.5 text-sm"
                        title={u.endereco}
                      >
                        <span className="mr-1.5 -ml-0.5 text-ouro">
                          <IconeLoja tamanho={14} />
                        </span>
                        {u.bairro}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- O convite: receita em mãos ---------- */}
      <div className="revelar mt-5 md:mt-6 relative overflow-hidden rounded-[2rem] banner-noite em-noite text-white ring-1 ring-inset ring-white/10 p-5 sm:p-6 md:p-8 lg:px-10 lg:py-9 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
        <span aria-hidden="true" className="malha-banner" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(192,160,96,0.3),transparent_62%)]"
        />
        <div className="relative flex items-start gap-4 md:gap-5 flex-1 min-w-0">
          <span className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
            <IconeReceita tamanho={24} />
          </span>
          <div className="min-w-0">
            <p className="rotulo">receita em mãos?</p>
            <p className="titulo-banner mt-1.5 text-[1.45rem] md:text-[1.8rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
              Envie a foto agora <span className="italic">e o farmacêutico confere.</span>
            </p>
            <p className="hidden sm:block mt-2 text-white/70 text-[0.95rem] leading-snug max-w-[46ch]">
              O pedido abre com o seu código e a foto vai pela conversa do WhatsApp. O valor
              e o prazo chegam por lá.
            </p>
          </div>
        </div>
        <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
          <BotaoEnviarReceita
            comIcone={false}
            className="botao bg-white text-navy hover:bg-gelo !pl-2 !pr-6 !gap-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
          >
            <span className="w-10 h-10 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
              <IconeReceita tamanho={20} />
            </span>
            Enviar receita
          </BotaoEnviarReceita>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botao border border-white/20 text-white transition-colors hover:bg-white/10 !gap-2.5"
          >
            <IconeWhatsApp tamanho={18} className="text-[#25D366]" />
            Tirar uma dúvida antes
          </a>
        </div>
      </div>

      {/* Aviso legal, discreto mas presente */}
      <p className="revelar mt-4 text-xs leading-relaxed text-cinza max-w-3xl">
        {WHATSAPP_LOJA} · Medicamentos manipulados são preparados somente mediante prescrição
        de profissional habilitado, dentro da validade. A sua receita e os seus dados ficam
        apenas com a nossa equipe.
      </p>
    </section>
  );
}
