"use client";
// Produtos e preços: a tela principal do colaborador (e do gestor).
//
// Lista em LINHAS (07/10/2026, "painel mais moderno e clean": os cartões
// em grade tinham muita informação repetida): capa, nome com a área e os
// selos, o preço (editável no lugar), as duas chaves do site ("No site" e
// "Preço no site") e as ações. Novidade e destaque ficam no formulário.
// - Filtro por texto, por categoria e por situação
// - Resumo no topo (total, no site, em falta, aguardando aprovação)
// - Produto cadastrado pelo colaborador espera o gestor publicar
// - Reordenar arrastando (só o gestor, com o filtro vazio)
//
// 14/10/2026 ("deixe mais clean e moderna e fácil; coloque a opção de
// preço em todos, mas o gestor escolhe se quer o preço ativado ou não"):
//   - o preço e a chave "Preço no site" aparecem em TODOS os produtos
//     (antes só no industrializado). Ligar num manipulado pede confirmação
//     e deixa um aviso na linha: a Anfarmag orienta não expor manipulado
//     com preço (RDC 67/2007, item 5.14); a decisão é do gestor;
//   - a busca, a categoria e os chips numa barra só, em vidro;
//   - a linha ficou mais leve: capa maior, o tipo num selo pequeno, o
//     preço numa coluna própria com a chave embaixo, as ações em ícones
//     com o texto só no "Editar"; o filtro "Com preço" entrou.

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { useSessaoDemo } from "./ModoDemo";
import { ProdutoDTO, CategoriaDTO, TIPO_COMBO, PAPEL_ADMIN, ehIndustrializado } from "@/lib/tipos";
import { formatarPreco, centavosParaInput, converterPrecoParaCentavos } from "@/lib/preco";
import { ICONES } from "./iconesAdmin";
import {
  Alca,
  AvisoAdmin,
  BotaoAdmin,
  CabecalhoAdmin,
  CartaoNumero,
  IconeMais,
  Interruptor,
  Selo,
  VazioAdmin,
  classeBotaoAdmin,
  classeCampoAdmin,
} from "./PecasAdmin";

type FiltroSituacao = "todos" | "no-site" | "inativos" | "aguardando" | "com-preco" | "industrializados" | "sem-foto";
type CampoChave = "ativo" | "aprovado" | "mostrarPreco";

const AVISO_MANIPULADO =
  "A Anfarmag orienta não expor manipulado com preço (RDC 67/2007, item 5.14). Ligue só com o aval do farmacêutico responsável.";

