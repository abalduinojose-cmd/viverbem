"use client";
// "Fale com a gente", a barra clara logo antes do rodapé escuro.
//
// Histórico curto: de 06/10 a 14/10/2026 foi um bloco grande (título em duas
// vozes, cartão da receita em azul-noite animado, cartão do WhatsApp com a
// conversa, as 3 lojas com mapa e o horário da semana). Em 25/10/2026 o
// usuário achou as páginas longas ("passa o WhatsApp, passa endereço,
// horário, em todas as páginas") e, na segunda volta do mesmo dia, pediu
// algo "dinâmico" no lugar da faixa com título e três botões empilhados.
//
// Agora é uma BARRA DE UMA LINHA, igual em todas as páginas (home
// inclusive): o estado da loja ao vivo (o ponto verde pulsa quando está
// aberta) e três ações em pílula, lado a lado até no celular, com o ícone em
// cima e o nome embaixo. Nada saiu do site: o cartão da receita segue no
// cabeçalho e no catálogo, o WhatsApp e as lojas com mapa e horário estão
// em /contato e /lojas. Nas páginas de lojas, contato e produto a barra não
// aparece (elas já têm tudo isso no corpo).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEstadoLoja } from "./HorarioAtendimento";
import { useCarrinho } from "@/lib/carrinho";
import { IconeWhatsApp } from "./icones";
import { IconeLoja } from "./IconesVantagens";
import { IconeReceita } from "./BotaoEnviarReceita";
import { UNIDADES, WHATSAPP_NUMERO } from "@/lib/tipos";

const ROTAS_SEM_O_BLOCO = ["/lojas", "/contato"];
const PREFIXOS_SEM_O_BLOCO = ["/produto/"];

// 25/10/2026, terceira volta ("mais clean e moderno, que fique bem com o
// layout"): a barra virou um CARTÃO branco sobre uma faixa em névoa, com o
// fio de ouro no alto (o mesmo do rodapé) e as três ações numa TRILHA em
// gelo, como as pílulas deslizantes das abas e da gaveta do carrinho
// 25/10/2026, quarta volta ("melhore mais"): o título curto em duas vozes
// voltou (é a assinatura do site), cada ação ganhou o ícone num círculo, um
// fio separa o texto das ações no computador e a trilha tem um fio fino
const classePilula =
  "group flex flex-1 lg:flex-none flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2.5 rounded-[1.1rem] lg:rounded-full px-2 py-2.5 lg:pl-1.5 lg:pr-5 lg:py-0 lg:min-h-12 text-[0.78rem] lg:text-[0.9rem] font-semibold transition duration-300 hover:-translate-y-0.5 active:scale-[0.98]";
const classeCirculo = "flex size-8 shrink-0 items-center justify-center rounded-full";

export function FaleComAGente() {
  const estado = useEstadoLoja();
  const { abrirPedido } = useCarrinho();
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;

  const detalhe = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  return (
    <section aria-labelledby="fale-com-a-gente" className="relative bg-nevoa border-t border-fio">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8">
        <div className="revelar relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-fio shadow-[0_28px_60px_-44px_rgba(16,42,74,0.5)] px-5 py-5 md:px-7 md:py-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* O fio de ouro no alto, o mesmo do rodapé logo abaixo */}
          <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-ouro/70 to-transparent" />
          <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-20 size-56 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.14),transparent_65%)]" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-[radial-gradient(circle,rgba(28,105,181,0.10),transparent_65%)]" />

          {/* O rótulo, o título curto em duas vozes e o estado da loja, ao vivo */}
          <div className="relative lg:flex-1">
            <p className="rotulo-pilula">fale com a gente</p>
            <h2 id="fale-com-a-gente" className="mt-3 text-[1.15rem] md:text-[1.3rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
              Pelo WhatsApp, pela receita{" "}
              <span className="italic font-[family-name:var(--font-destaque)] font-normal text-ouro-escuro">ou na loja</span>
            </h2>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-cinza">
              {estado ? (
                <span role="status" className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="relative flex size-2.5">
                    {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/50 motion-safe:animate-ping" />}
                    <span className={`relative size-2.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                  </span>
                  <span>
                    <span className={`font-semibold ${estado.aberto ? "text-green-700" : "text-navy"}`}>{estado.aberto ? "Aberto agora" : "Fechado agora"}</span>, {detalhe}
                  </span>
                </span>
              ) : (
                <span>Horário de atendimento</span>
              )}
              <span aria-hidden="true" className="hidden sm:inline size-1 rounded-full bg-ouro" />
              <span className="hidden sm:inline">{UNIDADES.length} lojas em Petrópolis</span>
            </p>
          </div>

          {/* As três ações, numa trilha em gelo, cada ícone no seu círculo */}
          <div className="relative flex items-stretch gap-1 rounded-[1.4rem] lg:rounded-full bg-gelo/80 p-1 ring-1 ring-inset ring-fio/70 lg:ml-8 lg:border-l lg:border-fio lg:pl-0 lg:ring-0 lg:bg-transparent lg:gap-2">
            <button type="button" onClick={() => abrirPedido()} data-receita-cta className={`${classePilula} bg-navy text-white shadow-[0_12px_24px_-14px_rgba(13,35,64,0.75)] hover:bg-tinta lg:ml-8`}>
              <span className={`${classeCirculo} bg-white/15`}>
                <IconeReceita tamanho={16} />
              </span>
              Enviar receita
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${classePilula} bg-[#1DA851] text-white shadow-[0_12px_24px_-14px_rgba(29,168,81,0.8)] hover:bg-[#178a43]`}
            >
              <span className={`${classeCirculo} bg-white/20`}>
                <IconeWhatsApp tamanho={16} />
              </span>
              WhatsApp
            </a>
            <Link href="/lojas" className={`${classePilula} text-navy hover:bg-white lg:bg-white lg:ring-1 lg:ring-inset lg:ring-fio lg:hover:ring-ouro/60`}>
              <span className={`${classeCirculo} bg-white ring-1 ring-fio lg:bg-gelo lg:ring-0`}>
                <IconeLoja tamanho={15} />
              </span>
              <span className="lg:hidden">Lojas</span>
              <span className="hidden lg:inline">Lojas e horários</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
