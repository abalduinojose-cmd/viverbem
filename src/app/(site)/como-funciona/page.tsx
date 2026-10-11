// COMO FUNCIONA: a página própria do pedido pela receita (11/10/2026,
// pedido: "melhore a página Como funciona, quero ela mais moderna"; antes
// era só uma âncora dentro de A Viver Bem). Abertura com o título em duas
// vozes e três números; os quatro passos com o convite da receita (o
// mesmo bloco da home, sem o cabeçalho repetido); as perguntas
// frequentes em sanfonas; e as avaliações como prova. Sem banco: a página
// é estática. Sistema "Branco, azul e ouro" (06/10/2026).
import type { Metadata } from "next";
import Link from "next/link";
import { ANOS_TRADICAO, UNIDADES } from "@/lib/tipos";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { PerguntasFrequentes } from "@/components/site/PerguntasFrequentes";
import { SetaDireita } from "@/components/site/icones";

export const metadata: Metadata = {
  title: "Como funciona · Manipulação Viver Bem",
  description:
    "Envie a foto da receita pelo WhatsApp, o farmacêutico confere e informa o valor e o prazo, a fórmula é preparada no laboratório e você retira numa das 3 lojas ou recebe pelo Delivery.",
};

const NUMEROS = [
  { valor: "4", rotulo: "passos, da receita à entrega" },
  { valor: String(UNIDADES.length), rotulo: "lojas para retirar sem custo" },
  { valor: String(ANOS_TRADICAO), rotulo: "anos de manipulação em Petrópolis" },
];

export default function PaginaComoFunciona() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-4 md:pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">o pedido pela receita</p>
            <h1 className="titulo-secao vao-rotulo">
              Simples como <span className="italic">enviar uma foto</span>
            </h1>
            <p className="texto-apoio mt-4 max-w-xl">
              Sem cadastro e sem aplicativo: a conversa acontece no WhatsApp, com o
              farmacêutico. Veja os quatro passos e as dúvidas mais comuns.
            </p>
          </div>
          {/* Os três números, com fios */}
          <ul className="lg:col-span-5 grid grid-cols-3 border-y border-fio">
            {NUMEROS.map((n, i) => (
              <li key={n.rotulo} className={`py-5 ${i > 0 ? "border-l border-fio pl-4" : "pr-4"}`}>
                <span className="numero-tinta block text-[2.2rem] md:text-[2.6rem] leading-none">{n.valor}</span>
                <span className="mt-2 block text-[0.78rem] md:text-sm leading-snug text-cinza">{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Os quatro passos e o convite ---------- */}
      <ComoFunciona cabecalho={false} className="pt-6 md:pt-8 pb-4" />

      {/* ---------- Perguntas frequentes ---------- */}
      <PerguntasFrequentes />

      {/* ---------- A prova: o link para as avaliações ---------- */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-14 md:pb-18">
        <Link
          href="/avaliacoes"
          className="group revelar flex flex-col gap-4 rounded-[2rem] border border-fio bg-white p-6 md:p-8 transition duration-300 hover:-translate-y-0.5 hover:border-ouro/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            <span className="rotulo-pilula">quem já pediu</span>
            <span className="mt-3 block text-[1.3rem] md:text-[1.6rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
              Veja o que os clientes dizem <span className="italic font-[family-name:var(--font-destaque)] font-normal text-ouro-escuro">sobre o atendimento</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 self-start sm:self-auto text-[0.95rem] font-semibold text-tinta">
            Ver as avaliações
            <SetaDireita tamanho={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>
    </main>
  );
}
