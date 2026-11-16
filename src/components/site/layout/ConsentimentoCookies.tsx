"use client";
// O aviso de cookies (21/10/2026, barra de borda a borda; 23/10/2026,
// cartão pequeno no canto, "menor e mais clean").
// "Aceitar" liga a medição (Google Analytics); "Só os necessários" deixa o
// site como está. Só aparece enquanto a pessoa não escolheu; o link
// "Cookies" do rodapé abre de novo para mudar a escolha. Os cookies
// necessários não dependem de aceite (a sessão do painel, só para a
// equipe, e esta própria escolha). Entra deslizando de baixo em WAAPI
// (roda também com movimento reduzido).
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
        { transform: "translateY(100%)", opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)", delay: 500, fill: "backwards" }
    );
    return () => a.cancel();
  }, [aberto]);

  if (!aberto) return null;

  const escolher = (aceitou: boolean) => {
    guardarConsentimento(aceitou);
    setAberto(false);
  };

  return (
    // 23/10/2026 ("deixe o cookies menor e mais clean, com uma frase menos
    // técnica, padrão de farmácia de manipulação"): um cartão pequeno no
    // canto de baixo à esquerda (no celular, uma folha baixa com margem),
    // sem título nem ícone, uma frase só e dois botões pequenos. A frase é
    // a que os sites de farmácia usam ("Usamos cookies para melhorar a sua
    // experiência..."), com o link da política; a escolha continua valendo
    // para o Google Analytics (aceitar liga, "só os necessários" não).
    <div
      ref={caixa}
      role="dialog"
      aria-label="Aviso de cookies"
      aria-describedby="cookies-texto"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-[1.25rem] banner-noite em-noite text-white shadow-[0_24px_60px_-28px_rgba(13,35,64,0.7)] ring-1 ring-inset ring-white/10 md:inset-x-auto md:left-6 md:bottom-6 md:mx-0 md:w-[24rem]"
    >
      <span aria-hidden="true" className="malha-banner rounded-[1.25rem]" />
      <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-ouro/70 to-transparent" />
      <div className="relative px-5 pt-4 pb-4">
        <p id="cookies-texto" className="text-[0.86rem] leading-relaxed text-white/85">
          Usamos cookies para melhorar a sua experiência no site. Saiba mais na nossa{" "}
          <Link href="/privacidade#cookies" className="font-medium text-[#e1c68f] underline-offset-4 hover:underline">
            Política de privacidade
          </Link>
          .
        </p>
        <div className="mt-3.5 flex items-center justify-end gap-2">
          <button type="button" onClick={() => escolher(false)} className="inline-flex h-10 items-center rounded-full px-3.5 text-[0.82rem] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white">
            Só os necessários
          </button>
          <button type="button" onClick={() => escolher(true)} className="inline-flex h-10 items-center rounded-full bg-white px-5 text-[0.85rem] font-semibold text-navy transition-colors hover:bg-[#f3ead9]">
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
