"use client";
// Home e arte da dobra (07/10/2026, "subir a seção no site ou não" e "o
// cliente vai colocar as fotos da hero no painel").
//   1. As seções da página inicial, cada uma com a sua chave: a mudança
//      vale na hora (as páginas do site leem o banco a cada visita).
//   2. A arte da dobra: a versão do computador (obrigatória para ligar o
//      modo arte) e a do celular (opcional). Com a arte, a dobra vira a
//      imagem inteira com só os três botões por cima; sem ela, o site
//      mostra o texto e os potes.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECOES_HOME, type ChaveSecao, type SecoesHome } from "@/lib/secoes";
import { AvisoAdmin, BotaoAdmin, CabecalhoAdmin, CartaoAdmin, Interruptor, Selo, classeBotaoAdmin } from "./PecasAdmin";

type Arte = { desktop: string | null; celular: string | null };

const TELAS = [
  {
    alvo: "desktop" as const,
    titulo: "Computador",
    medida: "1920 × 760 px, horizontal",
    texto: "Obrigatória para ligar o modo arte. Serve também para o celular quando não houver a outra.",
    proporcao: "aspect-[1920/760]",
  },
  {
    alvo: "celular" as const,
    titulo: "Celular",
    medida: "1080 × 1350 px, vertical",
    texto: "Opcional. Entra só nas telas pequenas, no lugar da arte do computador.",
    proporcao: "aspect-[1080/1350] max-w-[14rem]",
  },
];

export function ConfiguracaoSite({ secoes, arte }: { secoes: SecoesHome; arte: Arte }) {
  const router = useRouter();
  const [estado, setEstado] = useState(secoes);
  const [salvandoSecao, setSalvandoSecao] = useState<ChaveSecao | null>(null);
  const [ocupadoArte, setOcupadoArte] = useState<"desktop" | "celular" | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  // Quando o servidor manda valores novos (router.refresh), a cópia acompanha
  const [base, setBase] = useState(secoes);
  if (secoes !== base) {
    setBase(secoes);
    setEstado(secoes);
  }

  const ligadas = SECOES_HOME.filter((s) => estado[s.chave]).length;

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

  async function enviarArte(alvo: "desktop" | "celular", e: React.ChangeEvent<HTMLInputElement>) {
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
      setAviso(`Arte do ${alvo === "desktop" ? "computador" : "celular"} no ar.`);
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setOcupadoArte(null);
    }
  }

  async function removerArte(alvo: "desktop" | "celular") {
    const nome = alvo === "desktop" ? "computador" : "celular";
    const consequencia =
      alvo === "desktop"
        ? "\n\nSem a arte do computador, a dobra volta ao texto com os potes (a do celular, se houver, deixa de ser usada)."
        : "";
    if (!confirm(`Remover a arte do ${nome}?${consequencia}`)) return;
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
      setAviso(`Arte do ${nome} removida.`);
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
        descricao="O que aparece na página inicial e a arte que abre o site. Tudo vale na hora."
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

      {/* ---------- Arte da dobra ---------- */}
      <CartaoAdmin
        className="mt-4"
        titulo="Arte da dobra"
        apoio="Com a arte, a abertura do site vira a imagem inteira e só os três botões ficam por cima. Sem ela, o site mostra o texto e os potes."
        acao={<Selo tom={arte.desktop ? "ouro" : "cinza"}>{arte.desktop ? "Modo arte ligado" : "Dobra padrão"}</Selo>}
      >
        <div className="px-5 pb-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {TELAS.map((t) => {
            const url = arte[t.alvo];
            const ocupado = ocupadoArte === t.alvo;
            return (
              <div key={t.alvo} className="rounded-xl border border-fio p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{t.titulo}</p>
                    <p className="text-xs text-cinza mt-0.5">{t.medida}</p>
                  </div>
                  {url && <Selo tom="verde">No ar</Selo>}
                </div>

                <div className={`${t.proporcao} w-full rounded-lg overflow-hidden bg-gelo/70 border border-fio flex items-center justify-center`}>
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={`Arte da dobra, ${t.titulo.toLowerCase()}`} className="w-full h-full object-cover" />
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
                      onChange={(e) => enviarArte(t.alvo, e)}
                      disabled={ocupado}
                      className="sr-only"
                    />
                  </label>
                  {url && (
                    <BotaoAdmin tamanho="pequeno" variante="perigo" onClick={() => removerArte(t.alvo)} disabled={ocupado}>
                      Remover
                    </BotaoAdmin>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="px-5 pb-5 -mt-1 text-xs text-grafite-claro leading-relaxed">
          JPG, PNG ou WEBP até 8 MB. Deixe o centro da imagem mais calmo: é onde os botões ficam.
        </p>
      </CartaoAdmin>
    </div>
  );
}
