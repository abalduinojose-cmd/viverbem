"use client";
// "Adicionar ao carrinho" das fichas de produto. Põe 1 unidade, sem
// preço: o farmacêutico passa o valor pelo WhatsApp. Produto com dosagem
// para escolher manda para a página dele, onde a escolha acontece.
//
// É o botão do carrinho do sistema (.botao-carrinho, globals.css): pílula
// em ouro com o texto e o ícone em branco (10/10/2026; antes navy), verde
// por um instante quando o produto entrou.
import { useState } from "react";
import Link from "next/link";
import { ProdutoDTO, listarDosagens } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho, IconeFeito, SetaDireita } from "./icones";

export function BotaoAdicionar({
  produto,
  compacto = false,
  suave = false,
  className = "",
}: {
  produto: ProdutoDTO;
  /** Só o ícone, para as faixas estreitas (vistos recentemente) */
  compacto?: boolean;
  /** Compacto em contorno, que vira ouro no hover (listas laterais, onde o
   *  ouro cheio repetido pesava; 07/10/2026) */
  suave?: boolean;
  className?: string;
}) {
  const { adicionar } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  if (listarDosagens(produto.dosagens).length > 0) {
    return (
      <Link href={`/produto/${produto.slug}`} className={`botao-carrinho w-full ${className}`}>
        Escolher dosagem
        <SetaDireita tamanho={15} />
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
    const classeSuave = adicionado
      ? "bg-green-700 border-green-700 text-white"
      : "bg-white border-fio text-navy hover:bg-ouro-claro hover:border-ouro-claro hover:text-white";
    return (
      <button
        type="button"
        onClick={aoAdicionar}
        aria-label={`Adicionar ${produto.nome} ao carrinho`}
        className={
          suave
            ? `inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors active:scale-95 ${classeSuave} ${className}`
            : `botao-carrinho !min-h-11 w-11 !px-0 ${feito} ${className}`
        }
      >
        {adicionado ? <IconeFeito /> : <IconeCarrinho tamanho={17} />}
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
      {adicionado ? <IconeFeito /> : <IconeCarrinho tamanho={17} />}
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
