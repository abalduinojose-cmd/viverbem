"use client";
// "Adicionar ao carrinho" das fichas de produto. Põe 1 unidade, sem
// preço: o farmacêutico passa o valor pelo WhatsApp. Produto com dosagem
// para escolher manda para a página dele, onde a escolha acontece.
//
// É o botão do carrinho do sistema (.botao-carrinho, globals.css): pílula
// em ouro com o texto em navy (pedido do usuário), verde por um instante
// quando o produto entrou.
import { useState } from "react";
import Link from "next/link";
import { ProdutoDTO, listarDosagens } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";

function IconeCarrinho() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeSeta() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BotaoAdicionar({
  produto,
  compacto = false,
  className = "",
}: {
  produto: ProdutoDTO;
  /** Só o ícone, para as faixas estreitas (vistos recentemente) */
  compacto?: boolean;
  className?: string;
}) {
  const { adicionar } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  if (listarDosagens(produto.dosagens).length > 0) {
    return (
      <Link href={`/produto/${produto.slug}`} className={`botao-carrinho w-full ${className}`}>
        Escolher dosagem
        <IconeSeta />
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

  const feito = adicionado ? "botao-carrinho-feito" : "";

  if (compacto) {
    return (
      <button
        type="button"
        onClick={aoAdicionar}
        aria-label={`Adicionar ${produto.nome} ao carrinho`}
        className={`botao-carrinho !min-h-10 w-10 !px-0 ${feito} ${className}`}
      >
        {adicionado ? <IconeFeito /> : <IconeCarrinho />}
      </button>
    );
  }

  // No celular a ficha é estreita: "Adicionar" com o ícone do carrinho
  // cabe numa linha só; do sm para cima vai o texto inteiro
  return (
    <button
      type="button"
      onClick={aoAdicionar}
      aria-label={`Adicionar ${produto.nome} ao carrinho`}
      className={`botao-carrinho w-full ${feito} ${className}`}
    >
      <span className="sr-only" aria-live="polite">
        {adicionado ? "Produto adicionado ao carrinho" : ""}
      </span>
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
