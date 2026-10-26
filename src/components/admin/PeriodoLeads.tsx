"use client";
// O seletor de período dos leads (26/10/2026, "faça tipo o painel da
// Shopee, que você escolhe as datas"): um botão com o período escolhido
// que abre um painel com os atalhos (hoje, ontem, 7 dias, 30 dias, esta
// semana, este mês, mês passado, este ano) e, ao lado, as duas datas para
// um intervalo à escolha. As setas andam o intervalo para trás e para a
// frente pelo próprio tamanho dele.
import { useEffect, useRef, useState } from "react";

export const DIA = 86_400_000;
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export type Atalho = "hoje" | "ontem" | "7d" | "30d" | "semana" | "mes" | "mesPassado" | "ano" | "personalizado";
/** O intervalo: começo inclusive, fim exclusive (meia-noite do dia seguinte) */
export interface Intervalo {
  ini: Date;
  fim: Date;
  atalho: Atalho;
}

export const ATALHOS: { valor: Atalho; rotulo: string }[] = [
  { valor: "hoje", rotulo: "Hoje" },
  { valor: "ontem", rotulo: "Ontem" },
  { valor: "7d", rotulo: "Últimos 7 dias" },
  { valor: "30d", rotulo: "Últimos 30 dias" },
  { valor: "semana", rotulo: "Esta semana" },
  { valor: "mes", rotulo: "Este mês" },
  { valor: "mesPassado", rotulo: "Mês passado" },
  { valor: "ano", rotulo: "Este ano" },
];

export function meiaNoite(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** O intervalo de um atalho, contado a partir de "agora" */
export function intervaloDoAtalho(atalho: Atalho, agora: number): Intervalo {
  const hoje = meiaNoite(new Date(agora));
  const amanha = new Date(hoje.getTime() + DIA);
  switch (atalho) {
    case "hoje":
      return { ini: hoje, fim: amanha, atalho };
    case "ontem":
      return { ini: new Date(hoje.getTime() - DIA), fim: hoje, atalho };
    case "7d":
      return { ini: new Date(hoje.getTime() - 6 * DIA), fim: amanha, atalho };
    case "30d":
      return { ini: new Date(hoje.getTime() - 29 * DIA), fim: amanha, atalho };
    case "semana": {
      const diaSemana = (hoje.getDay() + 6) % 7; // segunda = 0
      const ini = new Date(hoje.getTime() - diaSemana * DIA);
      return { ini, fim: new Date(ini.getTime() + 7 * DIA), atalho };
    }
    case "mesPassado":
      return { ini: new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1), fim: new Date(hoje.getFullYear(), hoje.getMonth(), 1), atalho };
    case "ano":
      return { ini: new Date(hoje.getFullYear(), 0, 1), fim: new Date(hoje.getFullYear() + 1, 0, 1), atalho };
    case "mes":
    default:
      return { ini: new Date(hoje.getFullYear(), hoje.getMonth(), 1), fim: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1), atalho: "mes" };
  }
}

/** Quantos dias o intervalo tem */
export function diasDo(i: Intervalo) {
  return Math.max(1, Math.round((i.fim.getTime() - i.ini.getTime()) / DIA));
}

/** O mesmo tamanho, logo antes (para a comparação) */
export function intervaloAnterior(i: Intervalo): Intervalo {
  // Mês e ano inteiros comparam com o mês e o ano anteriores inteiros
  if (i.atalho === "mes" || i.atalho === "mesPassado") {
    return { ini: new Date(i.ini.getFullYear(), i.ini.getMonth() - 1, 1), fim: i.ini, atalho: i.atalho };
  }
  if (i.atalho === "ano") return { ini: new Date(i.ini.getFullYear() - 1, 0, 1), fim: i.ini, atalho: i.atalho };
  const tamanho = i.fim.getTime() - i.ini.getTime();
  return { ini: new Date(i.ini.getTime() - tamanho), fim: i.ini, atalho: "personalizado" };
}

/** Anda o intervalo para trás (-1) ou para a frente (+1) pelo próprio tamanho */
export function deslocarIntervalo(i: Intervalo, sentido: -1 | 1): Intervalo {
  if (i.atalho === "mes" || i.atalho === "mesPassado") {
    const ini = new Date(i.ini.getFullYear(), i.ini.getMonth() + sentido, 1);
    return { ini, fim: new Date(ini.getFullYear(), ini.getMonth() + 1, 1), atalho: "personalizado" };
  }
  if (i.atalho === "ano") {
    const ini = new Date(i.ini.getFullYear() + sentido, 0, 1);
    return { ini, fim: new Date(ini.getFullYear() + 1, 0, 1), atalho: "personalizado" };
  }
  const tamanho = i.fim.getTime() - i.ini.getTime();
  return { ini: new Date(i.ini.getTime() + sentido * tamanho), fim: new Date(i.fim.getTime() + sentido * tamanho), atalho: "personalizado" };
}

function diaCurto(d: Date, comAno: boolean) {
  return `${d.getDate()} ${MESES_CURTOS[d.getMonth()]}${comAno ? ` ${d.getFullYear()}` : ""}`;
}

