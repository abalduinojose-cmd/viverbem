"use client";
// Cabeçalho do site em três faixas, no modelo de loja (referência
// biovittare.com.br, pedida pelo usuário em 06/10/2026):
//   1. a faixa de vantagens no topo (só computador), em azul-noite, com
//      os links institucionais em pílulas na ponta;
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
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, CategoriaDTO, PERFIL_GOOGLE_URL, UNIDADES } from "@/lib/tipos";
import { useCarrinho } from "@/lib/carrinho";
import { IconeCarrinho, Chevron } from "./icones";
import { useEstadoLoja } from "./HorarioAtendimento";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";
import { IconeMoto } from "./IconeMoto";
import { IconeLoja, IconeEstrela } from "./IconesVantagens";

// Abre a gaveta do pedido. A contagem só aparece com item no carrinho
// (o carrinho vem do localStorage depois da hidratação, então começa 0
// no servidor e no cliente, sem divergência).
function BotaoCarrinho({
  className,
  rotulo = true,
  contagemInline = false,
  selo = "navy",
}: {
  className: string;
  rotulo?: boolean;
  /** Celular: a contagem vai dentro da pílula, ao lado do ícone, em vez do selo */
  contagemInline?: boolean;
  /** Cor do selo da contagem: navy sobre o botão branco do computador, ouro na cápsula do celular */
  selo?: "navy" | "ouro";
}) {
  const { totalItens, abrirPedido } = useCarrinho();
  const descricao =
    totalItens > 0 ? `Carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}` : "Carrinho";
  return (
    <button type="button" onClick={() => abrirPedido()} aria-label={descricao} className={className}>
      {contagemInline ? (
        <>
          <span className="flex">
            <IconeCarrinho tamanho={19} />
          </span>
          {totalItens > 0 && <span className="text-[0.8rem] font-semibold tabular-nums leading-none">{totalItens}</span>}
        </>
      ) : (
        <span className="relative">
          <IconeCarrinho tamanho={20} />
          {totalItens > 0 && (
            <span
              className={`absolute -top-2 -right-2.5 text-[0.65rem] font-bold rounded-full min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center ring-2 ring-white ${
                selo === "ouro" ? "bg-ouro-claro text-navy" : "bg-navy text-white"
              }`}
            >
              {totalItens}
            </span>
          )}
        </span>
      )}
      {rotulo && "Carrinho"}
    </button>
  );
}

