"use client";
// Leads (26/10/2026, "quero uma parte para guardar os leads, e nela a
// pessoa pode separar por mês, semana e ano"): quem entrou em contato com
// a farmácia e em que pé está a conversa.
//   - o período no alto (26/10/2026, segunda volta, "tipo o painel da
//     Shopee"): atalhos (hoje, ontem, 7 dias, 30 dias, esta semana, este
//     mês, mês passado, este ano) ou as duas datas à escolha, com as setas
//     para andar no tempo (ver PeriodoLeads); tudo embaixo obedece;
//   - os quatro números (leads, novos, em contato, viraram cliente) com a
//     comparação com o período anterior, e as barras por dia (semana e
//     mês) ou por mês (ano);
//   - de onde vieram (pedido pelo site, WhatsApp, Instagram, loja,
//     indicação), em chips que também filtram;
//   - a lista: nome, WhatsApp (abre a conversa), origem, interesse, a
//     situação (muda no lugar), a observação (abre e salva ao sair) e apagar;
//   - cadastrar um lead à mão e baixar a planilha do que está filtrado.
// Na prévia estática a mudança fica só na tela (nada é gravado).

import { useMemo, useState } from "react";
import {
  ORIGENS_LEAD,
  ROTULO_ORIGEM,
  ROTULO_SITUACAO,
  SITUACOES_LEAD,
  origemValida,
  situacaoValida,
  zapDoLead,
  type LeadDTO,
  type OrigemLead,
  type SituacaoLead,
} from "@/lib/leads";
import { AvisoAdmin, BotaoAdmin, CabecalhoAdmin, CartaoNumero, Inicial, Selo, classeCampoAdmin } from "./PecasAdmin";
import { ICONES } from "./iconesAdmin";
import { useSessaoDemo } from "./ModoDemo";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { DIA, PeriodoLeads, diasDo, intervaloAnterior, intervaloDoAtalho, meiaNoite, rotuloDoIntervalo, type Intervalo } from "./PeriodoLeads";

type Grao = "dia" | "semana" | "mes";
type FiltroSituacao = "TODOS" | SituacaoLead;
type FiltroOrigem = "" | OrigemLead;

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const DIAS_CURTOS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

const COR_SITUACAO: Record<SituacaoLead, { pilula: string; ponto: string }> = {
  NOVO: { pilula: "bg-ouro/12 text-ouro-escuro ring-ouro/30", ponto: "bg-ouro-escuro" },
  EM_CONTATO: { pilula: "bg-gelo text-tinta ring-tinta/20", ponto: "bg-tinta" },
  CONVERTIDO: { pilula: "bg-green-50 text-green-700 ring-green-600/25", ponto: "bg-green-600" },
  PERDIDO: { pilula: "bg-nevoa text-cinza ring-fio", ponto: "bg-grafite-claro" },
};
const TOM_ORIGEM: Record<OrigemLead, "azul" | "verde" | "ouro" | "cinza" | "ambar"> = {
  SITE: "azul",
  WHATSAPP: "verde",
  INSTAGRAM: "ouro",
  LOJA: "ambar",
  INDICACAO: "ouro",
  OUTRO: "cinza",
};

// ---------------------------------------------------------------- as barras

/** Como agrupar as barras: por dia até 31 dias, por semana até 120, por mês acima */
function graoDo(i: Intervalo): Grao {
  const dias = diasDo(i);
  return dias <= 31 ? "dia" : dias <= 120 ? "semana" : "mes";
}

