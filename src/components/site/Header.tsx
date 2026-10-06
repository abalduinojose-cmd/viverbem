"use client";
// Cabeçalho do site em três faixas, no modelo de loja (referência
// biovittare.com.br, pedida pelo usuário em 06/10/2026):
//   1. a faixa de vantagens no topo (só computador), com os links
//      institucionais na ponta;
//   2. a linha principal: logo, busca aberta, "Enviar receita" e carrinho
//      (no celular, três botões redondos: carrinho, busca e menu);
//   3. a fileira de categorias em pílulas, que rola para o lado no celular,
//      com "Como funciona" na ponta no computador.
// Fica preso ao topo (sticky) e ocupa espaço no fluxo da página, então as
// páginas não precisam de margem no topo. A altura está em
// --altura-cabecalho (globals.css), usada pela barra do catálogo.

import { useEffect, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { asset } from "@/lib/asset";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, CategoriaDTO, UNIDADES } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho } from "./CarrinhoDrawer";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";

// Abre a gaveta do pedido. A contagem só aparece com item no carrinho
// (o carrinho vem do localStorage depois da hidratação, então começa 0
// no servidor e no cliente, sem divergência).
function BotaoCarrinho({ className, rotulo = true }: { className: string; rotulo?: boolean }) {
  const { totalItens, abrirPedido } = useCarrinho();
  const descricao =
    totalItens > 0 ? `Carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}` : "Carrinho";
  return (
    <button type="button" onClick={() => abrirPedido()} aria-label={descricao} className={className}>
      <span className="relative">
        <IconeCarrinho tamanho={20} />
        {totalItens > 0 && (
          <span className="absolute -top-2 -right-2.5 bg-tinta text-white text-[0.65rem] font-bold rounded-full min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center">
            {totalItens}
          </span>
        )}
      </span>
      {rotulo && "Carrinho"}
    </button>
  );
}

