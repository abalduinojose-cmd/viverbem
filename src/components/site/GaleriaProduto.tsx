"use client";
// Galeria da página do produto: a foto grande sobre o ladrilho com a luz
// dourada da bancada e, quando há mais de uma foto (até 5, pelo painel),
// as miniaturas embaixo para trocar. Todas as fotos ficam no HTML (as
// outras escondidas), então o leitor de tela e o Google veem a galeria
// inteira; só a primeira carrega com prioridade.
import { useState } from "react";
import { asset } from "@/lib/asset";
import { FotoProduto } from "./FotoProduto";

export function GaleriaProduto({
  fotos,
  nome,
  novidade = false,
}: {
  fotos: string[];
  nome: string;
  novidade?: boolean;
}) {
  const [ativa, setAtiva] = useState(0);
  const atual = Math.min(ativa, Math.max(0, fotos.length - 1));

  return (
    <div>
      {/* O ladrilho quadrado, sem fio, com o pote centrado (10/10/2026,
          "acerte os erros de enquadramento": antes o pote ficava colado na
          base de um ladrilho alto, com vazio em cima) */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gelo/60 flex items-center justify-center aspect-square p-8 md:p-12">
        {/* A luz dourada da bancada, logo abaixo do pote */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[68%] h-[14%] w-[58%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(201,165,107,0.36),transparent_70%)]"
        />

        {fotos.length === 0 ? (
          <FotoProduto fotoUrl={null} nome={nome} className="relative" />
        ) : (
          fotos.map((src, i) => (
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
              // Desenho neutro (.svg): fundido no gelo e sem a sombra, senão vira uma caixa branca
              style={src.toLowerCase().endsWith(".svg") ? { mixBlendMode: "multiply", filter: "none" } : undefined}
              className={`relative max-w-full max-h-full object-contain [filter:drop-shadow(0_18px_16px_rgba(201,165,107,0.36))_drop-shadow(0_3px_3px_rgba(16,42,74,0.14))] ${
                i === atual ? "animar-surgir" : "hidden"
              }`}
            />
          ))
        )}

        {novidade && (
          <span className="absolute top-4 left-4 rotulo !text-ouro text-[0.6rem] bg-white border border-ouro/40 rounded-full px-3 py-1.5">
            Novidade
          </span>
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
              aria-label={`Foto ${i + 1} de ${fotos.length}`}
              onClick={() => setAtiva(i)}
              className={`shrink-0 w-[4.25rem] h-[4.25rem] rounded-2xl border bg-gelo/60 p-1.5 flex items-center justify-center transition ${
                i === atual ? "border-ouro ring-4 ring-ouro/15" : "border-fio hover:border-ouro/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
