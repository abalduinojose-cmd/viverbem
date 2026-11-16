// COMO FUNCIONA: a página própria do pedido pela receita (11/10/2026,
// pedido: "melhore a página Como funciona, quero ela mais moderna"; antes
// era só uma âncora dentro de A Viver Bem). Abertura com o título em duas
// vozes e três números; os quatro passos com o convite da receita (o
// mesmo bloco da home, sem o cabeçalho repetido); as perguntas
// frequentes em sanfonas; e as avaliações como prova. Sem banco: a página
// é estática. Sistema "Branco, azul e ouro" (06/10/2026).
//
// 16/11/2026 ("modernize toda a página do Como funciona, e no final dela
// coloque as informações da empresa; quero um layout melhor e condizente
// com o projeto"): a abertura ganhou o botão de enviar a receita e os três
// números no mesmo cartão branco de três células da página A Viver Bem
// (traço de ouro, número rolando); a prova das avaliações virou um cartão
// com o ícone em dois tons e a seta no círculo (o desenho dos atalhos da
// história); e a página fecha com "Quem responde pela sua fórmula", os
// dados da empresa (DadosDaEmpresa). Os quatro passos e as perguntas não
// mudaram (a nona versão dos passos é a aprovada).
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ANOS_TRADICAO, AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, UNIDADES } from "@/lib/tipos";
import { ComoFunciona } from "@/components/site/home/ComoFunciona";
import { PerguntasFrequentes } from "@/components/site/institucional/PerguntasFrequentes";
import { DadosDaEmpresa } from "@/components/site/institucional/DadosDaEmpresa";
import { BotaoEnviarReceita } from "@/components/site/carrinho/BotaoEnviarReceita";
import { NumeroRolante } from "@/components/site/historia/NumeroRolante";
import { IconeEstrelaDuo } from "@/components/site/ui/IconesVantagensDuo";
import { SetaDireita } from "@/components/site/ui/icones";

export const metadata: Metadata = {
  title: "Como funciona · Manipulação Viver Bem",
  description:
    "Envie a foto da receita pelo WhatsApp, o farmacêutico confere e informa o valor e o prazo, a fórmula é preparada no laboratório e você retira numa das 3 lojas ou recebe em casa, com envio para todo o Brasil.",
  alternates: { canonical: "/como-funciona" },
};

const NUMEROS = [
  { valor: "4", titulo: "Passos", rotulo: "da receita à entrega" },
  { valor: String(UNIDADES.length), titulo: "Lojas", rotulo: "para retirar sem custo" },
  { valor: String(ANOS_TRADICAO), titulo: "Anos", rotulo: "de manipulação" },
];

function SetaBaixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PaginaComoFunciona() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-9 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula entra">o pedido pela receita</p>
            <h1 className="titulo-secao vao-rotulo entra" style={{ "--atraso": "120ms" } as CSSProperties}>
              Simples como <span className="italic">enviar uma foto</span>
            </h1>
            <p className="texto-apoio entra mt-4 max-w-xl" style={{ "--atraso": "240ms" } as CSSProperties}>
              Sem cadastro e sem aplicativo: a conversa acontece no WhatsApp, com o
              farmacêutico. Veja os quatro passos e as dúvidas mais comuns.
            </p>
            <div className="entra mt-7 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ "--atraso": "360ms" } as CSSProperties}>
              <BotaoEnviarReceita className="botao botao-principal" />
              <a href="#passos" className="botao-link">
                Ver os passos
                <span className="acenar-baixo">
                  <SetaBaixo />
                </span>
              </a>
            </div>
          </div>

          {/* Os três números, rolando como contador, no cartão de três
              células da página A Viver Bem */}
          <ul
            className="entra lg:col-span-5 grid grid-cols-3 overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-inset ring-fio shadow-[0_26px_50px_-40px_rgba(16,42,74,0.55)]"
            style={{ "--atraso": "480ms" } as CSSProperties}
          >
            {NUMEROS.map((n, i) => (
              <li key={n.titulo} className={`relative px-3.5 pb-4 pt-5 md:px-6 md:pb-6 md:pt-7 ${i > 0 ? "border-l border-fio" : ""}`}>
                <span aria-hidden="true" className="absolute left-3.5 top-0 h-[2px] w-7 rounded-full bg-[image:var(--ouro-degrade)] md:left-6 md:w-9" />
                <NumeroRolante valor={n.valor} className="text-[clamp(2.2rem,1.6rem+2.2vw,3.25rem)]" />
                <span className="mt-2.5 block text-[0.86rem] font-semibold leading-tight tracking-[-0.01em] text-navy md:text-[1rem]">{n.titulo}</span>
                <span className="mt-0.5 block text-[0.74rem] leading-snug text-cinza md:text-[0.86rem]">{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Os quatro passos e o convite ---------- */}
      <div id="passos" className="scroll-mt-[calc(var(--altura-cabecalho)+1rem)]">
        <ComoFunciona cabecalho={false} className="pt-6 md:pt-8 pb-4" />
      </div>

      {/* ---------- Perguntas frequentes ---------- */}
      <PerguntasFrequentes />

      {/* ---------- A prova: o link para as avaliações ---------- */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-8 md:pt-4 pb-14 md:pb-18">
        <Link
          href="/avaliacoes"
          className="group revelar flex items-center gap-4 rounded-[1.75rem] bg-white p-4 pr-5 ring-1 ring-inset ring-fio shadow-[0_26px_50px_-40px_rgba(16,42,74,0.55)] transition duration-300 hover:-translate-y-0.5 hover:ring-ouro/40 md:gap-6 md:p-6 md:pr-7"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(145deg,#fdf9f0,#f3e6c8)] text-ouro-escuro ring-1 ring-inset ring-ouro/25 shadow-[inset_0_1px_0_#ffffff] md:size-16 md:rounded-[1.25rem]">
            <IconeEstrelaDuo tamanho={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.76rem] text-cinza md:text-[0.85rem]">
              {AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} no Google, {AVALIACOES_GOOGLE_TOTAL} avaliações
            </span>
            <span className="mt-0.5 block text-[1.1rem] md:text-[1.5rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
              Veja o que os clientes dizem <span className="italic font-[family-name:var(--font-destaque)] font-normal text-ouro-escuro">sobre o atendimento</span>
            </span>
          </span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gelo text-tinta transition duration-300 group-hover:bg-navy group-hover:text-white md:size-12">
            <SetaDireita tamanho={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      {/* ---------- Os dados da empresa ---------- */}
      <DadosDaEmpresa />
    </main>
  );
}
