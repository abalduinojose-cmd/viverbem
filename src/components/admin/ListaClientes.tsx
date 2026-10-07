"use client";
// Base de clientes captados pelo site: busca, resumo, detalhe dos
// pedidos e exportação em CSV (abre no Excel) para campanhas.

import { useMemo, useState } from "react";
import { formatarPreco } from "@/lib/preco";
import { BotaoAdmin, CabecalhoAdmin, CartaoNumero, Inicial, Selo, classeCampoAdmin } from "./PecasAdmin";

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
}

interface ItemPedido {
  nome: string;
  dosagem: string | null;
  quantidade: number;
  precoCentavos: number;
}

function lerItens(json: string): ItemPedido[] {
  try {
    const dados = JSON.parse(json);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ListaClientes({ clientes }: { clientes: ClienteDTO[] }) {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<number | null>(null);

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.whatsapp.toLowerCase().includes(termo) ||
        c.codigo.toLowerCase().includes(termo)
    );
  }, [busca, clientes]);

  const resumo = useMemo(() => {
    const totais = clientes.reduce((s, c) => s + c.totalCentavos, 0);
    const unicos = new Set(clientes.map((c) => c.whatsapp.replace(/\D/g, ""))).size;
    const receitas = clientes.filter((c) => c.receita).length;
    return { pedidos: clientes.length, unicos, totais, receitas };
  }, [clientes]);

  // Gera o CSV no navegador e baixa (compatível com Excel brasileiro)
  function exportarCSV() {
    const linhas = [
      ["Data", "Pedido", "Nome", "WhatsApp", "Receita", "Pagamento", "Entrega", "Local", "Total", "Itens"],
      ...listaFiltrada.map((c) => [
        formatarData(c.criadoEm),
        c.codigo,
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
    const csv = linhas
      .map((l) => l.map((campo) => `"${String(campo).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");
    // BOM para o Excel reconhecer os acentos
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `clientes-viverbem-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Clientes captados"
        descricao="Quem finalizou pedido pelo site. Base para promoções e recompra."
        acao={
          <BotaoAdmin variante="primario" onClick={exportarCSV} disabled={listaFiltrada.length === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Exportar CSV
          </BotaoAdmin>
        }
      />

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 max-w-3xl">
        <CartaoNumero rotulo="Pedidos" valor={resumo.pedidos} />
        <CartaoNumero rotulo="Com receita" valor={resumo.receitas} tom="tinta" />
        <CartaoNumero rotulo="Clientes únicos" valor={resumo.unicos} />
        <CartaoNumero rotulo="Em produtos com preço" valor={formatarPreco(resumo.totais)} />
      </div>

      {/* Busca */}
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome, WhatsApp ou código do pedido..."
        aria-label="Buscar cliente"
        className={`${classeCampoAdmin} mt-6 max-w-md`}
      />

      {/* Lista */}
      <div className="mt-5 flex flex-col gap-3">
        {listaFiltrada.length === 0 && (
          <p className="text-cinza py-12 text-center">
            Nenhum cliente ainda. Assim que alguém finalizar um pedido pelo site, ele aparece aqui.
          </p>
        )}

        {listaFiltrada.map((c) => {
          const itens = lerItens(c.itens);
          const expandido = aberto === c.id;
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-fio overflow-hidden">
              <button
                type="button"
                onClick={() => setAberto(expandido ? null : c.id)}
                aria-expanded={expandido}
                className="w-full flex flex-wrap items-center gap-4 p-4 text-left"
              >
                <Inicial nome={c.nome} tamanho="lg" />
                <div className="flex-1 min-w-40">
                  <p className="font-semibold text-navy">{c.nome}</p>
                  <p className="text-sm text-cinza">
                    {c.whatsapp} · {c.pagamento || "pagamento a combinar"}
                  </p>
                  {c.entrega && (
                    <p className="text-sm text-cinza mt-0.5">
                      {c.entrega}
                      {c.local ? `: ${c.local}` : ""}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {c.receita && (
                    <Selo tom="azul" className="mb-1">
                      Receita
                    </Selo>
                  )}
                  <p className="text-navy font-semibold tabular-nums">
                    {c.totalCentavos > 0 ? formatarPreco(c.totalCentavos) : c.receita ? "a combinar" : formatarPreco(0)}
                  </p>
                  <p className="text-xs text-grafite-claro tabular-nums">
                    {c.codigo} · {formatarData(c.criadoEm)}
                  </p>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className={`text-grafite-claro transition-transform ${expandido ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {expandido && (
                <div className="border-t border-fio bg-nevoa/70 px-5 py-4">
                  {c.receita && (
                    <p className="text-sm text-cinza mb-3">
                      Pedido pela receita: a foto chega na conversa do WhatsApp, e o valor é passado pelo farmacêutico.
                    </p>
                  )}
                  {itens.length > 0 && (
                    <p className="text-xs font-semibold tracking-wider uppercase text-grafite-claro mb-2">Produtos com preço</p>
                  )}
                  <ul className="flex flex-col gap-1.5">
                    {itens.map((i, idx) => (
                      <li key={idx} className="flex justify-between text-sm text-navy">
                        <span>
                          {i.quantidade}x {i.nome}
                          {i.dosagem ? ` (${i.dosagem})` : ""}
                        </span>
                        <span className="tabular-nums text-cinza">{formatarPreco(i.precoCentavos * i.quantidade)}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/55${c.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-tinta font-semibold hover:underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Z" />
                    </svg>
                    Chamar no WhatsApp
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
