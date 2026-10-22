"use client";
// Casca do painel: barra lateral no desktop e gaveta no celular.
//
// Dois painéis na mesma casca (07/10/2026): o do GESTOR, que abre na
// visão geral com os números e tem o grupo "Gestão" primeiro, e o da
// EQUIPE (colaborador), que vê só o catálogo e o site.
//
// 14/10/2026 ("modernize, quero um dashboard de alta qualidade e premium"):
// a lateral virou a folha escura do painel, em azul-noite com a luz da
// marca (a mesma atmosfera dos banners do site), e o conteúdo segue
// claro. A marca fica num ladrilho branco no alto; a página ativa é uma
// pílula de vidro com a marca de ouro na borda e o ícone em ouro; quem
// está logado aparece embaixo com a inicial no círculo de ouro. No celular
// a barra do topo e a gaveta são a mesma folha escura.

//
// Mesmo dia, segunda volta ("quero mais moderno"): a barra do topo em vidro
// no computador, com a trilha "Gestão › Visão geral", a data, a hora e o
// atalho para o site; e a pílula da página ativa desliza entre os itens ao
// navegar (uma só pílula, movida com a Web Animations API pela posição do
// item ativo), em vez de acender num e apagar no outro.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { asset } from "@/lib/asset";
import { PAPEL_ADMIN, nomePapel } from "@/lib/tipos";
import { BotaoSair } from "./BotaoSair";
import { Inicial } from "./PecasAdmin";
import { DataHoje, RelogioAgora } from "./PecasVivas";
import { ICONES } from "./iconesAdmin";
import { useSessaoDemo } from "./ModoDemo";
import { AvisoPedidoNovo, usePedidosNovos } from "./AvisoPedidos";

