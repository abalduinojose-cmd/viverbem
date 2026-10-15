"use client";
// Pedidos feitos pelo site (antes "Clientes captados"): a base de clientes
// para promoções e recompra, e desde 15/10/2026 também o andamento de cada
// pedido ("faça o 4": antes era só uma lista).
//   - cada pedido tem uma situação (Novo, Em preparo, Pronto, Concluído,
//     Cancelado), muda pelo seletor ou pelo botão de avançar, e vai ao log;
//   - "Responder" abre o WhatsApp do cliente com a mensagem pronta da
//     situação atual (lib/pedidos.ts);
//   - filtro por situação com a contagem, busca, e a planilha (CSV) do que
//     está filtrado, com a situação junto.
// Na prévia estática a mudança fica só na tela (nada é gravado).

import { useMemo, useState } from "react";
import { formatarPreco } from "@/lib/preco";
import { PROXIMO_STATUS, ROTULO_STATUS, STATUS_PEDIDO, linkResposta, statusValido, type StatusPedido } from "@/lib/pedidos";
import { ENTREGA_RETIRADA } from "@/lib/tipos";
import { AvisoAdmin, BotaoAdmin, CabecalhoAdmin, CartaoNumero, Inicial, Selo, classeCampoAdmin } from "./PecasAdmin";
import { ICONES } from "./iconesAdmin";

interface ClienteDTO {
  id: number;
  nome: string;
  whatsapp: string;
  pagamento: string;
  entrega: string;
  local: string;
  receita: boolean; // vai mandar a foto da receita pelo WhatsApp
  codigo: string;
  totalCentavos: number;
  itens: string; // JSON
  criadoEm: string; // ISO
  status?: string;
  statusEm?: string | null;
}

interface ItemPedido {
  nome: string;
  dosagem: string | null;
  quantidade: number;
  precoCentavos: number;
}

type Filtro = "TODOS" | StatusPedido;

