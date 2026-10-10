// LOJAS: as 3 unidades da Viver Bem em Petrópolis, cada uma num cartão
// com a foto, o endereço, "Como chegar" e o WhatsApp; embaixo, o horário
// com o estado ao vivo. Sistema "Branco, azul e ouro" (06/10/2026).
//
// 10/10/2026 ("modernize a página e coloque as fotos das 3 unidades, deixe
// bem clean e moderno"): a lista com fio virou três cartões com a foto da
// loja em cima (4:3, com a pílula do número e "retirada grátis"), o bairro
// grande, o endereço, o telefone fixo (só o Centro tem) e as duas ações.
// As fotos ficam SÓ nesta página (pedido). PROVISÓRIAS até o cliente
// mandar a foto real de cada unidade: por enquanto são as fotos da equipe
// e da fachada usadas na página A Viver Bem (public/fotos/sobre/). Para
// trocar, é só gravar os arquivos novos e ajustar FOTOS abaixo.
import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { UNIDADES, linkMapaUnidade, WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";
import { HorarioAtendimento } from "@/components/site/HorarioAtendimento";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { IconeWhatsApp } from "@/components/site/icones";

export const metadata: Metadata = {
  title: "Lojas · Manipulação Viver Bem",
  description:
    "As 3 lojas da Viver Bem em Petrópolis: Centro, Corrêas e Posse. Fotos, endereços, horário e como chegar.",
};

// A foto de cada loja, pelo bairro (PROVISÓRIAS, ver o comentário no alto)
const FOTOS: Record<string, { src: string; alt: string; largura: number; altura: number; posicao?: string }> = {
  Centro: {
    src: "/fotos/sobre/equipe-loja.webp",
    alt: "Equipe da Viver Bem dentro da loja",
    largura: 1200,
    altura: 749,
    posicao: "50% 35%",
  },
  Corrêas: {
    src: "/fotos/sobre/geracoes.webp",
    alt: "Equipe da Viver Bem na entrada da loja, entre as prateleiras",
    largura: 638,
    altura: 611,
  },
  Posse: {
    src: "/fotos/sobre/vinte-anos.webp",
    alt: "Fachada da loja da Viver Bem, com a equipe na porta",
    largura: 692,
    altura: 490,
  },
};

function IconePino() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function PaginaLojas() {
  return (
    <main className="flex-1">
      {/* ---------- Abertura ---------- */}
      <section className="halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">onde nos encontrar</p>
            <h1 className="titulo-secao vao-rotulo">
              {UNIDADES.length} lojas em <span className="italic">Petrópolis</span>
            </h1>
          </div>
          <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5 lg:text-right">
            Retire grátis na loja que preferir, ou receba em casa, de moto. O horário é o mesmo
            nas três.
          </p>
        </div>
      </section>

      {/* ---------- As lojas, em cartões com a foto ---------- */}
      <section aria-label="As lojas" className="px-5 md:px-8">
        <ul className="escalonado max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {UNIDADES.map((u, i) => {
            const foto = FOTOS[u.bairro];
            return (
              <li
                key={u.bairro}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-fio bg-white shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)] transition duration-300 hover:-translate-y-1 hover:border-ouro/40"
              >
                {/* A foto, com o número e "retirada grátis" numa pílula branca */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gelo">
                  {foto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(foto.src)}
                      alt={foto.alt}
                      width={foto.largura}
                      height={foto.altura}
                      loading={i === 0 ? undefined : "lazy"}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={foto.posicao ? { objectPosition: foto.posicao } : undefined}
                    />
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-2 h-7 pl-2.5 pr-3 rounded-full bg-white/92 text-navy text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
                    <span aria-hidden="true" className="numero-tinta text-[0.85rem] leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    retirada grátis
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h2 className="text-[1.45rem] md:text-[1.6rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
                    {u.bairro}
                  </h2>
                  <p className="mt-1.5 text-cinza leading-relaxed">{u.endereco}</p>
                  {u.telefone && <p className="mt-1 text-sm text-cinza tabular-nums">Telefone {u.telefone}</p>}

                  {/* As ações: o mapa é a principal; o WhatsApp é o mesmo das três */}
                  <div className="mt-auto pt-5 flex items-center gap-2.5">
                    <a
                      href={linkMapaUnidade(u.bairro, u.endereco)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="botao botao-principal botao-compacto !min-h-11 flex-1 !gap-2"
                    >
                      <IconePino />
                      Como chegar
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMERO}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Falar no WhatsApp sobre a loja ${u.bairro}`}
                      className="botao botao-secundario !min-h-11 w-11 !px-0"
                    >
                      <IconeWhatsApp tamanho={19} className="text-[#25D366]" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Horário e o pedido pela receita ---------- */}
      <section className="px-5 md:px-8 max-w-6xl mx-auto pt-12 md:pt-16 pb-14 md:pb-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div>
            <p className="rotulo-pilula">horário de atendimento</p>
            <h2 className="titulo-bloco vao-rotulo">
              O mesmo nas <span className="italic">{UNIDADES.length} lojas</span>
            </h2>
            <p className="text-cinza leading-relaxed mt-4 max-w-md">
              Prefere pedir de casa? Mande a foto da receita pelo site e finalize no WhatsApp, no{" "}
              {WHATSAPP_LOJA}. A gente entrega de moto ou separa na loja que você escolher.
            </p>
            <BotaoEnviarReceita className="botao botao-principal mt-7" />
          </div>

          {/* Horário com o estado ao vivo, em ficha clara */}
          <HorarioAtendimento />
        </div>
      </section>
    </main>
  );
}
