// "Como funciona": os 4 passos do pedido pela receita, da foto da
// prescrição até a entrega. Aparece na home e na página A Viver Bem.
//
// Revisão de 05/10/2026 ("tirar a cara de genérico"): os ícones pequenos
// com bolinha numerada e a linha ligando os passos deram lugar a números
// grandes no itálico serifado do site, a assinatura dos títulos.
//
// Texto de processo, não de resultado: manipulado não pode ter
// promessa de efeito (RDC 67/2007).
import { WHATSAPP_NUMERO, UNIDADES } from "@/lib/tipos";
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
    titulo: "Manipulação",
    texto: "A fórmula é preparada no laboratório, conforme a prescrição.",
    detalhe: "O rótulo sai com o seu nome, a composição e a validade.",
  },
  {
    titulo: "Retire ou receba",
    texto: "Na loja que você escolher, ou em casa, de moto.",
    detalhe: `A retirada é sem taxa, em ${UNIDADES.length} lojas.`,
  },
];

export function ComoFunciona({ className = "pt-20" }: { className?: string }) {
  return (
    <section id="como-funciona" className={`px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24 ${className}`}>
      <div className="max-w-2xl">
        <p className="selo-secao text-escarlate">simples assim</p>
        <h2 className="font-display text-[2.35rem] md:text-[3.25rem] font-extrabold tracking-[-0.035em] text-grafite leading-[1.04] mt-3">
          Como <span className="italic text-royal">funciona</span>
        </h2>
        <p className="text-grafite-medio text-base md:text-lg mt-3 leading-relaxed">
          Da foto da receita até a sua mão, em 4 passos.
        </p>
      </div>

      {/* Os passos: o número em itálico grande puxa a leitura */}
      <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
        {PASSOS.map((p, i) => (
          <li key={p.titulo} className="flex sm:flex-col gap-5 sm:gap-0">
            <span
              aria-hidden="true"
              className="shrink-0 w-14 sm:w-auto italic leading-[0.85] text-[3.4rem] md:text-[4.2rem] text-royal [font-family:var(--font-destaque)]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="sm:mt-5">
              <h3 className="font-display text-xl font-semibold text-grafite leading-snug">{p.titulo}</h3>
              <p className="text-grafite-medio leading-relaxed mt-2">{p.texto}</p>
              <p className="text-grafite-claro text-sm leading-relaxed mt-2">{p.detalhe}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Saídas: começar pela receita ou tirar a dúvida antes */}
      <div className="flex flex-col sm:flex-row gap-3 mt-12">
        <BotaoEnviarReceita className="bg-royal hover:bg-royal-escuro inline-flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-8 py-4 active:scale-[0.98] transition" />
        <a
          href={`https://wa.me/${WHATSAPP_NUMERO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-white text-grafite border border-linha hover:border-royal/40 hover:text-royal font-medium rounded-2xl px-7 py-4 transition-colors active:scale-[0.98]"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#25D366]">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
          </svg>
          Tirar uma dúvida antes
        </a>
      </div>
    </section>
  );
}
