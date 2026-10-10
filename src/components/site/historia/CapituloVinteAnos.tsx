"use client";
// Capítulo 03 da página A Viver Bem: a folha escura (08/10/2026). A única
// seção em azul-noite da página, com o topo arredondado deslizando por
// cima da linha do tempo. O "20" gigante em ouro cresce e assenta enquanto
// a folha entra na tela; a foto da fachada tem paralaxe; e quando a folha
// branca do capítulo 04 sobe por cima, o miolo desta recua um pouco e
// escurece, como uma página que fica para trás. Tudo anda com a rolagem
// da pessoa (motor.ts). O texto é o da farmácia.
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
        <p className="rotulo-pilula">03 · {anos} anos</p>

        {/* O número gigante e a legenda dele */}
        <div ref={linhaNumero} className="mt-4 md:mt-6 flex items-end gap-4 md:gap-7">
          <span ref={numero} className="numero-tinta numero-gigante origin-bottom-left">
            {anos}
          </span>
          <span className="pb-[0.45em] text-white/80 text-[clamp(1.1rem,0.85rem+1vw,1.75rem)] leading-tight max-w-[9ch]">
            anos construindo cuidado
          </span>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-14 items-center">
          <FotoParalaxe
            src="/fotos/sobre/vinte-anos.webp"
            alt="Fachada de uma loja da Viver Bem, com a equipe na porta"
            largura={692}
            altura={490}
            className="lg:col-span-5 w-full aspect-[4/3] rounded-[1.75rem]"
          />
          <div className="lg:col-span-7">
            <h2
              id="titulo-vinte-anos"
              className="titulo-banner text-[clamp(1.6rem,1.1rem+1.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-balance"
            >
              Uma trajetória guiada pela ciência, <span className="italic">pelo carinho e pela dedicação.</span>
            </h2>
            <p className="mt-5 text-white/75 text-[1rem] md:text-[1.06rem] leading-relaxed max-w-[60ch]">
              Em {anos} anos, construímos uma história guiada pela ciência, pelo carinho e pela
              dedicação a cada pessoa que passa pela nossa porta. Mais do que preparar
              fórmulas, acompanhamos gerações inteiras de famílias. E seguimos com o mesmo
              propósito do primeiro dia.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
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
