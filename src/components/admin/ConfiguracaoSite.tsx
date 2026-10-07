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

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECOES_HOME, type ChaveSecao, type SecoesHome } from "@/lib/secoes";
import { AvisoAdmin, BotaoAdmin, CabecalhoAdmin, CartaoAdmin, Interruptor, Selo, classeBotaoAdmin } from "./PecasAdmin";

type Arte = { desktop: string | null; celular: string | null };

const TELAS = [
  {
    tela: "desktop" as const,
    titulo: "Computador",
    medida: "1920 × 760 px, horizontal",
    texto: "Obrigatória para a arte valer. Serve também para o celular quando não houver a outra.",
    proporcao: "aspect-[1920/760]",
  },
  {
    tela: "celular" as const,
    titulo: "Celular",
    medida: "1080 × 1350 px, vertical",
    texto: "Opcional. Entra só nas telas pequenas, no lugar da arte do computador.",
    proporcao: "aspect-[1080/1350] max-w-[11rem]",
  },
];

// "desktop" para a arte 1, "desktop2" para a arte 2 (o que a API espera)
const alvoDe = (indice: number, tela: "desktop" | "celular") => (indice === 0 ? tela : `${tela}${indice + 1}`);

export function ConfiguracaoSite({ secoes, artes }: { secoes: SecoesHome; artes: Arte[] }) {
  const router = useRouter();
  const [estado, setEstado] = useState(secoes);
  const [salvandoSecao, setSalvandoSecao] = useState<ChaveSecao | null>(null);
  const [ocupadoArte, setOcupadoArte] = useState<string | null>(null);
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

  async function enviarArte(alvo: string, nome: string, e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
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

  return (
    <div className="max-w-3xl">
      <CabecalhoAdmin
        rotulo="Site"
        titulo="Home e arte da dobra"
        descricao="O que aparece na página inicial e as artes que abrem o site. Tudo vale na hora."
        acao={
          <a href="/" target="_blank" rel="noopener noreferrer" className={classeBotaoAdmin("secundario")}>
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

      {/* ---------- Seções da home ---------- */}
      <CartaoAdmin
        className="mt-6"
        titulo="Seções da página inicial"
        apoio={`${ligadas} de ${SECOES_HOME.length} ligadas. A dobra e as vantagens ficam sempre.`}
      >
        <ul className="px-5 pb-2 mt-2 divide-y divide-fio">
          {SECOES_HOME.map((s, i) => (
            <li key={s.chave} className="flex items-center justify-between gap-4 py-1">
              <span className="flex items-start gap-3 min-w-0">
                <span className="mt-3 w-6 text-[0.68rem] font-semibold tabular-nums text-grafite-claro">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Interruptor
                  ligado={estado[s.chave]}
                  rotulo={s.titulo}
                  descricao={s.texto}
                  aoAlternar={() => alternarSecao(s.chave)}
                  desabilitado={salvandoSecao === s.chave}
                />
              </span>
              <Selo tom={estado[s.chave] ? "verde" : "cinza"} className="hidden sm:inline-flex">
                {estado[s.chave] ? "No ar" : "Oculta"}
              </Selo>
            </li>
          ))}
        </ul>
        <p className="px-5 pb-5 text-xs text-grafite-claro leading-relaxed">
          Cada área também tem a própria chave &quot;Vitrine na home&quot; em Categorias.
        </p>
      </CartaoAdmin>

      {/* ---------- Artes da dobra ---------- */}
      <CartaoAdmin
        className="mt-4"
        titulo="Artes da dobra"
        apoio="Até duas. Com uma, a abertura do site vira a imagem inteira e só os três botões ficam por cima; com duas, a dobra alterna entre elas. Sem nenhuma, o site mostra o texto e os potes."
        acao={
          <Selo tom={artesNoAr > 0 ? "ouro" : "cinza"}>
            {artesNoAr === 0 ? "Dobra padrão" : artesNoAr === 1 ? "Modo arte, 1 arte" : "Modo arte, alternando 2"}
          </Selo>
        }
      >
        <div className="px-5 pb-5 mt-4 flex flex-col gap-5">
          {artes.map((arte, indice) => (
            <section key={indice} className="rounded-2xl border border-fio p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-navy">Arte {indice + 1}</h3>
                <Selo tom={arte.desktop ? "verde" : "cinza"}>{arte.desktop ? "No ar" : "Vazia"}</Selo>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {TELAS.map((t) => {
                  const url = arte[t.tela];
                  const alvo = alvoDe(indice, t.tela);
                  const nome = `Arte ${indice + 1}, ${t.titulo.toLowerCase()}`;
                  const ocupado = ocupadoArte === alvo;
                  return (
                    <div key={t.tela} className="flex flex-col gap-3">
                      <div>
                        <p className="text-sm font-medium text-navy">{t.titulo}</p>
                        <p className="text-xs text-cinza mt-0.5">{t.medida}</p>
                      </div>
                      <div className={`${t.proporcao} w-full rounded-xl overflow-hidden bg-gelo/70 border border-fio flex items-center justify-center`}>
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt={nome} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-grafite-claro px-4 text-center">Sem arte enviada</span>
                        )}
                      </div>
                      <p className="text-xs text-cinza leading-relaxed">{t.texto}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <label className={`${classeBotaoAdmin(url ? "secundario" : "primario", "pequeno")} cursor-pointer ${ocupado ? "opacity-50 pointer-events-none" : ""}`}>
                          {ocupado && (
                            <span aria-hidden="true" className="w-3.5 h-3.5 rounded-full border-2 border-current/40 border-t-current animate-spin" />
                          )}
                          {ocupado ? "Enviando..." : url ? "Trocar" : "Enviar arte"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => enviarArte(alvo, nome, e)}
                            disabled={ocupado}
                            className="sr-only"
                          />
                        </label>
                        {url && (
                          <BotaoAdmin tamanho="pequeno" variante="perigo" onClick={() => removerArte(alvo, nome, t.tela === "desktop")} disabled={ocupado}>
                            Remover
                          </BotaoAdmin>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <p className="px-5 pb-5 -mt-1 text-xs text-grafite-claro leading-relaxed">
          JPG, PNG ou WEBP até 8 MB. Deixe o centro da imagem mais calmo: é onde os botões ficam.
        </p>
      </CartaoAdmin>
    </div>
  );
}