// Chip de filtro da situação. Fica fora do componente: criado dentro, era
// um componente novo a cada renderização (perdia o foco e remontava).
function ChipFiltro({
  valor,
  atual,
  aoEscolher,
  children,
}: {
  valor: FiltroSituacao;
  atual: FiltroSituacao;
  aoEscolher: (valor: FiltroSituacao) => void;
  children: React.ReactNode;
}) {
  const ativo = atual === valor;
  return (
    <button
      type="button"
      onClick={() => aoEscolher(valor)}
      aria-pressed={ativo}
      className={`shrink-0 h-9 rounded-full px-3.5 text-[0.82rem] font-medium transition-colors active:scale-95 ${
        ativo ? "bg-navy text-white shadow-[0_10px_20px_-14px_rgba(13,35,64,0.7)]" : "bg-white text-cinza ring-1 ring-inset ring-fio hover:ring-tinta/40 hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}

function IconeLapis({ tamanho = 14 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconeAlerta({ tamanho = 14 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4 2.8 19.5h18.4L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4.5M12 17.2v.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ListaProdutos({
  produtos,
  categorias,
  papel,
}: {
  produtos: ProdutoDTO[];
  categorias: CategoriaDTO[];
  papel: string;
}) {
  const router = useRouter();
  // Na prévia estática vale o papel de quem entrou no navegador
  const demo = useSessaoDemo();
  const ehGestor = (demo?.papel ?? papel) === PAPEL_ADMIN;
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState<FiltroSituacao>("todos");
  // "" = todas as categorias; "sem" = produtos sem categoria
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [erro, setErro] = useState("");

  // Edição rápida de preço (id do produto sendo editado)
  const [editandoPreco, setEditandoPreco] = useState<number | null>(null);
  const [precoTexto, setPrecoTexto] = useState("");
  const [erroPreco, setErroPreco] = useState("");

  // Cópia local da lista para o drag-and-drop reordenar na hora
  const [lista, setLista] = useState(produtos);
  // Quando o servidor manda a lista nova, a cópia acompanha (durante a
  // renderização, sem efeito com setState)
  const [listaBase, setListaBase] = useState(produtos);
  if (produtos !== listaBase) {
    setListaBase(produtos);
    setLista(produtos);
  }

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return lista.filter((p) => {
      if (termo && !p.nome.toLowerCase().includes(termo)) return false;
      if (categoriaFiltro === "sem" && p.categoriaId !== null) return false;
      if (categoriaFiltro && categoriaFiltro !== "sem" && p.categoriaId !== Number(categoriaFiltro)) return false;
      if (situacao === "no-site") return p.ativo && p.aprovado;
      if (situacao === "inativos") return !p.ativo;
      if (situacao === "aguardando") return !p.aprovado;
      if (situacao === "com-preco") return p.mostrarPreco;
      if (situacao === "industrializados") return ehIndustrializado(p);
      if (situacao === "sem-foto") return p.fotos.length === 0;
      return true;
    });
  }, [busca, situacao, categoriaFiltro, lista]);

  // Resumo do topo
  const resumo = useMemo(
    () => ({
      total: lista.length,
      noSite: lista.filter((p) => p.ativo && p.aprovado).length,
      inativos: lista.filter((p) => !p.ativo).length,
      aguardando: lista.filter((p) => !p.aprovado).length,
      semFoto: lista.filter((p) => p.fotos.length === 0).length,
      comPreco: lista.filter((p) => p.mostrarPreco).length,
    }),
    [lista]
  );

  const filtrando = busca.trim() !== "" || situacao !== "todos" || categoriaFiltro !== "";

  // ---------- Drag-and-drop (gestor, sem filtros) ----------
  const podeArrastar = ehGestor && !filtrando;
  const [colunas, colunasMd] = podeArrastar ? COLUNAS.comAlca : COLUNAS.semAlca;
  const indiceArrastado = useRef<number | null>(null);

  function aoSoltar(indiceDestino: number) {
    const origem = indiceArrastado.current;
    indiceArrastado.current = null;
    if (origem === null || origem === indiceDestino) return;

    const nova = [...lista];
    const [movido] = nova.splice(origem, 1);
    nova.splice(indiceDestino, 0, movido);
    setLista(nova);

    fetch("/api/admin/ordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "produtos", ids: nova.map((p) => p.id) }),
    }).then(() => router.refresh());
  }

  // ---------- Ações ----------
  async function alternar(p: ProdutoDTO, campo: CampoChave) {
    // Ligar o preço num manipulado: a decisão é do gestor, mas com o aviso
    if (campo === "mostrarPreco" && !p.mostrarPreco && !ehIndustrializado(p)) {
      if (!confirm(`Mostrar o preço de "${p.nome}" no site?\n\n${AVISO_MANIPULADO}`)) return;
    }
    setOcupado(p.id);
    setErro("");
    try {
      const resposta = await fetch(`/api/admin/produtos/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [campo]: !p[campo] }),
      });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.erro ?? "Não foi possível alterar.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setOcupado(null);
    }
  }

  // Salva só o preço (edição rápida na linha). Manda SÓ o preço: antes
  // mandava o produto pela metade, e a composição, as indicações e o
  // modo de uso sumiam a cada ajuste de preço.
  async function salvarPreco(p: ProdutoDTO) {
    const centavos = converterPrecoParaCentavos(precoTexto);
    if (centavos === null || centavos === 0) {
      setErroPreco("Preço inválido");
      return;
    }
    setOcupado(p.id);
    setErroPreco("");
    try {
      const resposta = await fetch(`/api/admin/produtos/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ precoCentavos: centavos }),
      });
      if (!resposta.ok) {
        setErroPreco("Não foi possível salvar");
        return;
      }
      setEditandoPreco(null);
      router.refresh();
    } finally {
      setOcupado(null);
    }
  }

  async function apagar(p: ProdutoDTO) {
    if (
      !confirm(
        `Apagar "${p.nome}" de vez?\n\nDica: se o produto só está em falta, use a chave "No site" para escondê-lo sem perder o cadastro.`
      )
    ) {
      return;
    }
    setOcupado(p.id);
    try {
      await fetch(`/api/admin/produtos/${p.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setOcupado(null);
    }
  }

  return (
    <div className="max-w-6xl">
      {/* ---------- Cabeçalho ---------- */}
      <CabecalhoAdmin
        rotulo="Catálogo"
        titulo="Produtos e preços"
        descricao="Cadastre, cuide das fotos e escolha, produto a produto, o que aparece no site."
        acao={
          <Link href="/admin/produtos/novo" className={classeBotaoAdmin("primario")}>
            <IconeMais />
            Novo produto
          </Link>
        }
      />

      {/* ---------- Resumo ---------- */}
      <div className="cascata grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
        <CartaoNumero rotulo="Cadastrados" valor={resumo.total} icone={ICONES.produtos} />
        <CartaoNumero rotulo="No site" valor={resumo.noSite} tom="verde" icone={ICONES.site} apoio={`${resumo.comPreco} com preço`} />
        <CartaoNumero rotulo="Em falta" valor={resumo.inativos} tom={resumo.inativos > 0 ? "vermelho" : "navy"} apoio="escondidos do site" />
        <CartaoNumero
          rotulo={ehGestor ? "Aguardando você" : "Aguardando o gestor"}
          valor={resumo.aguardando}
          tom={resumo.aguardando > 0 ? "ambar" : "navy"}
          apoio="para publicar"
        />
      </div>

      {/* ---------- Busca + filtros, numa barra só ---------- */}
      <div className="mt-5 rounded-[1.25rem] bg-white/80 backdrop-blur-sm ring-1 ring-fio/80 p-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto..."
              aria-label="Buscar produto"
              className={`${classeCampoAdmin} !pl-11 !bg-nevoa/70 !border-transparent focus:!bg-white`}
            />
          </div>
          {/* Filtro por categoria */}
          <div className="relative">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              aria-label="Filtrar por categoria"
              className={`${classeCampoAdmin} appearance-none !pr-10 !bg-nevoa/70 !border-transparent font-medium cursor-pointer focus:!bg-white`}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                  {c.visivel ? "" : " (fora do site)"}
                </option>
              ))}
              <option value="sem">Sem categoria</option>
            </select>
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto rolagem-sem-barra max-w-full">
          <ChipFiltro valor="todos" atual={situacao} aoEscolher={setSituacao}>Todos</ChipFiltro>
          <ChipFiltro valor="no-site" atual={situacao} aoEscolher={setSituacao}>No site</ChipFiltro>
          <ChipFiltro valor="com-preco" atual={situacao} aoEscolher={setSituacao}>
            Com preço{resumo.comPreco > 0 ? ` (${resumo.comPreco})` : ""}
          </ChipFiltro>
          <ChipFiltro valor="inativos" atual={situacao} aoEscolher={setSituacao}>Em falta</ChipFiltro>
          <ChipFiltro valor="aguardando" atual={situacao} aoEscolher={setSituacao}>Aguardando</ChipFiltro>
          <ChipFiltro valor="sem-foto" atual={situacao} aoEscolher={setSituacao}>
            Sem foto{resumo.semFoto > 0 ? ` (${resumo.semFoto})` : ""}
          </ChipFiltro>
          <ChipFiltro valor="industrializados" atual={situacao} aoEscolher={setSituacao}>Industrializados</ChipFiltro>
        </div>
      </div>

      {/* Contagem do resultado filtrado, ou a dica de arrastar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-cinza px-1">
        {filtrando ? (
          <p>
            Mostrando <b className="text-navy">{listaFiltrada.length}</b> de {lista.length} produtos
            <button
              type="button"
              onClick={() => {
                setBusca("");
                setSituacao("todos");
                setCategoriaFiltro("");
              }}
              className="ml-2 text-tinta font-semibold hover:underline"
            >
              limpar filtros
            </button>
          </p>
        ) : (
          <p className="text-grafite-claro">
            {podeArrastar ? "Arraste as linhas pela alça para mudar a ordem no site." : `${lista.length} produtos, na ordem do site.`}
          </p>
        )}
      </div>

      {erro && <AvisoAdmin className="mt-3">{erro}</AvisoAdmin>}

      {/* ---------- A lista: um cartão só, com o cabeçalho das colunas ---------- */}
      <div className="mt-4 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] overflow-hidden">
        {listaFiltrada.length === 0 ? (
          <VazioAdmin titulo="Nenhum produto encontrado" descricao="Tente outro termo de busca ou limpe os filtros." />
        ) : (
          <>
            <div
              className={`hidden md:grid ${colunas} items-center gap-x-4 px-4 lg:px-5 h-10 border-b border-fio bg-nevoa/50 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza`}
            >
              <span />
              <span>Produto</span>
              <span className="text-right">Preço</span>
              <span className="text-center">Preço no site</span>
              <span className="text-center">No site</span>
              <span />
            </div>
            <ul className="divide-y divide-fio">
              {listaFiltrada.map((p, indice) => {
                const industrializado = ehIndustrializado(p);
                const totalFotos = p.fotos.length;
                const precoExpostoNoManipulado = !industrializado && p.mostrarPreco;
                return (
                  <li
                    key={p.id}
                    draggable={podeArrastar}
                    onDragStart={() => (indiceArrastado.current = indice)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => aoSoltar(indice)}
                    className={`group/linha relative px-3.5 py-3 md:px-4 lg:px-5 flex flex-wrap md:grid ${colunasMd} items-center gap-x-3 md:gap-x-4 gap-y-2.5 transition-colors duration-200 hover:bg-nevoa/55 ${
                      ocupado === p.id ? "opacity-60" : ""
                    }`}
                  >
                    {/* A marca na borda: ouro quando aguarda, vermelha em falta */}
                    {(!p.ativo || !p.aprovado) && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${!p.ativo ? "bg-carimbo/70" : "bg-[image:var(--ouro-degrade)]"}`}
                      />
                    )}

                    {/* Capa (com a alça do gestor ao lado) */}
                    <div className="flex items-center gap-2">
                      {podeArrastar && <Alca />}
                      <div className="w-14 h-14 shrink-0 rounded-xl bg-gelo/70 ring-1 ring-inset ring-navy/5 overflow-hidden flex items-center justify-center p-1.5">
                        {p.fotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={asset(p.fotoUrl)} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-[0.625rem] text-grafite-claro text-center leading-tight">sem foto</span>
                        )}
                      </div>
                    </div>

                    {/* Nome, situação e a linha de apoio */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Link
                          href={`/admin/produtos/${p.id}/editar`}
                          className="font-semibold text-navy text-[0.95rem] leading-snug hover:text-tinta transition-colors"
                        >
                          {p.nome}
                        </Link>
                        {p.tipo === TIPO_COMBO && <Selo tom="azul">Combo</Selo>}
                        {!p.aprovado && <Selo tom="ouro">Aguardando</Selo>}
                        {!p.ativo && <Selo tom="vermelho">Em falta</Selo>}
                        {ehGestor && !p.aprovado && (
                          <BotaoAdmin
                            variante="primario"
                            tamanho="pequeno"
                            onClick={() => alternar(p, "aprovado")}
                            disabled={ocupado === p.id}
                            className="!h-7 !px-3 !text-[0.75rem]"
                          >
                            Publicar
                          </BotaoAdmin>
                        )}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-cinza">
                        <span className={industrializado ? "text-tinta font-medium" : "text-cinza"}>{industrializado ? "Industrializado" : "Manipulado"}</span>
                        <span aria-hidden="true" className="text-fio">
                          ·
                        </span>
                        <span className="truncate">{p.categoriaNome ?? "Sem categoria"}</span>
                        {p.dosagens && (
                          <>
                            <span aria-hidden="true" className="text-fio">
                              ·
                            </span>
                            <span className="truncate text-grafite-claro">{p.dosagens}</span>
                          </>
                        )}
                        <span aria-hidden="true" className="text-fio">
                          ·
                        </span>
                        <span className={totalFotos === 0 ? "text-carimbo font-medium" : "text-grafite-claro"}>
                          {totalFotos === 0 ? "sem foto" : totalFotos === 1 ? "1 foto" : `${totalFotos} fotos`}
                        </span>
                      </p>
                    </div>

                    {/* No celular, a segunda linha (preço, chaves e ações); no computador o
                        invólucro some (contents) e cada parte vira uma coluna */}
                    <div className="w-full flex items-center gap-3 border-t border-fio pt-2.5 md:contents">
                      {/* O preço (em todos os produtos; clique para mudar) */}
                      <div className="mr-auto md:mr-0 flex items-center md:justify-end gap-2">
                        <span className="md:hidden text-[0.625rem] font-semibold tracking-[0.12em] uppercase text-cinza">Preço</span>
                        {editandoPreco === p.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-cinza text-sm">R$</span>
                            <input
                              value={precoTexto}
                              onChange={(e) => setPrecoTexto(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") salvarPreco(p);
                                if (e.key === "Escape") setEditandoPreco(null);
                              }}
                              autoFocus
                              inputMode="decimal"
                              aria-label="Novo preço"
                              className="w-24 border border-tinta/40 rounded-lg px-2 h-9 text-base font-semibold text-navy focus:outline-none focus:ring-4 focus:ring-tinta/10"
                            />
                            <button
                              type="button"
                              onClick={() => salvarPreco(p)}
                              disabled={ocupado === p.id}
                              aria-label="Salvar preço"
                              className="w-9 h-9 rounded-lg bg-navy text-white flex items-center justify-center disabled:opacity-50"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditandoPreco(null)}
                              aria-label="Cancelar"
                              className="w-9 h-9 rounded-lg bg-nevoa text-cinza flex items-center justify-center"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                              </svg>
                            </button>
                            {erroPreco && <span className="text-carimbo text-xs">{erroPreco}</span>}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditandoPreco(p.id);
                              setPrecoTexto(centavosParaInput(p.precoCentavos));
                              setErroPreco("");
                            }}
                            title="Clique para alterar o preço"
                            className={`group inline-flex items-center gap-1.5 h-8 rounded-lg -mr-1.5 px-1.5 tabular-nums transition-colors hover:bg-white hover:text-tinta hover:ring-1 hover:ring-fio ${
                              p.precoCentavos > 0
                                ? `font-semibold text-[1rem] ${p.mostrarPreco ? "text-navy" : "text-cinza"}`
                                : "text-grafite-claro text-sm font-medium"
                            }`}
                          >
                            {p.precoCentavos > 0 ? formatarPreco(p.precoCentavos) : "definir preço"}
                            <span className="text-grafite-claro opacity-0 group-hover:opacity-100 transition-opacity">
                              <IconeLapis />
                            </span>
                          </button>
                        )}
                      </div>

                      {/* As duas chaves: no celular com o nome em cima, no computador só a chave (o cabeçalho diz o que é) */}
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="md:hidden text-[0.625rem] font-semibold tracking-[0.1em] uppercase text-cinza whitespace-nowrap">Preço no site</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Interruptor
                            ligado={p.mostrarPreco}
                            rotulo="Preço no site"
                            aoAlternar={() => alternar(p, "mostrarPreco")}
                            desabilitado={ocupado === p.id || p.precoCentavos === 0}
                            cor="ouro"
                            compacto
                          />
                          {precoExpostoNoManipulado && (
                            <span className="text-amber-600" title={AVISO_MANIPULADO} aria-label={AVISO_MANIPULADO}>
                              <IconeAlerta />
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="md:hidden text-[0.625rem] font-semibold tracking-[0.1em] uppercase text-cinza whitespace-nowrap">No site</span>
                        <Interruptor
                          ligado={p.ativo}
                          rotulo="No site"
                          aoAlternar={() => alternar(p, "ativo")}
                          desabilitado={ocupado === p.id}
                          cor="verde"
                          compacto
                        />
                      </div>

                      {/* Ações: editar e apagar em ícones que acendem na linha */}
                      <div className="flex items-center gap-1 md:justify-end">
                        <Link
                          href={`/admin/produtos/${p.id}/editar`}
                          title="Editar"
                          aria-label={`Editar ${p.nome}`}
                          className="inline-flex size-9 items-center justify-center rounded-xl text-cinza transition-colors hover:bg-white hover:text-navy hover:ring-1 hover:ring-fio md:opacity-60 md:group-hover/linha:opacity-100 md:focus-visible:opacity-100"
                        >
                          <IconeLapis tamanho={16} />
                        </Link>
                        {ehGestor && (
                          <button
                            type="button"
                            onClick={() => apagar(p)}
                            disabled={ocupado === p.id}
                            aria-label={`Apagar ${p.nome}`}
                            title="Apagar"
                            className="inline-flex size-9 items-center justify-center rounded-xl text-cinza transition-colors hover:bg-carimbo/10 hover:text-carimbo disabled:opacity-40 md:opacity-0 md:group-hover/linha:opacity-100 md:focus-visible:opacity-100"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

// As colunas da lista no computador: capa (mais larga quando há a alça),
// produto, preço, as duas chaves e as ações. O cabeçalho e as linhas
// dividem a mesma régua, por isso as larguras são fixas.
const COLUNAS = {
  semAlca: ["grid-cols-[3.5rem_minmax(0,1fr)_8rem_6.5rem_4.5rem_5rem]", "md:grid-cols-[3.5rem_minmax(0,1fr)_8rem_6.5rem_4.5rem_5rem]"],
  comAlca: ["grid-cols-[5rem_minmax(0,1fr)_8rem_6.5rem_4.5rem_5rem]", "md:grid-cols-[5rem_minmax(0,1fr)_8rem_6.5rem_4.5rem_5rem]"],
} as const;
