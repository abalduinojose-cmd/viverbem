"use client";
// Formulário de produto (usado tanto para criar quanto para editar).
//
// Começa pelo TIPO DE VENDA, porque ele decide o que aparece no site:
//   - manipulado: sem dosagem, sem indicações e sem selos promocionais; o
//     cliente pede pela receita (RDC 67/2007, item 5.14). Esses campos nem
//     aparecem aqui, para ninguém preencher sem querer;
//   - industrializado com registro na Anvisa: venda normal, com preço e,
//     se o painel ligar, o preço exposto no site.
//
// Galeria (07/10/2026): até MAX_FOTOS_PRODUTO itens; a primeira FOTO é a
// capa. Os arquivos novos sobem um a um para /api/admin/upload na hora de
// salvar, e o produto recebe a lista de URLs na ordem escolhida.
//
// 14/10/2026 ("deixe mais clean e moderna; na opção de botar foto também
// pode colocar vídeo; coloque um botão salvar"):
//   - duas colunas no computador: à esquerda o tipo de venda, as fotos e
//     vídeos e os textos; à direita, presa ao rolar, a prévia de como o
//     produto aparece no site e as chaves do site;
//   - o tipo de venda virou um seletor de duas opções, o aviso do
//     manipulado uma linha discreta;
//   - a galeria aceita vídeo (MP4 ou WEBM até 40 MB), soltar arquivos em
//     cima, arrastar para reordenar e "usar como capa";
//   - a barra de salvar fica presa no pé da tela, com o estado ("alterações
//     não salvas", "salvo") e o botão Salvar; Ctrl+S também salva. Na
//     edição, salvar mantém a pessoa na página (antes voltava à lista), e
//     sair com alteração pendente pede confirmação.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { useSessaoDemo } from "./ModoDemo";
import {
  CategoriaDTO,
  MAX_FOTOS_PRODUTO,
  ProdutoDTO,
  TIPO_PRODUTO,
  VENDA_MANIPULADO,
  VENDA_INDUSTRIALIZADO,
  PAPEL_ADMIN,
  ehVideo,
} from "@/lib/tipos";
import { centavosParaInput, converterPrecoParaCentavos, formatarPreco } from "@/lib/preco";
import { AvisoAdmin, CabecalhoAdmin, CampoAdmin, Interruptor, Selo, classeAreaAdmin, classeBotaoAdmin, classeCampoAdmin } from "./PecasAdmin";

const TIPOS_VENDA = [
  { valor: VENDA_MANIPULADO, titulo: "Manipulado", texto: "Sem carrinho. O cliente envia a receita pelo WhatsApp." },
  { valor: VENDA_INDUSTRIALIZADO, titulo: "Industrializado", texto: "Com registro na Anvisa. Pode ter preço e carrinho." },
];

const TIPOS_VIDEO = ["video/mp4", "video/webm"];
const MAX_IMAGEM = 8 * 1024 * 1024;
const MAX_VIDEO = 40 * 1024 * 1024;

// Um item da galeria: o que já existe (url) ou o escolhido agora (arquivo)
type ItemGaleria = { chave: string; url?: string; arquivo?: File; preview: string; video: boolean };

let contadorChave = 0;
const novaChave = () => `f${Date.now()}-${contadorChave++}`;

