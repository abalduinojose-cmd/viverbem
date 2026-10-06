"use client";
// Catálogo do site: /produtos (tudo) e /produtos/[categoria].
//
// Estrutura no modelo da Formularis: as categorias no alto como caminho,
// a busca, e o conteúdo agrupado por área. O convite é sempre o mesmo,
// enviar a receita. Os chips de categoria são links, então cada categoria
// tem endereço próprio (dá para mandar o link de uma área inteira).
//
// Sistema "Branco, azul e ouro" (06/10/2026): abertura leve com o título
// em navy e a palavra-chave em ouro, chips do sistema, fichas de produto
// em ladrilhos e os títulos de área no tamanho padrão.

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CategoriaDTO, ProdutoDTO, ehIndustrializado } from "@/lib/tipos";
import { infoCategoria } from "@/lib/categorias";
import { combinaComTermos, normalizar, termosDaBusca } from "@/lib/texto";
import { ProdutoCard } from "./ProdutoCard";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";

// A busca que veio no endereço (?busca=). No site com servidor ela já
// chega pronta em buscaInicial; na vitrine estática quem lê é o navegador.
// No servidor não há endereço, então começa vazia e o navegador completa
// depois de hidratar, sem conflito entre os dois.
const semAssinatura = () => () => {};
function lerBuscaDoEndereco() {
  return new URLSearchParams(window.location.search).get("busca")?.slice(0, 60) ?? "";
}

// Fora do componente de propósito: declarada lá dentro, a grade seria
// recriada a cada letra digitada na busca e os cartões piscariam.
function Grade({ lista, comCategoria = true }: { lista: ProdutoDTO[]; comCategoria?: boolean }) {
  if (lista.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-xl font-semibold text-navy">Nada encontrado</p>
        <p className="text-cinza mt-1">
          Tente outra palavra, ou envie a sua receita que a gente confere para você.
        </p>
      </div>
    );
  }
  return (
    <div className="escalonado grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
      {lista.map((p) => (
        <ProdutoCard key={p.id} produto={p} mostrarCategoria={comCategoria} />
      ))}
    </div>
  );
}

/** Nome da área com a última parte em ouro ("Dermatologia & Estética") */
function TituloArea({ nome }: { nome: string }) {
  const e = nome.indexOf(" & ");
  if (e > 0) {
    return (
      <>
        {nome.slice(0, e)} <span className="italic">&amp; {nome.slice(e + 3)}</span>
      </>
    );
  }
  return <>{nome}</>;
}

