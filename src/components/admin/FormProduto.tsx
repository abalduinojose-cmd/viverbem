"use client";
// Formulário de produto (usado tanto para criar quanto para editar).
//
// Começa pelo TIPO DE VENDA, porque ele decide o que aparece no site:
//   - manipulado: sem preço, sem dosagem, sem indicações e sem selos
//     promocionais; o cliente pede pela receita (RDC 67/2007, item 5.14).
//     Esses campos nem aparecem aqui, para ninguém preencher sem querer;
//   - industrializado com registro na Anvisa: venda normal, com preço e,
//     se o painel ligar, o preço exposto no site.
//
// Galeria (07/10/2026): até 5 fotos por produto; a primeira é a capa. As
// fotos novas sobem uma a uma para /api/admin/upload na hora de salvar, e
// o produto recebe a lista de URLs na ordem escolhida.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CategoriaDTO,
  MAX_FOTOS_PRODUTO,
  ProdutoDTO,
  TIPO_PRODUTO,
  VENDA_MANIPULADO,
  VENDA_INDUSTRIALIZADO,
  PAPEL_ADMIN,
} from "@/lib/tipos";
import { centavosParaInput, converterPrecoParaCentavos } from "@/lib/preco";
import {
  AvisoAdmin,
  BotaoAdmin,
  CabecalhoAdmin,
  CampoAdmin,
  Interruptor,
  Selo,
  classeAreaAdmin,
  classeBotaoAdmin,
  classeCampoAdmin,
} from "./PecasAdmin";

const TIPOS_VENDA = [
  {
    valor: VENDA_MANIPULADO,
    titulo: "Manipulado",
    texto: "Aparece sem preço. O cliente envia a receita pelo WhatsApp.",
  },
  {
    valor: VENDA_INDUSTRIALIZADO,
    titulo: "Industrializado com registro",
    texto: "Pode aparecer com preço e carrinho. Só para produto com registro na Anvisa.",
  },
];

// Uma foto da galeria: a que já existe (url) ou a escolhida agora (arquivo)
type FotoGaleria = { chave: string; url?: string; arquivo?: File; preview: string };

let contadorChave = 0;
const novaChave = () => `f${Date.now()}-${contadorChave++}`;