function Secao({
  titulo,
  texto,
  acao,
  children,
}: {
  titulo: string;
  texto?: string;
  acao?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[1.02rem] font-semibold text-navy tracking-[-0.01em]">{titulo}</h2>
          {texto && <p className="text-[0.82rem] text-cinza mt-0.5 leading-relaxed">{texto}</p>}
        </div>
        {acao}
      </div>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function IconeSeta({ direcao }: { direcao: "esquerda" | "direita" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={direcao === "esquerda" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconePlay({ tamanho = 12 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

function IconeEnviar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15.5V4.5m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 14.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FormProduto({
  categorias,
  produto, // undefined = criando novo
  papel,
}: {
  categorias: CategoriaDTO[];
  produto?: ProdutoDTO;
  papel: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const editando = Boolean(produto);
  // Na prévia estática vale o papel de quem entrou no navegador
  const demo = useSessaoDemo();
  const ehGestor = (demo?.papel ?? papel) === PAPEL_ADMIN;

  const [venda, setVenda] = useState(produto?.venda ?? VENDA_MANIPULADO);
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto && produto.precoCentavos > 0 ? centavosParaInput(produto.precoCentavos) : "");
  const [categoriaId, setCategoriaId] = useState<string>(produto?.categoriaId ? String(produto.categoriaId) : "");
  const [dosagens, setDosagens] = useState(produto?.dosagens ?? "");
  const [apresentacao, setApresentacao] = useState(produto?.apresentacao ?? "");
  const [indicacoes, setIndicacoes] = useState(produto?.indicacoes ?? "");
  const [composicao, setComposicao] = useState(produto?.composicao ?? "");
  const [modoUso, setModoUso] = useState(produto?.modoUso ?? "");
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [mostrarPreco, setMostrarPreco] = useState(produto?.mostrarPreco ?? false);
  const [novidade, setNovidade] = useState(produto?.novidade ?? false);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [galeria, setGaleria] = useState<ItemGaleria[]>(() =>
    (produto?.fotos ?? []).map((url) => ({ chave: novaChave(), url, preview: url, video: ehVideo(url) }))
  );
  const [galeriaMudou, setGaleriaMudou] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [progresso, setProgresso] = useState("");
  const [salvoAgora, setSalvoAgora] = useState(false);
  const [soltando, setSoltando] = useState(false);
  const arrastada = useRef<string | null>(null);

  const industrializado = venda === VENDA_INDUSTRIALIZADO;
  const vagas = MAX_FOTOS_PRODUTO - galeria.length;
  const indiceCapa = galeria.findIndex((f) => !f.video);

  // ---------- Alterações pendentes ----------
  const retrato = useMemo(
    () =>
      JSON.stringify([venda, nome, descricao, preco, categoriaId, dosagens, apresentacao, indicacoes, composicao, modoUso, ativo, mostrarPreco, novidade, destaque, galeria.map((f) => f.url ?? f.chave)]),
    [venda, nome, descricao, preco, categoriaId, dosagens, apresentacao, indicacoes, composicao, modoUso, ativo, mostrarPreco, novidade, destaque, galeria]
  );
  const [retratoSalvo, setRetratoSalvo] = useState(retrato);
  const pendente = retrato !== retratoSalvo;

  // O "Salvo" some quando a pessoa volta a mexer
  if (salvoAgora && pendente) setSalvoAgora(false);

  // Ctrl+S salva; sair com alteração pendente pede confirmação
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    const sair = (e: BeforeUnloadEvent) => {
      if (pendente && !salvando) e.preventDefault();
    };
    window.addEventListener("keydown", tecla);
    window.addEventListener("beforeunload", sair);
    return () => {
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("beforeunload", sair);
    };
  }, [pendente, salvando]);

  // ---------- Galeria ----------
  function adicionarArquivos(lista: File[]) {
    if (lista.length === 0) return;
    const aceitos: File[] = [];
    const recusados: string[] = [];
    for (const arquivo of lista) {
      const video = TIPOS_VIDEO.includes(arquivo.type);
      const imagem = arquivo.type.startsWith("image/");
      if (!video && !imagem) recusados.push(`${arquivo.name}: formato não aceito`);
      else if (video && arquivo.size > MAX_VIDEO) recusados.push(`${arquivo.name}: vídeo acima de 40 MB`);
      else if (imagem && arquivo.size > MAX_IMAGEM) recusados.push(`${arquivo.name}: foto acima de 8 MB`);
      else aceitos.push(arquivo);
    }
    const cabem = aceitos.slice(0, Math.max(0, vagas));
    if (cabem.length < aceitos.length) recusados.push(`cada produto tem até ${MAX_FOTOS_PRODUTO} itens; entraram só os primeiros`);
    setErro(recusados.length ? `Alguns arquivos ficaram de fora: ${recusados.join("; ")}.` : "");
    if (cabem.length === 0) return;
    setGaleria((atual) => [
      ...atual,
      ...cabem.map((arquivo) => ({
        chave: novaChave(),
        arquivo,
        preview: URL.createObjectURL(arquivo),
        video: TIPOS_VIDEO.includes(arquivo.type),
      })),
    ]);
    setGaleriaMudou(true);
  }

  function escolherArquivos(e: React.ChangeEvent<HTMLInputElement>) {
    const lista = Array.from(e.target.files ?? []);
    e.target.value = "";
    adicionarArquivos(lista);
  }

  function remover(chave: string) {
    setGaleria((lista) => {
      const alvo = lista.find((f) => f.chave === chave);
      if (alvo?.arquivo) URL.revokeObjectURL(alvo.preview);
      return lista.filter((f) => f.chave !== chave);
    });
    setGaleriaMudou(true);
  }

  function mover(chave: string, para: number) {
    setGaleria((lista) => {
      const de = lista.findIndex((f) => f.chave === chave);
      if (de < 0 || para < 0 || para >= lista.length || de === para) return lista;
      const nova = [...lista];
      const [item] = nova.splice(de, 1);
      nova.splice(para, 0, item);
      return nova;
    });
    setGaleriaMudou(true);
  }

  // ---------- Salvar ----------
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (salvando) return;
    setErro("");

    // Manipulado não pede preço: guarda o que já havia
    let precoCentavos = produto?.precoCentavos ?? 0;
    if (industrializado) {
      const convertido = converterPrecoParaCentavos(preco);
      if (convertido === null || convertido === 0) {
        setErro("Informe o preço no formato 49,90.");
        return;
      }
      precoCentavos = convertido;
    }

    setSalvando(true);
    try {
      // 1) Os arquivos novos sobem um a um, na ordem da galeria
      const enviados: ItemGaleria[] = [];
      const novos = galeria.filter((f) => f.arquivo).length;
      let n = 0;
      for (const item of galeria) {
        if (item.url) {
          enviados.push(item);
          continue;
        }
        n += 1;
        setProgresso(`Enviando ${item.video ? "vídeo" : "foto"} ${n} de ${novos}...`);
        const formulario = new FormData();
        formulario.append("arquivo", item.arquivo as File);
        const respostaUpload = await fetch("/api/admin/upload", { method: "POST", body: formulario });
        const dadosUpload = await respostaUpload.json();
        if (!respostaUpload.ok) {
          setErro(dadosUpload.erro || "Falha no envio do arquivo.");
          return;
        }
        enviados.push({ ...item, url: dadosUpload.url });
      }
      setProgresso("Salvando...");

      // 2) Salva o produto (o servidor aplica de novo as regras do manipulado)
      const corpo = {
        nome,
        descricao,
        precoCentavos,
        tipo: produto?.tipo ?? TIPO_PRODUTO,
        venda,
        fotos: enviados.map((f) => f.url as string),
        fotosMudaram: galeriaMudou,
        ativo,
        mostrarPreco,
        novidade: industrializado && novidade,
        destaque: industrializado && destaque,
        dosagens: dosagens.trim() || null,
        apresentacao: apresentacao.trim() || null,
        indicacoes: indicacoes.trim() || null,
        composicao: composicao.trim() || null,
        modoUso: modoUso.trim() || null,
        categoriaId: categoriaId ? Number(categoriaId) : null,
      };

      const resposta = await fetch(editando ? `/api/admin/produtos/${produto!.id}` : "/api/admin/produtos", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível salvar.");
        return;
      }

      if (!editando) {
        router.push("/admin/produtos");
        router.refresh();
        return;
      }

      // Na edição a pessoa continua na página: a galeria passa a apontar
      // para os arquivos já enviados e o estado vira o novo "salvo"
      const novaGaleria = enviados.map((f) => {
        if (f.arquivo) URL.revokeObjectURL(f.preview);
        return { chave: f.chave, url: f.url, preview: f.url as string, video: f.video };
      });
      setGaleria(novaGaleria);
      setGaleriaMudou(false);
      setRetratoSalvo(
        JSON.stringify([venda, nome, descricao, preco, categoriaId, dosagens, apresentacao, indicacoes, composicao, modoUso, ativo, mostrarPreco, novidade, destaque, novaGaleria.map((f) => f.url)])
      );
      setSalvoAgora(true);
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
      setProgresso("");
    }
  }

  function voltar(e: React.MouseEvent) {
    if (pendente && !confirm("Sair sem salvar? As alterações feitas aqui se perdem.")) e.preventDefault();
  }

  // ---------- Prévia do cartão ----------
  const capa = indiceCapa >= 0 ? galeria[indiceCapa] : null;
  const precoPrevia = industrializado ? converterPrecoParaCentavos(preco) : produto?.precoCentavos ?? 0;
  const precoNaPrevia = mostrarPreco && precoPrevia ? precoPrevia : null;
  const categoriaNome = categorias.find((c) => String(c.id) === categoriaId)?.nome;

  return (
    <form ref={formRef} onSubmit={salvar} className="max-w-6xl">
      <CabecalhoAdmin
        rotulo={editando ? "Editar produto" : "Novo produto"}
        titulo={editando ? nome || produto!.nome : "Novo produto"}
        descricao={
          editando
            ? "Altere o que precisar e salve. O endereço do produto no site não muda."
            : ehGestor
              ? "Preencha e salve: o produto entra no site na hora."
              : "Depois de salvar, o produto fica aguardando o gestor conferir e publicar."
        }
        chips={produto && !produto.aprovado ? <Selo tom="ouro">Aguardando o gestor publicar</Selo> : undefined}
        acao={
          <Link href="/admin/produtos" onClick={voltar} className={classeBotaoAdmin("secundario")}>
            <IconeSeta direcao="esquerda" />
            Produtos
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem] gap-4 lg:gap-5 items-start">
        {/* ================= Coluna principal ================= */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* ---------- Tipo de venda ---------- */}
          <Secao titulo="Tipo de venda" texto="Decide o que o site pode mostrar deste produto.">
            <div role="radiogroup" aria-label="Tipo de venda" className="grid grid-cols-2 gap-1 rounded-2xl bg-nevoa p-1 ring-1 ring-inset ring-fio/70">
              {TIPOS_VENDA.map((t) => {
                const marcado = venda === t.valor;
                return (
                  <button
                    key={t.valor}
                    type="button"
                    role="radio"
                    aria-checked={marcado}
                    onClick={() => setVenda(t.valor)}
                    className={`rounded-[0.85rem] px-3 py-2.5 text-left transition ${
                      marcado ? "bg-white shadow-[0_8px_20px_-14px_rgba(13,35,64,0.5)] ring-1 ring-fio" : "hover:bg-white/60"
                    }`}
                  >
                    <span className={`flex items-center gap-2 text-sm font-semibold ${marcado ? "text-navy" : "text-cinza"}`}>
                      <span aria-hidden="true" className={`size-2 rounded-full transition-colors ${marcado ? "bg-tinta" : "bg-grafite-claro/40"}`} />
                      {t.titulo}
                    </span>
                    <span className="hidden sm:block text-xs text-cinza mt-1 leading-snug pl-4">{t.texto}</span>
                  </button>
                );
              })}
            </div>
            {!industrializado && (
              <p className="-mt-1 flex gap-2 text-[0.8rem] text-cinza leading-relaxed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 mt-0.5 text-tinta">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M12 11v5M12 8v.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Manipulado não é exposto como produto à venda: nome pela composição, sem marca e sem promessa de efeito; de preferência foto sem marca no rótulo.
              </p>
            )}
          </Secao>

          {/* ---------- Fotos e vídeos ---------- */}
          <Secao
            titulo="Fotos e vídeos"
            texto="A primeira foto é a capa das listas. Vídeo em MP4 ou WEBM, até 40 MB, toca sem som na página do produto."
            acao={
              <span className="shrink-0 h-7 inline-flex items-center rounded-full bg-nevoa px-2.5 text-xs font-semibold text-cinza tabular-nums">
                {galeria.length}/{MAX_FOTOS_PRODUTO}
              </span>
            }
          >
            {galeria.length > 0 && (
              <ul className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3">
                {galeria.map((f, i) => (
                  <li
                    key={f.chave}
                    draggable
                    onDragStart={() => (arrastada.current = f.chave)}
                    onDragEnd={() => (arrastada.current = null)}
                    onDragOver={(e) => {
                      if (arrastada.current) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      if (!arrastada.current) return;
                      e.preventDefault();
                      e.stopPropagation();
                      mover(arrastada.current, i);
                      arrastada.current = null;
                    }}
                    className="group relative cursor-grab active:cursor-grabbing"
                  >
                    <div
                      className={`aspect-square rounded-2xl overflow-hidden bg-gelo/60 flex items-center justify-center ring-1 ring-inset transition ${
                        i === indiceCapa ? "ring-2 ring-ouro/70" : "ring-fio group-hover:ring-tinta/40"
                      } ${f.video ? "" : "p-2"}`}
                    >
                      {f.video ? (
                        <video src={`${f.preview.startsWith("blob:") ? f.preview : asset(f.preview)}#t=0.1`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.preview.startsWith("blob:") ? f.preview : asset(f.preview)} alt={`Foto ${i + 1}`} draggable={false} className="max-w-full max-h-full object-contain" />
                      )}
                    </div>

                    {/* Selos: capa, vídeo e novo (ainda não enviado) */}
                    <div className="absolute top-2 left-2 flex gap-1 pointer-events-none">
                      {i === indiceCapa && (
                        <span className="h-5 px-2 rounded-full bg-[image:var(--ouro-degrade)] text-navy text-[0.625rem] font-semibold uppercase tracking-wider flex items-center">Capa</span>
                      )}
                      {f.video && (
                        <span className="h-5 px-1.5 rounded-full bg-navy/85 text-white text-[0.625rem] font-semibold uppercase tracking-wider flex items-center gap-1">
                          <IconePlay tamanho={9} />
                          Vídeo
                        </span>
                      )}
                    </div>
                    {f.arquivo && <span aria-label="Ainda não salvo" title="Ainda não salvo" className="absolute top-2 right-2 size-2 rounded-full bg-amber-500 ring-2 ring-white" />}

                    {/* Ações: aparecem ao passar o mouse; no celular ficam sempre */}
                    <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 rounded-xl bg-white/95 ring-1 ring-fio p-0.5 shadow-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                      <span className="flex">
                        <button
                          type="button"
                          onClick={() => mover(f.chave, i - 1)}
                          disabled={i === 0}
                          aria-label={`Mover o item ${i + 1} para a esquerda`}
                          className="size-7 rounded-lg text-cinza hover:bg-gelo hover:text-navy disabled:opacity-30 flex items-center justify-center"
                        >
                          <IconeSeta direcao="esquerda" />
                        </button>
                        <button
                          type="button"
                          onClick={() => mover(f.chave, i + 1)}
                          disabled={i === galeria.length - 1}
                          aria-label={`Mover o item ${i + 1} para a direita`}
                          className="size-7 rounded-lg text-cinza hover:bg-gelo hover:text-navy disabled:opacity-30 flex items-center justify-center"
                        >
                          <IconeSeta direcao="direita" />
                        </button>
                      </span>
                      {!f.video && i !== indiceCapa && (
                        <button
                          type="button"
                          onClick={() => mover(f.chave, 0)}
                          title="Usar como capa"
                          aria-label={`Usar a foto ${i + 1} como capa`}
                          className="size-7 rounded-lg text-ouro-escuro hover:bg-ouro/10 flex items-center justify-center"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 18.9l.9-5.4-3.9-3.8 5.4-.8L12 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remover(f.chave)}
                        aria-label={`Remover o item ${i + 1}`}
                        className="size-7 rounded-lg text-grafite-claro hover:bg-carimbo/10 hover:text-carimbo flex items-center justify-center"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* A área de envio: clique ou solte os arquivos */}
            {vagas > 0 && (
              <label
                onDragOver={(e) => {
                  if (arrastada.current) return;
                  e.preventDefault();
                  setSoltando(true);
                }}
                onDragLeave={() => setSoltando(false)}
                onDrop={(e) => {
                  if (arrastada.current) return;
                  e.preventDefault();
                  setSoltando(false);
                  adicionarArquivos(Array.from(e.dataTransfer.files));
                }}
                className={`flex items-center gap-4 rounded-2xl border-2 border-dashed px-5 cursor-pointer transition-colors ${galeria.length === 0 ? "py-9 flex-col text-center" : "py-4"} ${
                  soltando ? "border-tinta bg-gelo/70" : "border-fio hover:border-tinta/50 hover:bg-gelo/40"
                }`}
              >
                <span className="shrink-0 size-11 rounded-2xl bg-gelo text-tinta flex items-center justify-center">
                  <IconeEnviar />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-navy">
                    {soltando ? "Solte para adicionar" : galeria.length === 0 ? "Enviar fotos ou vídeos" : "Adicionar mais"}
                  </span>
                  <span className="block text-xs text-cinza mt-0.5">
                    Clique ou arraste aqui. JPG, PNG, WEBP, GIF ou vídeo MP4/WEBM. {vagas === 1 ? "Cabe mais 1." : `Cabem mais ${vagas}.`}
                  </span>
                </span>
                <input type="file" accept="image/*,video/mp4,video/webm" multiple onChange={escolherArquivos} className="sr-only" />
              </label>
            )}
            {galeria.length > 1 && <p className="-mt-2 text-xs text-grafite-claro">Arraste os quadros para mudar a ordem.</p>}
          </Secao>

          {/* ---------- Informações ---------- */}
          <Secao titulo="Informações">
            <CampoAdmin rotulo="Nome" obrigatorio>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className={classeCampoAdmin}
                placeholder={industrializado ? "Ex.: Protetor solar FPS 50" : "Ex.: Creme com ácido hialurônico"}
              />
            </CampoAdmin>

            <CampoAdmin
              rotulo="Descrição"
              obrigatorio
              dica={<span className="flex justify-end tabular-nums">{descricao.length} caracteres</span>}
            >
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows={3}
                className={classeAreaAdmin}
                placeholder={
                  industrializado
                    ? "Descrição curta que aparece no site"
                    : "O que é e como é preparado. Ex.: Creme facial com ácido hialurônico, manipulado conforme a prescrição."
                }
              />
            </CampoAdmin>

            <div className={`grid grid-cols-1 gap-5 ${industrializado ? "sm:grid-cols-2" : ""}`}>
              {industrializado && (
                <CampoAdmin rotulo="Preço" obrigatorio dica="Só aparece no site com a chave Preço no site ligada.">
                  <span className="relative block">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-cinza pointer-events-none">R$</span>
                    <input
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      required
                      inputMode="decimal"
                      className={`${classeCampoAdmin} !pl-11 tabular-nums`}
                      placeholder="49,90"
                    />
                  </span>
                </CampoAdmin>
              )}

              <CampoAdmin rotulo="Categoria">
                <span className="relative block">
                  <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={`${classeCampoAdmin} appearance-none !pr-10 cursor-pointer`}>
                    <option value="">Sem categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                        {c.visivel ? "" : " (fora do site)"}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grafite-claro pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </CampoAdmin>
            </div>

            {industrializado && (
              <CampoAdmin
                rotulo={
                  <>
                    Dosagens disponíveis <span className="text-cinza font-normal">(opcional)</span>
                  </>
                }
                dica="Se preencher, o cliente escolhe a dosagem no site antes de adicionar ao pedido."
              >
                <input value={dosagens} onChange={(e) => setDosagens(e.target.value)} className={classeCampoAdmin} placeholder="Separe por vírgula. Ex.: 250mg, 500mg, 1g" />
              </CampoAdmin>
            )}
          </Secao>

          {/* ---------- Página do produto (só industrializado) ---------- */}
          {industrializado && (
            <Secao titulo="Página do produto" texto="Opcional: o que ficar vazio não aparece no site. Use o que está no rótulo registrado.">
              <CampoAdmin rotulo="Apresentação">
                <input value={apresentacao} onChange={(e) => setApresentacao(e.target.value)} className={classeCampoAdmin} placeholder="Ex.: 30 cápsulas · 100ml · Pote 30g" />
              </CampoAdmin>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CampoAdmin rotulo="Indicações">
                  <textarea value={indicacoes} onChange={(e) => setIndicacoes(e.target.value)} rows={3} className={classeAreaAdmin} placeholder="Uma por linha, como no rótulo" />
                </CampoAdmin>
                <CampoAdmin rotulo="Composição">
                  <textarea value={composicao} onChange={(e) => setComposicao(e.target.value)} rows={3} className={classeAreaAdmin} placeholder="Um ativo por linha" />
                </CampoAdmin>
              </div>
              <CampoAdmin rotulo="Modo de uso">
                <textarea value={modoUso} onChange={(e) => setModoUso(e.target.value)} rows={2} className={classeAreaAdmin} placeholder="Como no rótulo" />
              </CampoAdmin>
            </Secao>
          )}
        </div>

        {/* ================= Coluna lateral (presa ao rolar) ================= */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
          {/* Como aparece no site */}
          <div className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-4">
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-cinza px-1">Como aparece no site</p>
            <div className={`mt-3 rounded-2xl ring-1 ring-fio overflow-hidden transition-opacity ${ativo ? "" : "opacity-50"}`}>
              <div className="aspect-[4/3] bg-gelo/60 flex items-center justify-center p-4">
                {capa ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={capa.preview.startsWith("blob:") ? capa.preview : asset(capa.preview)} alt="" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-xs text-grafite-claro">sem foto de capa</span>
                )}
              </div>
              <div className="px-3.5 py-3 text-center">
                <p className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-ouro-escuro truncate">{categoriaNome ?? "Sem categoria"}</p>
                <p className="mt-1 font-semibold text-navy text-[0.95rem] leading-snug line-clamp-2">{nome || "Nome do produto"}</p>
                <p className="mt-1.5 text-sm tabular-nums">
                  {precoNaPrevia ? <b className="text-navy">{formatarPreco(precoNaPrevia)}</b> : <span className="text-cinza">sem preço no site</span>}
                </p>
              </div>
            </div>
            {!ativo && <p className="mt-2.5 px-1 text-xs text-carimbo font-medium">Escondido do site enquanto estiver em falta.</p>}
          </div>

          {/* As chaves do site */}
          <div className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] px-4 py-2">
            <div className="flex flex-col divide-y divide-fio">
              <Interruptor
                ligado={ativo}
                rotulo={ativo ? "No site" : "Em falta"}
                descricao="Desligado, some do site sem apagar."
                aoAlternar={() => setAtivo((v) => !v)}
                cor="verde"
              />
              <Interruptor
                ligado={mostrarPreco}
                rotulo="Preço no site"
                descricao={industrializado ? "Mostra o preço no cartão e na página." : "A Anfarmag orienta não expor manipulado com preço (RDC 67/2007). Só com o aval do farmacêutico."}
                aoAlternar={() => setMostrarPreco((v) => !v)}
                cor="ouro"
              />
              {industrializado && (
                <>
                  <Interruptor ligado={novidade} rotulo="Novidade" descricao="Selo de novidade no site." aoAlternar={() => setNovidade((v) => !v)} />
                  <Interruptor ligado={destaque} rotulo="Destaque" descricao="Primeiro na faixa de pronta entrega." aoAlternar={() => setDestaque((v) => !v)} />
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {erro && <AvisoAdmin className="mt-4">{erro}</AvisoAdmin>}

      {/* ---------- A barra de salvar, presa no pé da tela ---------- */}
      <div className="sticky bottom-3 z-20 mt-5 mb-2">
        <div className="flex items-center justify-between gap-3 rounded-[1.25rem] bg-white/90 backdrop-blur-md ring-1 ring-fio shadow-[0_24px_50px_-24px_rgba(13,35,64,0.45)] pl-4 pr-2 py-2">
          <p className="min-w-0 flex items-center gap-2 text-sm" role="status">
            <span
              aria-hidden="true"
              className={`size-2 shrink-0 rounded-full ${salvando ? "bg-tinta animate-pulse" : pendente ? "bg-amber-500" : "bg-green-600"}`}
            />
            <span className={`truncate ${pendente || salvando ? "text-navy font-medium" : "text-cinza"}`}>
              {salvando
                ? progresso || "Salvando..."
                : salvoAgora
                  ? "Alterações salvas"
                  : pendente
                    ? "Alterações não salvas"
                    : editando
                      ? "Tudo salvo"
                      : !ehGestor
                        ? "Fica aguardando o gestor publicar"
                        : "Preencha e salve"}
            </span>
            <span className="hidden md:inline text-xs text-grafite-claro">Ctrl+S</span>
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Link href="/admin/produtos" onClick={voltar} className={`${classeBotaoAdmin("fantasma")} hidden sm:inline-flex`}>
              {pendente ? "Descartar" : "Voltar"}
            </Link>
            <button type="submit" disabled={salvando || (editando && !pendente)} className={`${classeBotaoAdmin("primario")} !px-6 min-w-[7.5rem]`}>
              {salvando ? (
                <span aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {editando ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
