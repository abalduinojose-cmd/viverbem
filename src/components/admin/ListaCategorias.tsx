"use client";
// Categorias: criar, renomear, ligar e desligar no site e na home, e
// reordenar arrastando (a ordem aqui é a ordem dos chips e das faixas
// no site).
//
// Desde 07/10/2026 o colaborador também mexe aqui: cria, renomeia e
// controla as duas chaves. Só apagar e reordenar seguem com o gestor.
//   "No site": desligada, a categoria some do site inteiro (menu, home e
//     catálogo, com os produtos dela), mas nada é apagado.
//   "Vitrine na home": desligada, a área segue no site, só sem a faixa
//     própria na página inicial.
//
// 14/10/2026 ("melhore a parte de criar categoria, modernize a lista"):
// criar virou um cartão com o campo e o botão numa pílula só e a prévia
// do endereço que a categoria vai ganhar; a lista virou um cartão com o
// cabeçalho das colunas (como Produtos e preços), a posição numerada, o
// total em pílula, as chaves compactas e renomear/apagar em ícones.
// Renomear acontece no lugar, na própria linha.

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessaoDemo } from "./ModoDemo";
import { PAPEL_ADMIN } from "@/lib/tipos";
import {
  Alca,
  AvisoAdmin,
  BotaoAdmin,
  CabecalhoAdmin,
  IconeMais,
  Interruptor,
  Selo,
  VazioAdmin,
} from "./PecasAdmin";

/** O endereço que a categoria vai ganhar (mesma ideia do servidor: sem
 *  acento, minúsculas, o resto vira hífen) */
