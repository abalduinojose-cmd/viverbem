"use client";
// A barra de leitura da história (página A Viver Bem, 08/10/2026): um fio
// de ouro no alto da tela que enche do começo da página até o fim do
// capítulo 04. É o indicador de progresso que a narrativa por capítulos
// pede: a pessoa sabe quanto falta da história.
import { useEffect, useRef } from "react";
import { registrarCena, limitar } from "./motor";

export function ProgressoLeitura({ ateId }: { ateId: string }) {
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barra.current;
    const fim = document.getElementById(ateId);
    if (!el || !fim) return;
    return registrarCena(fim, {
      sempre: true,
      suavidade: 0.25,
      medir: (c) => {
        const rolado = window.scrollY;
        const percurso = rolado + c.topo + c.altura - c.janela;
        return percurso > 0 ? limitar(rolado / percurso) : 1;
      },
      aplicar: (p) => {
        el.style.transform = `scaleX(${p.toFixed(4)})`;
        el.style.opacity = p > 0.002 ? "1" : "0";
      },
    });
  }, [ateId]);

  return (
    <div
      ref={barra}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[image:var(--ouro-degrade)] opacity-0"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
