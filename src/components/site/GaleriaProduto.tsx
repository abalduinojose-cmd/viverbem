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
      <div className="relative overflow-hidden rounded-[2rem] border border-fio bg-gradient-to-b from-gelo to-white flex items-end justify-center min-h-[20rem] md:min-h-[30rem] p-6 md:p-9">
        {/* A luz dourada da bancada */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[15%] bottom-6 h-20 bg-[radial-gradient(50%_60%_at_50%_70%,rgba(201,165,107,0.42),transparent_70%)]"
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
              className={`relative max-w-full max-h-[24rem] md:max-h-[28.5rem] object-contain drop-shadow-[0_28px_26px_rgba(54,52,107,0.25)] ${
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