function lerItens(json: string): ItemPedido[] {
  try {
    const dados = JSON.parse(json);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** "há 5 min", "há 3 h", "ontem", "há 4 dias", ou a data */
function quando(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return "ontem";
  if (d < 7) return `há ${d} dias`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

const COR_STATUS: Record<StatusPedido, { pilula: string; ponto: string }> = {
  NOVO: { pilula: "bg-ouro/12 text-ouro-escuro ring-ouro/30", ponto: "bg-ouro-escuro animate-pulse" },
  EM_PREPARO: { pilula: "bg-gelo text-tinta ring-tinta/20", ponto: "bg-tinta" },
  PRONTO: { pilula: "bg-green-50 text-green-700 ring-green-600/25", ponto: "bg-green-600" },
  CONCLUIDO: { pilula: "bg-nevoa text-cinza ring-fio", ponto: "bg-grafite-claro" },
  CANCELADO: { pilula: "bg-carimbo/10 text-carimbo ring-carimbo/25", ponto: "bg-carimbo" },
};

const ROTULO_AVANCAR: Partial<Record<StatusPedido, string>> = {
  NOVO: "Iniciar preparo",
  EM_PREPARO: "Marcar pronto",
  PRONTO: "Concluir",
};

const situacao = (c: ClienteDTO): StatusPedido => (statusValido(c.status) ? c.status : "NOVO");

function IconeWhats({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.7-.2 1.3Z" />
    </svg>
  );
}

export function ListaClientes({ clientes, statusInicial }: { clientes: ClienteDTO[]; statusInicial?: string }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>(statusValido(statusInicial) ? statusInicial : "TODOS");
  const [aberto, setAberto] = useState<number | null>(null);
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  // A situação mudada nesta tela (por cima do que veio do servidor)
  const [mudancas, setMudancas] = useState<Record<number, StatusPedido>>({});

  const lista = useMemo(() => clientes.map((c) => ({ ...c, status: mudancas[c.id] ?? situacao(c) })), [clientes, mudancas]);

  const contagem = useMemo(() => {
    const n = Object.fromEntries(STATUS_PEDIDO.map((s) => [s, 0])) as Record<StatusPedido, number>;
    for (const c of lista) n[c.status as StatusPedido] += 1;
    return n;
  }, [lista]);

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return lista.filter((c) => {
      if (filtro !== "TODOS" && c.status !== filtro) return false;
      if (!termo) return true;
      return c.nome.toLowerCase().includes(termo) || c.whatsapp.toLowerCase().includes(termo) || c.codigo.toLowerCase().includes(termo);
    });
  }, [busca, filtro, lista]);

  const unicos = useMemo(() => new Set(clientes.map((c) => c.whatsapp.replace(/\D/g, ""))).size, [clientes]);

  async function mudarStatus(c: ClienteDTO, novo: StatusPedido) {
    if (novo === c.status) return;
    if (novo === "CANCELADO" && !confirm(`Cancelar o pedido ${c.codigo} de ${c.nome}?\n\nEle sai dos números do painel.`)) return;
    const antes = mudancas[c.id];
    setMudancas((m) => ({ ...m, [c.id]: novo }));
    setOcupado(c.id);
    setErro("");
    try {
      const r = await fetch(`/api/admin/pedidos/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novo }),
      });
      if (!r.ok) {
        const dados = await r.json().catch(() => ({}));
        throw new Error(dados.erro || "Não foi possível mudar a situação.");
      }
    } catch (e) {
      setMudancas((m) => {
        const copia = { ...m };
        if (antes) copia[c.id] = antes;
        else delete copia[c.id];
        return copia;
      });
      setErro((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  // Gera o CSV no navegador e baixa (compatível com Excel brasileiro)
  function exportarCSV() {
    const linhas = [
      ["Data", "Pedido", "Situação", "Nome", "WhatsApp", "Receita", "Pagamento", "Entrega", "Local", "Total", "Itens"],
      ...listaFiltrada.map((c) => [
        formatarData(c.criadoEm),
        c.codigo,
        ROTULO_STATUS[c.status as StatusPedido],
        c.nome,
        c.whatsapp,
        c.receita ? "Sim" : "Não",
        c.pagamento,
        c.entrega,
        c.local,
        (c.totalCentavos / 100).toFixed(2).replace(".", ","),
        lerItens(c.itens)
          .map((i) => `${i.quantidade}x ${i.nome}${i.dosagem ? ` (${i.dosagem})` : ""}`)
          .join(" + "),
      ]),
    ];
    const csv = linhas.map((l) => l.map((campo) => `"${String(campo).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    // BOM para o Excel reconhecer os acentos
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pedidos-viverbem-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const chips: { valor: Filtro; rotulo: string; n: number }[] = [
    { valor: "TODOS", rotulo: "Todos", n: lista.length },
    { valor: "NOVO", rotulo: "Novos", n: contagem.NOVO },
    { valor: "EM_PREPARO", rotulo: "Em preparo", n: contagem.EM_PREPARO },
    { valor: "PRONTO", rotulo: "Prontos", n: contagem.PRONTO },
    { valor: "CONCLUIDO", rotulo: "Concluídos", n: contagem.CONCLUIDO },
    { valor: "CANCELADO", rotulo: "Cancelados", n: contagem.CANCELADO },
  ];

  return (
    <div className="max-w-6xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Pedidos"
        descricao="O que chegou pelo site, o andamento de cada pedido e a base de clientes."
        acao={
          <BotaoAdmin onClick={exportarCSV} disabled={listaFiltrada.length === 0}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Baixar planilha
          </BotaoAdmin>
        }
      />

      {/* ---------- Resumo ---------- */}
      <div className="cascata grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
        <CartaoNumero tom="noite" icone={ICONES.pedidos} rotulo="Novos" valor={contagem.NOVO} apoio="esperando você" />
        <CartaoNumero icone={ICONES.receita} rotulo="Em preparo" valor={contagem.EM_PREPARO} apoio="no laboratório" />
        <CartaoNumero tom={contagem.PRONTO > 0 ? "verde" : "navy"} icone={ICONES.site} rotulo="Prontos" valor={contagem.PRONTO} apoio="para entregar ou retirar" />
        <CartaoNumero icone={ICONES.clientes} rotulo="Clientes" valor={unicos} apoio={`${lista.length} pedidos no total`} />
      </div>

      {/* ---------- Busca e situação, numa barra só ---------- */}
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
            placeholder="Buscar por nome, WhatsApp ou código do pedido..."
            aria-label="Buscar pedido"
            className={`${classeCampoAdmin} !pl-11 !bg-nevoa/70 !border-transparent focus:!bg-white`}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto rolagem-sem-barra max-w-full">
          {chips.map((ch) => {
            const ativo = filtro === ch.valor;
            return (
              <button
                key={ch.valor}
                type="button"
                onClick={() => setFiltro(ch.valor)}
                aria-pressed={ativo}
                className={`shrink-0 inline-flex items-center gap-2 h-9 rounded-full px-3.5 text-[0.82rem] font-medium transition-colors active:scale-95 ${
                  ativo ? "bg-navy text-white shadow-[0_10px_20px_-14px_rgba(13,35,64,0.7)]" : "bg-white text-cinza ring-1 ring-inset ring-fio hover:ring-tinta/40 hover:text-navy"
                }`}
              >
                {ch.valor !== "TODOS" && <span aria-hidden="true" className={`size-1.5 rounded-full ${COR_STATUS[ch.valor].ponto.replace(" animate-pulse", "")}`} />}
                {ch.rotulo}
                <span className={`tabular-nums text-[0.75rem] ${ativo ? "text-white/70" : "text-grafite-claro"}`}>{ch.n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {erro && <AvisoAdmin className="mt-3">{erro}</AvisoAdmin>}

      {/* ---------- A lista ---------- */}
      <div className="mt-4 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] overflow-hidden">
        {listaFiltrada.length === 0 ? (
          <p className="text-cinza py-14 px-6 text-center">
            {lista.length === 0
              ? "Nenhum pedido ainda. Assim que alguém finalizar um pedido pelo site, ele aparece aqui."
              : "Nenhum pedido com esse filtro."}
          </p>
        ) : (
          <ul className="divide-y divide-fio">
            {listaFiltrada.map((c) => {
              const st = c.status as StatusPedido;
              const itens = lerItens(c.itens);
              const expandido = aberto === c.id;
              const proximo = PROXIMO_STATUS[st];
              const retirada = c.entrega === ENTREGA_RETIRADA;
              return (
                <li key={c.id} className={`relative transition-colors ${ocupado === c.id ? "opacity-70" : ""} ${st === "NOVO" ? "bg-ouro/[0.035]" : ""}`}>
                  {st === "NOVO" && <span aria-hidden="true" className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[image:var(--ouro-degrade)]" />}
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-3 px-4 md:px-5 py-3.5">
                    {/* Quem e o quê */}
                    <button
                      type="button"
                      onClick={() => setAberto(expandido ? null : c.id)}
                      aria-expanded={expandido}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <Inicial nome={c.nome} tamanho="md" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold text-navy text-[0.95rem] leading-snug">{c.nome}</span>
                          {c.receita && <Selo tom="azul">Receita</Selo>}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-cinza tabular-nums">
                          <span className="font-medium text-grafite">{c.codigo}</span>
                          <span aria-hidden="true" className="text-fio">·</span>
                          <span title={formatarData(c.criadoEm)}>{quando(c.criadoEm)}</span>
                          {c.entrega && (
                            <>
                              <span aria-hidden="true" className="text-fio">·</span>
                              <span>{retirada ? `Retirada${c.local ? ` em ${c.local.split(",")[0]}` : ""}` : "Entrega"}</span>
                            </>
                          )}
                        </span>
                      </span>
                    </button>

                    {/* Valor */}
                    <span className="hidden sm:block shrink-0 text-right text-sm font-semibold text-navy tabular-nums min-w-[5.5rem]">
                      {c.totalCentavos > 0 ? formatarPreco(c.totalCentavos) : <span className="font-medium text-grafite-claro">a combinar</span>}
                    </span>

                    {/* Situação, avançar e responder */}
                    <div className="w-full md:w-auto flex items-center gap-2 border-t border-fio pt-3 md:border-0 md:pt-0">
                      <label className={`relative inline-flex shrink-0 items-center h-9 rounded-full ring-1 ring-inset pl-3 pr-8 text-[0.8rem] font-semibold whitespace-nowrap ${COR_STATUS[st].pilula}`}>
                        <span aria-hidden="true" className={`mr-2 size-1.5 rounded-full ${COR_STATUS[st].ponto}`} />
                        <span className="sr-only">Situação do pedido {c.codigo}</span>
                        {ROTULO_STATUS[st]}
                        <select
                          value={st}
                          onChange={(e) => mudarStatus(c, e.target.value as StatusPedido)}
                          disabled={ocupado === c.id}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          aria-label={`Situação do pedido ${c.codigo}`}
                        >
                          {STATUS_PEDIDO.map((s) => (
                            <option key={s} value={s}>
                              {ROTULO_STATUS[s]}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-2.5 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </label>
                      {proximo && (
                        <BotaoAdmin tamanho="pequeno" onClick={() => mudarStatus(c, proximo)} disabled={ocupado === c.id} className="!h-9 shrink-0">
                          {ROTULO_AVANCAR[st]}
                        </BotaoAdmin>
                      )}
                      <a
                        href={linkResposta(c)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Responder no WhatsApp (mensagem de "${ROTULO_STATUS[st]}")`}
                        aria-label={`Responder ${c.nome} no WhatsApp`}
                        className="ml-auto md:ml-0 inline-flex shrink-0 items-center justify-center gap-1.5 h-9 min-w-9 rounded-full bg-[#25D366]/12 px-2.5 sm:px-3.5 text-[0.8rem] font-semibold text-[#128C4B] transition-colors hover:bg-[#25D366]/20"
                      >
                        <IconeWhats />
                        <span className="hidden sm:inline">Responder</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setAberto(expandido ? null : c.id)}
                        aria-label={expandido ? "Fechar o detalhe" : "Ver o detalhe"}
                        className="size-9 shrink-0 rounded-full text-grafite-claro hover:bg-nevoa hover:text-navy flex items-center justify-center"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`transition-transform ${expandido ? "rotate-180" : ""}`}>
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* O detalhe */}
                  {expandido && (
                    <div className="border-t border-fio bg-nevoa/60 px-5 py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_16rem] gap-5">
                      <div className="min-w-0">
                        {c.receita && (
                          <p className="text-sm text-cinza mb-3 leading-relaxed">
                            Pedido pela receita: a foto chega na conversa do WhatsApp, e o valor é passado pelo farmacêutico.
                          </p>
                        )}
                        {itens.length > 0 ? (
                          <>
                            <p className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza mb-2">Itens</p>
                            <ul className="flex flex-col gap-1.5">
                              {itens.map((i, idx) => (
                                <li key={idx} className="flex justify-between gap-3 text-sm text-navy">
                                  <span>
                                    {i.quantidade}x {i.nome}
                                    {i.dosagem ? ` (${i.dosagem})` : ""}
                                  </span>
                                  <span className="tabular-nums text-cinza shrink-0">{i.precoCentavos > 0 ? formatarPreco(i.precoCentavos * i.quantidade) : "a combinar"}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          !c.receita && <p className="text-sm text-cinza">Sem itens registrados.</p>
                        )}
                      </div>
                      <dl className="text-sm flex flex-col gap-2">
                        <div>
                          <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza">WhatsApp</dt>
                          <dd className="text-navy tabular-nums">{c.whatsapp}</dd>
                        </div>
                        {c.entrega && (
                          <div>
                            <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza">{c.entrega}</dt>
                            <dd className="text-navy">{c.local || "a combinar"}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza">Feito em</dt>
                          <dd className="text-navy tabular-nums">{formatarData(c.criadoEm)}</dd>
                        </div>
                        {st !== "CANCELADO" && (
                          <button type="button" onClick={() => mudarStatus(c, "CANCELADO")} className="self-start mt-1 text-xs font-medium text-grafite-claro hover:text-carimbo">
                            Cancelar pedido
                          </button>
                        )}
                      </dl>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p className="mt-3 px-1 text-xs text-grafite-claro">
        &quot;Responder&quot; abre o WhatsApp do cliente com a mensagem da situação do pedido; dá para editar antes de enviar.
      </p>
    </div>
  );
}
