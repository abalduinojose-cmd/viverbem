"use client";
// O filtro de período da visão geral (14/10/2026, "quero um filtro para
// filtrar e comparar com o mesmo período do ano ou do mês passado, com
// gráficos também; deixe mais moderno e clean").
//
// O servidor manda o histórico enxuto dos pedidos (lib/metricas.ts, sem
// nome nem telefone) e a hora em que a página foi montada; a conta toda
// acontece aqui, no navegador, por isso o filtro funciona igual no painel
// de verdade e na prévia estática.
//   - Período: este mês, 7, 30 ou 90 dias, ou este ano (até agora).
//   - Comparar com: o mesmo período do mês passado ou do ano passado
//     (as mesmas datas, um mês ou um ano antes). "Este ano" só compara
//     com o ano passado.
//   - Os quatro números com a variação; um gráfico só, com a escolha do
//     que medir (pedidos, receitas, faturamento ou clientes), a linha do
//     período em azul e a da comparação tracejada em ouro, e o detalhe de
//     cada ponto ao passar o dedo ou o mouse; como recebem o pedido e os
//     mais pedidos, também no período escolhido.
// Os pontos do gráfico são dias até 32 dias, semanas até 100, meses acima.

import { useEffect, useMemo, useRef, useState } from "react";
import type { PedidoHistorico } from "@/lib/metricas";
import { formatarPreco } from "@/lib/preco";
import { CartaoNumero } from "./PecasAdmin";
import { BarraViva, curvaSuave } from "./PecasVivas";
import { ICONES } from "./iconesAdmin";

type Periodo = "mes" | "7d" | "30d" | "90d" | "ano";
type Comparar = "mes" | "ano";
type Medida = "pedidos" | "receitas" | "faturamento" | "clientes";
type Grao = "dia" | "semana" | "mes";

const PERIODOS: { valor: Periodo; rotulo: string }[] = [
  { valor: "mes", rotulo: "Este mês" },
  { valor: "7d", rotulo: "7 dias" },
  { valor: "30d", rotulo: "30 dias" },
  { valor: "90d", rotulo: "90 dias" },
  { valor: "ano", rotulo: "Este ano" },
];
const MEDIDAS: { valor: Medida; rotulo: string }[] = [
  { valor: "pedidos", rotulo: "Pedidos" },
  { valor: "receitas", rotulo: "Receitas" },
  { valor: "faturamento", rotulo: "Faturamento" },
  { valor: "clientes", rotulo: "Clientes" },
];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const DIA = 86_400_000;
const AZUL = "#1c69b5";
const OURO = "#c9a56b";

// ---------------------------------------------------------------- datas

function diasNoMes(ano: number, mes: number) {
  return new Date(ano, mes + 1, 0).getDate();
}

/** A mesma data um mês ou um ano antes (31/03 vira 28 ou 29/02) */
function deslocar(d: Date, comparar: Comparar) {
  const ano = comparar === "ano" ? d.getFullYear() - 1 : d.getFullYear();
  const mes = comparar === "mes" ? d.getMonth() - 1 : d.getMonth();
  const alvo = new Date(ano, mes, 1);
  const dia = Math.min(d.getDate(), diasNoMes(alvo.getFullYear(), alvo.getMonth()));
  return new Date(alvo.getFullYear(), alvo.getMonth(), dia, d.getHours(), d.getMinutes(), d.getSeconds());
}

function intervalo(periodo: Periodo, agora: Date) {
  const a = agora.getFullYear();
  const m = agora.getMonth();
  const d = agora.getDate();
  const ini = {
    mes: new Date(a, m, 1),
    "7d": new Date(a, m, d - 6),
    "30d": new Date(a, m, d - 29),
    "90d": new Date(a, m, d - 89),
    ano: new Date(a, 0, 1),
  }[periodo];
  return { ini, fim: agora };
}

