"use client";
// Foto com profundidade (página A Viver Bem, 08/10/2026): a imagem fica um
// pouco maior que a moldura e desce mais devagar que a página enquanto
// atravessa a tela (paralaxe só na foto, nunca em texto). Na entrada, a
// moldura se abre: começa recortada para dentro e chega inteira quando a
// foto sobe até o meio da tela ("rolagem"); na abertura da página ela se
// abre sozinha na carga ("carga", animação CSS .revela-moldura). Sem
// JavaScript, a foto aparece inteira e parada.
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { registrarCena, atravessar, entre } from "./motor";

// A foto é 16% maior que a moldura: a paralaxe anda até 7% para cada lado
// sem nunca mostrar a borda
const ESCALA = 1.16;
const AMPLITUDE = 14;

export function FotoParalaxe({
  src,
  alt,
  largura,
  altura,
  className = "",
  revelar = "rolagem",
  prioritaria = false,
}: {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  /** Tamanho, proporção e cantos da moldura (ex.: "aspect-square rounded-[1.75rem]") */
  className?: string;
  /** Como a moldura se abre: com a rolagem, na carga da página ou não se abre */
  revelar?: "rolagem" | "carga" | "nenhum";
  /** A foto da abertura: carrega primeiro */
  prioritaria?: boolean;
}) {
  const moldura = useRef<HTMLDivElement>(null);
  const foto = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = moldura.current;
    const img = foto.current;
    if (!el || !img) return;
    const desligar = [
      registrarCena(el, {
        medir: atravessar,
        suavidade: 0.12,
        aplicar: (p) => {
          img.style.transform = `translate3d(0, ${((0.5 - p) * AMPLITUDE).toFixed(2)}%, 0) scale(${ESCALA})`;
        },
      }),
    ];
    if (revelar === "rolagem") {
      desligar.push(
        registrarCena(el, {
          medir: entre(1, 0.5),
          suavidade: 0.16,
          aplicar: (p) => {
            const recorte = ((1 - p) * 8).toFixed(2);
            const lados = ((1 - p) * 5).toFixed(2);
            el.style.clipPath = p >= 1 ? "" : `inset(${recorte}% ${lados}% ${recorte}% ${lados}% round var(--raio-foto, 1.75rem))`;
          },
        })
      );
    }
    return () => desligar.forEach((f) => f());
  }, [revelar]);

  return (
    <div
      ref={moldura}
      className={`relative overflow-hidden bg-gelo ${revelar === "carga" ? "revela-moldura" : ""} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={foto}
        src={asset(src)}
        alt={alt}
        width={largura}
        height={altura}
        loading={prioritaria ? undefined : "lazy"}
        fetchPriority={prioritaria ? "high" : undefined}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ transform: `scale(${ESCALA})` }}
      />
    </div>
  );
}
