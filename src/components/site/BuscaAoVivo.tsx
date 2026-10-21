"use client";
// A busca do cabeçalho, ao vivo (21/10/2026, "quero que ative a pesquisa
// quando eu colocar uma letra ou palavra ali"). A cada letra, uma lista
// com até seis produtos aparece embaixo do campo (foto, nome e área), com
// a linha "Ver todos os N resultados" que leva à página de resultados. O
// Enter sem nada escolhido continua indo para /produtos?busca=; as setas
// andam pela lista, Enter abre o produto escolhido, Esc fecha, clique fora
// fecha. O índice vem pronto do servidor (lib/indiceBusca.ts), então nada
// é pedido ao servidor enquanto se digita, e funciona na prévia estática.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import { procurarNoIndice, type ItemDoIndice } from "@/lib/indiceBusca";

const EH_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

function IconeLupa() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** O trecho do nome que casa com a busca, em negrito navy */
function NomeComDestaque({ nome, busca }: { nome: string; busca: string }) {
  const n = nome.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const b = busca.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const i = b ? n.indexOf(b) : -1;
  if (i < 0) return <>{nome}</>;
  return (
    <>
      {nome.slice(0, i)}
      <mark className="bg-transparent font-semibold text-navy">{nome.slice(i, i + b.length)}</mark>
      {nome.slice(i + b.length)}
    </>
  );
}

export function BuscaAoVivo({
  indice,
  termoInicial = "",
  autoFoco = false,
  aoFechar,
}: {
  indice: ItemDoIndice[];
  termoInicial?: string;
  autoFoco?: boolean;
  /** Chamado quando a pessoa escolhe algo (fecha a busca do celular) */
  aoFechar?: () => void;
}) {
  const router = useRouter();
  const idLista = useId();
  const raiz = useRef<HTMLFormElement>(null);
  const [termo, setTermo] = useState(termoInicial);
  const [aberta, setAberta] = useState(false);
  const [marcado, setMarcado] = useState(-1);

  const resultado = useMemo(() => procurarNoIndice(indice, termo), [indice, termo]);
  const mostrar = aberta && termo.trim().length > 0;

  // Clique fora fecha
  useEffect(() => {
    if (!mostrar) return;
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberta(false);
    };
    document.addEventListener("pointerdown", fora);
    return () => document.removeEventListener("pointerdown", fora);
  }, [mostrar]);

  const irParaResultados = () => {
    setAberta(false);
    aoFechar?.();
    const destino = `/produtos${termo.trim() ? `?busca=${encodeURIComponent(termo.trim())}` : ""}`;
    if (EH_DEMO) window.location.href = asset(`/produtos/${termo.trim() ? `?busca=${encodeURIComponent(termo.trim())}` : ""}`);
    else router.push(destino);
  };

  const abrirProduto = (slug: string) => {
    setAberta(false);
    aoFechar?.();
    if (EH_DEMO) window.location.href = asset(`/produto/${slug}/`);
    else router.push(`/produto/${slug}`);
  };

  const aoTeclar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!mostrar) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMarcado((m) => Math.min(resultado.itens.length - 1, m + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMarcado((m) => Math.max(-1, m - 1));
    } else if (e.key === "Escape") {
      setAberta(false);
    } else if (e.key === "Enter" && marcado >= 0 && resultado.itens[marcado]) {
      e.preventDefault();
      abrirProduto(resultado.itens[marcado].slug);
    }
  };

  return (
    <form
      ref={raiz}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        irParaResultados();
      }}
      className="group/busca relative w-full"
    >
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute left-1.5 top-1/2 z-[1] -translate-y-1/2 size-9 rounded-full flex items-center justify-center text-cinza transition-colors hover:text-navy hover:bg-white focus-visible:text-navy"
      >
        <IconeLupa />
      </button>
      <input
        type="search"
        name="busca"
        value={termo}
        onChange={(e) => {
          setTermo(e.target.value);
          setAberta(true);
          setMarcado(-1);
        }}
        onFocus={() => setAberta(true)}
        onKeyDown={aoTeclar}
        autoFocus={autoFoco}
        autoComplete="off"
        maxLength={60}
        role="combobox"
        aria-expanded={mostrar}
        aria-controls={idLista}
        aria-autocomplete="list"
        aria-activedescendant={marcado >= 0 ? `${idLista}-${marcado}` : undefined}
        placeholder="O que você procura? Nome ou ativo"
        aria-label="Buscar no site"
        className="w-full bg-gelo/70 border border-fio rounded-full pl-12 pr-4 md:pr-28 h-12 text-[0.95rem] text-grafite placeholder:text-grafite-suave focus:outline-none focus:ring-2 focus:ring-tinta/30 focus:border-tinta/40 focus:bg-white transition-colors"
      />
      <button
        type="submit"
        className="hidden md:inline-flex absolute right-1.5 top-1/2 -translate-y-1/2 h-9 items-center gap-1.5 rounded-full bg-navy px-4 text-[0.82rem] font-semibold text-white shadow-[0_8px_16px_-10px_rgba(13,35,64,0.6)] transition-colors hover:bg-tinta active:scale-[0.97]"
      >
        Buscar
      </button>

      {/* Os resultados, embaixo do campo */}
      {mostrar && (
        <div
          id={idLista}
          role="listbox"
          aria-label="Resultados da busca"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-fio shadow-[0_30px_60px_-24px_rgba(13,35,64,0.45)] animar-surgir"
        >
          {resultado.itens.length === 0 ? (
            <div className="px-5 py-5 text-sm text-cinza">
              Nada com <b className="text-navy">“{termo.trim()}”</b>. Tente outra palavra, ou{" "}
              <button type="button" onClick={irParaResultados} className="font-semibold text-tinta hover:underline">
                veja o catálogo
              </button>
              .
            </div>
          ) : (
            <>
              <ul className="py-1.5">
                {resultado.itens.map((p, i) => (
                  <li key={p.slug} role="option" id={`${idLista}-${i}`} aria-selected={i === marcado}>
                    <Link
                      href={`/produto/${p.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        abrirProduto(p.slug);
                      }}
                      onMouseEnter={() => setMarcado(i)}
                      className={`flex items-center gap-3 px-3 py-2 mx-1.5 rounded-xl transition-colors ${i === marcado ? "bg-gelo/80" : "hover:bg-nevoa"}`}
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gelo/70 p-1">
                        {p.fotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={asset(p.fotoUrl)} alt="" width={44} height={44} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="size-2 rounded-full bg-fio" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[0.95rem] text-grafite">
                          <NomeComDestaque nome={p.nome} busca={termo} />
                        </span>
                        {p.categoria && <span className="block truncate text-xs text-cinza">{p.categoria}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={irParaResultados}
                className="flex w-full items-center justify-between border-t border-fio px-5 py-3 text-sm font-semibold text-tinta transition-colors hover:bg-nevoa"
              >
                Ver {resultado.total === 1 ? "o resultado" : `todos os ${resultado.total} resultados`}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}
