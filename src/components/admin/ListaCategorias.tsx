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
  classeCampoAdmin,
} from "./PecasAdmin";

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

  return (
    <div className="max-w-3xl">
      <CabecalhoAdmin
        rotulo="Catálogo"
        titulo="Categorias"
        descricao={`Como os produtos ficam agrupados no site. ${noSite} de ${lista.length} no ar.`}
      />

      {/* Criar nova */}
      <form onSubmit={criar} className="mt-6 flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="sr-only">Nome da nova categoria</span>
          <input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            required
            maxLength={60}
            placeholder="Nome da nova categoria..."
            className={classeCampoAdmin}
          />
        </label>
        <BotaoAdmin type="submit" variante="primario" disabled={ocupado === "nova"}>
          <IconeMais />
          Criar categoria
        </BotaoAdmin>
      </form>

      {erro && <AvisoAdmin className="mt-4">{erro}</AvisoAdmin>}

      <p className="mt-4 text-sm text-grafite-claro">
        {ehGestor
          ? "Arraste as linhas pela alça para mudar a ordem das categorias no site."
          : "A ordem das categorias no site é definida pelo gestor."}
      </p>

      {/* Lista */}
      <div className="mt-3 flex flex-col gap-3">
        {lista.length === 0 && (
          <div className="bg-white rounded-2xl border border-fio">
            <VazioAdmin titulo="Nenhuma categoria" descricao="Crie a primeira no campo acima." />
          </div>
        )}
        {lista.map((c, indice) => (
          <div
            key={c.id}
            draggable={ehGestor}
            onDragStart={() => (indiceArrastado.current = indice)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => aoSoltar(indice)}
            className={`bg-white rounded-2xl border border-fio p-4 sm:p-5 transition-opacity ${
              ocupado === c.id ? "opacity-60" : ""
            } ${c.visivel ? "" : "bg-nevoa/60"}`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              {ehGestor && (
                <span className="mt-1">
                  <Alca />
                </span>
              )}

              {editando === c.id ? (
                <form
                  className="flex-1 flex flex-col sm:flex-row gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    renomear(c.id);
                  }}
                >
                  <input
                    value={nomeEdicao}
                    onChange={(e) => setNomeEdicao(e.target.value)}
                    autoFocus
                    required
                    maxLength={60}
                    aria-label="Novo nome da categoria"
                    className={`${classeCampoAdmin} flex-1`}
                  />
                  <div className="flex gap-2">
                    <BotaoAdmin type="submit" variante="primario" disabled={ocupado === c.id}>
                      Salvar
                    </BotaoAdmin>
                    <BotaoAdmin variante="fantasma" onClick={() => setEditando(null)}>
                      Cancelar
                    </BotaoAdmin>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-navy">{c.nome}</p>
                      {!c.visivel && <Selo tom="vermelho">Fora do site</Selo>}
                      {c.visivel && !c.vitrineHome && <Selo tom="cinza">Sem faixa na home</Selo>}
                    </div>
                    <p className="text-sm text-cinza mt-0.5">
                      {c.totalProdutos} produto{c.totalProdutos === 1 ? "" : "s"} · /produtos/{c.slug}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <BotaoAdmin
                      tamanho="pequeno"
                      onClick={() => {
                        setEditando(c.id);
                        setNomeEdicao(c.nome);
                      }}
                    >
                      Renomear
                    </BotaoAdmin>
                    {ehGestor && (
                      <BotaoAdmin tamanho="pequeno" variante="perigo" onClick={() => apagar(c)} disabled={ocupado === c.id}>
                        Apagar
                      </BotaoAdmin>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* As duas chaves do site */}
            {editando !== c.id && (
              <div className={`flex flex-wrap gap-x-6 border-t border-fio mt-3 pt-1 ${ehGestor ? "pl-7 sm:pl-8" : ""}`}>
                <Interruptor
                  ligado={c.visivel}
                  rotulo={c.visivel ? "No site" : "Fora do site"}
                  aoAlternar={() => alternar(c, "visivel")}
                  desabilitado={ocupado === c.id}
                  cor="verde"
                />
                <Interruptor
                  ligado={c.visivel && c.vitrineHome}
                  rotulo="Vitrine na home"
                  aoAlternar={() => alternar(c, "vitrineHome")}
                  desabilitado={ocupado === c.id || !c.visivel}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-grafite-claro leading-relaxed">
        A faixa de uma área só aparece na home quando ela tem pelo menos 3 produtos com foto.
        As outras seções da página inicial ficam em Home e arte da dobra.
      </p>
    </div>
  );
}