function meiaNoite(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function grao(ini: Date, fim: Date): Grao {
  const dias = (fim.getTime() - ini.getTime()) / DIA;
  return dias <= 32 ? "dia" : dias <= 100 ? "semana" : "mes";
}

/** Em que ponto do gráfico cai uma data */
function indice(t: Date, ini: Date, g: Grao) {
  if (g === "mes") return (t.getFullYear() - ini.getFullYear()) * 12 + t.getMonth() - ini.getMonth();
  const dias = Math.round((meiaNoite(t).getTime() - meiaNoite(ini).getTime()) / DIA);
  return g === "dia" ? dias : Math.floor(dias / 7);
}

function rotuloDoPonto(ini: Date, i: number, g: Grao, comAno: boolean) {
  if (g === "mes") {
    const d = new Date(ini.getFullYear(), ini.getMonth() + i, 1);
    return `${MESES[d.getMonth()]}${comAno ? `/${String(d.getFullYear()).slice(2)}` : ""}`;
  }
  const d = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + (g === "dia" ? i : i * 7));
  const texto = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return g === "semana" ? `sem. de ${texto}` : texto;
}

/** "1 a 14 de out." ou "15 de set. a 14 de out. de 2025" */
function textoIntervalo(ini: Date, fim: Date, anoAtual: number) {
  const mes = (d: Date) => MESES[d.getMonth()] + ".";
  const ano = fim.getFullYear() !== anoAtual ? ` de ${fim.getFullYear()}` : "";
  if (ini.getFullYear() === fim.getFullYear() && ini.getMonth() === fim.getMonth()) {
    return `${ini.getDate()} a ${fim.getDate()} de ${mes(fim)}${ano}`;
  }
  const anoIni = ini.getFullYear() !== fim.getFullYear() ? ` de ${ini.getFullYear()}` : "";
  return `${ini.getDate()} de ${mes(ini)}${anoIni} a ${fim.getDate()} de ${mes(fim)}${ano}`;
}

// ---------------------------------------------------------------- contas

interface Resumo {
  pedidos: number;
  receitas: number;
  faturamento: number;
  clientes: number;
  entregas: number;
  retiradas: number;
  porItem: Map<string, number>;
  serie: Record<Medida, number[]>;
}

function resumir(lista: PedidoHistorico[], ini: Date, fim: Date, g: Grao, pontos: number): Resumo {
  const serie: Record<Medida, number[]> = {
    pedidos: Array(pontos).fill(0),
    receitas: Array(pontos).fill(0),
    faturamento: Array(pontos).fill(0),
    clientes: Array(pontos).fill(0),
  };
  const clientesPorPonto = Array.from({ length: pontos }, () => new Set<number>());
  const clientes = new Set<number>();
  const porItem = new Map<string, number>();
  let pedidos = 0;
  let receitas = 0;
  let faturamento = 0;
  let entregas = 0;
  let retiradas = 0;
  const a = ini.getTime();
  const b = fim.getTime();
  for (const p of lista) {
    if (p.t < a || p.t > b) continue;
    const i = indice(new Date(p.t), ini, g);
    if (i < 0 || i >= pontos) continue;
    pedidos += 1;
    faturamento += p.total;
    clientes.add(p.cliente);
    serie.pedidos[i] += 1;
    serie.faturamento[i] += p.total;
    clientesPorPonto[i].add(p.cliente);
    if (p.receita) {
      receitas += 1;
      serie.receitas[i] += 1;
    }
    if (p.retirada === true) retiradas += 1;
    if (p.retirada === false) entregas += 1;
    for (const [nome, qtd] of p.itens) porItem.set(nome, (porItem.get(nome) ?? 0) + qtd);
  }
  serie.clientes = clientesPorPonto.map((s) => s.size);
  return { pedidos, receitas, faturamento, clientes: clientes.size, entregas, retiradas, porItem, serie };
}