/** As barras do período: por dia, por semana (a partir do começo) ou por mês */
function barrasDoPeriodo(i: Intervalo, lista: LeadDTO[]) {
  const g = graoDo(i);
  const dias = diasDo(i);
  if (g === "mes") {
    const meses: { rotulo: string; valor: number; ano: number; mes: number }[] = [];
    for (let d = new Date(i.ini.getFullYear(), i.ini.getMonth(), 1); d < i.fim; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
      meses.push({ rotulo: MESES_CURTOS[d.getMonth()], valor: 0, ano: d.getFullYear(), mes: d.getMonth() });
    }
    for (const l of lista) {
      const d = new Date(l.criadoEm);
      const m = meses.find((x) => x.ano === d.getFullYear() && x.mes === d.getMonth());
      if (m) m.valor += 1;
    }
    return { grao: g, barras: meses.map(({ rotulo, valor }) => ({ rotulo, valor })) };
  }
  if (g === "semana") {
    const n = Math.ceil(dias / 7);
    const barras = Array.from({ length: n }, (_, k) => {
      const d = new Date(i.ini.getTime() + k * 7 * DIA);
      return { rotulo: `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`, valor: 0 };
    });
    for (const l of lista) {
      const k = Math.floor((meiaNoite(new Date(l.criadoEm)).getTime() - i.ini.getTime()) / (7 * DIA));
      if (k >= 0 && k < n) barras[k].valor += 1;
    }
    return { grao: g, barras };
  }
  const barras = Array.from({ length: dias }, (_, k) => {
    const d = new Date(i.ini.getTime() + k * DIA);
    return { rotulo: dias <= 7 ? DIAS_CURTOS[(d.getDay() + 6) % 7] : String(d.getDate()), valor: 0 };
  });
  for (const l of lista) {
    const k = Math.floor((meiaNoite(new Date(l.criadoEm)).getTime() - i.ini.getTime()) / DIA);
    if (k >= 0 && k < dias) barras[k].valor += 1;
  }
  return { grao: g, barras };
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function quando(iso: string, agora: number) {
  const min = Math.round((agora - new Date(iso).getTime()) / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return "ontem";
  if (d < 7) return `há ${d} dias`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function IconeWhats({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.7-.2 1.3Z" />
    </svg>
  );
}

const situacaoDe = (l: LeadDTO): SituacaoLead => (situacaoValida(l.situacao) ? l.situacao : "NOVO");
const origemDe = (l: LeadDTO): OrigemLead => (origemValida(l.origem) ? l.origem : "OUTRO");

const FORM_VAZIO = { nome: "", whatsapp: "", origem: "WHATSAPP" as OrigemLead, interesse: "", observacao: "" };

export function ListaLeads({ leads, agora, podeApagar = false }: { leads: LeadDTO[]; agora: number; podeApagar?: boolean }) {
  // Na prévia estática quem manda é quem entrou no navegador
  const demo = useSessaoDemo();
  const apaga = demo ? demo.papel === PAPEL_ADMIN : podeApagar;
  const [intervalo, setIntervalo] = useState<Intervalo>(() => intervaloDoAtalho("mes", agora));
  const [busca, setBusca] = useState("");
  const [origemFiltro, setOrigemFiltro] = useState<FiltroOrigem>("");
  const [situacaoFiltro, setSituacaoFiltro] = useState<FiltroSituacao>("TODOS");
  const [aberto, setAberto] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvandoForm, setSalvandoForm] = useState(false);
  // O que mudou nesta tela, por cima do que veio do servidor
  const [mudancas, setMudancas] = useState<Record<number, Partial<LeadDTO>>>({});
  const [criados, setCriados] = useState<LeadDTO[]>([]);
  const [apagados, setApagados] = useState<Set<number>>(new Set());

  const todos = useMemo(
    () => [...criados, ...leads].filter((l) => !apagados.has(l.id)).map((l) => ({ ...l, ...(mudancas[l.id] ?? {}) })),
    [criados, leads, apagados, mudancas]
  );

  const periodo = useMemo(() => {
    const { ini, fim } = intervalo;
    const antes = intervaloAnterior(intervalo);
    const dentro = (l: LeadDTO, a: Date, b: Date) => {
      const t = new Date(l.criadoEm).getTime();
      return t >= a.getTime() && t < b.getTime();
    };
    const atual = todos.filter((l) => dentro(l, ini, fim));
    const anterior = todos.filter((l) => dentro(l, antes.ini, antes.fim));
    const contar = (lista: LeadDTO[]) => {
      const n = { total: lista.length, NOVO: 0, EM_CONTATO: 0, CONVERTIDO: 0, PERDIDO: 0 } as Record<string, number>;
      for (const l of lista) n[situacaoDe(l)] += 1;
      return n;
    };
    const porOrigem = Object.fromEntries(ORIGENS_LEAD.map((o) => [o, 0])) as Record<OrigemLead, number>;
    for (const l of atual) porOrigem[origemDe(l)] += 1;
    const { grao, barras } = barrasDoPeriodo(intervalo, atual);
    return {
      ini,
      fim,
      rotulo: rotuloDoIntervalo(intervalo, agora),
      rotuloAnterior: rotuloDoIntervalo(antes, agora),
      atual,
      n: contar(atual),
      nAnterior: contar(anterior),
      porOrigem,
      grao,
      barras,
    };
  }, [todos, agora, intervalo]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return periodo.atual.filter((l) => {
      if (origemFiltro && origemDe(l) !== origemFiltro) return false;
      if (situacaoFiltro !== "TODOS" && situacaoDe(l) !== situacaoFiltro) return false;
      if (!termo) return true;
      return [l.nome, l.whatsapp, l.interesse, l.observacao, l.codigoPedido].some((c) => c.toLowerCase().includes(termo));
    });
  }, [periodo.atual, busca, origemFiltro, situacaoFiltro]);

  const taxa = periodo.n.total > 0 ? Math.round((periodo.n.CONVERTIDO / periodo.n.total) * 100) : 0;
  const maiorBarra = Math.max(1, ...periodo.barras.map((b) => b.valor));

  function falhou(m: string) {
    setErro(m);
    setAviso("");
  }
  function deuCerto(m: string) {
    setAviso(m);
    setErro("");
  }

  // ---------- mudar um lead ----------
  async function alterar(l: LeadDTO, dados: Partial<LeadDTO>, mensagem: string) {
    const antes = mudancas[l.id];
    setMudancas((m) => ({ ...m, [l.id]: { ...(m[l.id] ?? {}), ...dados } }));
    setOcupado(l.id);
    try {
      const r = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: l.id, ...dados }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.erro || "Não foi possível salvar.");
      }
      deuCerto(mensagem);
    } catch (e) {
      setMudancas((m) => {
        const copia = { ...m };
        if (antes) copia[l.id] = antes;
        else delete copia[l.id];
        return copia;
      });
      falhou((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  async function apagar(l: LeadDTO) {
    if (!confirm(`Apagar o lead ${l.nome}?`)) return;
    setOcupado(l.id);
    try {
      const r = await fetch("/api/admin/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id }) });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.erro || "Não foi possível apagar.");
      }
      setApagados((s) => new Set(s).add(l.id));
      deuCerto(`${l.nome} apagado.`);
    } catch (e) {
      falhou((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  // ---------- cadastrar ----------
  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    const digitos = form.whatsapp.replace(/\D/g, "");
    if (!form.nome.trim() || digitos.length < 8) {
      falhou("Informe o nome e um WhatsApp válido.");
      return;
    }
    setSalvandoForm(true);
    try {
      const r = await fetch("/api/admin/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.erro || "Não foi possível cadastrar.");
      const novo: LeadDTO = d.lead ?? {
        id: -Date.now(),
        ...form,
        situacao: "NOVO",
        codigoPedido: "",
        criadoEm: new Date(agora).toISOString(),
        atualizadoEm: new Date(agora).toISOString(),
      };
      setCriados((c) => [novo, ...c]);
      setForm(FORM_VAZIO);
      setFormAberto(false);
      setIntervalo(intervaloDoAtalho("mes", agora));
      deuCerto(`${novo.nome} cadastrado.`);
    } catch (err) {
      falhou((err as Error).message);
    } finally {
      setSalvandoForm(false);
    }
  }

  // ---------- planilha ----------
  function exportarCSV() {
    const linhas = [
      ["Data", "Nome", "WhatsApp", "Origem", "Interesse", "Situação", "Observação", "Pedido"],
      ...filtrados.map((l) => [formatarData(l.criadoEm), l.nome, l.whatsapp, ROTULO_ORIGEM[origemDe(l)], l.interesse, ROTULO_SITUACAO[situacaoDe(l)], l.observacao, l.codigoPedido]),
    ];
    const csv = linhas.map((li) => li.map((campo) => `"${String(campo).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-viverbem-${periodo.rotulo.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="max-w-6xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Leads"
        descricao="Quem entrou em contato e em que pé está a conversa. Os pedidos do site entram sozinhos; o resto você cadastra."
        acao={
          <div className="flex flex-wrap gap-2">
            <BotaoAdmin onClick={exportarCSV} disabled={filtrados.length === 0}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Baixar planilha
            </BotaoAdmin>
            <BotaoAdmin variante="primario" onClick={() => setFormAberto((a) => !a)} aria-expanded={formAberto}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Cadastrar lead
            </BotaoAdmin>
          </div>
        }
      />

      {/* ---------- Cadastrar ---------- */}
      {formAberto && (
        <form onSubmit={cadastrar} className="mt-5 rounded-[1.5rem] bg-white ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">Novo lead</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" aria-label="Nome" className={classeCampoAdmin} required />
            <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp, ex.: (24) 99999-9999" aria-label="WhatsApp" className={classeCampoAdmin} required />
            <select value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value as OrigemLead })} aria-label="Origem" className={classeCampoAdmin}>
              {ORIGENS_LEAD.filter((o) => o !== "SITE").map((o) => (
                <option key={o} value={o}>
                  {ROTULO_ORIGEM[o]}
                </option>
              ))}
            </select>
            <input value={form.interesse} onChange={(e) => setForm({ ...form, interesse: e.target.value })} placeholder="O que a pessoa procura" aria-label="Interesse" className={classeCampoAdmin} />
            <textarea
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              placeholder="Observação (opcional)"
              aria-label="Observação"
              rows={2}
              className={`${classeCampoAdmin} md:col-span-2 resize-y`}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <BotaoAdmin type="submit" variante="primario" disabled={salvandoForm}>
              {salvandoForm ? "Salvando..." : "Salvar lead"}
            </BotaoAdmin>
            <BotaoAdmin variante="fantasma" onClick={() => setFormAberto(false)}>
              Cancelar
            </BotaoAdmin>
          </div>
        </form>
      )}

      {/* ---------- O período ---------- */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PeriodoLeads valor={intervalo} agora={agora} aoMudar={setIntervalo} />
        <p className="text-xs text-cinza tabular-nums">
          comparado com <span className="font-medium text-navy">{periodo.rotuloAnterior}</span>
        </p>
      </div>

      {/* ---------- Os quatro números ---------- */}
      <div className="cascata grid grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
        <CartaoNumero tom="noite" icone={ICONES.leads} rotulo="Leads" valor={periodo.n.total} apoio={`${periodo.nAnterior.total} em ${periodo.rotuloAnterior}`} />
        <CartaoNumero icone={ICONES.pedidos} rotulo="Novos" valor={periodo.n.NOVO} apoio="ainda sem resposta" />
        <CartaoNumero icone={ICONES.clientes} rotulo="Em contato" valor={periodo.n.EM_CONTATO} apoio="conversa em andamento" />
        <CartaoNumero tom={periodo.n.CONVERTIDO > 0 ? "verde" : "navy"} icone={ICONES.site} rotulo="Viraram cliente" valor={periodo.n.CONVERTIDO} apoio={`${taxa}% dos leads do período`} />
      </div>

      {/* ---------- As barras e as origens ---------- */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4 mt-4">
        <div className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5">
          <h2 className="text-[1.02rem] font-semibold text-navy tracking-[-0.01em]">Leads por {periodo.grao === "mes" ? "mês" : periodo.grao === "semana" ? "semana" : "dia"}</h2>
          <p className="text-cinza text-xs mt-0.5">{periodo.rotulo}</p>
          {periodo.n.total === 0 ? (
            <p className="mt-6 text-sm text-cinza">Nenhum lead neste período.</p>
          ) : (
            <div className="mt-5 flex h-36 items-end gap-[3px]" role="img" aria-label={`Leads por ${periodo.grao === "mes" ? "mês" : periodo.grao === "semana" ? "semana" : "dia"}`}>
              {periodo.barras.map((b, i) => {
                const alt = Math.max(b.valor > 0 ? 6 : 2, Math.round((b.valor / maiorBarra) * 100));
                const topo = b.valor === maiorBarra && b.valor > 0;
                const mostrarRotulo = periodo.barras.length <= 12 || i % 5 === 0 || i === periodo.barras.length - 1;
                return (
                  <div key={i} className="group relative flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5 h-full" title={`${b.rotulo}: ${b.valor}`}>
                    {topo && <span className="text-[0.65rem] font-semibold text-navy tabular-nums">{b.valor}</span>}
                    <span
                      className={`w-full rounded-t-md transition-colors ${b.valor === 0 ? "bg-nevoa" : topo ? "bg-[image:var(--ouro-degrade)]" : "bg-tinta/80 group-hover:bg-tinta"}`}
                      style={{ height: `${alt}%` }}
                    />
                    <span className={`text-[0.6rem] text-grafite-claro tabular-nums ${mostrarRotulo ? "" : "invisible"}`}>{b.rotulo}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5">
          <h2 className="text-[1.02rem] font-semibold text-navy tracking-[-0.01em]">De onde vieram</h2>
          <p className="text-cinza text-xs mt-0.5">Toque numa origem para filtrar a lista</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {ORIGENS_LEAD.map((o) => {
              const n = periodo.porOrigem[o];
              const pct = periodo.n.total > 0 ? Math.round((n / periodo.n.total) * 100) : 0;
              const ativo = origemFiltro === o;
              return (
                <li key={o}>
                  <button
                    type="button"
                    onClick={() => setOrigemFiltro(ativo ? "" : o)}
                    aria-pressed={ativo}
                    className={`w-full rounded-xl px-3 py-2 text-left transition-colors ${ativo ? "bg-gelo" : "hover:bg-nevoa"}`}
                  >
                    <span className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-navy">{ROTULO_ORIGEM[o]}</span>
                      <span className="tabular-nums">
                        <b className="text-navy">{n}</b>
                        <span className="text-xs text-grafite-claro"> · {pct}%</span>
                      </span>
                    </span>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-nevoa">
                      <span className="block h-full rounded-full bg-[image:var(--ouro-degrade)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ---------- Busca e situação ---------- */}
      <div className="mt-4 rounded-[1.25rem] bg-white/80 backdrop-blur-sm ring-1 ring-fio/80 p-3 flex flex-col gap-3">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, WhatsApp, interesse ou observação..."
            aria-label="Buscar lead"
            className={`${classeCampoAdmin} !pl-11 !bg-nevoa/70 !border-transparent focus:!bg-white`}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto rolagem-sem-barra max-w-full">
          {(["TODOS", ...SITUACOES_LEAD] as FiltroSituacao[]).map((v) => {
            const ativo = situacaoFiltro === v;
            const n = v === "TODOS" ? periodo.n.total : periodo.n[v];
            return (
              <button
                key={v}
                type="button"
                onClick={() => setSituacaoFiltro(v)}
                aria-pressed={ativo}
                className={`shrink-0 inline-flex items-center gap-2 h-9 rounded-full px-3.5 text-[0.82rem] font-medium transition-colors active:scale-95 ${
                  ativo ? "bg-navy text-white shadow-[0_10px_20px_-14px_rgba(13,35,64,0.7)]" : "bg-white text-cinza ring-1 ring-inset ring-fio hover:ring-tinta/40 hover:text-navy"
                }`}
              >
                {v !== "TODOS" && <span aria-hidden="true" className={`size-1.5 rounded-full ${COR_SITUACAO[v].ponto}`} />}
                {v === "TODOS" ? "Todos" : ROTULO_SITUACAO[v]}
                <span className={`tabular-nums text-[0.75rem] ${ativo ? "text-white/70" : "text-grafite-claro"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {erro && <AvisoAdmin className="mt-3">{erro}</AvisoAdmin>}
      {aviso && (
        <AvisoAdmin tom="ok" className="mt-3">
          {aviso}
        </AvisoAdmin>
      )}

      {/* ---------- A lista ---------- */}
      <div className="mt-4 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] overflow-hidden">
        {filtrados.length === 0 ? (
          <p className="text-cinza py-14 px-6 text-center">
            {periodo.n.total === 0 ? "Nenhum lead neste período. Mude o período acima ou cadastre um lead." : "Nenhum lead com esse filtro."}
          </p>
        ) : (
          <ul className="divide-y divide-fio">
            {filtrados.map((l) => {
              const st = situacaoDe(l);
              const origem = origemDe(l);
              const expandido = aberto === l.id;
              return (
                <li key={l.id} className={`relative transition-colors ${ocupado === l.id ? "opacity-70" : ""} ${st === "NOVO" ? "bg-ouro/[0.035]" : ""}`}>
                  {st === "NOVO" && <span aria-hidden="true" className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[image:var(--ouro-degrade)]" />}
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-3 px-4 md:px-5 py-3.5">
                    <button type="button" onClick={() => setAberto(expandido ? null : l.id)} aria-expanded={expandido} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <Inicial nome={l.nome} tamanho="md" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold text-navy text-[0.95rem] leading-snug">{l.nome}</span>
                          <Selo tom={TOM_ORIGEM[origem]}>{ROTULO_ORIGEM[origem]}</Selo>
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-cinza">
                          <span className="font-medium text-grafite tabular-nums">{l.whatsapp}</span>
                          <span aria-hidden="true" className="text-fio">·</span>
                          <span title={formatarData(l.criadoEm)}>{quando(l.criadoEm, agora)}</span>
                          {l.interesse && (
                            <>
                              <span aria-hidden="true" className="text-fio">·</span>
                              <span className="truncate max-w-[22rem]">{l.interesse}</span>
                            </>
                          )}
                        </span>
                      </span>
                    </button>

                    {/* A situação, no lugar */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="relative">
                        <span aria-hidden="true" className={`absolute left-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full ${COR_SITUACAO[st].ponto}`} />
                        <select
                          value={st}
                          onChange={(e) => alterar(l, { situacao: e.target.value }, `${l.nome}: ${ROTULO_SITUACAO[e.target.value as SituacaoLead].toLowerCase()}.`)}
                          aria-label={`Situação de ${l.nome}`}
                          disabled={ocupado === l.id}
                          className={`h-9 appearance-none rounded-full pl-7 pr-8 text-[0.8rem] font-semibold ring-1 ring-inset cursor-pointer ${COR_SITUACAO[st].pilula}`}
                        >
                          {SITUACOES_LEAD.map((s) => (
                            <option key={s} value={s}>
                              {ROTULO_SITUACAO[s]}
                            </option>
                          ))}
                        </select>
                        <svg aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <a
                        href={`https://wa.me/${zapDoLead(l.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Chamar ${l.nome} no WhatsApp`}
                        className="flex size-9 items-center justify-center rounded-full bg-[#1DA851]/12 text-[#128C4B] transition-colors hover:bg-[#1DA851] hover:text-white"
                      >
                        <IconeWhats />
                      </a>
                      {apaga && (
                      <button
                        type="button"
                        onClick={() => apagar(l)}
                        aria-label={`Apagar ${l.nome}`}
                        className="flex size-9 items-center justify-center rounded-full text-grafite-claro transition-colors hover:bg-carimbo/10 hover:text-carimbo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      )}
                    </div>
                  </div>

                  {expandido && (
                    <div className="px-4 md:px-5 pb-4 md:pl-[4.25rem]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="block text-xs text-cinza">
                          Interesse
                          <input
                            defaultValue={l.interesse}
                            onBlur={(e) => e.target.value !== l.interesse && alterar(l, { interesse: e.target.value }, "Interesse salvo.")}
                            className={`${classeCampoAdmin} mt-1`}
                            placeholder="O que a pessoa procura"
                          />
                        </label>
                        <label className="block text-xs text-cinza">
                          Observação
                          <textarea
                            defaultValue={l.observacao}
                            onBlur={(e) => e.target.value !== l.observacao && alterar(l, { observacao: e.target.value }, "Observação salva.")}
                            rows={2}
                            className={`${classeCampoAdmin} mt-1 resize-y`}
                            placeholder="Anote o que combinou"
                          />
                        </label>
                      </div>
                      <p className="mt-2 text-xs text-grafite-claro tabular-nums">
                        Cadastrado em {formatarData(l.criadoEm)}
                        {l.codigoPedido && ` · pedido ${l.codigoPedido}`}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
