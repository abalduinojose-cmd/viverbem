"use client";
// "Fale com a gente", a linha clara logo antes do rodapé escuro.
//
// Histórico curto: de 06/10 a 14/10/2026 foi um bloco grande (cartões da
// receita e do WhatsApp, as 3 lojas com mapa e o horário). Em 25/10/2026,
// em quatro voltas no mesmo dia, encolheu: faixa, barra, cartão com trilha
// de pílulas. Nenhuma agradou de vez: "quero mais clean, é uma marca de
// manipulação que foca na beleza e estética".
//
// Quinta versão (25/10/2026): SEM CAIXA. Um fio no alto, o rótulo fino, o
// título curto em duas vozes e o estado da loja; do outro lado, uma ação
// cheia (Enviar receita) e dois links em texto com seta (WhatsApp, Lojas e
// horários). Nada saiu do site: WhatsApp, lojas e horário completos ficam
// em /contato e /lojas, onde este bloco não aparece (nem na página do
// produto).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEstadoLoja } from "./HorarioAtendimento";
import { useCarrinho } from "@/lib/carrinho";
import { IconeWhatsApp, SetaDireita } from "./icones";
import { IconeReceita } from "./BotaoEnviarReceita";
import { UNIDADES, WHATSAPP_NUMERO } from "@/lib/tipos";

const ROTAS_SEM_O_BLOCO = ["/lojas", "/contato"];
const PREFIXOS_SEM_O_BLOCO = ["/produto/"];

const classeLinkTexto =
  "group inline-flex items-center gap-2 min-h-11 text-[0.95rem] font-semibold text-navy transition-colors hover:text-tinta";

export function FaleComAGente() {
  const estado = useEstadoLoja();
  const { abrirPedido } = useCarrinho();
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;

  const detalhe = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  return (
    <section aria-labelledby="fale-com-a-gente" className="relative bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="revelar border-t border-fio py-9 md:py-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          {/* O rótulo, o título curto em duas vozes e o estado da loja, ao vivo */}
          <div>
            <p className="rotulo-pilula">fale com a gente</p>
            <h2 id="fale-com-a-gente" className="mt-3 text-[1.35rem] md:text-[1.6rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
              Pelo WhatsApp, pela receita{" "}
              <span className="italic font-[family-name:var(--font-destaque)] font-normal text-ouro-escuro">ou na loja</span>
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-cinza">
              {estado ? (
                <span role="status" className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                  <span>
                    <span className={`font-medium ${estado.aberto ? "text-green-700" : "text-navy"}`}>{estado.aberto ? "Aberto agora" : "Fechado agora"}</span>, {detalhe}
                  </span>
                </span>
              ) : (
                <span>Horário de atendimento</span>
              )}
              <span aria-hidden="true" className="size-1 rounded-full bg-ouro" />
              <span>{UNIDADES.length} lojas em Petrópolis</span>
            </p>
          </div>

          {/* Uma ação cheia e dois links em texto */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <button type="button" onClick={() => abrirPedido()} data-receita-cta className="botao botao-principal !min-h-12 !px-6">
              <IconeReceita tamanho={18} />
              Enviar receita
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer" className={classeLinkTexto}>
              <IconeWhatsApp tamanho={18} className="text-[#128C4B]" />
              WhatsApp
              <SetaDireita tamanho={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <Link href="/lojas" className={classeLinkTexto}>
              Lojas e horários
              <SetaDireita tamanho={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
