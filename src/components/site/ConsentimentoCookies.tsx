"use client";
// O aviso de cookies (21/10/2026): um cartão discreto no canto, que só
// aparece enquanto a pessoa não escolheu. "Aceitar" liga a medição
// (Google Analytics); "Só os necessários" deixa o site como está, sem
// cookie de medição. O link "Cookies" do rodapé abre o aviso de novo para
// mudar a escolha. Os cookies necessários não dependem de aceite: são o
// da sessão do painel (só a equipe) e esta própria escolha.
// Entra com um deslize curto em WAAPI (roda também com movimento reduzido).
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { aoPedirParaAbrir, guardarConsentimento, lerConsentimento } from "./consentimento";

export function ConsentimentoCookies() {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  // Nasce fechado no servidor e abre no navegador se ainda não há escolha
  // (no quadro seguinte, para não renderizar de novo dentro do efeito)
  useEffect(() => {
    const quadro = window.requestAnimationFrame(() => {
      if (lerConsentimento() === null) setAberto(true);
    });
    const desligar = aoPedirParaAbrir(() => setAberto(true));
    return () => {
      window.cancelAnimationFrame(quadro);
      desligar();
    };
  }, []);

  useEffect(() => {
    const el = caixa.current;
    if (!aberto || !el) return;
    const a = el.animate(
      [
        { transform: "translateY(18px)", opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)", delay: 400, fill: "backwards" }
    );
    return () => a.cancel();
  }, [aberto]);

  if (!aberto) return null;

  const escolher = (aceitou: boolean) => {
    guardarConsentimento(aceitou);
    setAberto(false);
  };

  return (
    <div
      ref={caixa}
      role="dialog"
      aria-labelledby="cookies-titulo"
      aria-describedby="cookies-texto"
      className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[24rem] rounded-[1.5rem] bg-white ring-1 ring-fio shadow-[0_30px_60px_-28px_rgba(13,35,64,0.5)] p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gelo text-tinta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3a9 9 0 1 0 9 9 3.5 3.5 0 0 1-3.6-3.6A3.5 3.5 0 0 1 14 5a3.2 3.2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <circle cx="8.5" cy="10" r="1.1" fill="currentColor" />
            <circle cx="10" cy="15.5" r="1.1" fill="currentColor" />
            <circle cx="15" cy="14" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0">
          <p id="cookies-titulo" className="font-semibold text-navy leading-snug">
            Cookies neste site
          </p>
          <p id="cookies-texto" className="mt-1 text-[0.85rem] leading-relaxed text-cinza">
            Usamos só o essencial para o site funcionar. Com o seu aceite, medimos as visitas no Google Analytics para melhorar o site. Nada é vendido nem usado para anúncios.{" "}
            <Link href="/privacidade#cookies" className="text-tinta font-medium hover:underline">
              Saiba mais
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => escolher(false)} className="botao botao-secundario flex-1 !min-h-11 !px-4 text-sm">
          Só os necessários
        </button>
        <button type="button" onClick={() => escolher(true)} className="botao botao-primario flex-1 !min-h-11 !px-4 text-sm">
          Aceitar
        </button>
      </div>
    </div>
  );
}
