"use client";
// Home e arte da dobra (07/10/2026, "subir a seção no site ou não" e "o
// cliente vai colocar as fotos da hero no painel"; depois, "duas fotos na
// home, tanto para PC quanto para mobile").
//   1. As seções da página inicial, cada uma com a sua chave: a mudança
//      vale na hora (as páginas do site leem o banco a cada visita).
//   2. Até duas artes da dobra, cada uma com a versão do computador
//      (obrigatória para a arte valer) e a do celular (opcional). Com uma
//      arte, a dobra vira a imagem com só os três botões por cima; com
//      duas, alterna entre elas; sem nenhuma, mostra o texto e os potes.
//
// 14/10/2026 ("modernize, quero a parte das fotos mais clean e moderna"):
//   - as seções viraram ladrilhos numa grade de duas colunas, cada um com
//     a chave, o número e o estado;
//   - cada arte virou um palco: a versão do computador num quadro de
//     navegador (a barra com os três pontos) e a do celular num aparelho
//     ao lado, na proporção real; vazias, viram zonas de soltar o arquivo
//     (arrastar da pasta ou clicar); com arte, "Trocar" e "Remover" ficam
//     por cima da imagem, no hover, e o nome do arquivo some do caminho;
//   - as medidas e as dicas ficaram pequenas, embaixo de cada palco.

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { SECOES_HOME, type ChaveSecao, type SecoesHome } from "@/lib/secoes";
import { AvisoAdmin, CabecalhoAdmin, CartaoAdmin, Interruptor, Selo, classeBotaoAdmin } from "./PecasAdmin";

type Arte = { desktop: string | null; celular: string | null };
type Tela = "desktop" | "celular";

const TELAS: { tela: Tela; titulo: string; medida: string; texto: string }[] = [
  {
    tela: "desktop",
    titulo: "Computador",
    medida: "1920 × 760 px",
    texto: "Obrigatória para a arte valer. Serve também para o celular quando não houver a outra.",
  },
  {
    tela: "celular",
    titulo: "Celular",
    medida: "1080 × 1350 px",
    texto: "Opcional. Entra só nas telas pequenas, no lugar da arte do computador.",
  },
];

// "desktop" para a arte 1, "desktop2" para a arte 2 (o que a API espera)
const alvoDe = (indice: number, tela: Tela) => (indice === 0 ? tela : `${tela}${indice + 1}`);

