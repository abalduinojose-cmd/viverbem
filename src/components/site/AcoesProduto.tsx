"use client";
// Cartão de compra da página do produto: a dosagem (se houver), a
// quantidade e o botão do carrinho (.botao-carrinho, em ouro com o texto
// em navy), que fecha pelo WhatsApp. Sem preço: o farmacêutico
// passa o valor na conversa.
//
// 23/10/2026 ("a página do produto como um marketplace famoso"), segunda
// volta ("tire o valor sob consulta, melhore o pedir pelo WhatsApp e o botão
// de quantidade; tire a marca, é tudo da Viver Bem"):
//   - o preço só aparece quando é visível (industrializado com a chave
//     ligada); o "Valor sob consulta" e a linha "Vendido por" saíram;
//   - a QUANTIDADE virou um seletor de três partes (menos, número, mais)
//     em pílula branca com fio, ícones desenhados, ao lado do carrinho, como
//     nos marketplaces; no celular os dois ficam lado a lado também;
//   - o "Pedir pelo WhatsApp" virou um botão cheio no verde do WhatsApp,
//     com o ícone num círculo e uma linha de apoio ("resposta no horário
//     das lojas"); abre a conversa já com o produto, a dosagem e a
//     quantidade.
import { useState } from "react";
import { ProdutoDTO, listarDosagens, precoVisivel, WHATSAPP_NUMERO } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho, IconeFeito, IconeWhatsApp } from "./icones";

const MAXIMO = 20;

function IconeMenos() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconeMaisQtd() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

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

  const classePasso =
    "flex size-11 items-center justify-center rounded-full text-navy transition-colors hover:bg-gelo active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100";

  return (
    <div className="mt-7 rounded-[1.75rem] border border-fio bg-gradient-to-b from-white to-gelo/70 p-5 md:p-6 shadow-[0_24px_40px_-32px_rgba(16,42,74,0.35)]">
      {/* O preço, só quando pode aparecer */}
      {preco !== null && (
        <div className="pb-5 mb-5 border-b border-fio">
          <p className="text-[2rem] md:text-[2.3rem] font-semibold tracking-[-0.035em] text-navy tabular-nums leading-none">{formatarPreco(preco)}</p>
          <p className="mt-1.5 text-sm text-cinza tabular-nums">
            {quantidade > 1 ? `${quantidade} unidades: ${formatarPreco(preco * quantidade)}` : "à vista, confirmado no WhatsApp"}
          </p>
        </div>
      )}

      {/* Dosagens */}
      {dosagens.length > 0 && (
        <div className="mb-5">
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

      <p id="rotulo-quantidade" className="text-sm font-semibold text-navy">
        Quantidade
      </p>

      {/* A quantidade ao lado do carrinho, como num marketplace */}
      <div className="mt-2.5 flex items-stretch gap-2.5">
        <div
          role="group"
          aria-labelledby="rotulo-quantidade"
          className="flex shrink-0 items-center rounded-full bg-white p-1 ring-1 ring-inset ring-fio shadow-[0_8px_18px_-14px_rgba(13,35,64,0.4)]"
        >
          <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} disabled={quantidade <= 1} aria-label="Diminuir quantidade" className={classePasso}>
            <IconeMenos />
          </button>
          <output aria-live="polite" className="w-9 text-center text-[1.15rem] font-semibold text-navy tabular-nums">
            {quantidade}
          </output>
          <button
            type="button"
            onClick={() => setQuantidade((q) => Math.min(MAXIMO, q + 1))}
            disabled={quantidade >= MAXIMO}
            aria-label="Aumentar quantidade"
            className={classePasso}
          >
            <IconeMaisQtd />
          </button>
        </div>

        <button
          type="button"
          onClick={adicionarAoCarrinho}
          className={`botao-carrinho flex-1 min-w-0 !min-h-[3.25rem] !px-4 !text-[1rem] ${adicionado ? "botao-carrinho-feito" : ""}`}
        >
          <span className="sr-only" aria-live="polite">
            {adicionado ? "Produto adicionado ao carrinho" : ""}
          </span>
          {adicionado ? (
            <>
              <IconeFeito tamanho={20} />
              Adicionado
            </>
          ) : (
            <>
              <IconeCarrinho tamanho={20} />
              <span className="truncate">
                Adicionar<span className="hidden sm:inline"> ao carrinho</span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Pedir direto, sem passar pelo carrinho: o verde do WhatsApp, numa
          linha só (23/10/2026; a legenda com o que vai na mensagem saiu de
          vez na quinta volta: "deixe mais clean") */}
      <a
        href={linkWhats}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-3 flex w-full items-center justify-center gap-2.5 min-h-[3.25rem] rounded-full bg-[#1DA851] px-5 text-[1rem] font-semibold text-white shadow-[0_16px_30px_-18px_rgba(29,168,81,0.85)] transition-colors hover:bg-[#178a43] active:scale-[0.99]"
      >
        <IconeWhatsApp tamanho={21} />
        Pedir pelo WhatsApp
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-0.5">
          <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

    </div>
  );
}
