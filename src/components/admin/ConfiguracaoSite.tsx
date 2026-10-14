"use client";
// Home e arte da dobra (07/10/2026, "subir a seção no site ou não" e "o
// cliente vai colocar as fotos da hero no painel"; depois, "duas fotos na
// home, tanto para PC quanto para mobile").
//
// 14/10/2026, a tela cresceu ("quero a opção para subir as categorias, a
// pessoa controla qual vem primeiro; em Conheça nossas linhas, mudar as
// fotos e ícones e a posição; na arte da dobra coloque banners, por fotos,
// vídeos ou GIFs, para todos os banners do site"). Três blocos:
//   1. Os banners do site: a dobra (duas artes), a Saúde da Mulher, o
//      cartão da faixa Mais procurados, o de cada área e o da história.
//      Cada um é um palco: o computador num quadro de navegador, o celular
//      num aparelho; vazio, é uma zona de soltar o arquivo (arrastar da
//      pasta ou clicar); com mídia, "Trocar" e "Remover" por cima no hover.
//      Os grandes aceitam foto, GIF ou vídeo; os cartões das faixas, foto e
//      GIF. Tudo vale na hora no site.
//   2. Conheça nossas linhas de produtos: cada linha com a foto do círculo
//      (trocar, remover) e a ordem (arrastar ou as setas; a ordem das
//      linhas é a mesma dos chips e das faixas, só o gestor mexe).
//   3. As seções da página inicial, cada uma com a chave e a ordem
//      (arrastar ou as setas).
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { SECOES_HOME, type ChaveSecao, type SecoesHome } from "@/lib/secoes";
import { PAPEL_ADMIN } from "@/lib/tipos";
import type { Banners, DefinicaoBanner, Midia } from "@/lib/banners";
import type { ImagemDaLinha } from "@/lib/linhas";
import { useSessaoDemo } from "./ModoDemo";
import { Alca, AvisoAdmin, CabecalhoAdmin, CartaoAdmin, Interruptor, Selo, classeBotaoAdmin } from "./PecasAdmin";

type Tela = "desktop" | "celular";
type Linha = { id: number; nome: string; slug: string; imagem: ImagemDaLinha | null };

const ACEITA_IMAGEM = "image/jpeg,image/png,image/webp,image/gif";
const ACEITA_VIDEO = `${ACEITA_IMAGEM},video/mp4,video/webm`;

