"use client";
// Produtos e preços: a tela principal do colaborador (e do gestor).
//
// Lista em LINHAS (07/10/2026, "painel mais moderno e clean": os cartões
// em grade tinham muita informação repetida): capa, nome com a área e os
// selos, o preço (só industrializado, editável no lugar), as duas chaves
// do site ("No site" e, em industrializado, "Preço no site") e as ações.
// Novidade e destaque ficam no formulário do produto. Manipulado não tem
// preço no site (RDC 67/2007, item 5.14).
// - Filtro por texto, por categoria e por situação
// - Resumo no topo (total, no site, em falta, aguardando aprovação)
// - Produto cadastrado pelo colaborador espera o gestor publicar
// - Reordenar arrastando (só o gestor, com o filtro vazio)

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ProdutoDTO,
  CategoriaDTO,
  TIPO_COMBO,
  PAPEL_ADMIN,
  ehIndustrializado,
} from "@/lib/tipos";
import { formatarPreco, centavosParaInput, converterPrecoParaCentavos } from "@/lib/preco";
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

type FiltroSituacao = "todos" | "no-site" | "inativos" | "aguardando" | "industrializados" | "sem-foto";
type CampoChave = "ativo" | "aprovado" | "mostrarPreco";

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
      className={`shrink-0 h-10 rounded-full px-4 text-sm font-medium transition-colors active:scale-95 ${
        ativo ? "bg-navy text-white" : "bg-white text-cinza border border-fio hover:border-tinta/40 hover:text-navy"
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
  const ehGestor = papel === PAPEL_ADMIN;
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
      if (categoriaFiltro && categoriaFiltro !== "sem" && p.categoriaId !== Number(categoriaFiltro))
        return false;
      if (situacao === "no-site") return p.ativo && p.aprovado;
      if (situacao === "inativos") return !p.ativo;
      if (situacao === "aguardando") return !p.aprovado;
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
    }),
    [lista]
  );

  const filtrando = busca.trim() !== "" || situacao !== "todos" || categoriaFiltro !== "";

  // ---------- Drag-and-drop (gestor, sem filtros) ----------
  const podeArrastar = ehGestor && !filtrando;
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
        descricao="Cadastre, cuide das fotos e controle o que aparece no site."
        acao={
          <Link href="/admin/produtos/novo" className={classeBotaoAdmin("primario")}>
            <IconeMais />
            Novo produto
          </Link>
        }
      />

      {/* ---------- Resumo ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <CartaoNumero rotulo="Cadastrados" valor={resumo.total} />
        <CartaoNumero rotulo="No site" valor={resumo.noSite} tom="verde" />
        <CartaoNumero rotulo="Em falta" valor={resumo.inativos} tom={resumo.inativos > 0 ? "vermelho" : "navy"} />
        <CartaoNumero
          rotulo={ehGestor ? "Aguardando você" : "Aguardando o gestor"}
          valor={resumo.aguardando}
          tom={resumo.aguardando > 0 ? "ambar" : "navy"}
        />
      </div>

      {/* ---------- Busca + filtros ---------- */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-60 max-w-sm">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto..."
            aria-label="Buscar produto"
            className={`${classeCampoAdmin} !pl-11`}
          />
        </div>
        {/* Filtro por categoria */}
        <div className="relative">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            aria-label="Filtrar por categoria"
            className={`${classeCampoAdmin} appearance-none !pr-10 font-medium cursor-pointer`}
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
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto rolagem-sem-barra max-w-full">
          <ChipFiltro valor="todos" atual={situacao} aoEscolher={setSituacao}>Todos</ChipFiltro>
          <ChipFiltro valor="no-site" atual={situacao} aoEscolher={setSituacao}>No site</ChipFiltro>
          <ChipFiltro valor="inativos" atual={situacao} aoEscolher={setSituacao}>Em falta</ChipFiltro>
          <ChipFiltro valor="aguardando" atual={situacao} aoEscolher={setSituacao}>Aguardando</ChipFiltro>
          <ChipFiltro valor="sem-foto" atual={situacao} aoEscolher={setSituacao}>
            Sem foto{resumo.semFoto > 0 ? ` (${resumo.semFoto})` : ""}
          </ChipFiltro>
          <ChipFiltro valor="industrializados" atual={situacao} aoEscolher={setSituacao}>Industrializados</ChipFiltro>
        </div>
      </div>

      {/* Contagem do resultado filtrado */}
      {filtrando && (
        <p className="mt-3 text-sm text-cinza">
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
      )}

      {podeArrastar && (
        <p className="mt-3 text-sm text-grafite-claro">Arraste as linhas pela alça para mudar a ordem no site.</p>
      )}

      {erro && <AvisoAdmin className="mt-4">{erro}</AvisoAdmin>}

      {/* ---------- A lista ---------- */}
      {listaFiltrada.length === 0 ? (
        <div className="mt-5 bg-white rounded-2xl border border-fio">
          <VazioAdmin titulo="Nenhum produto encontrado" descricao="Tente outro termo de busca ou limpe os filtros." />
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {listaFiltrada.map((p, indice) => {
            const industrializado = ehIndustrializado(p);
            const totalFotos = p.fotos.length;
            return (
              <li
                key={p.id}
                draggable={podeArrastar}
                onDragStart={() => (indiceArrastado.current = indice)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => aoSoltar(indice)}
                className={`bg-white rounded-2xl border px-4 py-3 md:px-5 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 gap-y-3 transition-all hover:shadow-[0_18px_40px_-30px_rgba(16,42,74,0.35)] ${
                  p.ativo ? "border-fio" : "border-carimbo/25"
                } ${ocupado === p.id ? "opacity-60" : ""}`}
              >
                {/* Capa (com a alça do gestor ao lado) */}
                <div className="flex items-center gap-3">
                  {podeArrastar && <Alca />}
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-gelo/70 overflow-hidden flex items-center justify-center p-1.5">
                    {p.fotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.fotoUrl} alt="" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-[0.58rem] text-grafite-claro text-center leading-tight">sem foto</span>
                    )}
                  </div>
                </div>

                {/* Nome, área e selos */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Link href={`/admin/produtos/${p.id}/editar`} className="font-semibold text-navy leading-snug hover:text-tinta transition-colors">
                      {p.nome}
                    </Link>
                    {p.tipo === TIPO_COMBO && <Selo tom="azul">Combo</Selo>}
                    {!p.aprovado && <Selo tom="ambar">Aguardando o gestor</Selo>}
                    {!p.ativo && <Selo tom="vermelho">Em falta</Selo>}
                  </div>
                  <p className="mt-0.5 text-xs text-cinza truncate">
                    {industrializado ? "Industrializado" : "Manipulado"}
                    {" · "}
                    {p.categoriaNome ?? "Sem categoria"}
                    {p.dosagens ? ` · ${p.dosagens}` : ""}
                    {" · "}
                    <span className={totalFotos === 0 ? "text-carimbo font-medium" : ""}>
                      {totalFotos === 0 ? "sem foto" : totalFotos === 1 ? "1 foto" : `${totalFotos} fotos`}
                    </span>
                  </p>
                </div>

                {/* Preço (industrializado) e as chaves do site */}
                <div className="col-span-2 md:col-span-1 flex flex-wrap items-center gap-x-5 gap-y-1 md:justify-end border-t border-fio pt-2 md:border-0 md:pt-0">
                  {industrializado &&
                    (editandoPreco === p.id ? (
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
                        className="group inline-flex items-center gap-1.5 h-10 text-navy font-semibold text-[1.05rem] tabular-nums hover:text-tinta transition-colors"
                      >
                        {formatarPreco(p.precoCentavos)}
                        <span className="text-grafite-claro opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconeLapis />
                        </span>
                      </button>
                    ))}
                  <Interruptor
                    ligado={p.ativo}
                    rotulo="No site"
                    aoAlternar={() => alternar(p, "ativo")}
                    desabilitado={ocupado === p.id}
                    cor="verde"
                  />
                  {industrializado && (
                    <Interruptor
                      ligado={p.mostrarPreco}
                      rotulo="Preço no site"
                      aoAlternar={() => alternar(p, "mostrarPreco")}
                      desabilitado={ocupado === p.id}
                      cor="ouro"
                    />
                  )}
                </div>

                {/* Ações */}
                <div className="col-span-2 md:col-span-1 flex items-center gap-2 md:justify-end">
                  {ehGestor && !p.aprovado && (
                    <BotaoAdmin variante="primario" tamanho="pequeno" onClick={() => alternar(p, "aprovado")} disabled={ocupado === p.id}>
                      Publicar
                    </BotaoAdmin>
                  )}
                  <Link href={`/admin/produtos/${p.id}/editar`} className={classeBotaoAdmin("secundario", "pequeno")}>
                    <IconeLapis tamanho={14} />
                    Editar
                  </Link>
                  {ehGestor && (
                    <BotaoAdmin
                      variante="perigo"
                      tamanho="pequeno"
                      onClick={() => apagar(p)}
                      disabled={ocupado === p.id}
                      aria-label={`Apagar ${p.nome}`}
                      className="!px-0 w-9"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </BotaoAdmin>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