/** A pílula que marca a página ativa e desliza até ela quando a rota muda */
function PilulaAtiva({ nav, pathname }: { nav: React.RefObject<HTMLElement | null>; pathname: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const primeira = useRef(true);
  useEffect(() => {
    const pilula = ref.current;
    const caixa = nav.current;
    if (!pilula || !caixa) return;
    const ativo = caixa.querySelector<HTMLElement>("[aria-current='page']");
    if (!ativo) {
      pilula.style.opacity = "0";
      return;
    }
    const destino = { top: `${ativo.offsetTop}px`, height: `${ativo.offsetHeight}px`, opacity: "1" };
    if (primeira.current) {
      primeira.current = false;
      Object.assign(pilula.style, destino);
      return;
    }
    const origem = { top: pilula.style.top || destino.top, height: pilula.style.height || destino.height, opacity: pilula.style.opacity || "0" };
    Object.assign(pilula.style, destino);
    pilula.animate([origem, destino], { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  }, [nav, pathname]);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-3 right-3 rounded-xl bg-white/[0.1] ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{ top: 0, height: 0, opacity: 0 }}
    >
      {/* A marca de ouro da página ativa */}
      <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-[image:var(--ouro-degrade)]" />
    </span>
  );
}

export interface ItemNav {
  href: string;
  rotulo: string;
  icone: keyof typeof ICONES;
  grupo: string;
  externo?: boolean;
}

/** O logo num ladrilho branco (a marca é azul sobre branco; no escuro ela
 *  precisa do próprio fundo) */
function Marca({ className = "" }: { className?: string }) {
  return (
    // 22/10/2026 ("melhore a logo"): ladrilho mais folgado, a marca maior
    // (em WebP) e o fio de ouro na base, a assinatura do site
    <span className={`relative inline-flex items-center overflow-hidden rounded-[1.25rem] bg-white px-4 py-3 ring-1 ring-white/15 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.7)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/logo.webp")} alt="Manipulação Viver Bem" width={220} height={97} className="h-10 w-auto object-contain" draggable={false} />
      <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[image:var(--ouro-degrade)]" />
    </span>
  );
}

export function CascaAdmin({
  itens: todosItens,
  nome: nomeSessao,
  papel: papelSessao,
  children,
}: {
  itens: ItemNav[];
  nome: string;
  /** "ADMIN" (gestor) ou "OPERADOR" (colaborador) */
  papel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [gaveta, setGaveta] = useState(false);
  // Na prévia estática quem manda é quem entrou no navegador (ModoDemo):
  // as páginas foram geradas como gestor, e o colaborador perde o "Gestão"
  const demo = useSessaoDemo();
  const nome = demo?.nome ?? nomeSessao;
  const papel = demo?.papel ?? papelSessao;
  const ehGestor = papel === PAPEL_ADMIN;
  const itens = ehGestor ? todosItens : todosItens.filter((i) => i.grupo !== "Gestão");
  // Pedidos novos: a contagem no menu e o aviso quando chega um (gestor)
  const { novos, aviso, fecharAviso } = usePedidosNovos(ehGestor);

  // Trocar de página fecha a gaveta. Feito durante a renderização, ao
  // notar que o endereço mudou (um efeito com setState renderizaria duas vezes).
  const [caminhoAnterior, setCaminhoAnterior] = useState(pathname);
  if (pathname !== caminhoAnterior) {
    setCaminhoAnterior(pathname);
    setGaveta(false);
  }

  // Com a gaveta aberta, o fundo não rola junto
  useEffect(() => {
    document.body.style.overflow = gaveta ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gaveta]);

  const grupos = itens.reduce<Record<string, ItemNav[]>>((acc, i) => {
    (acc[i.grupo] ||= []).push(i);
    return acc;
  }, {});

  const ativoEm = (i: ItemNav) => !i.externo && pathname.startsWith(i.href);
  const itemAtual = itens.find(ativoEm);
  const tituloAtual = itemAtual?.rotulo ?? "Painel";
  const navLateral = useRef<HTMLElement>(null);
  const navGaveta = useRef<HTMLElement>(null);

  const menu = (navRef: React.RefObject<HTMLElement | null>) => (
    <>
      {/* A malha fina e a luz, como nos banners do site */}
      <span aria-hidden="true" className="malha-banner" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -bottom-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.22),transparent_62%)]"
      />

      {/* Marca e qual painel é este */}
      <div className="relative px-5 pt-5 pb-5">
        <Marca />
        <p className="rotulo-pilula mt-4 !text-[0.6875rem]">{ehGestor ? "Painel do gestor" : "Painel da equipe"}</p>
      </div>

      <nav ref={navRef} className="relative flex-1 px-3 pb-2 overflow-y-auto" aria-label="Páginas do painel">
        <PilulaAtiva nav={navRef} pathname={pathname} />
        {Object.entries(grupos).map(([grupo, lista]) => (
          <div key={grupo} className="mb-1">
            <p className="px-3 pt-4 pb-2 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/45">{grupo}</p>
            {lista.map((i) => {
              const ativo = ativoEm(i);
              const classe = `group relative z-[1] flex items-center gap-3 rounded-xl px-3 py-2.5 mb-0.5 text-[0.92rem] font-medium transition-colors ${
                ativo ? "text-white" : "text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`;
              const conteudo = (
                <>
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`shrink-0 transition-colors ${ativo ? "text-[#e1c68f]" : "text-white/55 group-hover:text-white"}`}
                  >
                    {ICONES[i.icone]}
                  </svg>
                  <span className="flex-1">{i.rotulo}</span>
                  {i.href === "/admin/clientes" && novos > 0 && (
                    <span className="min-w-5 h-5 rounded-full bg-[image:var(--ouro-degrade)] px-1.5 text-[0.6875rem] font-bold text-navy tabular-nums flex items-center justify-center" aria-label={`${novos} novos`}>
                      {novos}
                    </span>
                  )}
                  {i.externo && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white/40 group-hover:text-white/80 transition-colors">
                      <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </>
              );

              return i.externo ? (
                <a key={i.href} href={i.href} target="_blank" rel="noopener noreferrer" className={classe}>
                  {conteudo}
                </a>
              ) : (
                <Link key={i.href} href={i.href} aria-current={ativo ? "page" : undefined} className={classe}>
                  {conteudo}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Quem está logado */}
      <div className="relative p-3 border-t border-white/10 [&>button]:border-white/15 [&>button]:text-white/75 [&>button]:hover:text-white [&>button]:hover:border-white/30 [&>button]:hover:bg-white/10">
        <div className="flex items-center gap-3 px-1 pb-3">
          <Inicial nome={nome} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{nome}</p>
            <p className="text-[0.6875rem] uppercase tracking-wider text-white/50">{nomePapel(papel)}</p>
          </div>
        </div>
        <BotaoSair />
      </div>
    </>
  );

  return (
    <div className="flex-1 flex min-h-screen bg-nevoa text-grafite">
      {/* Lateral fixa (desktop): a folha escura do painel */}
      <aside className="hidden lg:flex w-[17rem] shrink-0 flex-col sticky top-0 h-screen overflow-hidden banner-noite em-noite text-white">
        {menu(navLateral)}
      </aside>

      {/* Gaveta (celular e tablet) */}
      {gaveta && (
        <div className="lg:hidden fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex" onClick={() => setGaveta(false)}>
          <div
            className="relative w-[17rem] max-w-[85vw] h-full flex flex-col overflow-hidden banner-noite em-noite text-white animar-surgir shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {menu(navGaveta)}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra do topo, só fora do desktop */}
        <header className="lg:hidden sticky top-0 z-40 banner-noite em-noite text-white flex items-center gap-3 px-4 h-14 shadow-[0_10px_30px_-20px_rgba(13,35,64,0.7)]">
          <button
            type="button"
            onClick={() => setGaveta(true)}
            aria-label="Abrir menu"
            className="w-10 h-10 -ml-2 rounded-xl text-white hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="font-semibold truncate">{tituloAtual}</p>
          <Marca className="ml-auto !px-2.5 !py-1.5 [&>img]:h-6" />
        </header>

        {/* A barra do topo do computador, em vidro: a trilha, a data, a hora e o site */}
        <div className="hidden lg:flex sticky top-0 z-30 items-center gap-4 h-14 px-8 bg-nevoa/75 backdrop-blur-md border-b border-fio/70">
          <p className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-cinza">{itemAtual?.grupo ?? "Painel"}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-grafite-claro shrink-0">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-navy truncate">{tituloAtual}</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 h-8 rounded-full bg-white ring-1 ring-fio px-3 text-[0.78rem] text-cinza">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <DataHoje />
            </span>
            <span className="inline-flex items-center gap-1.5 h-8 rounded-full bg-white ring-1 ring-fio px-3 text-[0.78rem] text-cinza tabular-nums">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <RelogioAgora />
            </span>
            <a
              href={asset("/")}
              target="_blank"
              rel="noopener noreferrer"
              className="group/site inline-flex items-center gap-1.5 h-8 rounded-full bg-navy text-white px-3.5 text-[0.78rem] font-semibold transition-colors hover:bg-tinta"
            >
              Ver o site
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover/site:translate-x-0.5 group-hover/site:-translate-y-0.5">
                <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Um sopro de azul no alto do conteúdo, para o claro não ser chapado */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 bg-[radial-gradient(70%_40%_at_100%_0%,rgba(28,105,181,0.07),transparent_60%)]">{children}</main>
        <AvisoPedidoNovo aviso={aviso} aoFechar={fecharAviso} />
      </div>
    </div>
  );
}
