// Página exclusiva de cada produto.
//
// Desde 05/10/2026 (pedido do cliente) nenhum produto mostra preço e todos
// vão para o carrinho; o farmacêutico confere o pedido e passa o valor
// pelo WhatsApp. "Enviar receita" continua como segunda opção.
//   - MANIPULADO: não mostra dosagem, indicação, modo de uso nem
//     apresentação (RDC 67/2007, item 5.14; RE nº 3.547/2026).
//   - INDUSTRIALIZADO com registro: os detalhes ficam em sanfonas.
//
// Sistema "Branco, azul e ouro" (06/10/2026; modernizada à noite, a
// pedido): a foto sobre o ladrilho com a luz dourada e os selos de
// logística embaixo; à direita a pílula da área em ouro, o nome grande, a
// frase em itálico serifado (a segunda voz do site), a descrição, o cartão
// de compra (AcoesProduto) e "Como pedir" num cartão claro com os três
// passos numerados em ouro, divididos por fios (07/10/2026: a trilha com
// círculos e linha saiu, no celular e no computador).
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { listarItens, ehIndustrializado, precoVisivel, UNIDADES } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { GaleriaProduto } from "@/components/site/GaleriaProduto";
import { AcoesProduto } from "@/components/site/AcoesProduto";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { BotaoVerMais } from "@/components/site/BotaoVerMais";
import { ColunaLateralProduto } from "@/components/site/ColunaLateralProduto";
import { BotaoEnviarReceita, IconeReceita } from "@/components/site/BotaoEnviarReceita";
import { IconeMoto } from "@/components/site/IconeMoto";
import { IconeLoja } from "@/components/site/IconesVantagens";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// Miniatura e título ao compartilhar o link (WhatsApp, Instagram, Google)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { produtos } = await obterCatalogo();
  const produto = produtos.find((p) => p.slug === slug);
  if (!produto) return { title: "Produto não encontrado" };

  const titulo = `${produto.nome} · Manipulação Viver Bem`;
  const descricao = produto.descricao;
  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: "website",
      images: produto.fotoUrl ? [{ url: produto.fotoUrl }] : undefined,
    },
  };
}

