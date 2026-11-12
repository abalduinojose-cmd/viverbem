// A VITRINE de UMA loja (12/11/2026, "melhore a página da loja", com as
// fotos das fachadas que a farmácia mandou): a fachada real em cima, alta
// no computador e deitada no celular, com o bairro grande em branco sobre
// um véu azul-noite e o número em ouro; embaixo, o endereço, o telefone,
// um mapa curto da rua (peças do OpenStreetMap, o mesmo de CartaoLoja) e
// as duas ações, "Como chegar" e o WhatsApp. A foto cresce devagar no
// hover. A página de contato segue com o CartaoLoja (só o mapa).
import { asset } from "@/lib/asset";
import { linkMapaUnidade, WHATSAPP_NUMERO, type Unidade } from "@/lib/tipos";
import { MapaLoja } from "./MapaLoja";
import { IconeWhatsApp } from "./icones";

function IconePino() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/** "Corrêas" -> "correas", para a âncora de cada loja (/lojas#correas) */
export function ancoraLoja(bairro: string) {
  return bairro.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function VitrineLoja({
  unidade,
  indice,
  prioridade = false,
}: {
  unidade: Unidade;
  indice: number;
  prioridade?: boolean;
}) {
  const mensagem = `Olá! Vim pelo site e gostaria de falar sobre a loja ${unidade.bairro}.`;
  return (
    <article
      id={ancoraLoja(unidade.bairro)}
      className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-inset ring-fio shadow-[0_24px_50px_-42px_rgba(16,42,74,0.45)] transition duration-300 hover:-translate-y-1 hover:ring-ouro/45 hover:shadow-[0_30px_50px_-36px_rgba(16,42,74,0.5)]"
    >
      {/* A fachada */}
      <figure className="relative aspect-[5/4] overflow-hidden bg-gelo md:aspect-[4/5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(`${unidade.foto}.webp`)}
          srcSet={`${asset(`${unidade.foto}-520.webp`)} 520w, ${asset(`${unidade.foto}.webp`)} 900w`}
          sizes="(min-width: 768px) 34vw, 100vw"
          alt={`Fachada da loja ${unidade.bairro} da Manipulação Viver Bem`}
          width={900}
          height={1000}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : "auto"}
          decoding="async"
          draggable={false}
          style={{ objectPosition: unidade.focoFoto }}
          className="absolute inset-0 h-full w-full object-cover transition-[scale] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />
        {/* O véu azul-noite embaixo, para o bairro em branco */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0D2340]/90 via-[#0D2340]/35 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 inline-flex h-8 items-center rounded-full bg-white/92 pl-2.5 pr-3 shadow-sm"
        >
          <span className="numero-tinta text-[1.1rem]">
            {String(indice + 1).padStart(2, "0")}
          </span>
        </span>
        <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <span className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/75">
            <span
              aria-hidden="true"
              className="h-px w-5 bg-[image:var(--ouro-degrade)]"
            />
            loja
          </span>
          <h3 className="mt-1.5 text-[2rem] font-semibold leading-none tracking-[-0.035em] text-white md:text-[2.2rem]">
            {unidade.bairro}
          </h3>
        </figcaption>
      </figure>

      {/* Endereço, mapa da rua e ações */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[0.95rem] leading-snug text-grafite">
          {unidade.endereco}
          <span className="text-cinza">, Petrópolis/RJ</span>
        </p>
        {unidade.telefone && (
          <a
            href={`tel:+55${unidade.telefone.replace(/\D/g, "")}`}
            className="mt-1.5 w-fit text-sm tabular-nums text-cinza transition-colors hover:text-navy"
          >
            Telefone {unidade.telefone}
          </a>
        )}
        {/* Mapa e ações descem juntos, para alinhar nas três vitrines */}
        <div className="mt-auto pt-4">
          <MapaLoja
            lat={unidade.lat}
            lon={unidade.lon}
            nome={unidade.bairro}
            className="h-28 rounded-2xl ring-1 ring-inset ring-fio"
          />
          <div className="flex items-center gap-2 pt-5">
            <a
              href={linkMapaUnidade(unidade.bairro, unidade.endereco)}
              target="_blank"
              rel="noopener noreferrer"
              className="botao botao-principal botao-compacto !min-h-11 !gap-2 flex-1"
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
      </div>
    </article>
  );
}
