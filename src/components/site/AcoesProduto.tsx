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

  // 23/10/2026 ("melhore o botão de quantidade", de novo): os dois passos
  // viraram círculos cheios, o "menos" em gelo e o "mais" em navy, com o
  // número maior no meio; a pílula tem a altura do botão do carrinho
  const classePasso = "flex size-10 items-center justify-center rounded-full transition active:scale-90 disabled:opacity-35 disabled:active:scale-100";

  // 23/10/2026 ("modernize essa parte"): o cartão virou uma FOLHA NAVY com
  // um halo de ouro no canto, a voz escura da marca no meio da página branca;
  // o seletor de quantidade fica numa trilha translúcida, o carrinho em ouro
  // e o WhatsApp em verde, os dois com a mesma altura
  return (
    <div className="relative mt-7 overflow-hidden rounded-[1.75rem] bg-navy p-5 text-white shadow-[0_28px_50px_-30px_rgba(13,35,64,0.7)] md:p-6">
      <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.35),transparent_65%)]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-12 size-48 rounded-full bg-[radial-gradient(circle,rgba(28,105,181,0.45),transparent_65%)]" />
      <div className="relative">
      {/* O preço, só quando pode aparecer */}
      {preco !== null && (
        <div className="pb-5 mb-5 border-b border-white/15">
          <p className="text-[2rem] md:text-[2.3rem] font-semibold tracking-[-0.035em] text-white tabular-nums leading-none">{formatarPreco(preco)}</p>
          <p className="mt-1.5 text-sm text-white/65 tabular-nums">
            {quantidade > 1 ? `${quantidade} unidades: ${formatarPreco(preco * quantidade)}` : "à vista, confirmado no WhatsApp"}
          </p>
        </div>
      )}

      {/* Dosagens */}
      {dosagens.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-white">Escolha a dosagem</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dosagens.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDosagem(d)}
                aria-pressed={dosagem === d}
                className={`inline-flex items-center h-11 px-5 rounded-full border text-[0.95rem] font-medium transition-colors ${
                  dosagem === d ? "bg-white border-white text-navy" : "bg-white/10 border-white/20 text-white hover:border-white/50"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      <p id="rotulo-quantidade" className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70">
        Quantidade
      </p>

      {/* A quantidade ao lado do carrinho, como num marketplace */}
      <div className="mt-2.5 flex items-stretch gap-2.5">
        <div
          role="group"
          aria-labelledby="rotulo-quantidade"
          className="flex h-[3.25rem] shrink-0 items-center gap-0.5 rounded-full bg-white/10 px-1.5 ring-1 ring-inset ring-white/15"
        >
          <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))} disabled={quantidade <= 1} aria-label="Diminuir quantidade" className={`${classePasso} text-white hover:bg-white/10`}>
            <IconeMenos />
          </button>
          <output aria-live="polite" className="w-10 text-center text-[1.3rem] font-semibold text-white tabular-nums">
            {quantidade}
          </output>
          <button
            type="button"
            onClick={() => setQuantidade((q) => Math.min(MAXIMO, q + 1))}
            disabled={quantidade >= MAXIMO}
            aria-label="Aumentar quantidade"
            className={`${classePasso} bg-white text-navy hover:bg-gelo`}
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
        className="group mt-3 flex w-full items-center justify-center gap-2.5 min-h-[3.25rem] rounded-full bg-[#1DA851] px-5 text-[1rem] font-semibold text-white shadow-[0_16px_30px_-16px_rgba(29,168,81,0.9)] transition-colors hover:bg-[#22b85c] active:scale-[0.99]"
      >
        <IconeWhatsApp tamanho={21} />
        Pedir pelo WhatsApp
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-0.5">
          <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      </div>
    </div>
  );
}
