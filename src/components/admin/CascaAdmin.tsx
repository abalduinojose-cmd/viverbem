"use client";
// Casca do painel: barra lateral clara no desktop e gaveta no celular.
//
// Dois painéis na mesma casca (07/10/2026): o do GESTOR, que abre na
// visão geral com os números e tem o grupo "Gestão" primeiro, e o da
// EQUIPE (colaborador), que vê só o catálogo e o site. A página ativa
// ganha uma marca de ouro na borda e o ícone em azul; quem está logado
// aparece embaixo com a inicial num círculo de ouro.

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
      {/* Marca e qual painel é este */}
      <div className="px-5 pt-5 pb-4 border-b border-fio">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/logo.png")}
          alt="Manipulação Viver Bem"
          width={220}
          height={97}
          className="h-9 w-auto object-contain"
          draggable={false}
        />
        <p className="rotulo-pilula mt-3 !text-[0.62rem]">{ehGestor ? "Painel do gestor" : "Painel da equipe"}</p>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-y-auto" aria-label="Páginas do painel">
        {Object.entries(grupos).map(([grupo, lista]) => (
          <div key={grupo}>
            <p className="px-3 pt-4 pb-1.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-grafite-claro">
              {grupo}
            </p>
            {lista.map((i) => {
              const ativo = ativoEm(i);
              const classe = `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] font-medium transition-colors ${
                ativo ? "bg-gelo text-navy" : "text-cinza hover:text-navy hover:bg-nevoa"
              }`;
              const conteudo = (
                <>
                  {/* A marca de ouro da página ativa */}
                  {ativo && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-[image:var(--ouro-degrade)]"
                    />
                  )}
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`shrink-0 transition-colors ${ativo ? "text-tinta" : "text-grafite-claro group-hover:text-tinta"}`}
                  >
                    {ICONES[i.icone]}
                  </svg>
                  <span className="flex-1">{i.rotulo}</span>
                  {i.externo && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-grafite-claro">
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
      <div className="p-3 border-t border-fio">
        <div className="flex items-center gap-3 px-1 pb-3">
          <Inicial nome={nome} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-navy truncate">{nome}</p>
            <p className="text-[0.65rem] uppercase tracking-wider text-grafite-claro">{nomePapel(papel)}</p>
          </div>
        </div>
        <BotaoSair />
      </div>
    </>
  );

  return (
    <div className="flex-1 flex min-h-screen bg-nevoa text-grafite">
      {/* Lateral fixa (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-fio flex-col sticky top-0 h-screen">
        {menu}
      </aside>

      {/* Gaveta (celular e tablet) */}
      {gaveta && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm flex"
          onClick={() => setGaveta(false)}
        >
          <div
            className="bg-white w-[17rem] max-w-[85vw] h-full flex flex-col animar-surgir shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {menu}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra do topo, só fora do desktop */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-fio flex items-center gap-3 px-4 h-14">
          <button
            type="button"
            onClick={() => setGaveta(true)}
            aria-label="Abrir menu"
            className="w-10 h-10 -ml-2 rounded-xl text-navy hover:bg-nevoa flex items-center justify-center transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="font-semibold text-navy truncate">{tituloAtual}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt=""
            width={220}
            height={97}
            className="h-7 w-auto object-contain ml-auto"
            draggable={false}
          />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 min-w-0">{children}</main>
      </div>
    </div>
  );
}
