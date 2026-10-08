"use client";
// Texto que acende palavra por palavra enquanto a pessoa rola (página A
// Viver Bem, 08/10/2026). Cada palavra começa apagada (16%) e chega a 100%
// quando a "frente de leitura" passa por ela; umas três palavras acendem
// juntas, para a frase correr como leitura. O texto inteiro está no HTML
// desde o servidor (leitores de tela e o Google leem normal) e sem
// JavaScript aparece aceso. A parte marcada como destaque sai na segunda
// voz do site: itálico serifado em ouro (classe .tinta, uma por palavra,
// porque o degradê recortado no texto precisa estar no próprio elemento).
import { Fragment, useEffect, useRef } from "react";
import { registrarCena, lerBloco } from "./motor";

export type ParteTexto = { texto: string; destaque?: boolean };

const ACESAS_JUNTAS = 3;
const APAGADA = 0.16;

export function TextoRevelado({
  partes,
  como = "p",
  className = "",
  de = 0.88,
  ate = 0.55,
}: {
  partes: ParteTexto[];
  /** A tag do bloco: parágrafo ou citação */
  como?: "p" | "blockquote";
  className?: string;
  /** Linha da tela (fração da altura) em que a leitura começa, pelo topo do bloco */
  de?: number;
  /** Linha da tela em que a leitura termina, pela base do bloco */
  ate?: number;
}) {
  const ref = useRef<HTMLParagraphElement & HTMLQuoteElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const palavras = Array.from(el.querySelectorAll<HTMLElement>("[data-palavra]"));
    const total = palavras.length;
    const ultimas = new Array<number>(total).fill(-1);
    return registrarCena(el, {
      medir: lerBloco(de, ate),
      suavidade: 0.2,
      aplicar: (p) => {
        const frente = p * (total + ACESAS_JUNTAS);
        for (let i = 0; i < total; i++) {
          const v = Math.min(1, Math.max(0, (frente - i) / ACESAS_JUNTAS));
          const opacidade = Math.round((APAGADA + (1 - APAGADA) * v) * 100) / 100;
          if (opacidade !== ultimas[i]) {
            ultimas[i] = opacidade;
            palavras[i].style.opacity = String(opacidade);
          }
        }
      },
    });
  }, [de, ate]);

  const conteudo = partes.map((parte, pi) => {
    const palavras = parte.texto.split(" ").filter(Boolean);
    return (
      <Fragment key={pi}>
        {palavras.map((palavra, wi) => (
          <Fragment key={wi}>
            <span data-palavra="" className={parte.destaque ? "tinta" : undefined}>
              {palavra}
            </span>
            {pi < partes.length - 1 || wi < palavras.length - 1 ? " " : null}
          </Fragment>
        ))}
      </Fragment>
    );
  });

  if (como === "blockquote") {
    return (
      <blockquote ref={ref} className={className}>
        {conteudo}
      </blockquote>
    );
  }
  return (
    <p ref={ref} className={className}>
      {conteudo}
    </p>
  );
}
