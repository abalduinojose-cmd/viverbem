"use client";
// Os potes das linhas de produtos com vida (14/10/2026).
//
// Segunda versão, no mesmo dia ("não gostei dos movimentos, mude"): saiu o
// flutuar e inclinar na direção do mouse. Agora é movimento de vitrine:
//
//   - cada pote "respira", crescendo 3% e voltando, devagar (4,8 s);
//   - de tempos em tempos um brilho passa por cima dele, como luz batendo
//     no vidro; o brilho é recortado no formato do pote (a própria foto
//     serve de máscara), então não passa pelo fundo do círculo;
//   - os seis vão em onda: cada um começa um pouco depois do anterior.
//
// Feito com a Web Animations API, que roda também com "reduzir movimento"
// ligado, como o resto do site. As animações só correm com a seção na
// tela.
import { useEffect, useRef } from "react";

export function PoteVivo({ indice, src, children }: { indice: number; src: string; children: React.ReactNode }) {
  const caixa = useRef<HTMLSpanElement>(null);
  const faixa = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = caixa.current;
    const brilho = faixa.current;
    if (!el || !brilho) return;

    const respira = el.animate([{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }], {
      duration: 4800,
      delay: -indice * 600,
      iterations: Infinity,
      easing: "ease-in-out",
    });
    // O brilho atravessa nos primeiros 22% do ciclo e some até a próxima volta.
    // A faixa tem metade da largura: -120% e 220% a deixam inteira fora.
    const passa = brilho.animate(
      [
        { transform: "translateX(-120%) skewX(-18deg)", offset: 0 },
        { transform: "translateX(220%) skewX(-18deg)", offset: 0.22 },
        { transform: "translateX(220%) skewX(-18deg)", offset: 1 },
      ],
      { duration: 5600, delay: indice * 450, iterations: Infinity, easing: "cubic-bezier(0.45, 0, 0.25, 1)" }
    );
    respira.pause();
    passa.pause();

    // Só com a seção na tela
    const observador = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) {
        respira.play();
        passa.play();
      } else {
        respira.pause();
        passa.pause();
      }
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      respira.cancel();
      passa.cancel();
    };
  }, [indice]);

  // A foto como máscara: o brilho só aparece onde há pote
  const mascara: React.CSSProperties = {
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };

  return (
    <span ref={caixa} className="relative flex h-full w-full items-center justify-center">
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={mascara}>
        <span
          ref={faixa}
          className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
          style={{ transform: "translateX(-120%) skewX(-18deg)" }}
        />
      </span>
    </span>
  );
}
