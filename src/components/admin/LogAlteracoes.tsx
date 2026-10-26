"use client";
// Log de alterações (26/10/2026, "modernize o log"): a linha do tempo do
// painel. Em cima, os números (hoje, 7 dias, quem mais mexeu); a busca e
// os filtros por área (catálogo, home, pedidos, leads, acessos) e por
// pessoa; e a lista agrupada por dia ("Hoje", "Ontem", a data), cada
// registro com o ícone do que foi feito (criou, alterou, apagou, ligou ou
// desligou), quem fez, o detalhe e a hora. A planilha sai do que está
// filtrado. Os registros continuam sendo gerados pelas rotas de API.

import { useMemo, useState } from "react";
import { AvisoAdmin, BotaoAdmin, CabecalhoAdmin, CartaoNumero, Inicial, classeCampoAdmin } from "./PecasAdmin";
import { ICONES } from "./iconesAdmin";

export interface RegistroLog {
  id: number;
  usuario: string;
  acao: string;
  detalhe: string;
  criadoEm: string; // ISO
}

type Area = "catalogo" | "home" | "pedidos" | "leads" | "acessos" | "outros";
type Verbo = "criou" | "alterou" | "apagou" | "ligou" | "desligou";

const AREAS: { valor: Area; rotulo: string }[] = [
  { valor: "catalogo", rotulo: "Catálogo" },
  { valor: "home", rotulo: "Home e banners" },
  { valor: "pedidos", rotulo: "Pedidos" },
  { valor: "leads", rotulo: "Leads" },
  { valor: "acessos", rotulo: "Acessos" },
  { valor: "outros", rotulo: "Outros" },
];

const DIA = 86_400_000;

function areaDe(r: RegistroLog): Area {
  const t = `${r.acao} ${r.detalhe}`.toLowerCase();
  if (/lead/.test(t)) return "leads";
  if (/pedido|situação|situacao/.test(t)) return "pedidos";
  if (/home|banner|seção|secao|dobra|linha/.test(t)) return "home";
  if (/acesso|usuário|usuario|senha|login/.test(t)) return "acessos";
  if (/produto|categoria|preço|preco|foto|catálogo|catalogo|dosagem|estoque|falta/.test(t)) return "catalogo";
  return "outros";
}

function verboDe(r: RegistroLog): Verbo {
  const a = r.acao.toLowerCase();
  if (/criou|cadastrou|adicionou|novo/.test(a)) return "criou";
  if (/apagou|removeu|excluiu|cancelou/.test(a)) return "apagou";
  if (/desligou|desativou|tirou|escondeu|bloqueou/.test(a)) return "desligou";
  if (/ligou|ativou|publicou|liberou|religou|desbloqueou/.test(a)) return "ligou";
  return "alterou";
}

const ICONE_VERBO: Record<Verbo, { cor: string; desenho: React.ReactNode }> = {
  criou: {
    cor: "bg-green-50 text-green-700 ring-green-600/20",
    desenho: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  },
  alterou: {
    cor: "bg-gelo text-tinta ring-tinta/20",
    desenho: <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  },
  apagou: {
    cor: "bg-carimbo/10 text-carimbo ring-carimbo/20",
    desenho: <path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  },
  ligou: {
    cor: "bg-ouro/12 text-ouro-escuro ring-ouro/30",
    desenho: (
      <>
        <rect x="3" y="7" width="18" height="10" rx="5" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="15" cy="12" r="2.6" fill="currentColor" />
      </>
    ),
  },
  desligou: {
    cor: "bg-nevoa text-cinza ring-fio",
    desenho: (
      <>
        <rect x="3" y="7" width="18" height="10" rx="5" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="9" cy="12" r="2.6" fill="currentColor" />
      </>
    ),
  },
};

function rotuloDoDia(iso: string, agora: number) {
  const d = new Date(iso);
  const hoje = new Date(agora);
  const chave = (x: Date) => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  if (chave(d) === chave(hoje)) return "Hoje";
  if (chave(d) === chave(new Date(agora - DIA))) return "Ontem";
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: d.getFullYear() !== hoje.getFullYear() ? "numeric" : undefined });
}

