// "Como funciona": a trilha única do pedido pela receita, da foto da
// prescrição até a retirada ou a entrega, em quatro ladrilhos (bento).
// Aparece na home e na página A Viver Bem.
//
// Em 06/10/2026 esta seção absorveu as duas que contavam o mesmo
// processo: "Cada pessoa tem sua fórmula" (os fatos do preparo viraram o
// passo 03 e o aviso legal) e "Receba em casa ou retire na loja" (virou o
// passo 04, com as 3 lojas em chips). O processo é contado uma vez.
//
// Texto de processo, não de resultado: manipulado não pode ter promessa
// de efeito (RDC 67/2007 e RDC 96/2008). Antes de mexer no texto, confirme
// com o farmacêutico responsável.
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";

const PASSOS = [
  {
    titulo: "Envie a receita",
    texto: "Mande a foto da prescrição pelo WhatsApp, ou traga na loja.",
    detalhe: "Pelo site, o pedido já chega com o seu código.",
  },
  {
    titulo: "O farmacêutico confere",
    texto: "Ele avalia a receita e passa o valor e o prazo de preparo.",
    detalhe: "Você só confirma se estiver de acordo.",
  },
  {
    titulo: "Preparo",
    texto:
      "A fórmula é preparada no laboratório, a partir da receita, depois do pedido. Nada fica pronto na prateleira.",
    detalhe: "O rótulo sai com o seu nome, a composição e a validade.",
  },
  {
    titulo: "Retire ou receba",
    texto: `Sem taxa, numa das ${UNIDADES.length} lojas, ou em casa, de moto, por toda Petrópolis.`,
    detalhe: "A taxa e o prazo da entrega são combinados pelo WhatsApp antes de sair.",
    lojas: true,
  },
];

function IconeWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#25D366]">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

export function ComoFunciona({ className = "secao" }: { className?: string }) {
  return (
    <section
      id="como-funciona"
      aria-labelledby="titulo-como-funciona"
      className={`max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)] ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
        {/* ---------- Coluna que fica: título, convite e aviso ---------- */}
        <div className="revelar md:col-span-5 md:sticky md:top-28 self-start">
          <p className="rotulo">como funciona</p>
          <h2 id="titulo-como-funciona" className="titulo-secao vao-rotulo">
            Da receita <span className="italic">até a sua mão</span>
          </h2>
          <p className="texto-apoio mt-4 max-w-md">
            Quatro passos, do envio da prescrição à retirada ou entrega. Cada fórmula é
            preparada depois do pedido, conforme a receita.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <BotaoEnviarReceita className="botao botao-principal" />
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="botao-link self-center sm:self-auto"
            >
              <IconeWhatsApp />
              Tirar uma dúvida antes
            </a>
          </div>

          {/* Aviso legal, discreto mas presente */}
          <p className="text-xs leading-relaxed text-grafite-claro mt-6 max-w-md">
            {WHATSAPP_LOJA} · Medicamentos manipulados são preparados somente mediante
            prescrição de profissional habilitado, dentro da validade. A sua receita e os
            seus dados ficam apenas com a nossa equipe.
          </p>
        </div>

        {/* ---------- Os quatro ladrilhos ---------- */}
        <ol className="escalonado md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="ladrilho ladrilho-luz p-6 md:p-7 flex flex-col">
              <span aria-hidden="true" className="numero-tinta text-[2.8rem] md:text-[3.6rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[1.3rem] md:text-[1.4rem] font-semibold tracking-[-0.03em] text-navy leading-snug">
                {p.titulo}
              </h3>
              <p className="text-grafite leading-relaxed mt-2.5">{p.texto}</p>
              <p className="text-cinza text-[0.92rem] leading-relaxed mt-1.5">{p.detalhe}</p>

              {/* Passo 04: as lojas, cada uma com o mapa */}
              {p.lojas && (
                <ul className="flex flex-wrap gap-2 mt-4 relative z-[1]">
                  {UNIDADES.map((u) => (
                    <li key={u.bairro}>
                      <a
                        href={linkMapaUnidade(u.bairro, u.endereco)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip !min-h-10 !px-3.5 text-sm"
                        title={u.endereco}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mr-1.5 -ml-0.5 text-ouro">
                          <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                          <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
                        </svg>
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
    </section>
  );
}
