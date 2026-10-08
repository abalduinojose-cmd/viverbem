"use client";
// Número que rola como um contador mecânico (página A Viver Bem,
// 08/10/2026): cada algarismo é uma fita de 0 a 9 que gira até o valor
// quando o número aparece na tela, um algarismo depois do outro. As fitas
// são desenhadas pelo CSS (.rolo-faixa::before), então o HTML só tem o
// número de verdade (para leitores de tela e o Google, em .sr-only). Cada
// janela tem a largura do próprio algarismo (o ::before invisível dela
// mede), para o "1" não ficar com vão como nos algarismos de largura fixa.
// Sem JavaScript, o número aparece direto no valor final.
import { useEffect, useRef } from "react";

export function NumeroRolante({ valor, className = "" }: { valor: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const faixas = Array.from(el.querySelectorAll<HTMLElement>("[data-digito]"));
    // Volta as fitas para o zero sem transição e só então libera a rolagem
    el.classList.add("rolo-parado");
    faixas.forEach((f) => f.style.setProperty("--d", "0"));
    el.getBoundingClientRect();
    el.classList.remove("rolo-parado");

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        faixas.forEach((f) => f.style.setProperty("--d", f.dataset.digito ?? "0"));
        observador.disconnect();
      },
      { threshold: 0.6 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <span ref={ref} className={`rolo ${className}`}>
      <span className="sr-only">{valor}</span>
      <span aria-hidden="true" className="rolo-digitos">
        {valor.split("").map((caractere, i) =>
          /\d/.test(caractere) ? (
            <span key={i} className="rolo-janela" data-d={caractere}>
              <span
                data-digito={caractere}
                className="rolo-faixa numero-tinta"
                style={{ "--d": caractere, "--i": i } as React.CSSProperties}
              />
            </span>
          ) : (
            <span key={i} className="numero-tinta">
              {caractere}
            </span>
          )
        )}
      </span>
    </span>
  );
}
