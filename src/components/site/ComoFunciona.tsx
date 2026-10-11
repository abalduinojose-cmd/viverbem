// "Como funciona": a trilha do pedido pela receita, da foto da prescrição
// até a retirada ou a entrega, em quatro passos. Aparece na home, na
// página A Viver Bem e na página /como-funciona (sem o cabeçalho).
//
// Sétima versão (11/10/2026, pedido: "deixe mais moderno, tá muito
// amador"): um STEPPER de verdade. No computador, uma linha de ouro
// atravessa os quatro passos e cresce quando a fileira entra na tela
// (scroll-driven, roda também com "reduzir movimento"); sobre a linha,
// quatro nós brancos com o ícone e um fio de ouro; embaixo de cada nó, o
// "passo 01" pequeno em ouro, o título, o texto e o detalhe, sem caixas.
// Até o tablet, os passos são cartões que arrastam para o lado (pedido de
// 10/10/2026), cada um com o nó do ícone, o número em marca d'água e a
// barra de ouro embaixo acompanhando a faixa. Depois dos passos, o convite
// da receita em azul-noite, largo: título em duas vozes, apoio, os botões
// da dobra (botao-vivo e botao-vidro) e a linha de confiança.
//
// Versões anteriores: 10/10 lista num cartão com o convite preso ao lado
// (sexta); 08/10 quatro cartões com traço e faixa (quinta); 07/10 um cartão
// dividido por fios (quarta). Esta seção absorveu as duas que contavam o
// mesmo processo: o processo é contado uma vez.
//
// Texto de processo, não de resultado: manipulado não pode ter promessa
// de efeito (RDC 67/2007 e RDC 96/2008). Antes de mexer no texto, confirme
// com o farmacêutico responsável.
import { UNIDADES, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { IconeLoja } from "./IconesVantagens";
import { IconeMoto } from "./IconeMoto";
import { IconeWhatsApp } from "./icones";

// Prancheta com o visto: o farmacêutico confere
function IconeConfere() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M10 3v6.5L4.6 19a1.5 1.5 0 0 0 1.3 2.2h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.2 16h9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

// Escudo com o visto: só com receita válida
function IconeEscudo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 5.8v5.4c0 4.4 3 8.3 7 9.8 4-1.5 7-5.4 7-9.8V5.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9.3 12 1.9 1.9 3.6-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Cadeado: a receita e os dados ficam com a equipe
function IconeCadeado() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const PASSOS = [
  {
    titulo: "Envie a receita",
    texto: "Envie a foto pelo WhatsApp ou traga a receita na loja.",
    detalhe: "Pelo site, o pedido já vai com o seu código.",
    icone: <IconeReceita tamanho={22} />,
  },
  {
    titulo: "O farmacêutico confere",
    texto: "Ele confere a receita e informa o valor e o prazo.",
    detalhe: "Você confirma só se estiver de acordo.",
    icone: <IconeConfere />,
  },
  {
    titulo: "Preparo",
    texto: "A fórmula é preparada no laboratório depois do pedido. Nada fica pronto na prateleira.",
    detalhe: "O rótulo sai com o seu nome, a fórmula e a validade.",
    icone: <IconeFrasco />,
  },
  {
    titulo: "Retire ou receba",
    texto: `Sem custo em uma das ${UNIDADES.length} lojas, ou em casa, pelo Delivery, em Petrópolis e Região.`,
    detalhe: "A taxa e o prazo da entrega são combinados pelo WhatsApp.",
    icone: <IconeMoto tamanho={22} />,
    lojas: true,
  },
];

// A linha de confiança, no convite: o aviso legal em dois pontos curtos
const CONFIANCA = [
  { icone: <IconeEscudo />, texto: "Manipulação com receita válida." },
  { icone: <IconeCadeado />, texto: "Sua receita e seus dados ficam só com a nossa equipe." },
];

/** O nó do passo: um círculo branco com o ícone e um fio de ouro */
function No({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative z-[1] flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-tinta ring-1 ring-ouro/50 shadow-[0_14px_30px_-16px_rgba(16,42,74,0.45),0_0_0_6px_rgba(201,165,107,0.1)]">
      {children}
    </span>
  );
}

export function ComoFunciona({
  className = "secao",
  cabecalho = true,
}: {
  className?: string;
  /** Falso na página /como-funciona, que já tem o próprio título */
  cabecalho?: boolean;
}) {
  return (
    <section
      id="como-funciona"
      aria-labelledby={cabecalho ? "titulo-como-funciona" : undefined}
      aria-label={cabecalho ? undefined : "Os quatro passos"}
      className={`max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)] ${className}`}
    >
      {/* ---------- Cabeçalho: rótulo, título em duas vozes e o apoio ---------- */}
      {cabecalho && (
        <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">como funciona</p>
            <h2 id="titulo-como-funciona" className="titulo-secao vao-rotulo">
              Do envio da receita <span className="italic">à entrega</span>
            </h2>
          </div>
          <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5 lg:text-right">
            Quatro passos, pelo WhatsApp e com o farmacêutico. Cada fórmula é preparada depois
            do pedido, conforme a receita.
          </p>
        </div>
      )}

      {/* ---------- Os quatro passos: stepper no computador, faixa até o tablet ---------- */}
      <div className={`passos-escopo ${cabecalho ? "vao-titulo" : ""}`}>
        <ol className="passos-faixa relative flex gap-4 overflow-x-auto rolagem-sem-barra snap-x snap-mandatory scroll-pl-5 -mx-5 px-5 pb-1 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:mx-0 lg:px-0 lg:pb-0">
          {/* A linha de ouro que atravessa os nós (só no computador): cresce
              quando a fileira entra na tela */}
          {/* Do centro do primeiro nó ao centro do último: meia coluna de cada
              lado (as colunas têm 2rem de vão entre si) */}
          <span aria-hidden="true" className="hidden lg:block absolute left-[calc((100%-6rem)/8)] right-[calc((100%-6rem)/8)] top-7 h-px bg-fio" />
          <span aria-hidden="true" className="traco-liga hidden lg:block absolute left-[calc((100%-6rem)/8)] right-[calc((100%-6rem)/8)] top-7 h-px" />

          {PASSOS.map((p, i) => (
            <li
              key={p.titulo}
              className="group relative flex w-[min(18.5rem,82vw)] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] border border-fio bg-white p-5 shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)] lg:w-auto lg:shrink lg:items-center lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-center lg:shadow-none"
            >
              {/* O número em marca d'água (só nos cartões) */}
              <span aria-hidden="true" className="numero-tinta pointer-events-none absolute right-4 top-1 text-[4.5rem] leading-none opacity-20 lg:hidden">
                {String(i + 1).padStart(2, "0")}
              </span>
              <No>{p.icone}</No>
              <span className="mt-5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">
                passo {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[1.2rem] md:text-[1.3rem] font-semibold tracking-[-0.03em] text-navy leading-snug">
                <span className="sr-only">Passo {i + 1}: </span>
                {p.titulo}
              </h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-grafite lg:max-w-[26ch]">{p.texto}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-cinza lg:max-w-[26ch]">{p.detalhe}</p>

              {/* Passo 04: as lojas, em chips com o mapa */}
              {p.lojas && (
                <ul className="mt-auto flex flex-wrap gap-2 pt-4 lg:justify-center">
                  {UNIDADES.map((u) => (
                    <li key={u.bairro}>
                      <a
                        href={linkMapaUnidade(u.bairro, u.endereco)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip !min-h-9 !px-3 text-[0.8rem]"
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
        {/* A barra de ouro que anda com a faixa (só até o tablet) */}
        <div aria-hidden="true" className="lg:hidden mt-4 mx-auto h-[3px] w-28 rounded-full bg-fio overflow-hidden">
          <span className="passos-barra block h-full w-full rounded-full bg-[image:var(--ouro-degrade)]" />
        </div>
      </div>

      {/* ---------- O convite da receita, largo ---------- */}
      <div className="revelar relative mt-10 md:mt-14 overflow-hidden rounded-[2rem] banner-noite em-noite p-6 md:p-8 lg:px-10 lg:py-9 text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
        <span aria-hidden="true" className="malha-banner" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.3),transparent_62%)]"
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 lg:items-center">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">receita em mãos?</p>
            <p className="titulo-banner mt-3 text-[1.6rem] md:text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
              Envie a foto <span className="italic">da sua receita.</span>
            </p>
            <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-white/70">
              A foto vai pelo WhatsApp. O farmacêutico confere e responde com o valor e o
              prazo.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row lg:justify-end">
            <BotaoEnviarReceita comIcone={false} className="botao botao-vivo !gap-2.5">
              <span className="text-ouro-escuro">
                <IconeReceita tamanho={20} />
              </span>
              Enviar receita
            </BotaoEnviarReceita>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="botao botao-vidro !gap-2.5"
            >
              <IconeWhatsApp tamanho={18} className="text-[#25D366]" />
              Tirar uma dúvida
            </a>
          </div>
        </div>
        {/* A linha de confiança */}
        <ul className="relative mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-[0.8rem] leading-snug text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {CONFIANCA.map((c) => (
            <li key={c.texto} className="flex items-center gap-2.5">
              <span className="shrink-0 text-ouro-claro">{c.icone}</span>
              {c.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
