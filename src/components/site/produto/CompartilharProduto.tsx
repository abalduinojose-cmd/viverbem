"use client";
// O "Compartilhar" da página do produto (23/10/2026): no celular abre a
// folha de compartilhar do aparelho; no computador copia o link e avisa.
import { useState } from "react";

export function CompartilharProduto({ nome }: { nome: string }) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: nome, text: `${nome} na Manipulação Viver Bem`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* a pessoa cancelou, ou o navegador não deixou copiar */
    }
  }

  return (
    <button
      type="button"
      onClick={compartilhar}
      className="inline-flex items-center gap-1.5 h-9 rounded-full px-3 text-[0.8rem] font-semibold text-navy ring-1 ring-inset ring-fio bg-white transition-colors hover:ring-ouro/50"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      <span aria-live="polite">{copiado ? "Link copiado" : "Compartilhar"}</span>
    </button>
  );
}
