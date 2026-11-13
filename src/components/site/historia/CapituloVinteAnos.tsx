"use client";
// Capítulo 03 da página A Viver Bem: a folha escura (08/10/2026). A única
// seção em azul-noite da página, com o topo arredondado deslizando por
// cima da linha do tempo. O "20" gigante em ouro cresce e assenta enquanto
// a folha entra na tela; a foto da fachada tem paralaxe; e quando a folha
// branca do capítulo 04 sobe por cima, o miolo desta recua um pouco e
// escurece, como uma página que fica para trás. Tudo anda com a rolagem
// da pessoa (motor.ts). O texto é o da farmácia.
//
// 13/11/2026 ("coloque essa foto no lugar; quero essa parte mais moderna e
// clean, mas mantenha a essência"): a foto da fachada deu lugar à da
// EQUIPE NO LABORATÓRIO, em pé (4:5), à direita no computador, com uma
// etiqueta de vidro discreta embaixo ("Nosso laboratório", "manipulação
// desde 2006"). O texto foi para a esquerda, com mais ar e uma medida mais
// curta. No celular a foto vem logo depois do "20". Ficaram a folha
// azul-noite, o "20" que cresce, a paralaxe e o recuo sob a folha branca.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BotaoEnviarReceita, IconeReceita } from "../BotaoEnviarReceita";
import { FotoParalaxe } from "./FotoParalaxe";
import { registrarCena, entre, limitar, suavizarSaida } from "./motor";

function SetaDireita() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CapituloVinteAnos({ anos, lojas }: { anos: number; lojas: number }) {
  const secao = useRef<HTMLElement>(null);
  const linhaNumero = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);
  const miolo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = secao.current;
    const linha = linhaNumero.current;
    const n = numero.current;
    const m = miolo.current;
    if (!s || !linha || !n || !m) return;

    // O "20" cresce de 70% para o tamanho cheio e acende enquanto sobe pela tela
    const crescer = registrarCena(linha, {
      medir: entre(1, 0.35),
      suavidade: 0.12,
      aplicar: (p) => {
        const e = suavizarSaida(p);
        n.style.transform = `translate3d(0, ${((1 - e) * 16).toFixed(2)}%, 0) scale(${(0.7 + 0.3 * e).toFixed(4)})`;
        n.style.opacity = String(Math.round((0.18 + 0.82 * e) * 100) / 100);
      },
    });

    // Quando a base da folha sobe da borda da tela até 45% dela (a folha
    // branca seguinte cobrindo), o miolo recua e escurece
    const recuar = registrarCena(s, {
      suavidade: 0.12,
      medir: (c) => limitar((c.janela - (c.topo + c.altura)) / (c.janela * 0.55)),
      aplicar: (q) => {
        m.style.transform = q > 0 ? `translate3d(0, ${(q * 3).toFixed(2)}rem, 0) scale(${(1 - 0.05 * q).toFixed(4)})` : "";
        m.style.opacity = q > 0 ? String(Math.round((1 - 0.55 * q) * 100) / 100) : "";
      },
    });

    return () => {
      crescer();
      recuar();
    };
  }, []);

  return (
    <section
      ref={secao}
      id="vinte-anos"
      aria-labelledby="titulo-vinte-anos"
      className="folha-noite em-noite relative z-[1] -mt-9 overflow-hidden rounded-t-[2.25rem] md:rounded-t-[3rem] scroll-mt-[calc(var(--altura-cabecalho)+1rem)]"
    >
      <span aria-hidden="true" className="malha-banner" />
      <div ref={miolo} className="capitulo capitulo-sob-folha relative max-w-6xl mx-auto px-5 md:px-8 origin-bottom">
        {/* Grade: no celular, cabeça, foto e texto em sequência; no
            computador a cabeça e o texto à esquerda e a foto alta à direita,
            ao lado dos dois */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-10">
          <div className="lg:col-span-7 lg:row-start-1">
            <p className="rotulo-pilula">{anos} anos de história</p>

            {/* O número gigante e a legenda dele */}
            <div ref={linhaNumero} className="mt-4 md:mt-6 flex items-end gap-4 md:gap-6">
              <span ref={numero} className="numero-tinta numero-gigante origin-bottom-left">
                {anos}
              </span>
              <span className="pb-[0.45em] text-white/80 text-[clamp(1.1rem,0.85rem+1vw,1.6rem)] leading-tight max-w-[9ch]">
                anos construindo cuidado
              </span>
            </div>
          </div>

          {/* A equipe no laboratório, com a etiqueta de vidro */}
          <figure className="relative lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center">
            <FotoParalaxe
              src="/fotos/sobre/laboratorio-equipe.webp"
              alt="Equipe do laboratório da Viver Bem manipulando fórmulas na bancada"
              largura={960}
              altura={1200}
              className="w-full aspect-[4/5] rounded-[2rem] ring-1 ring-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-[1.1rem] bg-noite/55 px-4 py-3 ring-1 ring-inset ring-white/15 backdrop-blur-md md:bottom-5 md:left-5 md:right-auto">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[image:var(--ouro-degrade)] shadow-[0_0_0_4px_rgba(201,165,107,0.2)]" />
              <span className="leading-tight">
                <span className="block text-[0.95rem] font-semibold tracking-[-0.01em] text-white">Nosso laboratório</span>
                <span className="block text-[0.8rem] text-white/65">manipulação desde 2006</span>
              </span>
            </figcaption>
          </figure>

          <div className="lg:col-span-7 lg:row-start-2">
            <h2
              id="titulo-vinte-anos"
              className="titulo-banner text-[clamp(1.75rem,1.15rem+1.8vw,2.6rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-balance max-w-[20ch]"
            >
              Uma trajetória guiada pela ciência, <span className="italic">pelo carinho e pela dedicação.</span>
            </h2>
            <span aria-hidden="true" className="mt-7 block h-px w-14 bg-[image:var(--ouro-degrade)]" />
            <p className="mt-7 text-white/75 text-[1rem] md:text-[1.08rem] leading-[1.75] max-w-[52ch]">
              Em {anos} anos, construímos uma história guiada pela ciência, pelo carinho e pela
              dedicação a cada pessoa que passa pela nossa porta. Mais do que preparar
              fórmulas, acompanhamos gerações inteiras de famílias. E seguimos com o mesmo
              propósito do primeiro dia.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <BotaoEnviarReceita comIcone={false} className="botao botao-vivo !gap-2.5">
                <span className="text-ouro-escuro">
                  <IconeReceita tamanho={20} />
                </span>
                Enviar receita
              </BotaoEnviarReceita>
              <Link href="/lojas" className="botao botao-vidro !gap-2">
                Nossas {lojas} lojas
                <SetaDireita />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
