"use client";
// Galeria da página do produto: a foto grande sobre o ladrilho com a luz
// dourada da bancada e, quando há mais de uma foto (até 5, pelo painel),
// as miniaturas embaixo para trocar. Todas as fotos ficam no HTML (as
// outras escondidas), então o leitor de tela e o Google veem a galeria
// inteira; só a primeira carrega com prioridade.
//
// 14/10/2026: a galeria aceita vídeo (MP4/WEBM enviado pelo painel). O
// vídeo toca sem som, em laço, só quando é o item à vista; a miniatura
// mostra o primeiro quadro com o sinal de "play".
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { ehVideo } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { TarjaProduto } from "./TarjaProduto";

function VideoDaGaleria({ src, ativo, nome }: { src: string; ativo: boolean; nome: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (ativo) v.play().catch(() => {});
    else v.pause();
  }, [ativo]);
  return (
    <video
      ref={ref}
      src={asset(src)}
      muted
      loop
      playsInline
      controls
      preload={ativo ? "auto" : "metadata"}
      aria-label={`${nome}, vídeo`}
      className={`relative max-w-full max-h-full rounded-2xl object-contain ${ativo ? "animar-surgir" : "hidden"}`}
    />
  );
}

function IconePlay({ tamanho = 14 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

export function GaleriaProduto({
  fotos,
  nome,
  novidade = false,
  maisPedido = false,
  acoes,
}: {
  fotos: string[];
  nome: string;
  novidade?: boolean;
  /** O selo "Mais pedido" (a chave "destaque" do painel), como o "mais
   *  vendido" dos marketplaces (23/10/2026) */
  maisPedido?: boolean;
  /** O que vai no canto superior direito da foto (o Compartilhar, 23/10/2026) */
  acoes?: React.ReactNode;
}) {
  const [ativa, setAtiva] = useState(0);
  const atual = Math.min(ativa, Math.max(0, fotos.length - 1));
  // Zoom ao passar o mouse (23/10/2026, estudo da Amazon): no computador a
  // foto cresce 1,8x e acompanha o ponteiro; no toque não muda nada
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const aoMover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div>
      {/* O ladrilho quadrado, sem fio, com o pote centrado (10/10/2026,
          "acerte os erros de enquadramento": antes o pote ficava colado na
          base de um ladrilho alto, com vazio em cima) */}
      <div onMouseMove={aoMover} onMouseLeave={() => setZoom(null)} className={`relative overflow-hidden rounded-[2rem] bg-gelo/60 flex items-center justify-center aspect-square p-8 md:p-12 ${zoom ? "cursor-zoom-in" : ""}`}>
        {/* (A luz dourada sob o pote saiu em 11/10/2026, junto com a sombra:
            "tire a sombra debaixo dos produtos") */}

        {fotos.length === 0 ? (
          <FotoProduto fotoUrl={null} nome={nome} className="relative" />
        ) : (
          fotos.map((src, i) =>
            ehVideo(src) ? (
              <VideoDaGaleria key={src} src={src} ativo={i === atual} nome={nome} />
            ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={asset(src)}
              alt={i === 0 ? nome : `${nome}, foto ${i + 1}`}
              width={500}
              height={500}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              {...(i === 0 ? { fetchPriority: "high" as const } : {})}
              // Desenho neutro (.svg): fundido no gelo, senão vira uma caixa branca
              style={{
                ...(src.toLowerCase().endsWith(".svg") ? { mixBlendMode: "multiply" as const } : {}),
                ...(zoom && i === atual ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%`, transition: "transform 0.15s ease-out" } : { transition: "transform 0.25s ease-out" }),
              }}
              className={`relative max-w-full max-h-full object-contain scale-[1.04] ${
                i === atual ? "animar-surgir" : "hidden"
              }`}
            />
            )
          )
        )}

        {/* 27/10/2026: a mesma tarja dos cartões, maior ("Mais vendido" no
            lugar de "Mais pedido") */}
        <TarjaProduto produto={{ destaque: maisPedido, novidade }} tamanho="grande" className="!left-4 !top-4" />
        {acoes && (
          <div onMouseMove={(e) => e.stopPropagation()} onMouseEnter={() => setZoom(null)} className="absolute top-4 right-4 z-20">
            {acoes}
          </div>
        )}
        {fotos.length > 1 && (
          <span
            aria-hidden="true"
            className="absolute bottom-4 right-4 inline-flex items-center h-7 px-2.5 rounded-full bg-white/90 ring-1 ring-fio text-xs font-medium text-navy tabular-nums"
          >
            {atual + 1} / {fotos.length}
          </span>
        )}
      </div>

      {/* As miniaturas, só com mais de uma foto */}
      {fotos.length > 1 && (
        <div role="tablist" aria-label="Fotos do produto" className="mt-3 flex gap-2.5 overflow-x-auto rolagem-sem-barra pb-1">
          {fotos.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === atual}
              aria-label={`${ehVideo(src) ? "Vídeo" : "Foto"} ${i + 1} de ${fotos.length}`}
              onClick={() => setAtiva(i)}
              className={`relative shrink-0 w-[4.25rem] h-[4.25rem] rounded-2xl border bg-gelo/60 p-1.5 flex items-center justify-center transition ${
                i === atual ? "border-ouro ring-4 ring-ouro/15" : "border-fio hover:border-ouro/50"
              }`}
            >
              {ehVideo(src) ? (
                <>
                  <video src={`${asset(src)}#t=0.1`} muted playsInline preload="metadata" className="max-w-full max-h-full rounded-lg object-cover" />
                  <span className="absolute inset-0 m-auto size-6 rounded-full bg-navy/80 text-white flex items-center justify-center">
                    <IconePlay tamanho={11} />
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset(src)}
                  alt=""
                  width={120}
                  height={120}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
