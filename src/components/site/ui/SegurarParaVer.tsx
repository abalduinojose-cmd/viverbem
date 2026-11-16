"use client";
// Segurar para ver (adendo 69, 13/10/2026): no celular, segurar o dedo num
// cartão por 0,4 s, sem mexer, faz ele sair da lista e crescer até o
// centro da tela, sobre um fundo escurecido; soltar devolve ele ao lugar.
// Soltar não abre nada: o clique que vem depois de um "ver" é engolido.
//
// Só vale para o toque (pointerType "touch"); com mouse nada muda. O dedo
// que anda mais de 8 px antes do tempo é rolagem e cancela. Depois que o
// cartão cresceu, a página não rola até o dedo sair da tela.
//
// A ampliação é uma camada por cima de tudo (portal no body) que nasce na
// posição do cartão e anima até o centro com a Web Animations API, e não
// com transição de CSS, para rodar também com "reduzir movimento" ligado,
// como o resto do site (o Windows do usuário está com as animações
// desligadas). Usado no cartão de produto e no reel.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ESPERA_MS = 400;
const LIMITE_PX = 8;
const ENTRADA = { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" as const };
const SAIDA = { duration: 220, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "both" as const };

export function SegurarParaVer({
  children,
  previa,
  className = "",
  largura = "min(78vw, 22rem)",
}: {
  children: React.ReactNode;
  /** O que aparece ampliado no centro da tela */
  previa: React.ReactNode;
  className?: string;
  /** Largura da ampliação, em CSS */
  largura?: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const relogio = useRef<number | null>(null);
  const inicio = useRef<{ x: number; y: number; id: number } | null>(null);
  const aberto = useRef(false);
  const engolirClique = useRef(false);
  const ultimoFoiToque = useRef(false);
  // Com origem: a ampliação está na tela (entrando, parada ou saindo)
  const [origem, setOrigem] = useState<DOMRect | null>(null);
  const [saindo, setSaindo] = useState(false);

  function pararRelogio() {
    if (relogio.current !== null) window.clearTimeout(relogio.current);
    relogio.current = null;
  }

  function abrir() {
    const el = raiz.current;
    if (!el) return;
    aberto.current = true;
    setSaindo(false);
    setOrigem(el.getBoundingClientRect());
    // Um toque curto de vibração no Android; o iPhone não deixa
    if (typeof navigator.vibrate === "function") navigator.vibrate(12);
  }

  function fechar() {
    if (!aberto.current) return;
    aberto.current = false;
    // O clique que o navegador manda ao soltar não pode abrir o produto.
    // No iPhone ele nem sempre vem; a trava se desfaz sozinha.
    engolirClique.current = true;
    window.setTimeout(() => (engolirClique.current = false), 700);
    setSaindo(true);
  }

  function aoPressionar(e: React.PointerEvent) {
    ultimoFoiToque.current = e.pointerType === "touch";
    if (e.pointerType !== "touch") return;
    // Botões de verdade (carrinho, som, expandir) continuam só botões
    if ((e.target as Element).closest("[data-sem-segurar]")) return;
    inicio.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    pararRelogio();
    relogio.current = window.setTimeout(() => {
      relogio.current = null;
      abrir();
    }, ESPERA_MS);
  }

  function aoMover(e: React.PointerEvent) {
    const i = inicio.current;
    if (!i || e.pointerId !== i.id || aberto.current) return;
    if (Math.hypot(e.clientX - i.x, e.clientY - i.y) > LIMITE_PX) {
      pararRelogio();
      inicio.current = null;
    }
  }

  function aoSoltar() {
    pararRelogio();
    inicio.current = null;
    fechar();
  }

  // Aberto: o dedo pode tremer, mas a página não rola por baixo
  useEffect(() => {
    if (!origem || saindo) return;
    const travar = (ev: TouchEvent) => {
      if (ev.cancelable) ev.preventDefault();
    };
    window.addEventListener("touchmove", travar, { passive: false });
    return () => window.removeEventListener("touchmove", travar);
  }, [origem, saindo]);

  useEffect(() => pararRelogio, []);

  return (
    <div
      ref={raiz}
      className={`segurar-para-ver ${className}`}
      // O cartão "sai" da lista: o lugar dele fica vazio enquanto a
      // ampliação está na tela
      style={origem ? { opacity: 0 } : undefined}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onContextMenu={(e) => {
        // O menu do sistema ("salvar imagem", "abrir em nova aba") cobriria
        // a ampliação; com mouse o botão direito segue normal
        if (ultimoFoiToque.current) e.preventDefault();
      }}
      onClickCapture={(e) => {
        if (!engolirClique.current) return;
        engolirClique.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
      {origem && (
        <Ampliacao
          origem={origem}
          saindo={saindo}
          largura={largura}
          aoSair={() => {
            setOrigem(null);
            setSaindo(false);
          }}
        >
          {previa}
        </Ampliacao>
      )}
    </div>
  );
}

function Ampliacao({
  origem,
  saindo,
  largura,
  aoSair,
  children,
}: {
  origem: DOMRect;
  saindo: boolean;
  largura: string;
  aoSair: () => void;
  children: React.ReactNode;
}) {
  const fundo = useRef<HTMLDivElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  // De onde veio, para voltar ao mesmo lugar
  const daOrigem = useRef("none");
  const aoSairRef = useRef(aoSair);
  useLayoutEffect(() => {
    aoSairRef.current = aoSair;
  });

  // Entrada: o painel já está no centro; mede, volta virtualmente para o
  // lugar do cartão e anima até o centro (a técnica FLIP)
  useLayoutEffect(() => {
    const p = painel.current;
    const f = fundo.current;
    if (!p || !f) return;
    const fim = p.getBoundingClientRect();
    const escala = origem.width / fim.width;
    const dx = origem.left + origem.width / 2 - (fim.left + fim.width / 2);
    const dy = origem.top + origem.height / 2 - (fim.top + fim.height / 2);
    daOrigem.current = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${escala.toFixed(4)})`;
    p.animate([{ transform: daOrigem.current, opacity: 0.5 }, { transform: "none", opacity: 1 }], ENTRADA);
    f.animate([{ opacity: 0 }, { opacity: 1 }], { ...ENTRADA, duration: 240 });
    // origem é fixa enquanto esta ampliação existe
  }, [origem]);

  // Saída: volta para o lugar do cartão e some
  useEffect(() => {
    if (!saindo) return;
    const p = painel.current;
    const f = fundo.current;
    if (!p || !f) {
      aoSairRef.current();
      return;
    }
    const volta = p.animate([{ transform: "none", opacity: 1 }, { transform: daOrigem.current, opacity: 0.6 }], SAIDA);
    f.animate([{ opacity: 1 }, { opacity: 0 }], SAIDA);
    volta.onfinish = () => aoSairRef.current();
    return () => {
      volta.onfinish = null;
    };
  }, [saindo]);

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div ref={fundo} className="absolute inset-0 bg-noite/50 backdrop-blur-[6px]" style={{ opacity: 0 }} />
      <div ref={painel} className="relative" style={{ width: largura, transformOrigin: "center center" }}>
        {children}
      </div>
    </div>,
    document.body
  );
}
