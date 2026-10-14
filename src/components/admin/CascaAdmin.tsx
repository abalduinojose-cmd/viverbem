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

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { asset } from "@/lib/asset";
import { PAPEL_ADMIN, nomePapel } from "@/lib/tipos";
import { BotaoSair } from "./BotaoSair";
import { Inicial } from "./PecasAdmin";
import { ICONES } from "./iconesAdmin";
import { useSessaoDemo } from "./ModoDemo";

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
    <span className={`inline-flex items-center rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/logo.png")} alt="Manipulação Viver Bem" width={220} height={97} className="h-8 w-auto object-contain" draggable={false} />
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
  const tituloAtual = itens.find(ativoEm)?.rotulo ?? "Painel";

  const menu = (
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

      <nav className="relative flex-1 px-3 pb-2 overflow-y-auto" aria-label="Páginas do painel">
        {Object.entries(grupos).map(([grupo, lista]) => (
          <div key={grupo} className="mb-1">
            <p className="px-3 pt-4 pb-2 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-white/45">{grupo}</p>
            {lista.map((i) => {
              const ativo = ativoEm(i);
              const classe = `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 mb-0.5 text-[0.92rem] font-medium transition-colors ${
                ativo
                  ? "bg-white/[0.1] text-white ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`;
              const conteudo = (
                <>
                  {/* A marca de ouro da página ativa */}
                  {ativo && (
                    <span aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-[image:var(--ouro-degrade)]" />
                  )}
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
        {menu}
      </aside>

      {/* Gaveta (celular e tablet) */}
      {gaveta && (
        <div className="lg:hidden fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex" onClick={() => setGaveta(false)}>
          <div
            className="relative w-[17rem] max-w-[85vw] h-full flex flex-col overflow-hidden banner-noite em-noite text-white animar-surgir shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {menu}
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

        {/* Um sopro de azul no alto do conteúdo, para o claro não ser chapado */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 bg-[radial-gradient(70%_40%_at_100%_0%,rgba(28,105,181,0.07),transparent_60%)]">{children}</main>
      </div>
    </div>
  );
}
