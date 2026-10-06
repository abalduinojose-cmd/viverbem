"use client";
// Ações da página do produto: escolher a dosagem (se houver), a
// quantidade e adicionar ao carrinho (que fecha pelo WhatsApp). Sem
// preço: o farmacêutico passa o valor na conversa. Aqui o botão
// principal é o "Adicionar ao carrinho", a ação da tela.
import { useState } from "react";
import { ProdutoDTO, listarDosagens } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";

export function AcoesProduto({ produto }: { produto: ProdutoDTO }) {
  const { adicionar } = useCarrinho();
  const dosagens = listarDosagens(produto.dosagens);
  const [dosagem, setDosagem] = useState<string | null>(dosagens[0] ?? null);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  function adicionarAoCarrinho() {
    adicionar(
      {
        produtoId: produto.id,
        nome: produto.nome,
        dosagem,
        fotoUrl: produto.fotoUrl,
      },
      quantidade
    );
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1600);
  }

  return (
    <div className="mt-auto">
      {/* Dosagens */}
      {dosagens.length > 0 && (
        <div className="mt-7">
          <p className="rotulo !text-cinza mb-3">Escolha a dosagem</p>
          <div className="flex flex-wrap gap-2.5">
            {dosagens.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDosagem(d)}
                aria-pressed={dosagem === d}
                className={`chip !min-h-12 !px-6 !text-base ${dosagem === d ? "chip-ativo" : ""}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantidade */}
      <div className="flex items-center justify-between gap-4 mt-7">
        <p className="rotulo !text-cinza">Quantidade</p>

        <div className="flex items-center rounded-full border border-fio p-1 gap-1">
          <button
            type="button"
            onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
            className="w-11 h-11 rounded-full text-tinta text-2xl font-medium flex items-center justify-center hover:bg-gelo active:scale-90 transition"
          >
            −
          </button>
          <span className="text-xl font-semibold text-navy w-8 text-center tabular-nums">
            {quantidade}
          </span>
          <button
            type="button"
            onClick={() => setQuantidade((q) => Math.min(20, q + 1))}
            aria-label="Aumentar quantidade"
            className="w-11 h-11 rounded-full text-tinta text-2xl font-medium flex items-center justify-center hover:bg-gelo active:scale-90 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Adicionar ao carrinho: a ação principal desta tela */}
      <button
        type="button"
        onClick={adicionarAoCarrinho}
        className={`botao botao-principal w-full mt-6 text-lg ${
          adicionado ? "!bg-green-600 !shadow-none" : ""
        }`}
      >
        {adicionado ? (
          "Adicionado ao carrinho"
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            Adicionar ao carrinho
          </>
        )}
      </button>
    </div>
  );
}