function hora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function LogAlteracoes({ registros, agora }: { registros: RegistroLog[]; agora: number }) {
  const [busca, setBusca] = useState("");
  const [area, setArea] = useState<Area | "todas">("todas");
  const [pessoa, setPessoa] = useState<string>("");

  const classificados = useMemo(() => registros.map((r) => ({ ...r, area: areaDe(r), verbo: verboDe(r) })), [registros]);

  const resumo = useMemo(() => {
    const hoje = classificados.filter((r) => agora - new Date(r.criadoEm).getTime() < DIA && rotuloDoDia(r.criadoEm, agora) === "Hoje").length;
    const semana = classificados.filter((r) => agora - new Date(r.criadoEm).getTime() < 7 * DIA).length;
    const porPessoa = new Map<string, number>();
    for (const r of classificados) porPessoa.set(r.usuario, (porPessoa.get(r.usuario) ?? 0) + 1);
    const pessoas = [...porPessoa.entries()].sort((a, b) => b[1] - a[1]);
    const porArea = Object.fromEntries(AREAS.map((a) => [a.valor, 0])) as Record<Area, number>;
    for (const r of classificados) porArea[r.area] += 1;
    return { hoje, semana, pessoas, porArea };
  }, [classificados, agora]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return classificados.filter((r) => {
      if (area !== "todas" && r.area !== area) return false;
      if (pessoa && r.usuario !== pessoa) return false;
      if (!termo) return true;
      return `${r.usuario} ${r.acao} ${r.detalhe}`.toLowerCase().includes(termo);
    });
  }, [classificados, busca, area, pessoa]);

  // Agrupados por dia, na ordem em que vieram (mais recentes primeiro)
  const porDia = useMemo(() => {
    const grupos: { rotulo: string; itens: typeof filtrados }[] = [];
    for (const r of filtrados) {
      const rotulo = rotuloDoDia(r.criadoEm, agora);
      const ultimo = grupos[grupos.length - 1];
      if (ultimo && ultimo.rotulo === rotulo) ultimo.itens.push(r);
      else grupos.push({ rotulo, itens: [r] });
    }
    return grupos;
  }, [filtrados, agora]);

  function exportarCSV() {
    const linhas = [["Data", "Quem", "Ação", "Detalhe", "Área"], ...filtrados.map((r) => [formatarData(r.criadoEm), r.usuario, r.acao, r.detalhe, AREAS.find((a) => a.valor === r.area)?.rotulo ?? ""])];
    const csv = linhas.map((li) => li.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `log-viverbem-${new Date(agora).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const chip = (ativo: boolean) =>
    `shrink-0 inline-flex items-center gap-2 h-9 rounded-full px-3.5 text-[0.82rem] font-medium transition-colors active:scale-95 ${
      ativo ? "bg-navy text-white shadow-[0_10px_20px_-14px_rgba(13,35,64,0.7)]" : "bg-white text-cinza ring-1 ring-inset ring-fio hover:ring-tinta/40 hover:text-navy"
    }`;

  return (
    <div className="max-w-5xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Log de alterações"
        descricao={`Quem mexeu no quê e quando, nas últimas ${registros.length} ações do painel. Registro automático.`}
        acao={
          <BotaoAdmin onClick={exportarCSV} disabled={filtrados.length === 0}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Baixar planilha
          </BotaoAdmin>
        }
      />

      {/* ---------- Os números ---------- */}
      <div className="cascata grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
        <CartaoNumero tom="noite" icone={ICONES.log} rotulo="Hoje" valor={resumo.hoje} apoio="ações no painel" />
        <CartaoNumero icone={ICONES.painel} rotulo="7 dias" valor={resumo.semana} apoio="ações na semana" />
        <CartaoNumero icone={ICONES.clientes} rotulo="Quem mais mexeu" valor={resumo.pessoas[0]?.[1] ?? 0} apoio={resumo.pessoas[0] ? `ações de ${resumo.pessoas[0][0]}` : "sem registros"} />
        <CartaoNumero icone={ICONES.produtos} rotulo="Catálogo" valor={resumo.porArea.catalogo} apoio={`${resumo.porArea.home} na home · ${resumo.porArea.pedidos} em pedidos`} />
      </div>

      {/* ---------- Busca e filtros ---------- */}
      <div className="mt-5 rounded-[1.25rem] bg-white/80 backdrop-blur-sm ring-1 ring-fio/80 p-3 flex flex-col gap-3">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por produto, pessoa ou ação..."
            aria-label="Buscar no log"
            className={`${classeCampoAdmin} !pl-11 !bg-nevoa/70 !border-transparent focus:!bg-white`}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto rolagem-sem-barra max-w-full">
          <button type="button" onClick={() => setArea("todas")} aria-pressed={area === "todas"} className={chip(area === "todas")}>
            Tudo <span className="tabular-nums text-[0.75rem] opacity-70">{classificados.length}</span>
          </button>
          {AREAS.filter((a) => resumo.porArea[a.valor] > 0).map((a) => (
            <button key={a.valor} type="button" onClick={() => setArea(a.valor)} aria-pressed={area === a.valor} className={chip(area === a.valor)}>
              {a.rotulo} <span className="tabular-nums text-[0.75rem] opacity-70">{resumo.porArea[a.valor]}</span>
            </button>
          ))}
        </div>
        {resumo.pessoas.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto rolagem-sem-barra max-w-full">
            <span className="shrink-0 text-xs text-cinza">por pessoa</span>
            <button type="button" onClick={() => setPessoa("")} aria-pressed={pessoa === ""} className={chip(pessoa === "")}>
              Todas
            </button>
            {resumo.pessoas.map(([nome, n]) => (
              <button key={nome} type="button" onClick={() => setPessoa(nome)} aria-pressed={pessoa === nome} className={chip(pessoa === nome)}>
                {nome} <span className="tabular-nums text-[0.75rem] opacity-70">{n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- A linha do tempo ---------- */}
      {porDia.length === 0 ? (
        <div className="mt-4 bg-white rounded-[1.5rem] ring-1 ring-fio/80 p-10 text-center text-cinza">
          {registros.length === 0 ? "Nenhuma alteração registrada. Assim que alguém mexer no painel, aparece aqui." : "Nada com esse filtro."}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-5">
          {porDia.map((g) => (
            <section key={g.rotulo} aria-label={g.rotulo}>
              <h2 className="flex items-center gap-3 px-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">
                {g.rotulo}
                <span className="h-px flex-1 bg-fio" />
                <span className="tabular-nums text-grafite-claro">{g.itens.length}</span>
              </h2>
              <ol className="relative mt-3 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] overflow-hidden">
                {/* O fio da linha do tempo */}
                <span aria-hidden="true" className="absolute left-[2.35rem] top-5 bottom-5 w-px bg-fio" />
                {g.itens.map((r) => {
                  const icone = ICONE_VERBO[r.verbo];
                  return (
                    <li key={r.id} className="relative flex items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-nevoa/60">
                      <span className={`relative z-[1] flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${icone.cor}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          {icone.desenho}
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.95rem] leading-snug text-navy">
                          <b className="font-semibold">{r.usuario}</b> {r.acao}
                          {r.detalhe && <span className="text-cinza"> {r.detalhe}</span>}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-grafite-claro">
                          <span className="tabular-nums" title={formatarData(r.criadoEm)}>
                            {hora(r.criadoEm)}
                          </span>
                          <span aria-hidden="true" className="text-fio">·</span>
                          <span>{AREAS.find((a) => a.valor === r.area)?.rotulo}</span>
                        </p>
                      </div>
                      <Inicial nome={r.usuario} tamanho="sm" />
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      )}
      {filtrados.length > 0 && filtrados.length < registros.length && (
        <AvisoAdmin tom="info" className="mt-3">
          Mostrando {filtrados.length} de {registros.length} registros.
        </AvisoAdmin>
      )}
    </div>
  );
}