/** "Outubro de 2026", "2026", "26 out", "20 a 26 out 2026", "28 set a 4 out 2026" */
export function rotuloDoIntervalo(i: Intervalo, agora: number): string {
  const ultimo = new Date(i.fim.getTime() - DIA);
  const anoAtual = new Date(agora).getFullYear();
  const comAno = i.ini.getFullYear() !== anoAtual || ultimo.getFullYear() !== anoAtual;
  const mesInteiro = i.ini.getDate() === 1 && i.fim.getDate() === 1 && i.fim.getMonth() === (i.ini.getMonth() + 1) % 12 && diasDo(i) >= 28;
  if (mesInteiro) return `${MESES[i.ini.getMonth()].charAt(0).toUpperCase()}${MESES[i.ini.getMonth()].slice(1)} de ${i.ini.getFullYear()}`;
  const anoInteiro = i.ini.getMonth() === 0 && i.ini.getDate() === 1 && i.fim.getMonth() === 0 && i.fim.getDate() === 1 && i.fim.getFullYear() === i.ini.getFullYear() + 1;
  if (anoInteiro) return String(i.ini.getFullYear());
  if (diasDo(i) === 1) return diaCurto(i.ini, comAno);
  if (i.ini.getMonth() === ultimo.getMonth() && i.ini.getFullYear() === ultimo.getFullYear()) {
    return `${i.ini.getDate()} a ${ultimo.getDate()} ${MESES_CURTOS[i.ini.getMonth()]}${comAno ? ` ${ultimo.getFullYear()}` : ""}`;
  }
  return `${diaCurto(i.ini, i.ini.getFullYear() !== ultimo.getFullYear())} a ${diaCurto(ultimo, comAno)}`;
}

function paraInput(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}
function deInput(v: string): Date | null {
  const [a, m, d] = v.split("-").map(Number);
  if (!a || !m || !d) return null;
  return new Date(a, m - 1, d);
}

export function PeriodoLeads({ valor, agora, aoMudar }: { valor: Intervalo; agora: number; aoMudar: (i: Intervalo) => void }) {
  const [aberto, setAberto] = useState(false);
  const [de, setDe] = useState(paraInput(valor.ini));
  const [ate, setAte] = useState(paraInput(new Date(valor.fim.getTime() - DIA)));
  const raiz = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou com Esc
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  function abrir() {
    setDe(paraInput(valor.ini));
    setAte(paraInput(new Date(valor.fim.getTime() - DIA)));
    setAberto((a) => !a);
  }

  function aplicarDatas() {
    const a = deInput(de);
    const b = deInput(ate);
    if (!a || !b) return;
    const ini = a <= b ? a : b;
    const ultimo = a <= b ? b : a;
    aoMudar({ ini, fim: new Date(ultimo.getTime() + DIA), atalho: "personalizado" });
    setAberto(false);
  }

  const hojeTexto = paraInput(meiaNoite(new Date(agora)));
  const nomeAtalho = ATALHOS.find((a) => a.valor === valor.atalho)?.rotulo ?? "Período";
  const classeSeta = "flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-fio text-navy transition-colors hover:ring-tinta/40 disabled:opacity-40";
  const podeAvancar = valor.fim.getTime() <= meiaNoite(new Date(agora)).getTime() + DIA;

  return (
    <div ref={raiz} className="relative flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => aoMudar(deslocarIntervalo(valor, -1))} aria-label="Período anterior" className={classeSeta}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        className="inline-flex h-10 items-center gap-2.5 rounded-full bg-white pl-3.5 pr-3 ring-1 ring-inset ring-fio text-[0.9rem] text-navy shadow-[0_10px_22px_-16px_rgba(13,35,64,0.45)] transition-colors hover:ring-tinta/40"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-tinta">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-xs text-cinza">{nomeAtalho}</span>
        <span className="font-semibold tabular-nums">{rotuloDoIntervalo(valor, agora)}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`text-grafite-claro transition-transform ${aberto ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button type="button" onClick={() => aoMudar(deslocarIntervalo(valor, 1))} disabled={!podeAvancar} aria-label="Próximo período" className={classeSeta}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Escolher o período"
          className="animar-surgir absolute left-0 top-[calc(100%+0.6rem)] z-30 w-[min(34rem,calc(100vw-2.5rem))] overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-fio shadow-[0_28px_60px_-28px_rgba(13,35,64,0.5)] sm:left-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[11rem_1fr]">
            {/* Os atalhos */}
            <ul className="border-b border-fio p-2 sm:border-b-0 sm:border-r grid grid-cols-2 gap-1 sm:flex sm:flex-col">
              {ATALHOS.map((a) => {
                const ativo = valor.atalho === a.valor;
                return (
                  <li key={a.valor}>
                    <button
                      type="button"
                      onClick={() => {
                        aoMudar(intervaloDoAtalho(a.valor, agora));
                        setAberto(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-left text-[0.88rem] transition-colors ${ativo ? "bg-navy text-white" : "text-navy hover:bg-nevoa"}`}
                    >
                      {a.rotulo}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* As datas à escolha */}
            <div className="p-4">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">Período à escolha</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block text-xs text-cinza">
                  De
                  <input type="date" value={de} max={hojeTexto} onChange={(e) => setDe(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-fio bg-nevoa/60 px-3 text-sm text-navy tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-tinta/30" />
                </label>
                <label className="block text-xs text-cinza">
                  Até
                  <input type="date" value={ate} max={hojeTexto} onChange={(e) => setAte(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-fio bg-nevoa/60 px-3 text-sm text-navy tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-tinta/30" />
                </label>
              </div>
              <p className="mt-2 text-xs text-grafite-claro">Os dois dias entram no período. A comparação usa o mesmo tamanho, logo antes.</p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setAberto(false)} className="h-10 rounded-full px-4 text-sm font-medium text-cinza transition-colors hover:bg-nevoa hover:text-navy">
                  Cancelar
                </button>
                <button type="button" onClick={aplicarDatas} className="h-10 rounded-full bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-tinta">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
