// "Como funciona": a trilha do pedido pela receita, da foto da prescrição
// até a retirada ou a entrega, em quatro passos. Aparece na home e na
// página A Viver Bem.
//
// Sexta versão (10/10/2026, pedido: "o Como funciona está muito simples, é
// uma parte importante do site, tem que estar mais moderna e clean";
// "modernize os botões"; "exclua o WhatsApp" da linha de confiança): os
// quatro cartões viraram UMA lista num cartão branco, cada passo com o
// número grande em ouro à esquerda, o ícone num quadrado gelo (que acende
// em azul no hover), o título, o texto e o detalhe; no passo 04 as lojas
// em chips. Ao lado, preso ao rolar no computador, o convite da receita em
// azul-noite com os botões da dobra (o branco com o fio de ouro que
// percorre a borda e o de vidro) e a linha de confiança dentro dele, sem
// o telefone. No celular, a lista vem primeiro e o convite embaixo (a
// faixa que arrastava para o lado saiu: a lista lê melhor).
//
// Versões anteriores: 08/10 quatro cartões com o traço de ouro e a faixa
// no celular (quinta); 07/10 um cartão só dividido por fios (quarta); o
// painel inteiro em azul-noite tinha sido reprovado antes. Esta seção
// absorveu as duas que contavam o mesmo processo ("Cada pessoa tem sua
// fórmula" e "Receba em casa ou retire na loja"): o processo é contado
// uma vez. Textos curtos e formais (10/10/2026).
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
    texto: `Sem custo em uma das ${UNIDADES.length} lojas, ou em casa, de moto, em toda Petrópolis.`,
    detalhe: "A taxa e o prazo da entrega são combinados pelo WhatsApp.",
    icone: <IconeMoto tamanho={22} />,
    lojas: true,
  },
];

// A linha de confiança, dentro do convite: o aviso legal em dois pontos curtos
const CONFIANCA = [
  { icone: <IconeEscudo />, texto: "Manipulamos só com receita válida, de profissional habilitado." },
  { icone: <IconeCadeado />, texto: "Sua receita e seus dados ficam só com a nossa equipe." },
];

export function ComoFunciona({ className = "secao" }: { className?: string }) {
  return (
    <section
      id="como-funciona"
      aria-labelledby="titulo-como-funciona"
      className={`max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)] ${className}`}
    >
      {/* ---------- Cabeçalho: rótulo, título em duas vozes e o apoio embaixo ---------- */}
      <div className="revelar max-w-3xl">
        <p className="rotulo-pilula">como funciona</p>
        <h2 id="titulo-como-funciona" className="titulo-secao vao-rotulo">
          Do envio da receita <span className="italic">à entrega</span>
        </h2>
        <p className="texto-apoio mt-5 max-w-[36rem]">
          Quatro passos, da foto da receita até a retirada ou a entrega. Cada fórmula é
          preparada depois do pedido, conforme a receita.
        </p>
      </div>

      <div className="vao-titulo grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* ---------- Os quatro passos, numa lista só ---------- */}
        <ol className="escalonado lg:col-span-7 rounded-[2rem] border border-fio bg-white px-5 md:px-7 shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)]">
          {PASSOS.map((p, i) => (
            <li
              key={p.titulo}
              className="group grid grid-cols-[3.25rem_1fr] md:grid-cols-[4.5rem_1fr] gap-x-3 md:gap-x-5 py-6 md:py-7 border-b border-fio last:border-b-0"
            >
              <span aria-hidden="true" className="numero-tinta -mt-1 text-[2.4rem] md:text-[3rem] leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gelo text-tinta transition-colors duration-300 group-hover:bg-tinta group-hover:text-white">
                    {p.icone}
                  </span>
                  <h3 className="text-[1.15rem] md:text-[1.3rem] font-semibold tracking-[-0.03em] text-navy leading-snug">
                    <span className="sr-only">Passo {i + 1}: </span>
                    {p.titulo}
                  </h3>
                </div>
                <p className="mt-3 max-w-[52ch] text-[0.95rem] md:text-base leading-relaxed text-grafite">{p.texto}</p>
                <p className="mt-1 text-sm leading-relaxed text-cinza">{p.detalhe}</p>

                {/* Passo 04: as lojas, em chips com o mapa */}
                {p.lojas && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {UNIDADES.map((u) => (
                      <li key={u.bairro}>
                        <a
                          href={linkMapaUnidade(u.bairro, u.endereco)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chip !min-h-9 !px-3 text-[0.8rem] md:!min-h-10 md:!px-3.5 md:text-sm"
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
              </div>
            </li>
          ))}
        </ol>

        {/* ---------- O convite da receita, preso ao lado no computador ---------- */}
        <div className="revelar relative overflow-hidden rounded-[2rem] banner-noite em-noite p-6 md:p-8 text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)] lg:col-span-5 lg:sticky lg:top-[calc(var(--altura-cabecalho)+1.5rem)]">
          <span aria-hidden="true" className="malha-banner" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.3),transparent_62%)]"
          />
          <div className="relative">
            <p className="rotulo-pilula">receita em mãos?</p>
            <p className="titulo-banner mt-4 text-[1.7rem] md:text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
              Envie a foto <span className="italic">da sua receita.</span>
            </p>
            <p className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-white/70">
              A foto vai pelo WhatsApp. O farmacêutico confere e responde com o valor e o
              prazo.
            </p>
            {/* Os botões da dobra: o branco com o fio de ouro e o de vidro */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
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
            {/* A linha de confiança, dentro do convite */}
            <ul className="mt-7 flex flex-col gap-2.5 border-t border-white/10 pt-5 text-[0.8rem] leading-snug text-white/70">
              {CONFIANCA.map((c) => (
                <li key={c.texto} className="flex items-center gap-2.5">
                  <span className="shrink-0 text-ouro-claro">{c.icone}</span>
                  {c.texto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
