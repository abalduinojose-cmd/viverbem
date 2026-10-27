"use client";
// "Fale com a gente", o convite logo antes do rodapé escuro.
//
// Histórico curto: de 06/10 a 14/10/2026 foi um bloco grande (cartões da
// receita e do WhatsApp, as 3 lojas com mapa e o horário). Em 25/10/2026,
// em cinco voltas no mesmo dia, virou faixa, barra, cartão com trilha,
// cartão lapidado e linha sem caixa, e depois uma chamada editorial
// centrada (adendo 102). Em 27/10/2026 veio um índice em linhas com fio
// (reprovado) e um bento de quatro peças (receita, mapa, WhatsApp, horário),
// do qual ele pediu para ficar só a receita: "o mapa polui, ele tem que
// ficar na parte dele; tira horário, WhatsApp e mapa; quero só o envie a
// receita e receba o orçamento, modernize, alta qualidade, minimalista".
//
// Nona versão (27/10/2026): UMA PEÇA SÓ, larga, em azul noite, o cartão
// aceso do site. À esquerda, o rótulo, o título em duas vozes ("orçamento"
// no itálico de ouro), uma frase e o botão vivo com o fio de ouro girando;
// à direita, no desktop, uma folha de receita em vidro, de leve inclinada,
// com as linhas e um traço de ouro, que sobe um pouco ao passar o mouse.
// Ao fundo, a malha de laboratório e a luz de ouro no canto. Nada mais:
// WhatsApp, lojas e horário completos seguem em /contato e /lojas, onde
// este bloco não aparece (nem na página do produto).
import { usePathname } from "next/navigation";
import { useCarrinho } from "@/lib/carrinho";
import { SetaDireita } from "./icones";
import { IconeReceita } from "./BotaoEnviarReceita";

const ROTAS_SEM_O_BLOCO = ["/lojas", "/contato"];
const PREFIXOS_SEM_O_BLOCO = ["/produto/"];

export function FaleComAGente() {
  const { abrirPedido } = useCarrinho();
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;

  return (
    <section aria-labelledby="fale-com-a-gente" className="relative border-t border-fio bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20 lg:py-24">
        <article className="revelar group relative isolate overflow-hidden rounded-[2rem] bg-noite text-white ring-1 ring-inset ring-white/10 shadow-[0_40px_80px_-48px_rgba(13,35,64,0.75)]">
          {/* A atmosfera: a malha e a luz de ouro */}
          <span aria-hidden="true" className="malha-banner" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.32),transparent_62%)]" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(28,105,181,0.28),transparent_64%)]" />

          <div className="relative grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-14">
            <div className="lg:col-span-7">
              <p className="rotulo-pilula !text-[#e1c68f]/85">fale com a gente</p>
              <h2 id="fale-com-a-gente" className="mt-5 max-w-[16ch] text-[2.1rem] sm:text-[2.6rem] lg:text-[3.25rem] font-bold leading-[1.02] tracking-[-0.04em] text-white text-balance">
                Envie a receita e receba o <span className="font-[family-name:var(--font-destaque)] font-normal italic tracking-[-0.01em] text-[#e1c68f]">orçamento</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[1.02rem] md:text-[1.1rem] leading-[1.6] text-white/72 text-pretty">
                Foto ou PDF. O farmacêutico confere cada fórmula e responde com o valor e o prazo, no horário das lojas.
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
                <button type="button" onClick={() => abrirPedido()} data-receita-cta className="botao botao-vivo !min-h-[3.5rem] !px-8 text-[1.02rem]">
                  <IconeReceita tamanho={20} />
                  Enviar receita
                  <SetaDireita tamanho={17} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
                <p className="text-[0.84rem] leading-snug text-white/50 sm:max-w-[22ch]">Sem compromisso. Você só paga depois que o farmacêutico confirma o pedido.</p>
              </div>
            </div>

            {/* A folha de receita em vidro, só no desktop */}
            <div aria-hidden="true" className="hidden lg:col-span-5 lg:flex lg:justify-end lg:pr-4">
              <div className="relative w-[17rem] -rotate-[4deg] rounded-[1.4rem] bg-white/[0.06] p-7 ring-1 ring-inset ring-white/15 shadow-[0_40px_70px_-40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-sm transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:-rotate-[2.5deg]">
                <span className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-destaque)] text-[1.9rem] italic leading-none text-[#e1c68f]">Rx</span>
                  <span className="text-[#e1c68f]/85">
                    <IconeReceita tamanho={22} />
                  </span>
                </span>
                <span className="mt-7 block h-[3px] w-14 rounded-full bg-[image:var(--ouro-degrade)]" />
                <span className="mt-6 block space-y-3.5">
                  <span className="block h-2 w-[88%] rounded-full bg-white/[0.16]" />
                  <span className="block h-2 w-[68%] rounded-full bg-white/[0.16]" />
                  <span className="block h-2 w-[78%] rounded-full bg-white/[0.16]" />
                  <span className="block h-2 w-[52%] rounded-full bg-white/[0.16]" />
                </span>
                <span className="mt-8 flex items-center justify-between">
                  <span className="block h-2 w-[34%] rounded-full bg-white/[0.12]" />
                  <span className="flex size-8 items-center justify-center rounded-full bg-[image:var(--ouro-degrade)] text-navy">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
