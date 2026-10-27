"use client";
// "Fale com a gente", o convite logo antes do rodapé escuro.
//
// Histórico curto: de 06/10 a 14/10/2026 foi um bloco grande (cartões da
// receita e do WhatsApp, as 3 lojas com mapa e o horário). Em 25/10/2026,
// em cinco voltas no mesmo dia, virou faixa, barra, cartão com trilha,
// cartão lapidado e linha sem caixa, e depois uma chamada editorial
// centrada (adendo 102). Em 27/10/2026 veio um índice em linhas com fio, e
// a resposta foi "nada que você fez tá legal nessa parte; quero algo
// totalmente moderno, estude tudo que já fizemos".
//
// Oitava versão (27/10/2026): um BENTO de quatro peças, montado só com o
// que o site já tem de aprovado:
//   - o cabeçalho das seções (rótulo, título em duas vozes, a frase à
//     direita), igual ao do "Como funciona";
//   - a peça da RECEITA, alta, é o cartão aceso do "Como funciona": azul
//     noite, a malha de laboratório, a luz de ouro no canto, pílulas de
//     vidro e o botão vivo com o fio de ouro girando;
//   - o MAPA de verdade com os três pinos (o mesmo do 14/10, que ele
//     aprovou: "mais simples, com os pontos e o mapa real"), com os
//     bairros em pílulas por cima: passar numa pílula acende o pino;
//   - o WHATSAPP numa peça branca com o verde do ícone e o número;
//   - o HORÁRIO com a loja ao vivo e a grade da semana, o dia de hoje aceso.
// As peças entram em cascata ao rolar (.escalonado) e sobem de leve ao
// passar o mouse, como os cartões do site. Nada saiu do site: WhatsApp,
// lojas e horário completos seguem em /contato e /lojas, onde este bloco
// não aparece (nem na página do produto).
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { HORARIOS, useEstadoLoja } from "./HorarioAtendimento";
import { MapaTresLojas } from "./MapaTresLojas";
import { useCarrinho } from "@/lib/carrinho";
import { IconeRelogio, IconeWhatsApp, SetaDireita } from "./icones";
import { IconeReceita } from "./BotaoEnviarReceita";
import { UNIDADES, WHATSAPP_LOJA, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";

const ROTAS_SEM_O_BLOCO = ["/lojas", "/contato"];
const PREFIXOS_SEM_O_BLOCO = ["/produto/"];

// A peça branca do bento: fio, canto grande, sobe de leve ao passar o mouse
const PECA_CLARA =
  "group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-white p-5 md:p-6 ring-1 ring-inset ring-fio shadow-[0_24px_50px_-42px_rgba(16,42,74,0.45)] transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-40px_rgba(16,42,74,0.55)]";

export function FaleComAGente() {
  const estado = useEstadoLoja();
  const { abrirPedido } = useCarrinho();
  const [lojaAtiva, setLojaAtiva] = useState<number | null>(null);
  // (na prévia estática a rota vem com a barra no fim, "/lojas/")
  const rota = (usePathname() ?? "").replace(/\/+$/, "") || "/";
  if (ROTAS_SEM_O_BLOCO.includes(rota) || PREFIXOS_SEM_O_BLOCO.some((p) => rota.startsWith(p))) return null;

  const detalhe = estado ? estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1) : "";

  return (
    <section aria-labelledby="fale-com-a-gente" className="halo-marca relative border-t border-fio bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20 lg:py-24">
        {/* O cabeçalho, como no "Como funciona" */}
        <div className="revelar grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">fale com a gente</p>
            <h2 id="fale-com-a-gente" className="titulo-secao vao-rotulo">
              Pelo WhatsApp, pela receita <span className="italic">ou na loja</span>
            </h2>
          </div>
          <p className="texto-apoio max-w-md lg:col-span-5 lg:pb-1.5 lg:text-right">
            Tire dúvidas, envie a receita ou combine a retirada. A equipe responde no horário das lojas.
          </p>
        </div>

        {/* O bento */}
        <div className="escalonado mt-8 md:mt-10 grid grid-cols-1 gap-3.5 md:gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_auto]">
          {/* 1. A receita: o cartão aceso */}
          <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-noite p-6 md:p-8 text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-34px_rgba(13,35,64,0.7)] sm:col-span-2 lg:col-span-5 lg:row-span-2 min-h-[22rem] lg:min-h-[27rem]">
            <span aria-hidden="true" className="malha-banner" />
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.36),transparent_62%)]" />
            {/* A receita grande, apagada, como marca d'água do cartão */}
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 text-[#e1c68f] opacity-[0.09] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
              <IconeReceita tamanho={220} />
            </span>

            <span className="relative text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#e1c68f]/85">O jeito mais rápido</span>
            <h3 className="relative mt-4 max-w-[14ch] text-[1.75rem] md:text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
              Envie a receita e receba o <span className="font-[family-name:var(--font-destaque)] font-normal italic text-[#e1c68f]">orçamento</span>
            </h3>
            <p className="relative mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-white/75">
              Foto ou PDF. O farmacêutico confere cada fórmula e responde com o valor e o prazo.
            </p>

            <ul className="relative mt-5 flex flex-wrap gap-2">
              {["Foto ou PDF", "Confere com o farmacêutico", "Retirada ou entrega"].map((t) => (
                <li key={t} className="botao-vidro inline-flex h-8 items-center rounded-full px-3 text-[0.78rem] font-medium">
                  {t}
                </li>
              ))}
            </ul>

            <div className="relative mt-auto pt-8">
              <button type="button" onClick={() => abrirPedido()} data-receita-cta className="botao botao-vivo w-full sm:w-auto !min-h-[3.25rem] !px-7">
                <IconeReceita tamanho={19} />
                Enviar receita
                <SetaDireita tamanho={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </article>

          {/* 2. O mapa com os três pinos e os bairros em pílulas */}
          <article className={`${PECA_CLARA} !p-0 sm:col-span-2 lg:col-span-7 lg:min-h-[17rem]`}>
            {/* No celular o mapa é uma caixa e a faixa vem embaixo; no desktop o mapa
                enche a peça e a faixa flutua por cima, com folga para os pinos */}
            <MapaTresLojas ativa={lojaAtiva} aoDestacar={setLojaAtiva} className="relative h-56 sm:h-64 lg:absolute lg:inset-0 lg:h-auto lg:[--folga-baixo:88]" />
            {/* A faixa de vidro com os bairros e o link para as lojas */}
            <div className="relative mt-auto flex flex-wrap items-center gap-2 p-3.5 md:p-4 lg:mx-4 lg:mb-4 lg:rounded-2xl lg:bg-white/85 lg:p-3.5 lg:ring-1 lg:ring-inset lg:ring-white/70 lg:shadow-[0_18px_40px_-28px_rgba(13,35,64,0.5)] lg:backdrop-blur-md">
              <span className="mr-1 w-full sm:w-auto text-[0.8rem] font-semibold text-navy">{UNIDADES.length} lojas em Petrópolis</span>
              {UNIDADES.map((u, i) => (
                <a
                  key={u.bairro}
                  href={linkMapaUnidade(u.bairro, u.endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setLojaAtiva(i)}
                  onMouseLeave={() => setLojaAtiva(null)}
                  onFocus={() => setLojaAtiva(i)}
                  onBlur={() => setLojaAtiva(null)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.78rem] font-semibold transition-colors ${
                    lojaAtiva === i ? "bg-navy text-white" : "bg-gelo text-navy hover:bg-tinta hover:text-white"
                  }`}
                >
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${lojaAtiva === i ? "bg-[#e1c68f]" : "bg-tinta"}`} />
                  {u.bairro}
                </a>
              ))}
              <Link href="/lojas" className="group/l ml-auto inline-flex h-8 items-center gap-1.5 text-[0.8rem] font-semibold text-tinta">
                Endereços e horários
                <SetaDireita tamanho={14} className="transition-transform duration-300 group-hover/l:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* 3. O WhatsApp: a peça inteira é o link */}
          <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer" className={`${PECA_CLARA} lg:col-span-4 hover:ring-[#1DA851]/40`}>
            <span className="flex items-start justify-between gap-3">
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-2xl bg-[#1DA851]/10 text-[#128C4B] transition-colors duration-500 group-hover:bg-[#1DA851] group-hover:text-white">
                <IconeWhatsApp tamanho={24} />
              </span>
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full text-tinta ring-1 ring-inset ring-fio transition duration-300 group-hover:bg-tinta group-hover:text-white group-hover:ring-tinta">
                <SetaDireita tamanho={16} />
              </span>
            </span>
            <span className="mt-5 block text-[1.25rem] md:text-[1.38rem] font-semibold leading-[1.2] tracking-[-0.03em] text-navy">Chamar no WhatsApp</span>
            <span className="mt-1 block text-[1.05rem] font-medium tabular-nums text-tinta">{WHATSAPP_LOJA}</span>
            <span className="mt-2 block text-[0.9rem] leading-relaxed text-cinza">Dúvidas, pedidos e retirada, com a equipe da loja.</span>
          </a>

          {/* 4. O horário, com a loja ao vivo */}
          <article className={`${PECA_CLARA} lg:col-span-3`}>
            <span className="flex items-center justify-between gap-3">
              <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-2xl bg-gelo text-tinta">
                <IconeRelogio tamanho={24} />
              </span>
              {estado && (
                <span role="status" className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold ${estado.aberto ? "bg-green-50 text-green-700" : "bg-nevoa text-navy"}`}>
                  <span aria-hidden="true" className="relative flex size-2">
                    {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/50 motion-safe:animate-ping" />}
                    <span className={`relative size-2 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
                  </span>
                  {estado.aberto ? "Aberto agora" : "Fechado agora"}
                </span>
              )}
            </span>
            <span className="mt-5 block text-[1.25rem] md:text-[1.38rem] font-semibold leading-[1.2] tracking-[-0.03em] text-navy">Horário das lojas</span>
            {estado && <span className="mt-1 block text-[0.9rem] text-cinza">{estado.aberto ? "Hoje, " : ""}{detalhe}</span>}
            <dl className="mt-4 space-y-1.5 text-[0.9rem]">
              {HORARIOS.map((h) => {
                const hoje = estado ? h.dias.includes(estado.dia) : false;
                return (
                  <div key={h.rotulo} className={`flex items-baseline justify-between gap-3 ${hoje ? "text-navy font-semibold" : "text-cinza"}`}>
                    <dt className="inline-flex items-center gap-2">
                      {hoje && <span aria-hidden="true" className="size-1.5 rounded-full bg-ouro" />}
                      {h.rotulo}
                    </dt>
                    <dd className="tabular-nums">{h.horas}</dd>
                  </div>
                );
              })}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
