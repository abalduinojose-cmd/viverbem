"use client";
// "Adicionar ao carrinho" dos cartões de produto. Põe 1 unidade, sem
// preço: o farmacêutico passa o valor pelo WhatsApp. Produto com dosagem
// para escolher manda para a página dele, onde a escolha acontece.
import { useState } from "react";
import Link from "next/link";
import { ProdutoDTO, listarDosagens } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";

function IconeCarrinho() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20.5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconeFeito() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BotaoAdicionar({
  produto,
  compacto = false,
  tema = "claro",
  className = "",
}: {
  produto: ProdutoDTO;
  /** Só o ícone, para as faixas estreitas (vistos recentemente) */
  compacto?: boolean;
  /** "noite" nas seções de fundo escuro (vitrine dos mais procurados) */
  tema?: "claro" | "noite";
  className?: string;
}) {
  const { adicionar } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  const noite = tema === "noite";

  if (listarDosagens(produto.dosagens).length > 0) {
    return (
      <Link
        href={`/produto/${produto.slug}`}
        className={`inline-flex items-center justify-center min-h-10 rounded-full border text-sm font-semibold px-4 transition-colors ${
          noite
            ? "border-white/20 hover:border-white/45 text-white"
            : "border-linha hover:border-royal/40 text-royal"
        } ${className}`}
      >
        Escolher dosagem
      </Link>
    );
  }

  function aoAdicionar() {
    adicionar({
      produtoId: produto.id,
      nome: produto.nome,
      dosagem: null,
      fotoUrl: produto.fotoUrl,
    });
    setAdicionado(true);
    window.setTimeout(() => setAdicionado(false), 1800);
  }

  const cor = adicionado
    ? "bg-green-600 text-white"
    : noite
      ? "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white hover:text-noite hover:ring-white"
      : "bg-royal-claro text-royal hover:bg-royal hover:text-white";

  if (compacto) {
    return (
      <button
        type="button"
        onClick={aoAdicionar}
        aria-label={`Adicionar ${produto.nome} ao carrinho`}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 ${cor} ${className}`}
      >
        {adicionado ? <IconeFeito /> : <IconeCarrinho />}
      </button>
    );
  }

  // No celular o cartão é estreito: "Adicionar" com o ícone do carrinho
  // cabe numa linha só; do sm para cima vai o texto inteiro
  return (
    <button
      type="button"
      onClick={aoAdicionar}
      aria-label={`Adicionar ${produto.nome} ao carrinho`}
      className={`w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition active:scale-[0.97] ${cor} ${className}`}
    >
      {adicionado ? <IconeFeito /> : <IconeCarrinho />}
      {adicionado ? (
        "Adicionado"
      ) : (
        <>
          <span className="sm:hidden">Adicionar</span>
          <span className="hidden sm:inline">Adicionar ao carrinho</span>
        </>
      )}
    </button>
  );
}