const INSTITUCIONAL = [
  { href: "/sobre", rotulo: "A Viver Bem" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/contato", rotulo: "Contato" },
];

// Itens do submenu "A Viver Bem" (âncoras da página Sobre), no menu do celular
const MENU_SOBRE = [
  { href: "/sobre#historia", rotulo: "Nossa história" },
  { href: "/sobre#como-funciona", rotulo: "Como funciona" },
  { href: "/sobre#avaliacoes", rotulo: "O que dizem os clientes" },
];

function IconeLupa() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Na vitrine estática (GitHub Pages) a busca carrega a página inteira, e o
// catálogo lê o termo no endereço; com servidor, a navegação é instantânea
const EH_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

// Busca: vai para /produtos?busca=termo, que já abre filtrado
function CampoBusca({ aoBuscar, autoFoco = false }: { aoBuscar?: () => void; autoFoco?: boolean }) {
  const Formulario = EH_DEMO ? "form" : Form;
  return (
    <Formulario
      action={EH_DEMO ? asset("/produtos/") : "/produtos"}
      onSubmit={aoBuscar}
      className="relative w-full"
    >
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cinza">
        <IconeLupa />
      </span>
      <input
        type="search"
        name="busca"
        autoFocus={autoFoco}
        required
        placeholder="O que você procura? Nome ou ativo"
        aria-label="Buscar no site"
        className="w-full bg-gelo/70 border border-fio rounded-full pl-12 pr-4 h-12 text-[0.95rem] text-grafite placeholder:text-grafite-claro focus:outline-none focus:ring-2 focus:ring-tinta/30 focus:border-tinta/40 focus:bg-white transition-colors"
      />
    </Formulario>
  );
}

// Pílula da fileira de categorias: a ativa em navy, as outras acendem no
// gelo ao passar o mouse
const classeCategoria = (ativo: boolean) =>
  `shrink-0 inline-flex items-center h-9 px-4 rounded-full text-[0.82rem] font-medium whitespace-nowrap transition-colors ${
    ativo ? "bg-navy text-white" : "text-navy/80 hover:bg-gelo hover:text-navy"
  }`;

// Botão redondo do celular (carrinho, busca, menu)
const classeBotaoRedondo =
  "md:hidden w-10 h-10 rounded-full bg-gelo text-navy flex items-center justify-center active:scale-95 transition";

export function Header({ categorias }: { categorias: CategoriaDTO[] }) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);

  // Fecha tudo ao trocar de página. Feito durante a renderização, ao
  // notar que o endereço mudou (em efeito, dispararia uma renderização
  // a mais a cada navegação).
  const [caminhoAnterior, setCaminhoAnterior] = useState(pathname);
  if (pathname !== caminhoAnterior) {
    setCaminhoAnterior(pathname);
    setMenuAberto(false);
    setBuscaAberta(false);
  }

  // Esc fecha busca e menu
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBuscaAberta(false);
        setMenuAberto(false);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  const nota = AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 });

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_var(--color-fio)]">
      {/* ---------- 1. Faixa de vantagens (computador) ---------- */}
      <div className="hidden md:block bg-gelo/60 border-b border-fio">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-8 flex items-center justify-between text-[0.78rem] text-cinza">
          <ul className="flex items-center gap-6">
            <li>Entrega de moto por toda Petrópolis</li>
            <li>Retirada sem taxa em {UNIDADES.length} lojas</li>
            <li>
              <span className="text-ouro">★</span> {nota} no Google · {AVALIACOES_GOOGLE_TOTAL} avaliações
            </li>
          </ul>
          <ul className="flex items-center gap-5">
            {INSTITUCIONAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`transition-colors hover:text-tinta ${pathname.startsWith(l.href) ? "text-tinta font-medium" : ""}`}
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- 2. Linha principal ---------- */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-[4.75rem] flex items-center gap-4 md:gap-8">
        <Link href="/" className="shrink-0 active:scale-95 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Manipulação Viver Bem"
            draggable={false}
            width={220}
            height={97}
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:block flex-1 max-w-xl">
          <CampoBusca />
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Computador: a receita como ação principal, ao lado do carrinho */}
          <BotaoEnviarReceita className="hidden md:inline-flex botao botao-principal botao-compacto !min-h-12" />
          <BotaoCarrinho className="hidden md:inline-flex botao botao-secundario botao-compacto !min-h-12" />

          {/* Celular: carrinho, lupa e menu, em botões redondos */}
          <BotaoCarrinho rotulo={false} className={classeBotaoRedondo} />
          <button
            type="button"
            onClick={() => {
              setBuscaAberta((b) => !b);
              setMenuAberto(false);
            }}
            aria-label={buscaAberta ? "Fechar busca" : "Buscar"}
            aria-expanded={buscaAberta}
            className={`${classeBotaoRedondo} ${buscaAberta ? "!bg-navy !text-white" : ""}`}
          >
            <IconeLupa />
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuAberto((m) => !m);
              setBuscaAberta(false);
            }}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            className={`${classeBotaoRedondo} ${menuAberto ? "!bg-navy !text-white" : ""}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuAberto ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ---------- 3. Fileira de categorias em pílulas ---------- */}
      <nav
        aria-label="Categorias"
        className="relative border-t border-fio bg-white after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-12 after:bg-gradient-to-l after:from-white md:after:hidden"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[3.25rem] flex items-center gap-1.5 overflow-x-auto rolagem-sem-barra">
          <Link href="/produtos" className={classeCategoria(pathname === "/produtos")}>
            Todos
          </Link>
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/produtos/${c.slug}`}
              className={classeCategoria(pathname === `/produtos/${c.slug}`)}
            >
              {c.nome}
            </Link>
          ))}
          <Link
            href="/sobre#como-funciona"
            className="botao-link !min-h-0 ml-auto shrink-0 hidden lg:inline-flex text-[0.85rem] pl-4"
          >
            Como funciona
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Busca aberta, logo abaixo (celular) */}
      {buscaAberta && (
        <div className="md:hidden border-t border-fio bg-white px-5 py-3 animar-surgir">
          <CampoBusca autoFoco aoBuscar={() => setBuscaAberta(false)} />
        </div>
      )}

      {/* Menu do celular */}
      {menuAberto && (
        <nav
          aria-label="Principal"
          className="md:hidden bg-white border-t border-fio px-5 pb-6 pt-3 flex flex-col gap-1 max-h-[calc(100dvh-var(--altura-cabecalho))] overflow-y-auto animar-surgir"
        >
          <p className="px-3 pt-2 pb-1 rotulo !text-cinza">A Viver Bem</p>
          {MENU_SOBRE.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuAberto(false)}
              className="px-3 py-3 rounded-xl text-base font-medium text-grafite hover:bg-gelo transition-colors"
            >
              {l.rotulo}
            </Link>
          ))}
          <div className="border-t border-fio my-2" aria-hidden="true" />
          {INSTITUCIONAL.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname.startsWith(l.href) ? "text-tinta bg-gelo" : "text-grafite hover:bg-gelo"
              }`}
            >
              {l.rotulo}
            </Link>
          ))}
          <div className="pt-3">
            <BotaoEnviarReceita className="botao botao-principal w-full" />
          </div>
        </nav>
      )}
    </header>
  );
}
