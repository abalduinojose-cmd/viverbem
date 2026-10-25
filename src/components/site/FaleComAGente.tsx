"use client";
// "Fale com a gente", o convite logo antes do rodapé escuro.
//
// Histórico curto: de 06/10 a 14/10/2026 foi um bloco grande (cartões da
// receita e do WhatsApp, as 3 lojas com mapa e o horário). Em 25/10/2026,
// em cinco voltas no mesmo dia, virou faixa, barra, cartão com trilha,
// cartão lapidado e linha sem caixa. Nenhuma ficou boa para ele: "ainda tá
// longe de tá bom; quero mais clean, é uma marca que foca na beleza e
// estética".
//
// Sexta versão (25/10/2026): uma CHAMADA EDITORIAL CENTRADA, como nas
// marcas de beleza. Muito respiro, o rótulo fino, o título grande em duas
// vozes (o mesmo .titulo-secao das seções, com o risco de ouro centrado),
// uma frase, o estado da loja ao vivo e dois botões no centro; embaixo, o
// link em texto para as lojas. Sem cartão, sem trilha, sem ícones em
// círculo. Nada saiu do site: WhatsApp, lojas e horário completos ficam
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

export function FaleComAGente() {
  const estado = useEstadoLoja();
  const { abrirPedido } = useCarrinho();
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;

  const detalhe = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  return (
    <section aria-labelledby="fale-com-a-gente" className="halo-marca relative bg-white border-t border-fio">
      <div className="revelar text-center max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24 flex flex-col items-center">
        <p className="rotulo-pilula">fale com a gente</p>
        <h2 id="fale-com-a-gente" className="titulo-secao vao-rotulo">
          Pelo WhatsApp, pela receita <span className="italic">ou na loja</span>
        </h2>
        <p className="texto-apoio mt-6 max-w-[38ch]">
          Tire dúvidas, envie a receita ou combine a retirada. A equipe responde no horário das lojas.
        </p>

        {/* O estado da loja, ao vivo */}
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2 text-sm text-cinza">
          {estado ? (
            <span role="status" className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="relative flex size-2">
                {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/50 motion-safe:animate-ping" />}
                <span className={`relative size-2 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
              </span>
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

        {/* Os dois botões, no centro */}
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button type="button" onClick={() => abrirPedido()} data-receita-cta className="botao botao-principal !min-h-[3.25rem] !px-7">
            <IconeReceita tamanho={19} />
            Enviar receita
          </button>
          <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer" className="botao botao-secundario !min-h-[3.25rem] !px-7">
            <IconeWhatsApp tamanho={19} className="text-[#128C4B]" />
            Chamar no WhatsApp
          </a>
        </div>

        <Link href="/lojas" className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-medium text-tinta hover:underline underline-offset-4">
          Endereços, horários e como chegar
          <SetaDireita tamanho={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