const INSTITUCIONAL = [
  { href: "/sobre", rotulo: "A Viver Bem" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/contato", rotulo: "Contato" },
];

// Vantagens da faixa do topo (computador). Para a faixa nunca quebrar
// linha, a nota do Google entra de lg para cima e a retirada só de xl.
const VANTAGENS = [
  { icone: <IconeMoto tamanho={16} />, texto: "Delivery em Petrópolis e Região" },
  {
    icone: <IconeEstrela tamanho={14} />,
    texto: `${AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} no Google · ${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    href: PERFIL_GOOGLE_URL,
    aPartirDe: "lg" as const,
  },
  { icone: <IconeLoja tamanho={15} />, texto: `Retirada sem taxa em ${UNIDADES.length} lojas`, aPartirDe: "xl" as const },
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

// Pílula da fileira de categorias: a ativa em navy, as outras em gelo
const classeCategoria = (ativo: boolean) =>
  `shrink-0 inline-flex items-center h-11 px-4 rounded-full text-[0.82rem] font-medium whitespace-nowrap transition-colors ${
    ativo ? "bg-navy text-white shadow-[0_8px_16px_-10px_rgba(13,35,64,0.6)]" : "bg-gelo/70 text-navy/80 hover:bg-gelo hover:text-navy"
  }`;

// Botões do celular (carrinho, busca e menu) numa cápsula branca com fio,
// ícones em navy; o que estiver aberto vira um círculo navy (07/10/2026,
// "deixe esses botões mais clean": a cápsula navy com o círculo de ouro saiu)
const classeBotaoCapsula = (ativo = false) =>
  `w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 ${
    ativo ? "bg-navy text-white" : "text-navy hover:bg-gelo"
  }`;
// O carrinho na cápsula: o mesmo botão dos outros dois, com a contagem num
// selo pequeno de ouro quando há itens
const classeBotaoCarrinhoCelular = classeBotaoCapsula();

// "Aberto agora · Fecha às 19h" na faixa do topo (07/10/2026). No servidor
// é null: sai um texto neutro, sem horário congelado no HTML.
function SeloAbertoFaixa() {
  const estado = useEstadoLoja();
  if (!estado) return <span className="text-white/80">Horário de atendimento</span>;
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={`w-2 h-2 rounded-full ${estado.aberto ? "bg-green-400" : "bg-white/40"}`} />
      <span className="font-semibold text-white">{estado.aberto ? "Aberto agora" : "Fechado agora"}</span>
      <span className="text-white/60">· {estado.detalhe}</span>
    </span>
  );
}

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

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-[0_1px_0_var(--color-fio)]">
      {/* ---------- 1. Faixa do topo (computador) ---------- */}
      {/* Em azul-noite, como a dobra: o selo ao vivo "Aberto agora" e as
          vantagens com ícone em ouro, separadas por um fio; os links
          institucionais em pílulas na ponta. Nada quebra linha: cada item
          entra só a partir da largura em que cabe. */}
      <div className="hidden md:block bg-[linear-gradient(90deg,#0d2340_0%,#0f3157_55%,#124a86_100%)] text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-9 flex items-center justify-between gap-6 text-[0.78rem] whitespace-nowrap">
          <ul className="flex items-center min-w-0">
            <li className="flex items-center">
              <SeloAbertoFaixa />
            </li>
            {VANTAGENS.map((v) => {
              const visivel = v.aPartirDe === "xl" ? "hidden xl:flex" : v.aPartirDe === "lg" ? "hidden lg:flex" : "flex";
              const miolo = (
                <>
                  <span className="text-ouro-claro">{v.icone}</span>
                  {v.texto}
                </>
              );
              return (
                <li key={v.texto} className={`${visivel} items-center`}>
                  <span aria-hidden="true" className="mx-4 h-3.5 w-px bg-white/15" />
                  {v.href ? (
                    <a
                      href={v.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                      {miolo}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-white/80">{miolo}</span>
                  )}
                </li>
              );
            })}
          </ul>
          {/* Os links institucionais: texto fino, um ponto de ouro entre eles e
              um fio de ouro que nasce da esquerda no hover e fica na página
              atual (07/10/2026, "melhore esses botões") */}
          <ul className="flex items-center shrink-0">
            {INSTITUCIONAL.map((l, i) => {
              const ativo = pathname.startsWith(l.href);
              return (
                <li key={l.href} className="flex items-center">
                  {i > 0 && <span aria-hidden="true" className="mx-3.5 w-1 h-1 rounded-full bg-ouro-claro/60" />}
                  <Link
                    href={l.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`group relative inline-flex items-center h-9 tracking-[0.02em] transition-colors ${
                      ativo ? "text-white font-medium" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {l.rotulo}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-px bg-[image:var(--ouro-degrade)] origin-left transition-transform duration-300 ${
                        ativo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ---------- 2. Linha principal ---------- */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-[4.75rem] flex items-center gap-4 md:gap-8">
        <Link
          href="/"
          onClick={(e) => {
            // Já na home: só volta ao topo, suave
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMenuAberto(false);
              setBuscaAberta(false);
            }
          }}
          className="shrink-0 active:scale-95 transition-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Manipulação Viver Bem"
            draggable={false}
            width={220}
            height={97}
            className="h-[2.85rem] md:h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:block flex-1 max-w-xl">
          <CampoBusca />
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Computador: a receita como ação principal, ao lado do carrinho */}
          <BotaoEnviarReceita className="hidden md:inline-flex botao botao-principal botao-compacto !min-h-12" />
          <BotaoCarrinho className="hidden md:inline-flex botao botao-secundario botao-compacto !min-h-12" />

          {/* Celular: cápsula branca com fio, com o carrinho, a lupa e o menu */}
          <div className="md:hidden flex items-center gap-0.5 p-0.5 rounded-full border border-fio bg-white">
            <BotaoCarrinho rotulo={false} selo="ouro" className={classeBotaoCarrinhoCelular} />
            <button
              type="button"
              onClick={() => {
                setBuscaAberta((b) => !b);
                setMenuAberto(false);
              }}
              aria-label={buscaAberta ? "Fechar busca" : "Buscar"}
              aria-expanded={buscaAberta}
              className={classeBotaoCapsula(buscaAberta)}
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
              className={classeBotaoCapsula(menuAberto)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {menuAberto ? (
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M4 8h16M4 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- 3. Fileira de categorias em pílulas ---------- */}
      <nav
        aria-label="Categorias"
        className="relative border-t border-fio/70 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-12 after:bg-gradient-to-l after:from-white/90 md:after:hidden"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[3.25rem] flex items-center gap-2 overflow-x-auto rolagem-sem-barra">
          <Link
            href="/produtos"
            aria-current={pathname === "/produtos" ? "page" : undefined}
            className={`${classeCategoria(pathname === "/produtos")} !pl-3 gap-1.5`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Todos
          </Link>
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/produtos/${c.slug}`}
              aria-current={pathname === `/produtos/${c.slug}` ? "page" : undefined}
              className={classeCategoria(pathname === `/produtos/${c.slug}`)}
            >
              {c.nome}
            </Link>
          ))}
          <Link
            href="/sobre#como-funciona"
            className="group ml-auto shrink-0 hidden lg:inline-flex items-center gap-2 h-11 pl-4 pr-1.5 rounded-full border border-fio bg-white text-navy text-[0.82rem] font-medium whitespace-nowrap transition-colors hover:border-ouro/50"
          >
            Como funciona
            <span className="w-8 h-8 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
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
          className="md:hidden bg-white border-t border-fio px-5 pt-2 pb-6 flex flex-col max-h-[calc(100dvh-var(--altura-cabecalho))] overflow-y-auto animar-surgir"
        >
          {/* A Viver Bem: linhas limpas, só o texto e a seta (07/10/2026) */}
          <p className="pt-3 pb-1 rotulo !text-cinza text-[0.66rem]">A Viver Bem</p>
          <ul className="lista-fichas">
            {MENU_SOBRE.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-3 py-3.5 text-[0.98rem] font-medium text-navy transition-colors hover:text-tinta"
                >
                  <span className="flex-1">{l.rotulo}</span>
                  <Chevron className="shrink-0 text-ouro" />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-3 border-t border-fio lista-fichas">
            {INSTITUCIONAL.slice(1).map((l) => {
              const ativo = pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`flex items-center gap-3 py-3.5 text-[0.98rem] font-medium transition-colors ${
                      ativo ? "text-tinta" : "text-navy hover:text-tinta"
                    }`}
                  >
                    <span className="flex-1">{l.rotulo}</span>
                    <Chevron className="shrink-0 text-ouro" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-5">
            <BotaoEnviarReceita className="botao botao-principal w-full" />
          </div>
        </nav>
      )}
    </header>
  );
}
