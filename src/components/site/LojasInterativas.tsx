"use client";
// As lojas com o mapa ao vivo (página /lojas, 11/10/2026, pedido: "deixe
// a página de lojas mais dinâmica"): a lista das três unidades à esquerda
// (número em ouro, bairro grande, endereço) e, ao lado, preso ao rolar no
// computador, o cartão da loja escolhida com o mapa do Google embutido,
// o estado ao vivo (aberto ou fechado, e a que horas muda), o endereço e
// as ações. Tocar numa loja troca o mapa. O mapa é o embed público do
// Google Maps (sem chave), carregado só quando chega à tela.
import { useState } from "react";
import { useEstadoLoja } from "./HorarioAtendimento";
import { IconeWhatsApp, SetaDireita } from "./icones";
import { linkMapaUnidade, WHATSAPP_NUMERO } from "@/lib/tipos";

export interface LojaInterativa {
  bairro: string;
  endereco: string;
  telefone: string | null;
}

function IconePino() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LojasInterativas({ unidades }: { unidades: LojaInterativa[] }) {
  const [ativa, setAtiva] = useState(0);
  const estado = useEstadoLoja();
  const loja = unidades[Math.min(ativa, unidades.length - 1)];
  const busca = `Manipulação Viver Bem, ${loja.endereco}, ${loja.bairro}, Petrópolis RJ`;
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(busca)}&hl=pt-BR&z=16&output=embed`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      {/* ---------- A lista: tocar numa loja troca o mapa ---------- */}
      <ol className="lg:col-span-6 border-y border-fio divide-y divide-fio" aria-label="As lojas">
        {unidades.map((u, i) => {
          const escolhida = i === ativa;
          return (
            <li key={u.bairro}>
              <button
                type="button"
                onClick={() => setAtiva(i)}
                aria-pressed={escolhida}
                className="group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-x-4 py-6 text-left transition-opacity md:grid-cols-[4.5rem_1fr_auto] md:py-8"
              >
                <span aria-hidden="true" className={`numero-tinta text-[1.9rem] md:text-[2.4rem] leading-none transition-opacity ${escolhida ? "" : "opacity-50"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[1.5rem] md:text-[1.9rem] font-semibold tracking-[-0.035em] leading-tight transition-colors ${escolhida ? "text-navy" : "text-navy/60 group-hover:text-navy"}`}>
                    {u.bairro}
                  </span>
                  <span className="mt-1 block text-[0.95rem] text-cinza leading-snug">{u.endereco}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                    escolhida ? "bg-navy text-white" : "bg-gelo text-navy group-hover:bg-fio"
                  }`}
                >
                  <SetaDireita tamanho={16} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ---------- O cartão da loja escolhida, com o mapa ---------- */}
      <div className="lg:col-span-6 lg:sticky lg:top-[calc(var(--altura-cabecalho)+1.5rem)]">
        <div className="overflow-hidden rounded-[2rem] border border-fio bg-white shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)]">
          <div className="relative aspect-[4/3] bg-gelo sm:aspect-[16/10]">
            <iframe
              key={loja.bairro}
              title={`Mapa da loja ${loja.bairro}`}
              src={mapa}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rotulo-pilula">{loja.bairro}</span>
              {estado && (
                <span role="status" className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                  <span className={estado.aberto ? "text-green-700" : "text-cinza"}>
                    {estado.aberto ? "Aberto agora" : "Fechado"} · {estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1)}
                  </span>
                </span>
              )}
            </div>
            <p className="mt-3 text-[1.05rem] font-medium text-navy leading-snug">{loja.endereco}, Petrópolis/RJ</p>
            {loja.telefone && <p className="mt-1 text-sm text-cinza tabular-nums">Telefone {loja.telefone}</p>}
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href={linkMapaUnidade(loja.bairro, loja.endereco)}
                target="_blank"
                rel="noopener noreferrer"
                className="botao botao-principal botao-compacto !min-h-11 !gap-2"
              >
                <IconePino />
                Como chegar
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Falar no WhatsApp sobre a loja ${loja.bairro}`}
                className="botao botao-secundario !min-h-11 w-11 !px-0"
              >
                <IconeWhatsApp tamanho={19} className="text-[#25D366]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
