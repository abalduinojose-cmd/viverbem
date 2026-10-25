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

const classePilula =
  "group flex flex-1 lg:flex-none flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-2.5 rounded-2xl lg:rounded-full px-3 py-3 lg:px-5 lg:py-0 lg:min-h-12 text-[0.8rem] lg:text-[0.92rem] font-semibold transition duration-300 hover:-translate-y-0.5 active:scale-[0.98]";

export function FaleComAGente() {
  const estado = useEstadoLoja();
  const { abrirPedido } = useCarrinho();
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;

  const detalhe = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  return (
    <section aria-labelledby="fale-com-a-gente" className="relative bg-white border-t border-fio">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        {/* O estado da loja, ao vivo */}
        <div className="revelar flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id="fale-com-a-gente" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">
            Fale com a gente
          </h2>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-cinza">
            {estado ? (
              <span role="status" className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="relative flex size-2">
                  {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/50 motion-safe:animate-ping" />}
                  <span className={`relative size-2 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
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

        {/* As três ações, lado a lado */}
        <div className="flex items-stretch gap-2 lg:gap-2.5">
          <button type="button" onClick={() => abrirPedido()} data-receita-cta className={`${classePilula} bg-navy text-white hover:bg-tinta`}>
            <IconeReceita tamanho={19} />
            Enviar receita
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${classePilula} bg-[#1DA851] text-white hover:bg-[#178a43]`}
          >
            <IconeWhatsApp tamanho={19} />
            WhatsApp
          </a>
          <Link href="/lojas" className={`${classePilula} bg-white text-navy ring-1 ring-inset ring-fio hover:ring-ouro/60`}>
            <IconeLoja tamanho={18} />
            <span className="lg:hidden">Lojas</span>
            <span className="hidden lg:inline">Lojas e horários</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