export function CatalogoClient({
  categorias,
  produtos,
  categoriaAtiva = null,
  buscaInicial = "",
}: {
  categorias: CategoriaDTO[];
  /** Na página de categoria, já vem só a categoria */
  produtos: ProdutoDTO[];
  categoriaAtiva?: CategoriaDTO | null;
  buscaInicial?: string;
}) {
  const buscaDoEndereco = useSyncExternalStore(semAssinatura, lerBuscaDoEndereco, () => "");
  // null = a pessoa ainda não digitou: vale a busca que veio no endereço
  const [digitada, setBusca] = useState<string | null>(null);
  const busca = digitada ?? (buscaInicial || buscaDoEndereco);
  // Palavras sem acento: "omega 3" precisa achar "Ômega 3 Viver Bem"
  const termos = useMemo(() => termosDaBusca(busca), [busca]);
  const buscando = termos.length > 0;

  const resultadoBusca = useMemo(() => {
    if (termos.length === 0) return [];
    return produtos.filter((p) => {
      // O campo diz "nome ou ativo", então a composição também entra,
      // junto da categoria (quem busca "cabelo" espera a área toda)
      const alvo = normalizar(
        [p.nome, p.descricao, p.categoriaNome ?? "", p.composicao ?? "", p.indicacoes ?? ""].join(" ")
      );
      return combinaComTermos(alvo, termos);
    });
  }, [termos, produtos]);

  const industrializados = useMemo(() => produtos.filter(ehIndustrializado), [produtos]);

  // Só as categorias que têm algo para mostrar
  const categoriasComItens = useMemo(
    () => categorias.filter((c) => produtos.some((p) => p.categoriaId === c.id)),
    [categorias, produtos]
  );

  const apoio = categoriaAtiva
    ? infoCategoria(categoriaAtiva.slug).descricao
    : "Fórmulas preparadas a partir da receita, separadas por área.";

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* ---------- Abertura ---------- */}
      <div className="halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-cinza min-h-10" aria-label="Você está em">
            <Link href="/" className="inline-flex items-center min-h-10 hover:text-tinta transition-colors">Início</Link>
            <span aria-hidden="true" className="text-ouro">/</span>
            {categoriaAtiva ? (
              <>
                <Link href="/produtos" className="inline-flex items-center min-h-10 hover:text-tinta transition-colors">Categorias</Link>
                <span aria-hidden="true" className="text-ouro">/</span>
                <span className="text-navy">{categoriaAtiva.nome}</span>
              </>
            ) : (
              <span className="text-navy">Categorias</span>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-4">
            <div className="max-w-2xl">
              <p className="rotulo">{categoriaAtiva ? "categoria" : "categorias"}</p>
              <h1 className="titulo-secao vao-rotulo">
                {categoriaAtiva ? (
                  <TituloArea nome={categoriaAtiva.nome} />
                ) : (
                  <>
                    O que <span className="italic">manipulamos</span>
                  </>
                )}
              </h1>
              <p className="texto-apoio mt-4">{apoio}</p>
            </div>

            {/* O convite da página: a receita */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <p className="text-sm text-cinza leading-snug max-w-[14rem]">
                Tem a receita? O farmacêutico confere e passa o valor.
              </p>
              <BotaoEnviarReceita className="botao botao-principal botao-compacto !min-h-12 self-start" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Busca e categorias (grudam abaixo do cabeçalho) ---------- */}
      <div className="sticky top-[var(--altura-cabecalho)] z-40 bg-white/90 backdrop-blur-md border-y border-fio">
        <div className="px-5 md:px-8 pt-4 pb-3 max-w-7xl mx-auto w-full">
          <div className="relative max-w-2xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cinza"
              width="20"
              height="20"
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
              placeholder={categoriaAtiva ? `Buscar em ${categoriaAtiva.nome}...` : "Buscar por nome ou ativo..."}
              aria-label="Buscar"
              className="w-full bg-gelo/70 border border-fio rounded-full pl-11 pr-11 py-3 text-base text-grafite placeholder:text-grafite-claro focus:outline-none focus:ring-2 focus:ring-tinta/30 focus:border-tinta/40 focus:bg-white transition-colors"
            />
            {buscando && (
              <button
                type="button"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-cinza hover:text-navy w-9 h-9 flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <nav
          aria-label="Categorias"
          className="flex gap-2.5 overflow-x-auto rolagem-sem-barra px-5 md:px-8 pb-3.5 max-w-7xl mx-auto w-full"
        >
          <Link href="/produtos" className={`chip ${!categoriaAtiva ? "chip-ativo" : ""}`} aria-current={!categoriaAtiva ? "page" : undefined}>
            Todas
          </Link>
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/produtos/${c.slug}`}
              className={`chip ${categoriaAtiva?.id === c.id ? "chip-ativo" : ""}`}
              aria-current={categoriaAtiva?.id === c.id ? "page" : undefined}
            >
              {c.nome}
            </Link>
          ))}
        </nav>
      </div>

      {/* ---------- Conteúdo ---------- */}
      <main className="flex-1 px-5 md:px-8 py-10 pb-24 max-w-7xl mx-auto w-full">
        {buscando ? (
          <>
            <h2 className="text-2xl font-semibold text-navy mb-6 tracking-[-0.03em]">
              {resultadoBusca.length} {resultadoBusca.length === 1 ? "resultado" : "resultados"} para “
              {busca.trim()}”
            </h2>
            {resultadoBusca.length > 0 ? (
              <Grade lista={resultadoBusca} />
            ) : (
              /* Sem resultado a página ficava vazia, sem dizer o que fazer */
              <div className="ladrilho p-8 md:p-10 text-center">
                <p className="text-navy text-lg font-medium">
                  Não encontramos nada com esse nome no site.
                </p>
                <p className="text-cinza mt-2">
                  A farmácia manipula conforme a receita, então nem toda fórmula está no catálogo.
                  Envie a foto da prescrição e o farmacêutico confere.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <BotaoEnviarReceita className="botao botao-principal" />
                  <Link href="/produtos" className="botao botao-secundario">
                    Ver tudo
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : categoriaAtiva ? (
          <Grade lista={produtos} comCategoria={false} />
        ) : (
          <div className="flex flex-col gap-16">
            {/* Industrializados com registro */}
            {industrializados.length > 0 && (
              <section>
                <div className="mb-6">
                  <p className="rotulo">com registro na Anvisa</p>
                  <h2 className="text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-[1.06] mt-2">
                    Pronta <span className="italic">entrega</span>
                  </h2>
                </div>
                <Grade lista={industrializados} />
              </section>
            )}

            {categoriasComItens.map((c) => (
              <section key={c.id}>
                <div className="flex items-end justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <h2 className="text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-[1.06]">
                      <TituloArea nome={c.nome} />
                    </h2>
                    <p className="text-cinza text-sm md:text-base mt-1.5">{infoCategoria(c.slug).descricao}</p>
                  </div>
                  <Link href={`/produtos/${c.slug}`} className="botao botao-secundario botao-compacto shrink-0 hidden sm:inline-flex">
                    Ver categoria
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
                {/* A seção já leva o nome da categoria: não repetir no cartão */}
                <Grade lista={produtos.filter((p) => p.categoriaId === c.id)} comCategoria={false} />
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