function Secao({ titulo, texto, children }: { titulo: string; texto?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-fio p-5 md:p-6">
      <h2 className="font-semibold text-navy">{titulo}</h2>
      {texto && <p className="text-sm text-cinza mt-0.5 leading-relaxed">{texto}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
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
  const editando = Boolean(produto);
  const ehGestor = papel === PAPEL_ADMIN;

  const [venda, setVenda] = useState(produto?.venda ?? VENDA_MANIPULADO);
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(
    produto && produto.precoCentavos > 0 ? centavosParaInput(produto.precoCentavos) : ""
  );
  const [categoriaId, setCategoriaId] = useState<string>(
    produto?.categoriaId ? String(produto.categoriaId) : ""
  );
  const [dosagens, setDosagens] = useState(produto?.dosagens ?? "");
  const [apresentacao, setApresentacao] = useState(produto?.apresentacao ?? "");
  const [indicacoes, setIndicacoes] = useState(produto?.indicacoes ?? "");
  const [composicao, setComposicao] = useState(produto?.composicao ?? "");
  const [modoUso, setModoUso] = useState(produto?.modoUso ?? "");
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [mostrarPreco, setMostrarPreco] = useState(produto?.mostrarPreco ?? false);
  const [novidade, setNovidade] = useState(produto?.novidade ?? false);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [fotos, setFotos] = useState<FotoGaleria[]>(
    (produto?.fotos ?? []).map((url) => ({ chave: novaChave(), url, preview: url }))
  );
  const [fotosMudaram, setFotosMudaram] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [progresso, setProgresso] = useState("");

  const industrializado = venda === VENDA_INDUSTRIALIZADO;
  const vagas = MAX_FOTOS_PRODUTO - fotos.length;

  // ---------- Galeria ----------
  function adicionarFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const escolhidas = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (escolhidas.length === 0) return;
    const cabem = escolhidas.slice(0, Math.max(0, vagas));
    if (cabem.length < escolhidas.length) {
      setErro(`Cada produto pode ter até ${MAX_FOTOS_PRODUTO} fotos. Entraram só as primeiras.`);
    } else {
      setErro("");
    }
    setFotos((lista) => [
      ...lista,
      ...cabem.map((arquivo) => ({ chave: novaChave(), arquivo, preview: URL.createObjectURL(arquivo) })),
    ]);
    setFotosMudaram(true);
  }

  function removerFoto(chave: string) {
    setFotos((lista) => {
      const alvo = lista.find((f) => f.chave === chave);
      if (alvo?.arquivo) URL.revokeObjectURL(alvo.preview);
      return lista.filter((f) => f.chave !== chave);
    });
    setFotosMudaram(true);
  }

  function moverFoto(chave: string, para: number) {
    setFotos((lista) => {
      const de = lista.findIndex((f) => f.chave === chave);
      if (de < 0 || para < 0 || para >= lista.length) return lista;
      const nova = [...lista];
      const [foto] = nova.splice(de, 1);
      nova.splice(para, 0, foto);
      return nova;
    });
    setFotosMudaram(true);
  }

  // ---------- Salvar ----------
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    // Manipulado não tem preço no site: guarda o que já havia, sem pedir
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
      // 1) As fotos novas sobem uma a uma, na ordem da galeria
      const urls: string[] = [];
      let enviadas = 0;
      const novas = fotos.filter((f) => f.arquivo).length;
      for (const foto of fotos) {
        if (foto.url) {
          urls.push(foto.url);
          continue;
        }
        enviadas += 1;
        setProgresso(`Enviando foto ${enviadas} de ${novas}...`);
        const formulario = new FormData();
        formulario.append("arquivo", foto.arquivo as File);
        const respostaUpload = await fetch("/api/admin/upload", { method: "POST", body: formulario });
        const dadosUpload = await respostaUpload.json();
        if (!respostaUpload.ok) {
          setErro(dadosUpload.erro || "Falha no envio da foto.");
          return;
        }
        urls.push(dadosUpload.url);
      }
      setProgresso("Salvando...");

      // 2) Salva o produto (o servidor aplica de novo as regras do manipulado)
      const corpo = {
        nome,
        descricao,
        precoCentavos,
        tipo: produto?.tipo ?? TIPO_PRODUTO,
        venda,
        fotos: urls,
        fotosMudaram,
        ativo,
        mostrarPreco: industrializado && mostrarPreco,
        novidade: industrializado && novidade,
        destaque: industrializado && destaque,
        dosagens: dosagens.trim() || null,
        apresentacao: apresentacao.trim() || null,
        indicacoes: indicacoes.trim() || null,
        composicao: composicao.trim() || null,
        modoUso: modoUso.trim() || null,
        categoriaId: categoriaId ? Number(categoriaId) : null,
      };

      const resposta = await fetch(
        editando ? `/api/admin/produtos/${produto!.id}` : "/api/admin/produtos",
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpo),
        }
      );
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível salvar.");
        return;
      }

      router.push("/admin/produtos");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
      setProgresso("");
    }
  }

  return (
    <form onSubmit={salvar} className="max-w-3xl">
      <CabecalhoAdmin
        rotulo={editando ? "Editar produto" : "Novo produto"}
        titulo={editando ? produto!.nome : "Novo produto"}
        descricao={
          editando
            ? "Altere o que precisar. O endereço do produto no site não muda."
            : ehGestor
              ? "Preencha e publique: o produto entra no site ao salvar."
              : "Depois de salvar, o produto fica aguardando o gestor conferir e publicar."
        }
        acao={produto && !produto.aprovado ? <Selo tom="ambar">Aguardando o gestor publicar</Selo> : undefined}
      />

      <div className="mt-6 flex flex-col gap-4">
        {/* ---------- Tipo de venda: decide o que aparece no site ---------- */}
        <Secao titulo="Tipo de venda" texto="Decide o que o site pode mostrar deste produto.">
          <fieldset>
            <legend className="sr-only">Tipo de venda</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIPOS_VENDA.map((t) => {
                const marcado = venda === t.valor;
                return (
                  <label
                    key={t.valor}
                    className={`relative border rounded-xl p-4 cursor-pointer transition-colors ${
                      marcado ? "border-tinta bg-gelo/60 ring-4 ring-tinta/10" : "border-fio bg-white hover:border-tinta/40"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="venda"
                        value={t.valor}
                        checked={marcado}
                        onChange={() => setVenda(t.valor)}
                        className="w-4 h-4 accent-[#1c69b5]"
                      />
                      <span className="font-semibold text-navy">{t.titulo}</span>
                    </span>
                    <span className="block text-xs text-cinza mt-1.5 leading-relaxed pl-[1.65rem]">{t.texto}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {!industrializado && (
            <AvisoAdmin tom="info" className="!font-normal text-[0.85rem] leading-relaxed">
              Manipulado não pode ser exposto como produto à venda. Use o nome pela composição
              (sem marca), descreva o que é, sem promessa de efeito, e prefira foto sem marca no rótulo.
            </AvisoAdmin>
          )}
        </Secao>

        {/* ---------- Galeria ---------- */}
        <Secao
          titulo="Fotos"
          texto={`Até ${MAX_FOTOS_PRODUTO} fotos. A primeira é a capa, que aparece nas listas; as outras entram na página do produto. Prefira fundo branco ou transparente.`}
        >
          <div className="flex items-center justify-between gap-3 -mt-2">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-cinza tabular-nums">
              {fotos.length} de {MAX_FOTOS_PRODUTO}
            </p>
            {vagas > 0 && (
              <label className={`${classeBotaoAdmin("secundario", "pequeno")} cursor-pointer`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                {fotos.length === 0 ? "Enviar fotos" : "Adicionar"}
                <input type="file" accept="image/*" multiple onChange={adicionarFotos} className="sr-only" />
              </label>
            )}
          </div>

          <ul className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {fotos.map((f, i) => (
              <li key={f.chave} className="relative group">
                <div
                  className={`aspect-square rounded-xl overflow-hidden border bg-gelo/60 flex items-center justify-center p-1.5 ${
                    i === 0 ? "border-ouro/60 ring-4 ring-ouro/10" : "border-fio"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.preview} alt={`Foto ${i + 1}`} className="max-w-full max-h-full object-contain" />
                </div>
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 h-5 px-2 rounded-full bg-[image:var(--ouro-degrade)] text-navy text-[0.6rem] font-semibold uppercase tracking-wider flex items-center">
                    Capa
                  </span>
                )}
                {/* Ordem e remoção */}
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => moverFoto(f.chave, i - 1)}
                      disabled={i === 0}
                      aria-label={`Mover a foto ${i + 1} para a esquerda`}
                      className="w-7 h-7 rounded-lg text-cinza hover:bg-gelo hover:text-navy disabled:opacity-30 flex items-center justify-center"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moverFoto(f.chave, i + 1)}
                      disabled={i === fotos.length - 1}
                      aria-label={`Mover a foto ${i + 1} para a direita`}
                      className="w-7 h-7 rounded-lg text-cinza hover:bg-gelo hover:text-navy disabled:opacity-30 flex items-center justify-center"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removerFoto(f.chave)}
                    aria-label={`Remover a foto ${i + 1}`}
                    className="w-7 h-7 rounded-lg text-grafite-claro hover:bg-carimbo/10 hover:text-carimbo flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
            {/* A vaga para a próxima foto */}
            {vagas > 0 && (
              <li>
                <label className="aspect-square rounded-xl border-2 border-dashed border-fio hover:border-tinta/50 hover:bg-gelo/40 cursor-pointer flex flex-col items-center justify-center gap-1.5 text-cinza transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.7" />
                    <path d="m5 18 5-4.5 3.5 3 2.5-2 4.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[0.68rem] font-medium">{fotos.length === 0 ? "Enviar" : "Mais uma"}</span>
                  <input type="file" accept="image/*" multiple onChange={adicionarFotos} className="sr-only" />
                </label>
              </li>
            )}
          </ul>
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

          <CampoAdmin rotulo="Descrição" obrigatorio>
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
            {/* Preço: só para quem é vendido com preço */}
            {industrializado && (
              <CampoAdmin rotulo="Preço (R$)" obrigatorio dica="Fica guardado aqui; só aparece no site se a chave abaixo estiver ligada.">
                <input
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  required
                  inputMode="decimal"
                  className={classeCampoAdmin}
                  placeholder="49,90"
                />
              </CampoAdmin>
            )}

            <CampoAdmin rotulo="Categoria">
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className={`${classeCampoAdmin} appearance-none`}
              >
                <option value="">Sem categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                    {c.visivel ? "" : " (fora do site)"}
                  </option>
                ))}
              </select>
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
              <input
                value={dosagens}
                onChange={(e) => setDosagens(e.target.value)}
                className={classeCampoAdmin}
                placeholder="Separe por vírgula. Ex.: 250mg, 500mg, 1g"
              />
            </CampoAdmin>
          )}
        </Secao>

        {/* ---------- Página do produto (só industrializado) ---------- */}
        {industrializado && (
          <Secao
            titulo="Informações da página do produto"
            texto="Tudo aqui é opcional: o que ficar vazio simplesmente não aparece no site. Use o que está no rótulo registrado."
          >
            <CampoAdmin rotulo="Apresentação">
              <input
                value={apresentacao}
                onChange={(e) => setApresentacao(e.target.value)}
                className={classeCampoAdmin}
                placeholder="Ex.: 30 cápsulas · 100ml · Pote 30g"
              />
            </CampoAdmin>
            <CampoAdmin rotulo="Indicações">
              <textarea
                value={indicacoes}
                onChange={(e) => setIndicacoes(e.target.value)}
                rows={3}
                className={classeAreaAdmin}
                placeholder="Uma por linha, como no rótulo"
              />
            </CampoAdmin>
            <CampoAdmin rotulo="Composição">
              <textarea
                value={composicao}
                onChange={(e) => setComposicao(e.target.value)}
                rows={3}
                className={classeAreaAdmin}
                placeholder="Um ativo por linha"
              />
            </CampoAdmin>
            <CampoAdmin rotulo="Modo de uso">
              <textarea
                value={modoUso}
                onChange={(e) => setModoUso(e.target.value)}
                rows={2}
                className={classeAreaAdmin}
                placeholder="Como no rótulo"
              />
            </CampoAdmin>
          </Secao>
        )}

        {/* ---------- Chaves do site ---------- */}
        <Secao titulo="No site">
          <div className="-mt-2 flex flex-col divide-y divide-fio">
            <Interruptor
              ligado={ativo}
              rotulo={ativo ? "No site" : "Em falta (escondido do site)"}
              descricao="Desligue para esconder sem apagar, por exemplo um item em falta."
              aoAlternar={() => setAtivo((v) => !v)}
              cor="verde"
            />
            {industrializado && (
              <>
                <Interruptor
                  ligado={mostrarPreco}
                  rotulo="Preço no site"
                  descricao="Mostra o preço no cartão e na página do produto. Desligado, o farmacêutico passa o valor pelo WhatsApp."
                  aoAlternar={() => setMostrarPreco((v) => !v)}
                  cor="ouro"
                />
                <Interruptor
                  ligado={novidade}
                  rotulo="Novidade"
                  descricao="Ganha o selo de novidade no site."
                  aoAlternar={() => setNovidade((v) => !v)}
                />
                <Interruptor
                  ligado={destaque}
                  rotulo="Destaque"
                  descricao="Aparece primeiro na faixa de pronta entrega da home."
                  aoAlternar={() => setDestaque((v) => !v)}
                />
              </>
            )}
          </div>
        </Secao>

        {!editando && !ehGestor && (
          <AvisoAdmin tom="info" className="!font-normal">
            Depois de salvar, o produto fica aguardando o gestor conferir e publicar no site.
          </AvisoAdmin>
        )}

        {erro && <AvisoAdmin>{erro}</AvisoAdmin>}

        <div className="flex flex-wrap items-center gap-3 pt-1 pb-6">
          <BotaoAdmin type="submit" variante="primario" disabled={salvando} className="!px-7">
            {salvando && (
              <span aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {salvando ? progresso || "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
          </BotaoAdmin>
          <Link href="/admin/produtos" className={classeBotaoAdmin("fantasma")}>
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
