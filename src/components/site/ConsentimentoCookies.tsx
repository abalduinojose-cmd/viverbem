"use client";
// O aviso de cookies (21/10/2026): uma barra no pé da tela, no padrão dos
// sites grandes ("deixe mais moderno e padrão"): no computador uma faixa
// de borda a borda em azul-noite, com o texto à esquerda e os dois botões à
// direita; no celular uma folha que sobe do pé, de largura inteira.
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
    <div
      ref={caixa}
      role="dialog"
      aria-labelledby="cookies-titulo"
      aria-describedby="cookies-texto"
      className="fixed inset-x-0 bottom-0 z-[60] banner-noite em-noite text-white shadow-[0_-24px_60px_-30px_rgba(13,35,64,0.6)] ring-1 ring-inset ring-white/10 rounded-t-[1.5rem] md:rounded-none"
    >
      <span aria-hidden="true" className="malha-banner" />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ouro/60 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:gap-8 md:px-8 md:py-4">
        <div className="flex items-start gap-3 md:flex-1">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#e1c68f] ring-1 ring-white/15">
            {/* O gral com o pistilo, símbolo da manipulação (22/10/2026: "não
                quero um ícone de biscoito, quero um ligado à manipulação") */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 11.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M5.5 11.5c.2 3.9 2.6 6.8 6.5 6.8s6.3-2.9 6.5-6.8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9.5 18.3v2.2h5v-2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m13.2 10.2 5.2-6.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="19" cy="3.6" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <div className="min-w-0">
            <p id="cookies-titulo" className="font-semibold leading-snug">
              Este site usa cookies
            </p>
            <p id="cookies-texto" className="mt-1 text-[0.85rem] leading-relaxed text-white/70 md:max-w-[62ch]">
              Os necessários fazem o site funcionar. Com o seu aceite, medimos as visitas no Google Analytics para melhorar o site. Nada é vendido nem usado para anúncios.{" "}
              <Link href="/privacidade#cookies" className="font-medium text-[#e1c68f] hover:underline">
                Política de privacidade
              </Link>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => escolher(false)} className="botao botao-vidro flex-1 !min-h-11 !px-5 text-sm md:flex-none">
            Só os necessários
          </button>
          <button type="button" onClick={() => escolher(true)} className="botao flex-1 !min-h-11 !px-6 text-sm md:flex-none bg-white text-navy font-semibold hover:bg-[#f3ead9]">
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
