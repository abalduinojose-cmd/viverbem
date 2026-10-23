"use client";
// Cartão de compra da página do produto: a dosagem (se houver), a
// quantidade e o botão do carrinho (.botao-carrinho, em ouro com o texto
// em navy), que fecha pelo WhatsApp. Sem preço: o farmacêutico
// passa o valor na conversa.
//
// 23/10/2026 ("a página do produto como um marketplace famoso"): o cartão
// ganhou o lugar do preço no alto (o preço quando é visível; senão "Valor
// sob consulta" e como ele chega), o "Pedir agora pelo WhatsApp" logo
// abaixo do carrinho (abre a conversa já com o produto, a dosagem e a
// quantidade) e a linha de quem vende e prepara.
import { useState } from "react";
import { ProdutoDTO, listarDosagens, precoVisivel, WHATSAPP_NUMERO } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho, IconeFeito, IconeWhatsApp } from "./icones";

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

  const mensagemWhats = `Olá! Vim pelo site e quero pedir: ${quantidade}x ${produto.nome}${dosagem ? ` (${dosagem})` : ""}.`;
  const linkWhats = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagemWhats)}`;

  return (
    <div className="mt-7 rounded-[1.75rem] border border-fio bg-gradient-to-b from-white to-gelo/70 p-5 md:p-6 shadow-[0_24px_40px_-32px_rgba(16,42,74,0.35)]">
      {/* O lugar do preço, como num marketplace */}
      <div className="pb-5 mb-5 border-b border-fio">
        {preco !== null ? (
          <>
            <p className="text-[2rem] md:text-[2.3rem] font-semibold tracking-[-0.035em] text-navy tabular-nums leading-none">{formatarPreco(preco)}</p>
            <p className="mt-1.5 text-sm text-cinza">à vista, confirmado no WhatsApp</p>
          </>
        ) : (
          <>
            <p className="text-[1.6rem] md:text-[1.8rem] font-semibold tracking-[-0.03em] text-navy leading-none">Valor sob consulta</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-cinza">
              <span className="text-[#1DA851]">
                <IconeWhatsApp tamanho={15} />
              </span>
              O farmacêutico confere e passa o valor pelo WhatsApp
            </p>
          </>
        )}
      </div>

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
            {preco !== null ? `Total ${formatarPreco(preco * quantidade)}` : "até 20 por pedido"}
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

      {/* Pedir direto, sem passar pelo carrinho */}
      <a
        href={linkWhats}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 flex w-full items-center justify-center gap-2.5 min-h-[3.25rem] rounded-full bg-white text-[#117a3c] text-[0.98rem] font-semibold ring-1 ring-inset ring-[#25D366]/45 transition-colors hover:bg-[#f1fbf4]"
      >
        <IconeWhatsApp tamanho={19} />
        Pedir agora pelo WhatsApp
      </a>

      {/* Quem vende e prepara */}
      <p className="mt-4 flex items-start gap-2 text-[0.8rem] leading-snug text-cinza">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-px shrink-0 text-tinta">
          <path d="M12 3 5 6v5.5c0 4.2 2.9 8 7 9.5 4.1-1.5 7-5.3 7-9.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>
          Vendido e preparado por <b className="font-semibold text-navy">Manipulação Viver Bem</b>. Cada pedido passa pelo farmacêutico antes de confirmar.
        </span>
      </p>
    </div>
  );
}
