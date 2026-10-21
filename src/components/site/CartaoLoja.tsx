// O cartão de UMA loja (21/10/2026, "melhore a parte das lojas, mais
// moderna e clean"): o mapa da região em cima, com o pino e o número da
// loja em ouro; embaixo, o bairro grande, o endereço, o telefone fixo (só
// o Centro tem) e as duas ações, "Como chegar" (abre o Google Maps com a
// loja) e o WhatsApp. Três deles lado a lado fazem a página das lojas e o
// fim da página de contato. Sem estado: o "aberto agora" fica uma vez só,
// no cabeçalho da seção, porque o horário é o mesmo nas três.
import { MapaLoja } from "./MapaLoja";
import { IconeWhatsApp } from "./icones";
import { linkMapaUnidade, WHATSAPP_NUMERO, type Unidade } from "@/lib/tipos";

function IconePino() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function CartaoLoja({ unidade, indice, compacto = false }: { unidade: Unidade; indice: number; compacto?: boolean }) {
  const mensagem = `Olá! Vim pelo site e gostaria de falar sobre a loja ${unidade.bairro}.`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-inset ring-fio shadow-[0_24px_50px_-42px_rgba(16,42,74,0.45)] transition duration-300 hover:-translate-y-1 hover:ring-ouro/45 hover:shadow-[0_30px_50px_-36px_rgba(16,42,74,0.5)]">
      <div className="relative">
        <MapaLoja lat={unidade.lat} lon={unidade.lon} nome={unidade.bairro} className={compacto ? "h-36" : "h-44 md:h-48"} />
        <span aria-hidden="true" className="absolute left-4 top-3.5 inline-flex h-8 items-center rounded-full bg-white/92 pl-2.5 pr-3 shadow-sm">
          <span className="numero-tinta text-[1.1rem]">{String(indice + 1).padStart(2, "0")}</span>
        </span>
      </div>
      <div className={`flex flex-1 flex-col ${compacto ? "p-5" : "p-5 md:p-6"}`}>
        <h3 className={`font-semibold tracking-[-0.03em] leading-none text-navy ${compacto ? "text-[1.35rem]" : "text-[1.6rem] md:text-[1.8rem]"}`}>{unidade.bairro}</h3>
        <p className="mt-2.5 text-[0.95rem] leading-snug text-grafite">
          {unidade.endereco}
          <span className="text-cinza">, Petrópolis/RJ</span>
        </p>
        {unidade.telefone && (
          <a href={`tel:+55${unidade.telefone.replace(/\D/g, "")}`} className="mt-1.5 w-fit text-sm tabular-nums text-cinza transition-colors hover:text-navy">
            Telefone {unidade.telefone}
          </a>
        )}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <a
            href={linkMapaUnidade(unidade.bairro, unidade.endereco)}
            target="_blank"
            rel="noopener noreferrer"
            className="botao botao-principal botao-compacto !min-h-11 !gap-2 flex-1 sm:flex-none"
          >
            <IconePino />
            Como chegar
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Falar no WhatsApp sobre a loja ${unidade.bairro}`}
            className="botao botao-secundario !min-h-11 w-11 !px-0"
          >
            <IconeWhatsApp tamanho={19} className="text-[#25D366]" />
          </a>
        </div>
      </div>
    </article>
  );
}
