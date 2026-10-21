// AVALIAÇÕES: a página só das avaliações (11/10/2026, pedido: "quero uma
// página só para as avaliações, coloque 30, moderna e dinâmica"; antes
// "O que dizem os clientes" era uma âncora dentro de A Viver Bem).
//
// Abertura com o título em duas vozes e, ao lado, o cartão da nota em
// azul-noite (a média, as estrelas, os rostos de quem avaliou, o total do
// perfil, "ver no Google" e "avaliar"). Depois, a lista viva
// (ListaAvaliacoes): busca, assuntos, mural em colunas e "ver mais". Fecha
// com o convite da receita. As avaliações são as públicas do perfil da
// Viver Bem no Google, como foram escritas; quem não tem foto aparece com
// a inicial. Sistema "Branco, azul e ouro" (06/10/2026).
import type { Metadata } from "next";
import { obterTodasAvaliacoes } from "@/lib/catalogo";
import { asset } from "@/lib/asset";
import {
  ANOS_TRADICAO,
  AVALIACOES_GOOGLE_NOTA,
  AVALIACOES_GOOGLE_TOTAL,
  AVALIAR_GOOGLE_URL,
  PERFIL_GOOGLE_URL,
  UNIDADES,
} from "@/lib/tipos";
import { Estrelas } from "@/components/site/Estrelas";
import { ListaAvaliacoes } from "@/components/site/ListaAvaliacoes";
import { BotaoEnviarReceita, IconeReceita } from "@/components/site/BotaoEnviarReceita";
import { SetaDireita } from "@/components/site/icones";

export const dynamic = "force-dynamic";

const NOTA = AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 });

export const metadata: Metadata = {
  title: "Avaliações · Manipulação Viver Bem",
  description: `Nota ${NOTA} no Google, com ${AVALIACOES_GOOGLE_TOTAL} avaliações. Veja o que os clientes dizem sobre a Manipulação Viver Bem, em Petrópolis.`,
  alternates: { canonical: "/avaliacoes" },
};

// Logotipo "G" do Google
function IconeGoogle({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-3l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC04" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.4 6.8 9 4.8 12 4.8z" />
    </svg>
  );
}

export default async function PaginaAvaliacoes() {
  const avaliacoes = await obterTodasAvaliacoes();
  const rostos = avaliacoes.filter((a) => a.fotoUrl).slice(0, 5);

  return (
    <main className="flex-1">
      {/* ---------- Abertura: o título e o cartão da nota ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-8 md:pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">quem já é cliente</p>
            <h1 className="titulo-secao vao-rotulo">
              O que dizem <span className="italic">os nossos clientes</span>
            </h1>
            <p className="texto-apoio mt-4 max-w-xl">
              Avaliações públicas do perfil da Viver Bem no Google, como foram escritas por quem
              compra aqui. Há {ANOS_TRADICAO} anos em Petrópolis, em {UNIDADES.length} lojas.
            </p>
          </div>

          {/* O cartão da nota, em azul-noite */}
          <div className="lg:col-span-5 banner-noite em-noite relative overflow-hidden rounded-[2rem] p-6 md:p-7 text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
            <span aria-hidden="true" className="malha-banner" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-medium">
                <IconeGoogle tamanho={14} />
                Avaliações no Google
              </span>
              <div className="mt-5 flex items-end gap-4">
                <span className="text-[4.5rem] md:text-[5rem] font-semibold leading-none tracking-[-0.05em] tabular-nums">{NOTA}</span>
                <span className="pb-2">
                  <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={20} />
                  <span className="mt-1.5 block text-sm text-white/65">nota máxima, de 5</span>
                </span>
              </div>
              <div className="mt-6 flex items-center gap-3">
                {rostos.length > 0 && (
                  <span className="flex -space-x-2.5 shrink-0">
                    {rostos.map((a) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={a.id}
                        src={asset(a.fotoUrl as string)}
                        alt=""
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-navy"
                        draggable={false}
                      />
                    ))}
                  </span>
                )}
                <span className="text-xs text-white/65 leading-snug">
                  <b className="block text-sm font-semibold text-white tabular-nums">{AVALIACOES_GOOGLE_TOTAL} avaliações</b>
                  de quem já é cliente
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={AVALIAR_GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="botao botao-vivo !min-h-12 !text-[0.95rem] !gap-2">
                  Avaliar a Viver Bem
                  <SetaDireita tamanho={15} />
                </a>
                <a href={PERFIL_GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="botao botao-vidro !min-h-12 !text-[0.95rem]">
                  Ver no Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- A lista viva ---------- */}
      <section aria-label="Avaliações" className="px-5 md:px-8 max-w-6xl mx-auto pb-12 md:pb-16">
        <ListaAvaliacoes avaliacoes={avaliacoes} />
      </section>

      {/* ---------- O convite da receita ---------- */}
      <section className="px-5 md:px-8 max-w-6xl mx-auto pb-14 md:pb-18">
        <div className="revelar relative overflow-hidden rounded-[2rem] banner-noite em-noite p-6 md:p-8 lg:px-10 text-white ring-1 ring-inset ring-white/10 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
          <span aria-hidden="true" className="malha-banner" />
          <div className="relative flex-1 min-w-0">
            <p className="rotulo-pilula">receita em mãos?</p>
            <p className="titulo-banner mt-3 text-[1.45rem] md:text-[1.8rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
              Envie a foto <span className="italic">da sua receita.</span>
            </p>
            <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-snug text-white/70">
              O farmacêutico confere e responde pelo WhatsApp com o valor e o prazo.
            </p>
          </div>
          <BotaoEnviarReceita comIcone={false} className="relative botao botao-vivo !gap-2.5 self-start lg:self-auto">
            <span className="text-ouro-escuro">
              <IconeReceita tamanho={20} />
            </span>
            Enviar receita
          </BotaoEnviarReceita>
        </div>
      </section>
    </main>
  );
}
