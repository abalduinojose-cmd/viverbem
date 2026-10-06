"use client";
// Clique e arraste com o mouse nas faixas horizontais (produtos,
// avaliações). Toque e caneta seguem com a rolagem nativa, que já
// funciona bem; o mouse, por padrão, não arrasta nada.
//
// Dois cuidados: (1) o arrasto nativo de links e imagens (HTML5 drag) é
// cancelado, porque ele dispara depois de alguns pixels e interrompe os
// eventos de ponteiro, o que fazia o arrasto "não funcionar" em cima dos
// cartões; (2) um arrasto não vira clique no item: se o mouse andou, o
// clique seguinte é engolido.
//
// A ref da faixa nasce no componente e vem por parâmetro (o lint do React
// não deixa um hook devolver ref para ser lida na renderização).
import { useRef, useState } from "react";

// A partir de quantos pixels consideramos que foi arrasto, e não clique
const TOLERANCIA = 6;

export function useArrasteHorizontal<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const inicio = useRef({ x: 0, scroll: 0, andou: 0 });
  const [arrastando, setArrastando] = useState(false);

  function onPointerDown(e: React.PointerEvent<T>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const faixa = ref.current;
    if (!faixa) return;
    inicio.current = { x: e.clientX, scroll: faixa.scrollLeft, andou: 0 };
    setArrastando(true);
  }

  function onPointerMove(e: React.PointerEvent<T>) {
    if (!arrastando) return;
    const faixa = ref.current;
    if (!faixa) return;
    const distancia = e.clientX - inicio.current.x;
    inicio.current.andou = Math.max(inicio.current.andou, Math.abs(distancia));
    faixa.scrollLeft = inicio.current.scroll - distancia;
  }

  function soltar() {
    if (arrastando) setArrastando(false);
  }

  // Arrastou? Então o clique que vem a seguir não deve abrir o item
  function onClickCapture(e: React.MouseEvent<T>) {
    if (inicio.current.andou > TOLERANCIA) {
      e.preventDefault();
      e.stopPropagation();
      inicio.current.andou = 0;
    }
  }

  // Sem o arrasto nativo de link/imagem, que cancelaria o ponteiro
  function onDragStart(e: React.DragEvent<T>) {
    e.preventDefault();
  }

  return {
    arrastando,
    /** Espalhe na faixa que rola: `<div ref={ref} {...props}>` */
    props: {
      onPointerDown,
      onPointerMove,
      onPointerUp: soltar,
      onPointerLeave: soltar,
      onPointerCancel: soltar,
      onClickCapture,
      onDragStart,
    },
  };
}
