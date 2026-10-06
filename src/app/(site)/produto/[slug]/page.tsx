// Página exclusiva de cada produto.
//
// Desde 05/10/2026 (pedido do cliente) nenhum produto mostra preço e todos
// vão para o carrinho; o farmacêutico confere o pedido e passa o valor
// pelo WhatsApp. "Enviar receita" continua como segunda opção.
//   - MANIPULADO: não mostra dosagem, indicação, modo de uso nem
//     apresentação (RDC 67/2007, item 5.14; RE nº 3.547/2026).
//   - INDUSTRIALIZADO com registro: os detalhes ficam em sanfonas.
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { listarItens, ehIndustrializado } from "@/lib/tipos";
import { FotoProduto } from "@/components/site/FotoProduto";
import { AcoesProduto } from "@/components/site/AcoesProduto";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { VistosRecentemente } from "@/components/site/VistosRecentemente";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";

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
    <details className="group border-b border-linha py-1.5">
      <summary className="flex items-center justify-between gap-4 min-h-12 cursor-pointer list-none font-semibold text-grafite marker:content-['']">
        {titulo}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-grafite-claro transition-transform group-open:rotate-180"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      {temLista ? (
        <ul className="mb-3 flex flex-col gap-2">
          {itens.map((i) => (
            <li key={i} className="flex items-start gap-2.5 text-grafite-medio leading-relaxed">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-escarlate mt-2.5" aria-hidden="true" />
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-3 text-grafite-medio leading-relaxed whitespace-pre-line">{texto}</p>
      )}
    </details>
  );
}

// Como o pedido chega até a pessoa, em três linhas de processo
const PASSOS_PEDIDO = [
  "Adicione ao carrinho e envie o pedido pelo WhatsApp",
  "O farmacêutico confere e passa o valor e o prazo",
  "Retire numa das 3 lojas ou receba em casa, de moto",
];

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params;
  const { produtos, categorias } = await obterCatalogo();
  const produto = produtos.find((p) => p.slug === slug);
  if (!produto) notFound();

  const industrializado = ehIndustrializado(produto);
  const categoria = categorias.find((c) => c.id === produto.categoriaId) ?? null;
  const hrefCategoria = categoria ? `/produtos/${categoria.slug}` : "/produtos";

  const relacionados = produtos
    .filter((p) => p.categoriaId === produto.categoriaId && p.id !== produto.id)
    .slice(0, 8);

  return (
    <main className="flex-1 pt-16 md:pt-[4.5rem] bg-white">
      {/* Trilha de navegação */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-7">
        <nav className="flex items-center gap-2 text-sm text-grafite-claro min-h-10" aria-label="Você está em">
          <Link href="/" className="inline-flex items-center min-h-10 hover:text-royal transition-colors">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href={hrefCategoria} className="inline-flex items-center min-h-10 hover:text-royal transition-colors truncate max-w-[9rem] md:max-w-none">
            {categoria?.nome ?? "Categorias"}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-grafite-medio truncate max-w-[10rem] md:max-w-none">{produto.nome}</span>
        </nav>
      </div>

      {/* Produto */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {/* Imagem */}
          <div className="relative bg-royal-nevoa rounded-[2rem] border border-linha flex items-center justify-center min-h-[18rem] md:min-h-[30rem] p-10 md:p-14 md:self-start overflow-hidden">
            {industrializado && produto.novidade && (
              <span className="absolute top-6 left-6 bg-escarlate text-white text-[0.65rem] font-semibold tracking-wide px-3 py-1.5 rounded-full">
                NOVIDADE
              </span>
            )}
            <FotoProduto
              fotoUrl={produto.fotoUrl}
              nome={produto.nome}
              className="max-w-full max-h-[24rem] !object-contain"
              prioritaria
            />
          </div>

          {/* Texto e ação */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {produto.categoriaNome && (
                <Link
                  href={hrefCategoria}
                  className="inline-flex items-center min-h-10 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-royal bg-royal-claro hover:bg-royal hover:text-white px-3.5 rounded-full transition-colors"
                >
                  {produto.categoriaNome}
                </Link>
              )}
              {industrializado && produto.apresentacao && (
                <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-grafite-medio bg-royal-nevoa border border-linha px-3 py-1.5 rounded-full">
                  {produto.apresentacao}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-[2.7rem] font-semibold text-grafite leading-[1.1] mt-5">
              {produto.nome}
            </h1>
            <p className="text-grafite-medio text-base md:text-lg mt-4 leading-relaxed">
              {produto.descricao}
            </p>

            <AcoesProduto produto={produto} />

            {industrializado && (
              <div className="mt-7 border-t border-linha">
                <Sanfona titulo="Indicações" itens={listarItens(produto.indicacoes)} />
                <Sanfona titulo="Composição" itens={listarItens(produto.composicao)} />
                <Sanfona titulo="Modo de uso" texto={produto.modoUso} />
              </div>
            )}

            {/* Como o pedido anda, e a receita como segunda opção */}
            <div className="mt-8 bg-royal-nevoa border border-linha rounded-[1.75rem] p-5 md:p-6">
              <p className="font-semibold text-grafite">Como pedir</p>
              <ol className="flex flex-col gap-3 mt-4">
                {PASSOS_PEDIDO.map((passo, i) => (
                  <li key={passo} className="flex items-start gap-3 text-grafite-medio leading-snug">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-white border border-linha text-royal text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {passo}
                  </li>
                ))}
              </ol>
              <BotaoEnviarReceita
                produtoVisto={produto.nome}
                className="w-full mt-6 flex items-center justify-center gap-2.5 bg-white border border-linha hover:border-royal/40 text-royal font-semibold rounded-2xl px-6 py-3.5 active:scale-[0.98] transition"
              >
                Tenho receita: enviar a foto
              </BotaoEnviarReceita>
            </div>

            <p className="text-grafite-claro text-sm mt-5 leading-relaxed">
              O farmacêutico confere o seu pedido e passa o valor pelo WhatsApp. Se a
              fórmula precisar de receita, ele pede a foto da prescrição.{" "}
              <Link href="/sobre#como-funciona" className="text-royal font-medium hover:underline">
                Entenda como funciona
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* O que a pessoa já abriu no site, para retomar de onde parou */}
      <VistosRecentemente slugAtual={produto.slug} catalogo={produtos} />

      {/* Da mesma área */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-14 border-t border-linha">
          <div className="flex items-end justify-between gap-4 mt-10 mb-6">
            <div>
              <p className="selo-secao flex items-center gap-3 text-escarlate">
                <span aria-hidden="true" className="h-px w-9 bg-escarlate/40" />
                da mesma área
              </p>
              <h2 className="font-display text-[1.7rem] md:text-[2.3rem] font-extrabold tracking-[-0.035em] text-grafite leading-[1.06] mt-2">
                Mais em {categoria?.nome ?? "nossas categorias"}
              </h2>
            </div>
            <Link
              href={hrefCategoria}
              className="group shrink-0 hidden sm:inline-flex items-center gap-2.5 rounded-full border border-linha py-1.5 pl-4 pr-1.5 text-sm font-semibold text-grafite transition-colors hover:border-royal/40"
            >
              Ver categoria
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-claro text-royal transition duration-300 group-hover:bg-royal group-hover:text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
          <FaixaProdutos produtos={relacionados} comCategoria={false} />
        </section>
      )}
    </main>
  );
}