function IconeEnviar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V5m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15.5V17a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 17v-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconeSeta({ cima }: { cima: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={cima ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Botões de subir e descer (também para quem não arrasta: toque, teclado) */
function Setas({ indice, total, mover, nome }: { indice: number; total: number; mover: (de: number, para: number) => void; nome: string }) {
  const classe = "flex size-7 items-center justify-center rounded-lg text-grafite-claro hover:bg-nevoa hover:text-navy disabled:opacity-30 disabled:hover:bg-transparent transition-colors";
  return (
    <span className="flex flex-col">
      <button type="button" className={classe} disabled={indice === 0} onClick={() => mover(indice, indice - 1)} aria-label={`Subir ${nome}`}>
        <IconeSeta cima />
      </button>
      <button type="button" className={classe} disabled={indice === total - 1} onClick={() => mover(indice, indice + 1)} aria-label={`Descer ${nome}`}>
        <IconeSeta cima={false} />
      </button>
    </span>
  );
}

/** A prévia de uma mídia: imagem ou vídeo sem som */
function Previa({ midia, className }: { midia: Midia; className: string }) {
  if (midia.tipo === "video") {
    return <video src={asset(midia.url)} className={className} muted loop autoPlay playsInline aria-hidden="true" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(midia.url)} alt="" className={className} />;
}

export function ConfiguracaoSite({
  secoes,
  ordem: ordemInicial,
  banners: bannersIniciais,
  definicoes,
  linhas: linhasIniciais,
  papel,
}: {
  secoes: SecoesHome;
  ordem: ChaveSecao[];
  banners: Banners;
  definicoes: DefinicaoBanner[];
  linhas: Linha[];
  papel: string;
}) {
  const router = useRouter();
  const demo = useSessaoDemo();
  const ehGestor = (demo?.papel ?? papel) === PAPEL_ADMIN;
  const [estado, setEstado] = useState(secoes);
  const [ordem, setOrdem] = useState(ordemInicial);
  const [linhas, setLinhas] = useState(linhasIniciais);
  const [salvandoSecao, setSalvandoSecao] = useState<ChaveSecao | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [arrastandoSobre, setArrastandoSobre] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  // Quando o servidor manda valores novos (router.refresh), as cópias acompanham
  const [base, setBase] = useState({ secoes, ordemInicial, linhasIniciais });
  if (secoes !== base.secoes || ordemInicial !== base.ordemInicial || linhasIniciais !== base.linhasIniciais) {
    setBase({ secoes, ordemInicial, linhasIniciais });
    setEstado(secoes);
    setOrdem(ordemInicial);
    setLinhas(linhasIniciais);
  }

  const ligadas = SECOES_HOME.filter((s) => estado[s.chave]).length;
  const bannersNoAr = definicoes.filter((d) => bannersIniciais[d.chave]?.desktop).length;
  const dobraNoAr = ["dobra-1", "dobra-2"].filter((c) => bannersIniciais[c]?.desktop).length;

  const falhou = (mensagem: string) => {
    setErro(mensagem);
    setAviso("");
  };
  const deuCerto = (mensagem: string) => {
    setAviso(mensagem);
    setErro("");
    router.refresh();
  };

  // ---------- Seções: chave e ordem ----------
  async function alternarSecao(chave: ChaveSecao) {
    const valor = !estado[chave];
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
        falhou(dados.erro || "Não foi possível salvar.");
        setEstado((e) => ({ ...e, [chave]: !valor }));
        return;
      }
      const titulo = SECOES_HOME.find((s) => s.chave === chave)?.titulo ?? "Seção";
      deuCerto(`${titulo} ${valor ? "ligada" : "desligada"}. Já vale no site.`);
    } catch {
      falhou("Falha de conexão. Tente novamente.");
      setEstado((e) => ({ ...e, [chave]: !valor }));
    } finally {
      setSalvandoSecao(null);
    }
  }

  async function moverSecao(de: number, para: number) {
    if (para < 0 || para >= ordem.length || de === para) return;
    const nova = [...ordem];
    const [item] = nova.splice(de, 1);
    nova.splice(para, 0, item);
    setOrdem(nova);
    try {
      const resposta = await fetch("/api/admin/site", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secoesOrdem: nova }),
      });
      if (!resposta.ok) {
        falhou("Não foi possível salvar a ordem.");
        setOrdem(ordem);
        return;
      }
      deuCerto("Ordem das seções salva. Já vale no site.");
    } catch {
      falhou("Falha de conexão. Tente novamente.");
      setOrdem(ordem);
    }
  }

  // ---------- Linhas: ordem (só o gestor) ----------
  async function moverLinha(de: number, para: number) {
    if (!ehGestor || para < 0 || para >= linhas.length || de === para) return;
    const nova = [...linhas];
    const [item] = nova.splice(de, 1);
    nova.splice(para, 0, item);
    setLinhas(nova);
    try {
      const resposta = await fetch("/api/admin/ordenar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "categorias", ids: nova.map((l) => l.id) }),
      });
      if (!resposta.ok) {
        falhou("Não foi possível salvar a ordem das linhas.");
        setLinhas(linhas);
        return;
      }
      deuCerto("Ordem das linhas salva. Vale nos círculos, nos chips e nas faixas.");
    } catch {
      falhou("Falha de conexão. Tente novamente.");
      setLinhas(linhas);
    }
  }

  // ---------- Mídias: banners e fotos das linhas ----------
  async function enviar(alvo: string, nome: string, arquivo: File | undefined, aceitaVideo: boolean) {
    if (!arquivo) return;
    const imagem = /^image\/(jpeg|png|webp|gif)$/.test(arquivo.type);
    const video = /^video\/(mp4|webm)$/.test(arquivo.type);
    if (!imagem && !(aceitaVideo && video)) {
      falhou(aceitaVideo ? "Envie JPG, PNG, WEBP, GIF, MP4 ou WEBM." : "Envie JPG, PNG, WEBP ou GIF.");
      return;
    }
    setOcupado(alvo);
    try {
      const formulario = new FormData();
      formulario.append("arquivo", arquivo);
      formulario.append("alvo", alvo);
      const resposta = await fetch("/api/admin/midia", { method: "POST", body: formulario });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        falhou(dados.erro || "Não foi possível enviar.");
        return;
      }
      deuCerto(`${nome} no ar.`);
    } catch {
      falhou("Falha de conexão. Tente novamente.");
    } finally {
      setOcupado(null);
    }
  }

  async function remover(alvo: string, nome: string, consequencia = "") {
    if (!confirm(`Remover ${nome}?${consequencia}`)) return;
    setOcupado(alvo);
    try {
      const resposta = await fetch("/api/admin/midia", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alvo }),
      });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        falhou(dados.erro || "Não foi possível remover.");
        return;
      }
      deuCerto(`${nome} removida.`);
    } catch {
      falhou("Falha de conexão. Tente novamente.");
    } finally {
      setOcupado(null);
    }
  }

  /** Drag-and-drop das listas (uma origem por lista) */
  const arrastando = useRef<{ lista: "secoes" | "linhas"; indice: number } | null>(null);

  /** O palco de uma tela de um banner: a zona de soltar (vazia) ou a mídia
   *  com as ações por cima. Função de desenho, não componente (definida
   *  aqui dentro, um componente remontaria a cada render). */
  function palco(def: DefinicaoBanner, tela: Tela) {
    const midia = bannersIniciais[def.chave]?.[tela] ?? null;
    const alvo = `banner:${def.chave}:${tela}`;
    const nome = `${def.titulo}, ${tela === "desktop" ? "computador" : "celular"}`;
    const ocupadoAqui = ocupado === alvo;
    const sobre = arrastandoSobre === alvo;
    const celular = tela === "celular";
    const vertical = !def.celular; // os cartões das faixas são retratos
    const proporcao = celular ? def.proporcaoCelular : def.proporcaoDesktop;
    const medida = celular ? def.medidaCelular : def.medidaDesktop;
    const entrada = (
      <input
        type="file"
        accept={def.video ? ACEITA_VIDEO : ACEITA_IMAGEM}
        onChange={(e) => {
          const arquivo = e.target.files?.[0];
          e.target.value = "";
          enviar(alvo, nome, arquivo, def.video);
        }}
        disabled={ocupadoAqui}
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
        enviar(alvo, nome, e.dataTransfer.files?.[0], def.video);
      },
    };
    const moldura = celular
      ? "rounded-[1.4rem] ring-[5px] ring-navy bg-navy"
      : vertical
        ? "rounded-xl ring-1 ring-fio bg-white"
        : "rounded-xl ring-1 ring-fio bg-white";
    const comBarra = !celular && !vertical;

    return (
      <div className={`flex flex-col gap-1.5 ${celular ? "w-[8.5rem] shrink-0" : vertical ? "w-[10rem] shrink-0" : "flex-1 min-w-0"}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.8rem] font-medium text-navy">{celular ? "Celular" : vertical ? "Cartão" : "Computador"}</p>
          <span className="text-[0.6875rem] text-grafite-claro tabular-nums">{medida}</span>
        </div>
        <div
          {...soltar}
          className={`relative overflow-hidden transition-[box-shadow] duration-200 ${moldura} ${sobre ? "shadow-[0_0_0_4px_rgba(28,105,181,0.25)]" : ""}`}
          style={{ aspectRatio: proporcao }}
        >
          {comBarra && (
            <span aria-hidden="true" className="absolute inset-x-0 top-0 z-[1] flex items-center gap-1 h-5 px-2.5 bg-nevoa border-b border-fio">
              <span className="size-1.5 rounded-full bg-[#ff5f57]" />
              <span className="size-1.5 rounded-full bg-[#febc2e]" />
              <span className="size-1.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 h-2 flex-1 max-w-24 rounded-full bg-fio" />
            </span>
          )}
          {midia ? (
            <>
              <Previa midia={midia} className={`absolute inset-0 w-full h-full object-cover ${comBarra ? "top-5 h-[calc(100%-1.25rem)]" : ""}`} />
              {midia.tipo === "video" && (
                <span className="absolute left-2 top-2 z-[1] inline-flex items-center gap-1 h-5 rounded-full bg-navy/80 px-2 text-[0.625rem] font-semibold uppercase tracking-wider text-white">
                  vídeo
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-center gap-2 p-2 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <label className={`${classeBotaoAdmin("secundario", "pequeno")} cursor-pointer !h-8 !px-3 !text-[0.75rem] ${ocupadoAqui ? "opacity-50 pointer-events-none" : ""}`}>
                  {ocupadoAqui ? "Enviando..." : "Trocar"}
                  {entrada}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    remover(alvo, nome, !celular && def.celular ? "\n\nSem a versão do computador, a do celular (se houver) fica guardada mas não é usada." : "")
                  }
                  disabled={ocupadoAqui}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-white/90 text-carimbo text-[0.75rem] font-semibold hover:bg-white disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            </>
          ) : (
            <label
              className={`absolute inset-0 ${comBarra ? "top-5" : ""} flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer border-2 border-dashed m-2 rounded-lg transition-colors ${
                sobre
                  ? "border-tinta bg-gelo/80 text-tinta"
                  : celular
                    ? "border-white/25 text-white/80 hover:border-white/60"
                    : "border-fio text-cinza hover:border-tinta/50 hover:text-tinta bg-nevoa/40"
              } ${ocupadoAqui ? "opacity-50 pointer-events-none" : ""}`}
            >
              {ocupadoAqui ? <span aria-hidden="true" className="w-5 h-5 rounded-full border-2 border-current/40 border-t-current animate-spin" /> : <IconeEnviar />}
              <span className="text-[0.75rem] font-semibold leading-tight px-2">{ocupadoAqui ? "Enviando..." : celular || vertical ? "Enviar" : "Solte aqui ou clique"}</span>
              {!celular && !vertical && <span className="text-[0.6875rem] opacity-70">{def.video ? "Foto, GIF ou vídeo" : "Foto ou GIF"}</span>}
              {entrada}
            </label>
          )}
        </div>
      </div>
    );
  }

  const grandes = definicoes.filter((d) => d.celular);
  const cartoes = definicoes.filter((d) => !d.celular);

  return (
    <div className="max-w-5xl">
      <CabecalhoAdmin
        rotulo="Site"
        titulo="Home e arte da dobra"
        descricao="A ordem e as chaves da página inicial, as fotos das linhas e todos os banners do site. Tudo vale na hora."
        chips={
          <>
            <Selo tom="verde">
              {ligadas} de {SECOES_HOME.length} seções no ar
            </Selo>
            <Selo tom={dobraNoAr > 0 ? "ouro" : "cinza"}>{dobraNoAr === 0 ? "Dobra padrão" : dobraNoAr === 1 ? "Modo arte, 1 arte" : "Modo arte, alternando 2"}</Selo>
            <Selo tom="azul">
              {bannersNoAr} de {definicoes.length} banners enviados
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

      {/* ---------- 1. Os banners do site ---------- */}
      <CartaoAdmin
        className="mt-6"
        titulo="Banners do site"
        apoio="Foto, GIF ou vídeo (sem som, em laço). Sem nada enviado, cada banner mostra o padrão do site. Deixe o centro mais calmo: é onde ficam os botões e o texto."
      >
        <div className="px-5 pb-5 mt-4 flex flex-col gap-4">
          {grandes.map((def) => (
            <section key={def.chave} className="rounded-2xl bg-nevoa/50 ring-1 ring-inset ring-fio/70 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-navy">{def.titulo}</h3>
                  <p className="text-xs text-cinza mt-0.5 leading-snug">{def.texto}</p>
                </div>
                <Selo tom={bannersIniciais[def.chave]?.desktop ? "verde" : "cinza"}>{bannersIniciais[def.chave]?.desktop ? "No ar" : "Padrão"}</Selo>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {palco(def, "desktop")}
                {palco(def, "celular")}
              </div>
            </section>
          ))}

          <section className="rounded-2xl bg-nevoa/50 ring-1 ring-inset ring-fio/70 p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-navy">Cartões das faixas e da história</h3>
              <p className="text-xs text-cinza mt-0.5 leading-snug">O cartão vertical no fim de cada faixa de produtos, e a foto do banner da história no celular. Foto ou GIF.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {cartoes.map((def) => (
                <div key={def.chave} className="flex flex-col gap-1.5">
                  <p className="text-[0.8rem] font-semibold text-navy truncate max-w-[10rem]" title={def.titulo}>
                    {def.titulo}
                  </p>
                  {palco(def, "desktop")}
                </div>
              ))}
            </div>
          </section>
        </div>
      </CartaoAdmin>

      {/* ---------- 2. Conheça nossas linhas de produtos ---------- */}
      <CartaoAdmin
        className="mt-4"
        titulo="Conheça nossas linhas de produtos"
        apoio={`Os círculos logo abaixo da dobra. A foto de cada linha e a ordem delas (a ordem vale também nos chips do cabeçalho e nas faixas).${ehGestor ? "" : " Só o gestor muda a ordem."}`}
      >
        <ul className="px-5 pb-5 mt-4 flex flex-col gap-2">
          {linhas.map((l, i) => {
            const alvo = `linha:${l.slug}`;
            const ocupadoAqui = ocupado === alvo;
            return (
              <li
                key={l.id}
                draggable={ehGestor}
                onDragStart={() => (arrastando.current = { lista: "linhas", indice: i })}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const a = arrastando.current;
                  arrastando.current = null;
                  if (a?.lista === "linhas") moverLinha(a.indice, i);
                }}
                className={`flex items-center gap-3 rounded-2xl bg-white ring-1 ring-inset ring-fio/80 px-3 py-2.5 ${ocupadoAqui ? "opacity-60" : ""}`}
              >
                {ehGestor && <Alca />}
                <span className="shrink-0 size-14 rounded-full bg-gelo overflow-hidden flex items-center justify-center p-1.5 ring-1 ring-inset ring-fio/70">
                  {l.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(l.imagem.src)} alt="" className={l.imagem.tipo === "foto" ? "size-full object-cover rounded-full" : "max-w-full max-h-full object-contain"} />
                  ) : (
                    <span className="numero-tinta text-xl text-ouro-escuro">{l.nome.charAt(0)}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-navy text-[0.95rem] leading-tight">{l.nome}</span>
                  <span className="block text-xs text-cinza mt-0.5">
                    {l.imagem?.propria ? "Foto enviada pelo painel" : l.imagem ? "Foto padrão (um pote da linha)" : "Sem foto: a inicial em ouro"}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <label className={`${classeBotaoAdmin("secundario", "pequeno")} cursor-pointer ${ocupadoAqui ? "opacity-50 pointer-events-none" : ""}`}>
                    {ocupadoAqui ? "Enviando..." : l.imagem?.propria ? "Trocar" : "Enviar foto"}
                    <input
                      type="file"
                      accept={ACEITA_IMAGEM}
                      onChange={(e) => {
                        const arquivo = e.target.files?.[0];
                        e.target.value = "";
                        enviar(alvo, `Foto da linha ${l.nome}`, arquivo, false);
                      }}
                      disabled={ocupadoAqui}
                      className="sr-only"
                    />
                  </label>
                  {l.imagem?.propria && (
                    <button
                      type="button"
                      onClick={() => remover(alvo, `a foto da linha ${l.nome}`, "\n\nO círculo volta para a foto padrão.")}
                      disabled={ocupadoAqui}
                      className={`${classeBotaoAdmin("perigo", "pequeno")}`}
                    >
                      Remover
                    </button>
                  )}
                  {ehGestor && <Setas indice={i} total={linhas.length} mover={moverLinha} nome={l.nome} />}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="px-5 pb-5 -mt-2 text-xs text-grafite-claro leading-relaxed">
          Foto quadrada, de preferência PNG com fundo transparente (o pote solto sobre o gelo) ou uma foto que preencha o círculo.
        </p>
      </CartaoAdmin>

      {/* ---------- 3. Seções da página inicial, na ordem ---------- */}
      <CartaoAdmin
        className="mt-4"
        titulo="Seções da página inicial"
        apoio="A ordem aqui é a ordem da página; arraste ou use as setas. A dobra e as vantagens ficam sempre no alto. Cada área também tem a chave &quot;Vitrine na home&quot; em Categorias."
      >
        <ul className="px-5 pb-5 mt-4 flex flex-col gap-2">
          {ordem.map((chave, i) => {
            const s = SECOES_HOME.find((x) => x.chave === chave);
            if (!s) return null;
            const ligada = estado[chave];
            return (
              <li
                key={chave}
                draggable
                onDragStart={() => (arrastando.current = { lista: "secoes", indice: i })}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  const a = arrastando.current;
                  arrastando.current = null;
                  if (a?.lista === "secoes") moverSecao(a.indice, i);
                }}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2 ring-1 ring-inset transition-colors ${ligada ? "bg-white ring-fio/80" : "bg-nevoa/60 ring-transparent"}`}
              >
                <Alca />
                <span className={`w-6 text-[0.6875rem] font-semibold tabular-nums ${ligada ? "text-ouro-escuro" : "text-grafite-claro"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <Interruptor ligado={ligada} rotulo={s.titulo} descricao={s.texto} aoAlternar={() => alternarSecao(chave)} desabilitado={salvandoSecao === chave} />
                </span>
                <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${ligada ? "bg-green-500" : "bg-grafite-claro/40"}`} />
                <Setas indice={i} total={ordem.length} mover={moverSecao} nome={s.titulo} />
              </li>
            );
          })}
        </ul>
      </CartaoAdmin>
    </div>
  );
}