function variacao(atual: number, anterior: number): number | null {
  if (anterior === 0) return atual === 0 ? 0 : null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

function reaisCurtos(centavos: number) {
  const reais = centavos / 100;
  if (reais >= 1000) return `R$ ${(reais / 1000).toFixed(reais >= 10000 ? 0 : 1).replace(".", ",")} mil`;
  return `R$ ${Math.round(reais)}`;
}

function tetoRedondo(maior: number) {
  if (maior <= 0) return 1;
  const potencia = Math.pow(10, Math.floor(Math.log10(maior)));
  for (const passo of [1, 2, 2.5, 5, 10]) if (passo * potencia >= maior) return passo * potencia;
  return 10 * potencia;
}

// ---------------------------------------------------------------- peças

function Variacao({ valor, noite = false }: { valor: number | null; noite?: boolean }) {
  if (valor === null) {
    return (
      <span className={`inline-flex items-center text-[0.6875rem] font-semibold rounded-full px-2 py-0.5 ${noite ? "bg-white/10 text-white/70" : "bg-gelo text-tinta"}`} title="Nada no período de comparação">
        novo
      </span>
    );
  }
  const subiu = valor > 0;
  const parado = valor === 0;
  const classe = noite
    ? parado
      ? "bg-white/10 text-white/70"
      : subiu
        ? "bg-green-400/20 text-green-200"
        : "bg-white/10 text-[#f6c7c9]"
    : parado
      ? "bg-nevoa text-cinza"
      : subiu
        ? "bg-green-50 text-green-700"
        : "bg-carimbo/10 text-carimbo";
  return (
    <span className={`inline-flex items-center gap-1 text-[0.6875rem] font-semibold rounded-full px-2 py-0.5 tabular-nums ${classe}`} title="Em relação ao período de comparação">
      {!parado && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={subiu ? "M12 19V5m0 0-6 6m6-6 6 6" : "M12 5v14m0 0 6-6m-6 6-6-6"} stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {subiu ? "+" : ""}
      {valor}%
    </span>
  );
}

/** Seletor em trilho (as pílulas do filtro) */
function Trilho<T extends string>({
  opcoes,
  valor,
  aoEscolher,
  rotulo,
  desligadas = [],
}: {
  opcoes: { valor: T; rotulo: string }[];
  valor: T;
  aoEscolher: (v: T) => void;
  rotulo: string;
  desligadas?: T[];
}) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="inline-flex shrink-0 gap-0.5 rounded-full bg-nevoa p-1 ring-1 ring-inset ring-fio/70">
      {opcoes.map((o) => {
        const ativo = o.valor === valor;
        const desligada = desligadas.includes(o.valor);
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            disabled={desligada}
            onClick={() => aoEscolher(o.valor)}
            className={`h-8 rounded-full px-3.5 text-[0.8rem] font-medium whitespace-nowrap transition disabled:opacity-35 disabled:cursor-not-allowed ${
              ativo ? "bg-white text-navy shadow-[0_6px_16px_-10px_rgba(13,35,64,0.55)] ring-1 ring-fio" : "text-cinza hover:text-navy"
            }`}
          >
            {o.rotulo}
          </button>
        );
      })}
    </div>
  );
}

/** O gráfico de linhas comparativo: o período em azul (com a área) e a
 *  comparação tracejada em ouro; passar o dedo ou o mouse mostra o ponto. */