// Na vitrine estática (GitHub Pages) todas as páginas de produto são
// geradas de uma vez a partir do retrato do banco.
export async function generateStaticParams() {
  if (process.env.DEMO !== "1") return [];
  const { produtos } = await obterCatalogo();
  return produtos.map((p) => ({ slug: p.slug }));
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ouro shrink-0">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Sanfona de detalhe: fechada por padrão, abre no clique. Sem
// JavaScript, é o <details> nativo do navegador.
function Sanfona({
  titulo,
  itens,
  texto,
}: {
  titulo: string;
  itens?: string[];
  texto?: string | null;
}) {
  const temLista = itens && itens.length > 0;
  if (!temLista && !texto) return null;

  return (
    <details className="group rounded-2xl border border-fio bg-white open:bg-gelo/40 transition-colors">
      <summary className="flex items-center justify-between gap-4 min-h-14 px-5 cursor-pointer list-none font-semibold text-navy marker:content-['']">
        {titulo}
        <span className="shrink-0 w-8 h-8 rounded-full bg-gelo text-ouro flex items-center justify-center transition-transform group-open:rotate-180">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>

      <div className="px-5 pb-5">
        {temLista ? (
          <ul className="flex flex-col gap-2">
            {itens.map((i) => (
              <li key={i} className="flex items-start gap-2.5 text-cinza leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-ouro mt-2.5" aria-hidden="true" />
                {i}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-cinza leading-relaxed whitespace-pre-line">{texto}</p>
        )}
      </div>
    </details>
  );
}

// Como o pedido chega até a pessoa, em três passos de processo
const PASSOS_PEDIDO = [
  { titulo: "Adicione ao carrinho", texto: "e envie o pedido pelo WhatsApp." },
  { titulo: "O farmacêutico confere", texto: "e passa o valor e o prazo." },
  { titulo: "Retire ou receba", texto: `Numa das ${UNIDADES.length} lojas, sem taxa, ou em casa, de moto.` },
];

// Selos de logística, embaixo da foto: só o que dá para comprovar
const SELOS = [
  { icone: <IconeMoto tamanho={16} />, titulo: "Delivery", texto: "por toda Petrópolis" },
  { icone: <IconeLoja tamanho={15} />, titulo: "Retirada sem taxa", texto: `em ${UNIDADES.length} lojas` },
  { icone: <IconeReceita tamanho={15} />, titulo: "Receita conferida", texto: "pelo farmacêutico" },
];

// Os selos, em linha de três. Quem chama diz onde aparecem (display):
// "hidden lg:grid" sob a foto no computador, "grid lg:hidden" depois do
// cartão de compra no celular.
function Selos({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid-cols-1 sm:grid-cols-3 gap-2 ${className}`}>
      {SELOS.map((s) => (
        <li
          key={s.titulo}
          className="flex items-center gap-2 rounded-2xl border border-fio bg-white px-3 py-2.5 text-[0.78rem] text-cinza whitespace-nowrap"
        >
          <span className="shrink-0 w-7 h-7 rounded-full bg-ouro/10 text-ouro-escuro flex items-center justify-center">
            {s.icone}
          </span>
          <span className="leading-tight">
            <b className="block font-semibold text-navy text-[0.82rem]">{s.titulo}</b>
            {s.texto}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params;
  const { produtos, categorias } = await obterCatalogo();
  const produto = produtos.find((p) => p.slug === slug);
  if (!produto) notFound();

  const industrializado = ehIndustrializado(produto);
  // Só industrializado com a chave "Preço no site" ligada no painel
  const preco = precoVisivel(produto);
  const categoria = categorias.find((c) => c.id === produto.categoriaId) ?? null;
  const hrefCategoria = categoria ? `/produtos/${categoria.slug}` : "/produtos";

  const relacionados = produtos
    .filter((p) => p.categoriaId === produto.categoriaId && p.id !== produto.id)
    .slice(0, 8);

  // Para a coluna lateral: os primeiros do catálogo com foto real, sem este
  const maisProcurados = produtos
    .filter((p) => p.id !== produto.id && p.fotoUrl && !p.fotoUrl.toLowerCase().endsWith(".svg"))
    .slice(0, 4);

  return (
    <main className="flex-1">
      {/* Trilha de navegação */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-5 md:px-8 pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-cinza min-h-10" aria-label="Você está em">
          <Link href="/" className="inline-flex items-center min-h-11 hover:text-tinta transition-colors">
            Início
          </Link>
          <Chevron />
          <Link
            href={hrefCategoria}
            className="inline-flex items-center min-h-11 hover:text-tinta transition-colors truncate max-w-[9rem] md:max-w-none"
          >
            {categoria?.nome ?? "Categorias"}
          </Link>
          <Chevron />
          <span className="text-navy font-medium truncate max-w-[10rem] md:max-w-none">{produto.nome}</span>
        </nav>
      </div>

      {/* Produto */}
      <section className="max-w-6xl xl:max-w-7xl mx-auto px-5 md:px-8 pt-4 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1fr_1fr_18rem] gap-8 lg:gap-10 items-start">
          {/* ---------- Foto e selos ---------- */}
          <div className="lg:sticky lg:top-[calc(var(--altura-cabecalho)+1.5rem)]">
            {/* A galeria: até 5 fotos, a primeira com prioridade */}
            <GaleriaProduto fotos={produto.fotos} nome={produto.nome} novidade={industrializado && produto.novidade} />

            <Selos className="hidden lg:grid mt-4" />
          </div>

          {/* ---------- Texto e ação ---------- */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {produto.categoriaNome && (
                <Link
                  href={hrefCategoria}
                  className="inline-flex items-center gap-2 h-11 pl-3 pr-4 rounded-full bg-white border border-ouro/40 text-ouro-escuro text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-ouro hover:bg-ouro/5"
                >
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
                  {produto.categoriaNome}
                </Link>
              )}
              {industrializado && produto.apresentacao && (
                <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-gelo text-cinza text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
                  {produto.apresentacao}
                </span>
              )}
            </div>

            <h1 className="mt-5 text-[2.4rem] md:text-[3.25rem] font-semibold tracking-[-0.045em] text-navy leading-[1]">
              {produto.nome}
            </h1>
            {/* A segunda voz: a frase em itálico serifado, em ouro */}
            <p className="tinta mt-3 text-[1.5rem] md:text-[1.75rem] leading-tight">
              {industrializado ? "Pronta entrega nas lojas" : "Preparado a partir da sua receita"}
            </p>
            {preco !== null && (
              <p className="mt-4 text-[1.9rem] md:text-[2.2rem] font-semibold tracking-[-0.03em] text-navy tabular-nums leading-none">
                {formatarPreco(preco)}
              </p>
            )}
            <p className="texto-apoio mt-5 max-w-[34rem]">{produto.descricao}</p>

            <AcoesProduto produto={produto} />
            <Selos className="grid lg:hidden mt-5" />

            {industrializado && (
              <div className="mt-6 flex flex-col gap-2.5">
                <Sanfona titulo="Indicações" itens={listarItens(produto.indicacoes)} />
                <Sanfona titulo="Composição" itens={listarItens(produto.composicao)} />
                <Sanfona titulo="Modo de uso" texto={produto.modoUso} />
              </div>
            )}

            {/* Como o pedido anda: três passos numerados em ouro, num cartão
                claro com fios (07/10/2026, "melhore o print": a trilha com os
                círculos e a linha saiu, no celular e no computador) */}
            <div className="mt-9 rounded-[1.75rem] border border-fio bg-white p-5 md:p-6">
              <p className="rotulo-pilula !text-[0.64rem]">Como pedir</p>
              <ol className="mt-3 lista-fichas">
                {PASSOS_PEDIDO.map((p, i) => (
                  <li key={p.titulo} className="flex items-start gap-4 py-3.5">
                    <span aria-hidden="true" className="numero-tinta shrink-0 w-9 text-[1.5rem] leading-none pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-navy leading-snug">{p.titulo}</span>
                      <span className="mt-0.5 block text-cinza text-[0.95rem] leading-relaxed">{p.texto}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <BotaoEnviarReceita produtoVisto={produto.nome} className="botao-link mt-4" comIcone={false}>
                Tenho receita: enviar a foto
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </BotaoEnviarReceita>
            </div>

            <p className="text-cinza text-sm mt-6 leading-relaxed">
              O farmacêutico confere o seu pedido e passa o valor pelo WhatsApp. Se a
              fórmula precisar de receita, ele pede a foto da prescrição.{" "}
              <Link href="/sobre#como-funciona" className="text-tinta font-medium hover:underline">
                Entenda como funciona
              </Link>
              .
            </p>
          </div>

          {/* Coluna lateral (computador largo): mais procurados e o que a pessoa já viu */}
          <ColunaLateralProduto
            slugAtual={produto.slug}
            catalogo={produtos}
            maisProcurados={maisProcurados}
            className="hidden xl:flex xl:flex-col xl:gap-5 xl:sticky xl:top-[calc(var(--altura-cabecalho)+1.5rem)]"
          />
        </div>
      </section>

      {/* Abaixo do xl, os mesmos dois blocos, lado a lado */}
      <section className="xl:hidden max-w-6xl xl:max-w-7xl mx-auto px-5 md:px-8 pb-6">
        <ColunaLateralProduto
          slugAtual={produto.slug}
          catalogo={produtos}
          maisProcurados={maisProcurados}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        />
      </section>

      {/* Da mesma área */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl xl:max-w-7xl mx-auto px-5 md:px-8 pt-4 pb-16 border-t border-fio">
          <div className="flex items-end justify-between gap-4 mt-10 mb-6">
            <div>
              <p className="rotulo">da mesma área</p>
              <h2 className="titulo-bloco mt-2">
                Mais em <span className="italic">{categoria?.nome ?? "nossas categorias"}</span>
              </h2>
            </div>
            <span className="shrink-0 hidden sm:inline-flex">
              <BotaoVerMais href={hrefCategoria}>Ver categoria</BotaoVerMais>
            </span>
          </div>
          <FaixaProdutos produtos={relacionados} comCategoria={false} />
        </section>
      )}
    </main>
  );
}
