"use client";
// Vitrine dos vídeos do Instagram da farmácia, no formato vertical dos
// reels. Os arquivos ficam em public/videos/, com a capa de cada um ao
// lado (reel-N.jpg, gerada por scripts/gerar-posteres.js).
//
// Os vídeos NÃO tocam sozinhos: cada cartão mostra a capa e só carrega o
// arquivo quando a pessoa aperta o play, para a home não pesar. Tocar um
// pausa o anterior.
//
// Sistema "Receita e rótulo" (06/10/2026): sem a caixa em volta; texto à
// esquerda e os dois reels à direita, em cantos de 20px.

import { useEffect, useRef, useState } from "react";
import { INSTAGRAM_PERFIL, INSTAGRAM_URL } from "@/lib/tipos";
import { asset } from "@/lib/asset";

// Só os reels institucionais (equipe, laboratório, loja). O terceiro
// saiu: mostrava manipulados pelo nome de marca e chamava para
// "conhecer esses produtos", o caso que a Anvisa puniu (RE 3.547/2026).
// Antes de colocar um reel novo aqui, o farmacêutico precisa ver (e
// ouvir) o vídeo inteiro.
const REELS = [
  { arquivo: "/videos/reel-1.mp4", capa: "/videos/reel-1.jpg", titulo: "Curiosidades da manipulação" },
  { arquivo: "/videos/reel-2.mp4", capa: "/videos/reel-2.jpg", titulo: "Quem faz a Viver Bem" },
];

function IconeInstagram({ tamanho = 20 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function ReelsInstagram() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [tocando, setTocando] = useState<number | null>(null);

  function alternar(indice: number) {
    const video = refs.current[indice];
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setTocando(null);
      return;
    }

    // Só um vídeo por vez
    refs.current.forEach((v, i) => {
      if (v && i !== indice) v.pause();
    });
    video.play();
    setTocando(indice);
  }

  // Pausa o que estiver tocando quando sai da tela
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) {
            const video = e.target as HTMLVideoElement;
            if (!video.paused) {
              video.pause();
              setTocando(null);
            }
          }
        });
      },
      { threshold: 0.35 }
    );
    refs.current.forEach((v) => v && observador.observe(v));
    return () => observador.disconnect();
  }, []);

  return (
    <section aria-labelledby="titulo-reels" className="secao max-w-7xl mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-9 lg:items-center">
        {/* Cabeçalho */}
        <div className="revelar lg:col-span-5">
          <p className="rotulo">acompanhe a gente</p>
          <h2 id="titulo-reels" className="titulo-secao vao-rotulo">
            Por dentro da <span className="italic">Viver Bem</span>
          </h2>
          <p className="texto-apoio mt-4 max-w-md">
            O laboratório, a loja e quem faz a farmácia no dia a dia, direto do nosso
            Instagram.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="botao botao-secundario mt-8"
          >
            <IconeInstagram />@{INSTAGRAM_PERFIL}
          </a>
        </div>

        {/* Vídeos */}
        <div className="revelar lg:col-span-7 flex gap-4 md:gap-6 overflow-x-auto rolagem-sem-barra snap-x snap-mandatory -mx-5 px-5 pb-2 lg:mx-0 lg:px-0 lg:justify-end">
          {REELS.map((reel, i) => (
            <div
              key={reel.arquivo}
              className="group relative snap-start shrink-0 w-[15rem] sm:w-[16.5rem] aspect-[9/16] overflow-hidden rounded-caixa bg-gelo shadow-[0_30px_60px_-30px_rgba(13,35,64,0.45)]"
            >
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                src={asset(reel.arquivo)}
                poster={asset(reel.capa)}
                preload="none"
                playsInline
                loop
                onEnded={() => setTocando(null)}
                className="w-full h-full object-cover"
              />

              {/* Botão de play sobre o vídeo */}
              <button
                type="button"
                onClick={() => alternar(i)}
                aria-label={tocando === i ? `Pausar: ${reel.titulo}` : `Assistir: ${reel.titulo}`}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* A cortina escura some enquanto o vídeo roda */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-t from-noite/45 via-transparent to-noite/10 transition-opacity duration-300 ${
                    tocando === i ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`relative w-14 h-14 rounded-full bg-white/95 text-tinta flex items-center justify-center shadow-[0_14px_30px_-12px_rgba(16,42,74,0.55)] transition duration-300 ${
                    tocando === i
                      ? "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                      : "opacity-100 group-hover:scale-105"
                  }`}
                >
                  {tocando === i ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1.2" />
                      <rect x="14" y="5" width="4" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </span>
              </button>

              {/* Selo do Instagram, fora do botão para poder ser clicado */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver no Instagram de @${INSTAGRAM_PERFIL}`}
                className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 flex items-center justify-center transition duration-300 ${
                  tocando === i ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                }`}
              >
                <IconeInstagram tamanho={18} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