function enderecoDe(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function IconeLapis() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconeLixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const classeIcone =
  "inline-flex size-9 items-center justify-center rounded-xl text-cinza transition-colors hover:bg-white hover:text-navy hover:ring-1 hover:ring-fio disabled:opacity-40";
const rotuloCelular = "md:hidden text-[0.625rem] font-semibold tracking-[0.1em] uppercase text-cinza whitespace-nowrap";

export interface CategoriaComTotal {
  id: number;
  nome: string;
  slug: string;
  ordem: number;
  visivel: boolean;
  vitrineHome: boolean;
  totalProdutos: number;
}

export function ListaCategorias({ categorias, papel }: { categorias: CategoriaComTotal[]; papel: string }) {
  const router = useRouter();
  // Na prévia estática vale o papel de quem entrou no navegador
  const demo = useSessaoDemo();
  const ehGestor = (demo?.papel ?? papel) === PAPEL_ADMIN;
  const [novoNome, setNovoNome] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState<number | "nova" | null>(null);

  // Cópia local para o drag-and-drop reordenar na hora
  const [lista, setLista] = useState(categorias);
  // Quando o servidor manda a lista nova, a cópia acompanha (durante a
  // renderização, sem efeito com setState)
  const [listaBase, setListaBase] = useState(categorias);
  if (categorias !== listaBase) {
    setListaBase(categorias);
    setLista(categorias);
  }
  const indiceArrastado = useRef<number | null>(null);

  function aoSoltar(indiceDestino: number) {
    const origem = indiceArrastado.current;
    indiceArrastado.current = null;
    if (origem === null || origem === indiceDestino) return;

    const nova = [...lista];
    const [movida] = nova.splice(origem, 1);
    nova.splice(indiceDestino, 0, movida);
    setLista(nova);

    fetch("/api/admin/ordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "categorias", ids: nova.map((c) => c.id) }),
    }).then(() => router.refresh());
  }

  async function chamar(url: string, metodo: string, corpo?: unknown) {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      throw new Error(dados.erro || "Não foi possível salvar.");
    }
  }

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setOcupado("nova");
    try {
      await chamar("/api/admin/categorias", "POST", { nome: novoNome });
      setNovoNome("");
      router.refresh();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  async function renomear(id: number) {
    setErro("");
    setOcupado(id);
    try {
      await chamar(`/api/admin/categorias/${id}`, "PATCH", { nome: nomeEdicao });
      setEditando(null);
      router.refresh();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  async function alternar(c: CategoriaComTotal, campo: "visivel" | "vitrineHome") {
    setErro("");
    setOcupado(c.id);
    try {
      await chamar(`/api/admin/categorias/${c.id}`, "PATCH", { [campo]: !c[campo] });
      router.refresh();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  async function apagar(c: CategoriaComTotal) {
    const aviso =
      c.totalProdutos > 0
        ? `Apagar a categoria "${c.nome}"?\n\nOs ${c.totalProdutos} produto(s) dela NÃO serão apagados: ficarão "sem categoria".\n\nDica: para só tirar a área do site, use a chave "No site".`
        : `Apagar a categoria "${c.nome}"?`;
    if (!confirm(aviso)) return;

    setOcupado(c.id);
    try {
      await chamar(`/api/admin/categorias/${c.id}`, "DELETE");
      router.refresh();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(null);
    }
  }

  const noSite = lista.filter((c) => c.visivel).length;
  const naHome = lista.filter((c) => c.visivel && c.vitrineHome).length;
  const enderecoNovo = enderecoDe(novoNome);
  // Colunas no computador: posição, categoria, as duas chaves e as ações
  const colunas = ehGestor
    ? "md:grid-cols-[3.25rem_minmax(0,1fr)_6rem_8rem_5.5rem]"
    : "md:grid-cols-[1.75rem_minmax(0,1fr)_6rem_8rem_3rem]";

  return (
    <div className="max-w-4xl">
      <CabecalhoAdmin
        rotulo="Catálogo"
        titulo="Categorias"
        descricao="Como os produtos ficam agrupados no site, na ordem dos chips e das faixas."
        chips={
          <>
            <span className="inline-flex items-center gap-1.5 h-8 rounded-full px-3 text-[0.78rem] font-medium tabular-nums bg-green-50 text-green-700">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-green-600" />
              {noSite} de {lista.length} no site
            </span>
            <span className="inline-flex items-center h-8 rounded-full px-3 text-[0.78rem] font-medium tabular-nums bg-white ring-1 ring-fio text-cinza">
              {naHome} com vitrine na home
            </span>
          </>
        }
      />

      {/* ---------- Criar nova ---------- */}
      <form onSubmit={criar} className="mt-6 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-4 sm:p-5">
        <label htmlFor="nova-categoria" className="block text-sm font-semibold text-navy">
          Nova categoria
        </label>
        <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:rounded-full sm:bg-nevoa/70 sm:ring-1 sm:ring-inset sm:ring-fio sm:p-1 sm:focus-within:ring-tinta/50 sm:focus-within:bg-white transition-colors">
          <span className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none">
              <IconeMais tamanho={16} />
            </span>
            <input
              id="nova-categoria"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              required
              maxLength={60}
              placeholder="Ex.: Pet, Esportiva, Infantil"
              className="w-full h-11 rounded-full pl-11 pr-4 text-[0.95rem] text-grafite placeholder:text-grafite-suave bg-nevoa/70 ring-1 ring-inset ring-fio sm:bg-transparent sm:ring-0 focus:outline-none focus:ring-tinta/50 sm:focus:ring-0"
            />
          </span>
          <BotaoAdmin type="submit" variante="primario" disabled={ocupado === "nova" || !novoNome.trim()} className="!px-5">
            {ocupado === "nova" ? "Criando..." : "Criar categoria"}
          </BotaoAdmin>
        </div>
        <p className="mt-2.5 px-1 text-xs text-grafite-claro truncate">
          {enderecoNovo ? (
            <>
              Endereço no site: <span className="text-tinta font-medium">/produtos/{enderecoNovo}</span>
            </>
          ) : (
            "Entra no fim da lista, já no site. Depois é só mover para a posição certa."
          )}
        </p>
      </form>

      {erro && <AvisoAdmin className="mt-4">{erro}</AvisoAdmin>}

      {/* ---------- A lista: um cartão com o cabeçalho das colunas ---------- */}
      <div className="mt-4 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] overflow-hidden">
        {lista.length === 0 ? (
          <VazioAdmin titulo="Nenhuma categoria" descricao="Crie a primeira no campo acima." />
        ) : (
          <>
            <div className={`hidden md:grid ${colunas} items-center gap-x-4 px-5 h-10 border-b border-fio bg-nevoa/50 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza`}>
              <span />
              <span>Categoria</span>
              <span className="text-center">No site</span>
              <span className="text-center">Vitrine na home</span>
              <span />
            </div>
            <ul className="divide-y divide-fio">
              {lista.map((c, indice) => (
                <li
                  key={c.id}
                  draggable={ehGestor && editando !== c.id}
                  onDragStart={() => (indiceArrastado.current = indice)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => aoSoltar(indice)}
                  className={`group/linha relative px-4 md:px-5 py-3.5 flex flex-wrap md:grid ${colunas} items-center gap-x-3 md:gap-x-4 gap-y-2.5 transition-colors hover:bg-nevoa/55 ${
                    ocupado === c.id ? "opacity-60" : ""
                  }`}
                >
                  {!c.visivel && <span aria-hidden="true" className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-carimbo/70" />}

                  {/* Posição (com a alça do gestor) */}
                  <div className="flex items-center gap-1.5">
                    {ehGestor && <Alca />}
                    <span className="w-6 text-center text-sm font-semibold text-grafite-claro tabular-nums">{indice + 1}</span>
                  </div>

                  {/* Nome, total e endereço (ou o campo de renomear) */}
                  <div className="min-w-0 flex-1">
                    {editando === c.id ? (
                      <form
                        className="flex items-center gap-1.5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          renomear(c.id);
                        }}
                      >
                        <input
                          value={nomeEdicao}
                          onChange={(e) => setNomeEdicao(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditando(null);
                          }}
                          autoFocus
                          required
                          maxLength={60}
                          aria-label="Novo nome da categoria"
                          className="min-w-0 flex-1 h-9 rounded-lg border border-tinta/40 px-3 text-[0.95rem] font-semibold text-navy focus:outline-none focus:ring-4 focus:ring-tinta/10"
                        />
                        <button type="submit" disabled={ocupado === c.id} aria-label="Salvar o nome" className="size-9 shrink-0 rounded-lg bg-navy text-white flex items-center justify-center disabled:opacity-50">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => setEditando(null)} aria-label="Cancelar" className="size-9 shrink-0 rounded-lg bg-nevoa text-cinza flex items-center justify-center">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="font-semibold text-navy text-[0.95rem] leading-snug">{c.nome}</p>
                          <span className="inline-flex items-center h-5 rounded-full bg-gelo px-2 text-[0.6875rem] font-semibold text-tinta tabular-nums">
                            {c.totalProdutos} {c.totalProdutos === 1 ? "produto" : "produtos"}
                          </span>
                          {!c.visivel && <Selo tom="vermelho">Fora do site</Selo>}
                        </div>
                        <p className="mt-0.5 text-xs text-grafite-claro truncate">/produtos/{c.slug}</p>
                      </>
                    )}
                  </div>

                  {/* No celular, as chaves e as ações numa segunda linha */}
                  <div className="w-full flex items-center gap-4 border-t border-fio pt-2.5 md:contents">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={rotuloCelular}>No site</span>
                      <Interruptor
                        ligado={c.visivel}
                        rotulo={c.visivel ? "No site" : "Fora do site"}
                        aoAlternar={() => alternar(c, "visivel")}
                        desabilitado={ocupado === c.id}
                        cor="verde"
                        compacto
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={rotuloCelular}>Vitrine na home</span>
                      <Interruptor
                        ligado={c.visivel && c.vitrineHome}
                        rotulo="Vitrine na home"
                        aoAlternar={() => alternar(c, "vitrineHome")}
                        desabilitado={ocupado === c.id || !c.visivel}
                        compacto
                      />
                    </div>
                    <div className="ml-auto md:ml-0 flex items-center gap-1 md:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setEditando(c.id);
                          setNomeEdicao(c.nome);
                        }}
                        title="Renomear"
                        aria-label={`Renomear ${c.nome}`}
                        className={`${classeIcone} md:opacity-60 md:group-hover/linha:opacity-100 md:focus-visible:opacity-100`}
                      >
                        <IconeLapis />
                      </button>
                      {ehGestor && (
                        <button
                          type="button"
                          onClick={() => apagar(c)}
                          disabled={ocupado === c.id}
                          title="Apagar"
                          aria-label={`Apagar ${c.nome}`}
                          className={`${classeIcone} hover:!bg-carimbo/10 hover:!text-carimbo hover:!ring-0 md:opacity-0 md:group-hover/linha:opacity-100 md:focus-visible:opacity-100`}
                        >
                          <IconeLixo />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <p className="mt-4 px-1 text-xs text-grafite-claro leading-relaxed">
        {ehGestor ? "Arraste as linhas pela alça para mudar a ordem no site. " : "A ordem no site é definida pelo gestor. "}
        A vitrine de uma área só aparece na home com pelo menos 3 produtos com foto; as outras seções da página inicial ficam em Home e arte da dobra.
      </p>
    </div>
  );
}
