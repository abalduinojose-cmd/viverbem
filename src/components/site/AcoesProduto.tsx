"use client";
// Cartão de compra da página do produto: a dosagem (se houver), a
// quantidade e o botão do carrinho (.botao-carrinho, em ouro com o texto
// em navy), que fecha pelo WhatsApp. Sem preço: o farmacêutico
// passa o valor na conversa.
import { useState } from "react";
import { ProdutoDTO, listarDosagens, precoVisivel } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho, IconeFeito } from "./icones";

export function AcoesProduto({ produto }: { produto: ProdutoDTO }) {
  const { adicionar } = useCarrinho();
  const dosagens = listarDosagens(produto.dosagens);
  const [dosagem, setDosagem] = useState<string | null>(dosagens[0] ?? null);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  // Só industrializado com a chave "Preço no site" ligada no painel
  const preco = precoVisivel(produto);

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
    <div className="mt-7 rounded-[1.75rem] border border-fio bg-gradient-to-b from-white to-gelo/70 p-5 md:p-6 shadow-[0_24px_40px_-32px_rgba(16,42,74,0.35)]">
      {/* Dosagens */}
      {dosagens.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-navy">Escolha a dosagem</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dosagens.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDosagem(d)}
                aria-pressed={dosagem === d}
                className={`inline-flex items-center h-11 px-5 rounded-full border text-[0.95rem] font-medium transition-colors ${
                  dosagem === d ? "bg-navy border-navy text-white" : "bg-white border-fio text-grafite hover:border-navy/40"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantidade */}
      <div className={`flex items-center justify-between gap-4 ${dosagens.length > 0 ? "mt-5" : ""}`}>
        <div>
          <p className="text-sm font-semibold text-navy">Quantidade</p>
          <p className="text-xs text-cinza mt-0.5 tabular-nums">
            {preco !== null ? `Total ${formatarPreco(preco * quantidade)}, confirmado no WhatsApp` : "O valor vem pelo WhatsApp"}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-gelo p-1">
          <button
            type="button"
            onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
            disabled={quantidade <= 1}
            aria-label="Diminuir quantidade"
            className="w-11 h-11 rounded-full bg-white text-navy text-xl font-medium flex items-center justify-center shadow-sm transition active:scale-90 disabled:opacity-40 disabled:active:scale-100"
          >
            −
          </button>
          <span className="w-9 text-center text-lg font-semibold text-navy tabular-nums">{quantidade}</span>
          <button
            type="button"
            onClick={() => setQuantidade((q) => Math.min(20, q + 1))}
            aria-label="Aumentar quantidade"
            className="w-11 h-11 rounded-full bg-navy text-white text-xl font-medium flex items-center justify-center transition hover:bg-tinta active:scale-90"
          >
            +
          </button>
        </div>
      </div>

      {/* Adicionar ao carrinho: a ação principal desta tela */}
      <button
        type="button"
        onClick={adicionarAoCarrinho}
        className={`botao-carrinho w-full mt-5 !min-h-14 !text-[1.05rem] ${adicionado ? "botao-carrinho-feito" : ""}`}
      >
        <span className="sr-only" aria-live="polite">
          {adicionado ? "Produto adicionado ao carrinho" : ""}
        </span>
        {adicionado ? (
          <>
            <IconeFeito tamanho={22} />
            Adicionado ao carrinho
          </>
        ) : (
          <>
            <IconeCarrinho tamanho={22} />
            Adicionar ao carrinho
          </>
        )}
      </button>
    </div>
  );
}
