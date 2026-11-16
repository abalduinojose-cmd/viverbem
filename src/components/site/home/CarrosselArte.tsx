"use client";
// A dobra em modo arte com mais de uma imagem: as artes ficam empilhadas e
// se alternam num fade (7s, parado enquanto o mouse está em cima ou a aba
// está escondida), com as bolinhas no alto para trocar na mão. A primeira
// arte fica no fluxo e dá a altura; as outras ficam por cima, absolutas.
// Os botões da dobra vêm por cima de tudo (children).
// 14/10/2026: cada arte pode ser foto, GIF ou vídeo (MidiaBanner).
import { useEffect, useRef, useState } from "react";
import type { ArteHero } from "@/lib/hero";
import { MidiaBanner } from "./MidiaBanner";

const INTERVALO_MS = 7000;

export function CarrosselArte({ artes, children }: { artes: ArteHero[]; children: React.ReactNode }) {
  const [ativa, setAtiva] = useState(0);
  const pausado = useRef(false);

  useEffect(() => {
    if (artes.length < 2) return;
    const relogio = setInterval(() => {
      if (pausado.current || document.hidden) return;
      setAtiva((a) => (a + 1) % artes.length);
    }, INTERVALO_MS);
    return () => clearInterval(relogio);
  }, [artes.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausado.current = true)}
      onMouseLeave={() => (pausado.current = false)}
      onFocusCapture={() => (pausado.current = true)}
      onBlurCapture={() => (pausado.current = false)}
    >
      {artes.map((arte, i) => (
        <div
          key={arte.desktop.url}
          aria-hidden={i !== ativa}
          className={`${i === 0 ? "relative" : "absolute inset-0"} block transition-opacity duration-700 ${i === ativa ? "opacity-100" : "opacity-0"}`}
        >
          <MidiaBanner
            desktop={arte.desktop}
            celular={arte.celular}
            prioridade={i === 0}
            largura={1920}
            altura={760}
            className="block w-full h-full min-h-[26rem] md:min-h-[22rem] md:max-h-[34rem] object-cover"
          />
        </div>
      ))}

      {children}

      {artes.length > 1 && (
        <div className="absolute top-4 inset-x-0 flex justify-center gap-1" role="tablist" aria-label="Qual arte mostrar">
          {artes.map((arte, i) => (
            <button
              key={arte.desktop.url}
              type="button"
              role="tab"
              aria-selected={i === ativa}
              aria-label={`Arte ${i + 1} de ${artes.length}`}
              onClick={() => setAtiva(i)}
              className="group/ponto flex h-11 min-w-8 items-center justify-center px-1"
            >
              <span
                aria-hidden="true"
                className={`block h-2 rounded-full transition-[width,background-color] duration-300 ease-out ${
                  i === ativa ? "w-7 bg-[image:var(--ouro-degrade)]" : "w-2 bg-white/50 group-hover/ponto:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