function GraficoComparativo({
  atual,
  anterior,
  rotulosAtual,
  rotulosAnterior,
  formato,
  nomeAtual,
  nomeAnterior,
}: {
  atual: number[];
  anterior: number[];
  rotulosAtual: string[];
  rotulosAnterior: string[];
  formato: (n: number) => string;
  nomeAtual: string;
  nomeAnterior: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const linha = useRef<SVGPathElement>(null);
  const [largura, setLargura] = useState(640);
  const [foco, setFoco] = useState<number | null>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const observador = new ResizeObserver(([e]) => setLargura(Math.max(260, Math.round(e.contentRect.width))));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const A = largura < 480 ? 200 : 236;
  const esq = 44;
  const dir = 14;
  const topo = 14;
  const base = A - 28;
  const n = atual.length;
  const teto = tetoRedondo(Math.max(...atual, ...anterior, 0));
  const x = (i: number) => (n <= 1 ? (esq + largura - dir) / 2 : esq + (i / (n - 1)) * (largura - esq - dir));
  const y = (v: number) => base - (v / teto) * (base - topo);
  const pontosAtual = atual.map((v, i) => [x(i), y(v)] as const);
  const pontosAnterior = anterior.map((v, i) => [x(i), y(v)] as const);
  const dAtual = curvaSuave(pontosAtual, base, topo);
  const dAnterior = curvaSuave(pontosAnterior, base, topo);
  const area = dAtual ? `${dAtual} L${x(n - 1)},${base} L${x(0)},${base} Z` : "";

  // A linha do período se desenha de novo a cada troca de filtro
  useEffect(() => {
    const el = linha.current;
    if (!el || !dAtual) return;
    const comprimento = el.getTotalLength();
    const animacao = el.animate([{ strokeDasharray: `${comprimento}`, strokeDashoffset: comprimento }, { strokeDasharray: `${comprimento}`, strokeDashoffset: 0 }], {
      duration: 900,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    return () => animacao.cancel();
  }, [dAtual]);

  function aoMover(e: React.PointerEvent<SVGRectElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left + esq;
    const i = n <= 1 ? 0 : Math.round(((px - esq) / (largura - esq - dir)) * (n - 1));
    setFoco(Math.max(0, Math.min(n - 1, i)));
  }

  const marcas = n <= 1 ? [0] : n <= 4 ? atual.map((_, i) => i) : [0, Math.round((n - 1) / 2), n - 1];
  const idGrad = `g-comp-${nomeAtual.length}`;

  return (
    <div ref={caixa} className="relative select-none">
      <svg width={largura} height={A} viewBox={`0 0 ${largura} ${A}`} className="block" role="img" aria-label={`${nomeAtual} comparado com ${nomeAnterior}`}>
        <defs>
          <linearGradient id={idGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={AZUL} stopOpacity="0.22" />
            <stop offset="1" stopColor={AZUL} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={esq} x2={largura - dir} y1={y(teto * f)} y2={y(teto * f)} stroke="#e4e8ee" strokeDasharray={f === 0 ? undefined : "3 4"} />
            <text x={esq - 8} y={y(teto * f) + 3.5} textAnchor="end" className="fill-grafite-claro" style={{ fontSize: 10.5, fontVariantNumeric: "tabular-nums" }}>
              {formato(teto * f)}
            </text>
          </g>
        ))}
        {marcas.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={A - 8}
            textAnchor={n > 1 && i === 0 ? "start" : n > 1 && i === n - 1 ? "end" : "middle"}
            className="fill-grafite-claro"
            style={{ fontSize: 10.5, fontVariantNumeric: "tabular-nums" }}
          >
            {rotulosAtual[i]}
          </text>
        ))}

        {area && <path d={area} fill={`url(#${idGrad})`} />}
        {dAnterior && <path d={dAnterior} fill="none" stroke={OURO} strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />}
        {dAtual && <path ref={linha} d={dAtual} fill="none" stroke={AZUL} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
        {n === 1 && (
          <>
            <circle cx={x(0)} cy={y(anterior[0] ?? 0)} r="4" fill={OURO} />
            <circle cx={x(0)} cy={y(atual[0] ?? 0)} r="5" fill={AZUL} />
          </>
        )}

        {/* O ponto em foco */}
        {foco !== null && (
          <g>
            <line x1={x(foco)} x2={x(foco)} y1={topo} y2={base} stroke="#0d2340" strokeOpacity="0.18" />
            <circle cx={pontosAnterior[foco]?.[0]} cy={pontosAnterior[foco]?.[1]} r="4" fill="#fff" stroke={OURO} strokeWidth="2" />
            <circle cx={pontosAtual[foco]?.[0]} cy={pontosAtual[foco]?.[1]} r="5" fill={AZUL} stroke="#fff" strokeWidth="2" />
          </g>
        )}
        <rect
          x={esq}
          y={0}
          width={largura - esq - dir}
          height={base}
          fill="transparent"
          onPointerMove={aoMover}
          onPointerDown={aoMover}
          onPointerLeave={() => setFoco(null)}
          style={{ touchAction: "pan-y" }}
        />
      </svg>

      {foco !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 min-w-[10.5rem] rounded-2xl bg-white/95 backdrop-blur ring-1 ring-fio shadow-[0_16px_36px_-18px_rgba(13,35,64,0.5)] px-3.5 py-2.5 text-xs"
          style={{ left: Math.min(Math.max(x(foco) - 84, 0), largura - 172) }}
        >
          <p className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-cinza">
              <span className="size-2 rounded-full" style={{ background: AZUL }} />
              {rotulosAtual[foco]}
            </span>
            <b className="text-navy tabular-nums">{formato(atual[foco] ?? 0)}</b>
          </p>
          <p className="mt-1 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-cinza">
              <span className="size-2 rounded-full" style={{ background: OURO }} />
              {rotulosAnterior[foco]}
            </span>
            <b className="text-navy tabular-nums">{formato(anterior[foco] ?? 0)}</b>
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- o painel

export function PainelPeriodo({ historico, agora }: { historico: PedidoHistorico[]; agora: number }) {
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [comparar, setComparar] = useState<Comparar>("mes");
  const [medida, setMedida] = useState<Medida>("pedidos");
  // "Este ano" só se compara com o ano passado
  const comparacao: Comparar = periodo === "ano" ? "ano" : comparar;

  const conta = useMemo(() => {
    const hoje = new Date(agora);
    const { ini, fim } = intervalo(periodo, hoje);
    const ini2 = deslocar(ini, comparacao);
    const fim2 = deslocar(fim, comparacao);
    const g = grao(ini, fim);
    const pontos = indice(fim, ini, g) + 1;
    const atual = resumir(historico, ini, fim, g, pontos);
    const anterior = resumir(historico, ini2, fim2, g, pontos);
    const comAno = g === "mes" && ini.getFullYear() !== fim.getFullYear();
    return {
      atual,
      anterior,
      textoAtual: textoIntervalo(ini, fim, hoje.getFullYear()),
      textoAnterior: textoIntervalo(ini2, fim2, hoje.getFullYear()),
      rotulosAtual: Array.from({ length: pontos }, (_, i) => rotuloDoPonto(ini, i, g, comAno)),
      rotulosAnterior: Array.from({ length: pontos }, (_, i) => rotuloDoPonto(ini2, i, g, true)),
      grao: g,
    };
  }, [historico, agora, periodo, comparacao]);

  const { atual, anterior } = conta;
  const nomeComparacao = comparacao === "mes" ? "mês passado" : "ano passado";
  const formato = medida === "faturamento" ? reaisCurtos : (v: number) => String(Math.round(v));
  const totalMedida = (r: Resumo) => (medida === "faturamento" ? formatarPreco(r.faturamento) : String(r[medida]));

  // Os mais pedidos do período, com a quantidade da comparação ao lado
  const maisPedidos = [...atual.porItem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const totalEntrega = atual.entregas + atual.retiradas;
  const pctEntrega = totalEntrega > 0 ? Math.round((atual.entregas / totalEntrega) * 100) : 0;

  return (
    <section className="mt-7" aria-label="Números do período">
      {/* ---------- O filtro ---------- */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
          <div className="overflow-x-auto rolagem-sem-barra -mx-1 px-1">
            <Trilho rotulo="Período" opcoes={PERIODOS} valor={periodo} aoEscolher={setPeriodo} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-cinza whitespace-nowrap">comparar com</span>
            <Trilho
              rotulo="Comparar com"
              opcoes={[
                { valor: "mes", rotulo: "Mês passado" },
                { valor: "ano", rotulo: "Ano passado" },
              ]}
              valor={comparacao}
              aoEscolher={setComparar}
              desligadas={periodo === "ano" ? ["mes"] : []}
            />
          </div>
        </div>
        <p className="text-xs text-cinza tabular-nums">
          <span className="font-semibold text-navy">{conta.textoAtual}</span> contra {conta.textoAnterior}
        </p>
      </div>

      {/* ---------- Os quatro números ---------- */}
      <div className="cascata grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        <CartaoNumero
          tom="noite"
          icone={ICONES.pedidos}
          rotulo="Pedidos"
          valor={String(atual.pedidos)}
          extra={<Variacao noite valor={variacao(atual.pedidos, anterior.pedidos)} />}
          apoio={`${anterior.pedidos} no ${nomeComparacao}`}
        />
        <CartaoNumero
          icone={ICONES.receita}
          rotulo="Receitas"
          valor={String(atual.receitas)}
          extra={<Variacao valor={variacao(atual.receitas, anterior.receitas)} />}
          apoio={`${atual.pedidos > 0 ? Math.round((atual.receitas / atual.pedidos) * 100) : 0}% dos pedidos · ${anterior.receitas} no ${nomeComparacao}`}
        />
        <CartaoNumero
          icone={ICONES.faturamento}
          rotulo="Faturamento"
          valor={formatarPreco(atual.faturamento)}
          extra={<Variacao valor={variacao(atual.faturamento, anterior.faturamento)} />}
          apoio={`${formatarPreco(anterior.faturamento)} no ${nomeComparacao}`}
        />
        <CartaoNumero
          icone={ICONES.clientes}
          rotulo="Clientes"
          valor={String(atual.clientes)}
          extra={<Variacao valor={variacao(atual.clientes, anterior.clientes)} />}
          apoio={`WhatsApps diferentes · ${anterior.clientes} no ${nomeComparacao}`}
        />
      </div>

      {/* ---------- O gráfico comparativo ---------- */}
      <div className="mt-4 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[1.02rem] font-semibold text-navy tracking-[-0.01em]">Evolução no período</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-2 text-cinza">
                <span aria-hidden="true" className="w-4 h-[3px] rounded-full" style={{ background: AZUL }} />
                Este período <b className="text-navy tabular-nums">{totalMedida(atual)}</b>
              </span>
              <span className="inline-flex items-center gap-2 text-cinza">
                <span aria-hidden="true" className="w-4 border-t-2 border-dashed" style={{ borderColor: OURO }} />
                {nomeComparacao.charAt(0).toUpperCase() + nomeComparacao.slice(1)} <b className="text-navy tabular-nums">{totalMedida(anterior)}</b>
              </span>
              <span className="text-grafite-claro">por {conta.grao === "dia" ? "dia" : conta.grao === "semana" ? "semana" : "mês"}</span>
            </div>
          </div>
          <div className="overflow-x-auto rolagem-sem-barra -mx-1 px-1">
            <Trilho rotulo="O que medir" opcoes={MEDIDAS} valor={medida} aoEscolher={setMedida} />
          </div>
        </div>
        <div className="mt-5">
          {atual.pedidos === 0 && anterior.pedidos === 0 ? (
            <div className="relative h-[200px] overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f7f9fc,#ffffff)] ring-1 ring-inset ring-fio/70 flex flex-col items-center justify-center text-center px-6 gap-1.5">
              {/* Uma curva de apoio, bem apagada, para o cartão não parecer um erro */}
              <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                <path d="M0 150 C 90 140, 150 90, 230 100 S 360 150, 440 110 S 540 70, 600 80" fill="none" stroke="#1c69b5" strokeOpacity="0.12" strokeWidth="2.5" />
                <path d="M0 170 C 100 160, 170 130, 250 140 S 380 170, 460 140 S 560 110, 600 120" fill="none" stroke="#c9a56b" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="5 5" />
              </svg>
              <p className="relative font-semibold text-navy text-[0.95rem]">Nenhum pedido nos dois períodos</p>
              <p className="text-cinza text-sm max-w-xs leading-snug">Escolha um período maior ou compare com o ano passado.</p>
            </div>
          ) : (
            <GraficoComparativo
              atual={atual.serie[medida]}
              anterior={anterior.serie[medida]}
              rotulosAtual={conta.rotulosAtual}
              rotulosAnterior={conta.rotulosAnterior}
              formato={formato}
              nomeAtual={MEDIDAS.find((m) => m.valor === medida)?.rotulo ?? ""}
              nomeAnterior={nomeComparacao}
            />
          )}
        </div>
      </div>

      {/* ---------- Como recebem e os mais pedidos, no período ---------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5">
          <h2 className="text-[1.02rem] font-semibold text-navy tracking-[-0.01em]">Como recebem o pedido</h2>
          <p className="text-cinza text-xs mt-0.5">No período escolhido</p>
          {totalEntrega === 0 ? (
            <p className="mt-4 text-sm text-cinza">Nenhum pedido com entrega ou retirada no período.</p>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { nome: "Entrega", n: atual.entregas, antes: anterior.entregas, pct: pctEntrega, cor: AZUL },
                  { nome: "Retirada na loja", n: atual.retiradas, antes: anterior.retiradas, pct: 100 - pctEntrega, cor: OURO },
                ].map((c) => (
                  <div key={c.nome} className="rounded-2xl bg-nevoa/70 px-4 py-3.5">
                    <p className="flex items-center gap-2 text-xs font-medium text-cinza">
                      <span aria-hidden="true" className="size-2 rounded-full" style={{ background: c.cor }} />
                      {c.nome}
                    </p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="text-[1.75rem] font-semibold text-navy tracking-[-0.03em] leading-none tabular-nums">{c.n}</span>
                      <span className="text-sm font-medium text-grafite-claro tabular-nums">{c.pct}%</span>
                    </p>
                    <p className="mt-1.5 text-xs text-grafite-claro tabular-nums">
                      {c.antes} no {nomeComparacao}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-2 rounded-full overflow-hidden bg-nevoa gap-[3px]">
                <BarraViva pct={pctEntrega} className="h-full rounded-full" style={{ background: AZUL }} />
                <div className="h-full flex-1 rounded-full" style={{ background: OURO }} />
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5">
          <h2 className="text-[1.02rem] font-semibold text-navy tracking-[-0.01em]">Mais pedidos</h2>
          <p className="text-cinza text-xs mt-0.5">Produtos com preço, no período escolhido</p>
          {maisPedidos.length === 0 ? (
            <p className="mt-4 text-sm text-cinza leading-relaxed">Nenhum produto com preço pedido no período. Os pedidos pela receita contam em Receitas.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {maisPedidos.map(([nome, qtd], i) => (
                <li key={nome}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-navy">
                      <span className="text-grafite-claro tabular-nums mr-2">{i + 1}</span>
                      {nome}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      <b className="text-navy">{qtd}</b>
                      <span className="text-xs text-grafite-claro"> · antes {anterior.porItem.get(nome) ?? 0}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-nevoa rounded-full mt-1.5 overflow-hidden">
                    <BarraViva pct={Math.round((qtd / maisPedidos[0][1]) * 100)} className="h-full rounded-full bg-[image:var(--ouro-degrade)]" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