function IconeEnviar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V5m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15.5V17a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 17v-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ConfiguracaoSite({ secoes, artes }: { secoes: SecoesHome; artes: Arte[] }) {
  const router = useRouter();
  const [estado, setEstado] = useState(secoes);
  const [salvandoSecao, setSalvandoSecao] = useState<ChaveSecao | null>(null);
  const [ocupadoArte, setOcupadoArte] = useState<string | null>(null);
  const [arrastandoSobre, setArrastandoSobre] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  // Quando o servidor manda valores novos (router.refresh), a cópia acompanha
  const [base, setBase] = useState(secoes);
  if (secoes !== base) {
    setBase(secoes);
    setEstado(secoes);
  }

  const ligadas = SECOES_HOME.filter((s) => estado[s.chave]).length;
  const artesNoAr = artes.filter((a) => a.desktop).length;

  async function alternarSecao(chave: ChaveSecao) {
    const valor = !estado[chave];
    setErro("");
    setAviso("");
    setEstado((e) => ({ ...e, [chave]: valor })); // otimista
    setSalvandoSecao(chave);
    try {
      const resposta = await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secoesHome: { [chave]: valor } }),
      });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.erro || "Não foi possível salvar.");
        setEstado((e) => ({ ...e, [chave]: !valor }));
        return;
      }
      const titulo = SECOES_HOME.find((s) => s.chave === chave)?.titulo ?? "Seção";
      setAviso(`${titulo} ${valor ? "ligada" : "desligada"}. Já vale no site.`);
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
      setEstado((e) => ({ ...e, [chave]: !valor }));
    } finally {
      setSalvandoSecao(null);
    }
  }

  async function enviarArte(alvo: string, nome: string, arquivo: File | undefined) {
    if (!arquivo) return;
    if (!/^image\/(jpeg|png|webp)$/.test(arquivo.type)) {
      setErro("Envie uma imagem JPG, PNG ou WEBP.");
      return;
    }
    setErro("");
    setAviso("");
    setOcupadoArte(alvo);
    try {
      const formulario = new FormData();
      formulario.append("arquivo", arquivo);
      formulario.append("alvo", alvo);
      const resposta = await fetch("/api/admin/hero", { method: "POST", body: formulario });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível enviar a arte.");
        return;
      }
      setAviso(`${nome} no ar.`);
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setOcupadoArte(null);
    }
  }

  async function removerArte(alvo: string, nome: string, ehDesktop: boolean) {
    const consequencia = ehDesktop
      ? "\n\nSem a versão do computador, esta arte deixa de aparecer (a do celular, se houver, fica guardada mas não é usada)."
      : "";
    if (!confirm(`Remover ${nome}?${consequencia}`)) return;
    setErro("");
    setAviso("");
    setOcupadoArte(alvo);
    try {
      const resposta = await fetch("/api/admin/hero", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alvo }),
      });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.erro || "Não foi possível remover.");
        return;
      }
      setAviso(`${nome} removida.`);
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setOcupadoArte(null);
    }
  }

  /** A zona de soltar (vazia) ou a imagem com as ações por cima (função de
   *  desenho, não componente: definida aqui dentro, um componente
   *  remontaria a cada render) */
  function palco(arte: Arte, indice: number, t: (typeof TELAS)[number]) {
    const url = arte[t.tela];
    const alvo = alvoDe(indice, t.tela);
    const nome = `Arte ${indice + 1}, ${t.titulo.toLowerCase()}`;
    const ocupado = ocupadoArte === alvo;
    const sobre = arrastandoSobre === alvo;
    const celular = t.tela === "celular";
    const entrada = (
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const arquivo = e.target.files?.[0];
          e.target.value = "";
          enviarArte(alvo, nome, arquivo);
        }}
        disabled={ocupado}
        className="sr-only"
      />
    );
    const soltar = {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        if (!sobre) setArrastandoSobre(alvo);
      },
      onDragLeave: () => setArrastandoSobre(null),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setArrastandoSobre(null);
        enviarArte(alvo, nome, e.dataTransfer.files?.[0]);
      },
    };

    return (
      <div className={`flex flex-col gap-2 ${celular ? "w-[9.5rem] shrink-0" : "flex-1 min-w-0"}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-navy">{t.titulo}</p>
          <span className="text-[0.6875rem] text-grafite-claro tabular-nums">{t.medida}</span>
        </div>

        {/* O quadro: navegador (computador) ou aparelho (celular) */}
        <div
          {...soltar}
          className={`relative overflow-hidden transition-[box-shadow,background-color] duration-200 ${
            celular
              ? "rounded-[1.4rem] ring-[5px] ring-navy bg-navy aspect-[1080/1350]"
              : "rounded-xl ring-1 ring-fio bg-white aspect-[1920/760] md:aspect-[1920/700]"
          } ${sobre ? "shadow-[0_0_0_4px_rgba(28,105,181,0.25)]" : ""}`}
        >
          {!celular && (
            <span aria-hidden="true" className="absolute inset-x-0 top-0 z-[1] flex items-center gap-1 h-5 px-2.5 bg-nevoa border-b border-fio">
              <span className="size-1.5 rounded-full bg-[#ff5f57]" />
              <span className="size-1.5 rounded-full bg-[#febc2e]" />
              <span className="size-1.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 h-2 flex-1 max-w-24 rounded-full bg-fio" />
            </span>
          )}
          {url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(url)} alt={nome} className={`absolute inset-0 w-full h-full object-cover ${celular ? "" : "top-5 h-[calc(100%-1.25rem)]"}`} />
              {/* As ações por cima, no hover ou no toque */}
              <div className="group/acoes absolute inset-0 flex items-end justify-center gap-2 p-2 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <label className={`${classeBotaoAdmin("secundario", "pequeno")} cursor-pointer !h-8 !px-3 !text-[0.75rem] ${ocupado ? "opacity-50 pointer-events-none" : ""}`}>
                  {ocupado ? "Enviando..." : "Trocar"}
                  {entrada}
                </label>
                <button
                  type="button"
                  onClick={() => removerArte(alvo, nome, !celular)}
                  disabled={ocupado}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-white/90 text-carimbo text-[0.75rem] font-semibold hover:bg-white disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            </>
          ) : (
            <label
              className={`absolute inset-0 ${celular ? "" : "top-5"} flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer border-2 border-dashed m-2 rounded-lg transition-colors ${
                sobre ? "border-tinta bg-gelo/80 text-tinta" : celular ? "border-white/25 text-white/80 hover:border-white/60" : "border-fio text-cinza hover:border-tinta/50 hover:text-tinta bg-nevoa/40"
              } ${ocupado ? "opacity-50 pointer-events-none" : ""}`}
            >
              {ocupado ? (
                <span aria-hidden="true" className="w-5 h-5 rounded-full border-2 border-current/40 border-t-current animate-spin" />
              ) : (
                <IconeEnviar />
              )}
              <span className="text-[0.78rem] font-semibold leading-tight px-2">{ocupado ? "Enviando..." : celular ? "Enviar arte" : "Solte a imagem aqui ou clique"}</span>
              {!celular && <span className="text-[0.6875rem] opacity-70">JPG, PNG ou WEBP até 8 MB</span>}
              {entrada}
            </label>
          )}
        </div>
        <p className="text-[0.6875rem] text-grafite-claro leading-snug">{t.texto}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <CabecalhoAdmin
        rotulo="Site"
        titulo="Home e arte da dobra"
        descricao="O que aparece na página inicial e as artes que abrem o site. Tudo vale na hora."
        chips={
          <>
            <Selo tom="verde">{ligadas} de {SECOES_HOME.length} seções no ar</Selo>
            <Selo tom={artesNoAr > 0 ? "ouro" : "cinza"}>
              {artesNoAr === 0 ? "Dobra padrão" : artesNoAr === 1 ? "Modo arte, 1 arte" : "Modo arte, alternando 2"}
            </Selo>
          </>
        }
        acao={
          <a href={asset("/")} target="_blank" rel="noopener noreferrer" className={classeBotaoAdmin("secundario")}>
            Ver a home
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17 17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        }
      />

      {erro && <AvisoAdmin className="mt-5">{erro}</AvisoAdmin>}
      {aviso && !erro && (
        <AvisoAdmin tom="ok" className="mt-5">
          {aviso}
        </AvisoAdmin>
      )}

      {/* ---------- Artes da dobra, primeiro: é o que mais muda a cara do site ---------- */}
      <CartaoAdmin
        className="mt-6"
        titulo="Artes da dobra"
        apoio="Até duas. Com uma, a abertura vira a imagem inteira e só os três botões ficam por cima; com duas, a dobra alterna. Sem nenhuma, o site mostra o texto e os potes."
      >
        <div className="px-5 pb-5 mt-4 flex flex-col gap-4">
          {artes.map((arte, indice) => (
            <section key={indice} className="rounded-2xl bg-nevoa/50 ring-1 ring-inset ring-fio/70 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="font-semibold text-navy flex items-center gap-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-navy text-white text-[0.7rem] tabular-nums">{indice + 1}</span>
                  Arte {indice + 1}
                </h3>
                <Selo tom={arte.desktop ? "verde" : "cinza"}>{arte.desktop ? "No ar" : "Vazia"}</Selo>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {TELAS.map((t) => (
                  <Fragment key={t.tela}>{palco(arte, indice, t)}</Fragment>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="px-5 pb-5 -mt-1 text-xs text-grafite-claro leading-relaxed">Deixe o centro da imagem mais calmo: é onde os botões ficam.</p>
      </CartaoAdmin>

      {/* ---------- Seções da home, em ladrilhos ---------- */}
      <CartaoAdmin className="mt-4" titulo="Seções da página inicial" apoio="A dobra e as vantagens ficam sempre. Cada área também tem a chave &quot;Vitrine na home&quot; em Categorias.">
        <ul className="px-5 pb-5 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SECOES_HOME.map((s, i) => {
            const ligada = estado[s.chave];
            return (
              <li
                key={s.chave}
                className={`flex items-start justify-between gap-3 rounded-2xl px-3.5 py-2.5 ring-1 ring-inset transition-colors ${
                  ligada ? "bg-white ring-fio/80" : "bg-nevoa/60 ring-transparent"
                }`}
              >
                <span className="flex items-start gap-2.5 min-w-0">
                  <span className={`mt-3 w-5 text-[0.6875rem] font-semibold tabular-nums ${ligada ? "text-ouro-escuro" : "text-grafite-claro"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <Interruptor ligado={ligada} rotulo={s.titulo} descricao={s.texto} aoAlternar={() => alternarSecao(s.chave)} desabilitado={salvandoSecao === s.chave} />
                </span>
                <span aria-hidden="true" className={`mt-3.5 size-2 shrink-0 rounded-full ${ligada ? "bg-green-500" : "bg-grafite-claro/40"}`} />
              </li>
            );
          })}
        </ul>
      </CartaoAdmin>
    </div>
  );
}
