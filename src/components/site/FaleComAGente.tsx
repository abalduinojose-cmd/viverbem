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
//
// Lapidação (27/10/2026, "gostei, ficou ótimo, só aprimore mais"): tudo
// guiado pela rolagem (roda também com "reduzir movimento"): o título se
// escreve ao entrar (como os títulos de seção), na folha as linhas se
// desenham uma depois da outra e o visto de ouro aparece por último (uma
// história só: a receita chega e é conferida); um fio de luz na borda de
// cima do cartão; a luz de ouro cresce um pouco ao passar o mouse. O cartão
// recorta com overflow: clip (overflow: hidden faria dele um contêiner de
// rolagem, e as linhas de tempo view() ficariam presas nele).
//
// 29/10/2026: no desktop, a folha em vidro deu lugar à cena animada que já
// existia (CenaReceita, adendo 50); o título continua se escrevendo.
import { usePathname } from "next/navigation";
import { useCarrinho } from "@/lib/carrinho";
import { SetaDireita } from "./icones";
import { IconeReceita } from "./BotaoEnviarReceita";
import { CenaReceita } from "./receita/CenaReceita";

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
        <article className="revelar group relative isolate overflow-clip rounded-[2rem] bg-noite text-white ring-1 ring-inset ring-white/10 shadow-[0_40px_80px_-48px_rgba(13,35,64,0.75),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {/* A atmosfera: a malha e a luz de ouro */}
          <span aria-hidden="true" className="malha-banner" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.32),transparent_62%)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(28,105,181,0.28),transparent_64%)]" />

          <div className="relative grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-14">
            <div className="lg:col-span-7">
              <p className="rotulo-pilula !text-[#e1c68f]/85">fale com a gente</p>
              <h2 id="fale-com-a-gente" className="titulo-receita mt-5 max-w-[16ch] text-[2.1rem] sm:text-[2.6rem] lg:text-[3.25rem] font-bold leading-[1.02] tracking-[-0.04em] text-white text-balance">
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

            {/* A cena animada, só no desktop (29/10/2026, "coloque a animação
                que já tínhamos feito antes"): a CenaReceita do adendo 50, em que
                o celular fotografa a receita e a conversa do WhatsApp responde
                "Receita conferida". Ela se ajusta ao tamanho desta caixa e só
                roda com o cartão à vista; no celular a caixa não aparece e a
                cena nem começa. */}
            <div aria-hidden="true" className="relative hidden lg:col-span-5 lg:block lg:h-[23rem] lg:-my-4">
              <CenaReceita className="inset-0" />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
