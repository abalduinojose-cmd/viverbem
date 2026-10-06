// Página exclusiva de cada produto.
//
// Desde 05/10/2026 (pedido do cliente) nenhum produto mostra preço e todos
// vão para o carrinho; o farmacêutico confere o pedido e passa o valor
// pelo WhatsApp. "Enviar receita" continua como segunda opção.
//   - MANIPULADO: não mostra dosagem, indicação, modo de uso nem
//     apresentação (RDC 67/2007, item 5.14; RE nº 3.547/2026).
//   - INDUSTRIALIZADO com registro: os detalhes ficam em sanfonas.
//
// Sistema "Branco, azul e ouro" (06/10/2026): a foto sobre um ladrilho
// com a luz dourada, o título em navy, "Como pedir" em três linhas com fio
// e a receita como link.
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
    <details className="group border-b border-fio py-1.5">
      <summary className="flex items-center justify-between gap-4 min-h-12 cursor-pointer list-none font-medium text-navy marker:content-['']">
        {titulo}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-ouro transition-transform group-open:rotate-180"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      {temLista ? (
        <ul className="mb-3 flex flex-col gap-2">
          {itens.map((i) => (
            <li key={i} className="flex items-start gap-2.5 text-cinza leading-relaxed">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-ouro mt-2.5" aria-hidden="true" />
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-3 text-cinza leading-relaxed whitespace-pre-line">{texto}</p>
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
    <main className="flex-1">
      {/* Trilha de navegação */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-7">
        <nav className="flex items-center gap-2 text-sm text-cinza min-h-10" aria-label="Você está em">
          <Link href="/" className="inline-flex items-center min-h-10 hover:text-tinta transition-colors">Início</Link>
          <span aria-hidden="true" className="text-ouro">/</span>
          <Link href={hrefCategoria} className="inline-flex items-center min-h-10 hover:text-tinta transition-colors truncate max-w-[9rem] md:max-w-none">
            {categoria?.nome ?? "Categorias"}
          </Link>
          <span aria-hidden="true" className="text-ouro">/</span>
          <span className="text-navy truncate max-w-[10rem] md:max-w-none">{produto.nome}</span>
        </nav>
      </div>

      {/* Produto */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-6 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {/* Imagem, sobre o ladrilho com a luz dourada */}
          <div className="ladrilho ladrilho-luz relative flex items-end justify-center min-h-[20rem] md:min-h-[32rem] p-10 md:p-14 md:self-start">
            <span
              aria-hidden="true"
              className="absolute inset-x-[15%] bottom-8 h-16 bg-[radial-gradient(50%_60%_at_50%_60%,rgba(192,160,96,0.4),transparent_70%)]"
            />
            <FotoProduto
              fotoUrl={produto.fotoUrl}
              nome={produto.nome}
              className="relative max-w-full max-h-[24rem] !object-contain drop-shadow-[0_28px_26px_rgba(16,42,74,0.25)]"
              prioritaria
            />
          </div>

          {/* Texto e ação */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {produto.categoriaNome && (
                <Link href={hrefCategoria} className="chip !min-h-9 !px-3.5 rotulo !text-tinta text-[0.62rem]">
                  {produto.categoriaNome}
                </Link>
              )}
              {industrializado && produto.apresentacao && (
                <span className="chip !min-h-9 !px-3.5 rotulo !text-cinza text-[0.62rem]">{produto.apresentacao}</span>
              )}
            </div>

            <h1 className="text-[2.25rem] md:text-[2.9rem] font-semibold tracking-[-0.04em] text-navy leading-[1.05] mt-5">
              {produto.nome}
            </h1>
            <p className="texto-apoio mt-4">{produto.descricao}</p>

            <AcoesProduto produto={produto} />

            {industrializado && (
              <div className="mt-7 border-t border-fio">
                <Sanfona titulo="Indicações" itens={listarItens(produto.indicacoes)} />
                <Sanfona titulo="Composição" itens={listarItens(produto.composicao)} />
                <Sanfona titulo="Modo de uso" texto={produto.modoUso} />
              </div>
            )}

            {/* Como o pedido anda, em três linhas com fio */}
            <div className="mt-8">
              <p className="rotulo !text-cinza">Como pedir</p>
              <ol className="lista-fichas mt-3">
                {PASSOS_PEDIDO.map((passo, i) => (
                  <li key={passo} className="flex items-baseline gap-4 py-3 text-grafite leading-snug">
                    <span className="numero-tinta text-xl shrink-0 w-7">{String(i + 1).padStart(2, "0")}</span>
                    {passo}
                  </li>
                ))}
              </ol>
              <BotaoEnviarReceita produtoVisto={produto.nome} className="botao-link mt-5" comIcone={false}>
                Tenho receita: enviar a foto
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </BotaoEnviarReceita>
            </div>

            <p className="text-grafite-claro text-sm mt-6 leading-relaxed">
              O farmacêutico confere o seu pedido e passa o valor pelo WhatsApp. Se a
              fórmula precisar de receita, ele pede a foto da prescrição.{" "}
              <Link href="/sobre#como-funciona" className="text-tinta font-medium hover:underline">
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
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-4 pb-16 border-t border-fio">
          <div className="flex items-end justify-between gap-4 mt-10 mb-6">
            <div>
              <p className="rotulo">da mesma área</p>
              <h2 className="text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-[1.06] mt-2">
                Mais em <span className="italic">{categoria?.nome ?? "nossas categorias"}</span>
              </h2>
            </div>
            <Link href={hrefCategoria} className="botao botao-secundario botao-compacto shrink-0 hidden sm:inline-flex">
              Ver categoria
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <FaixaProdutos produtos={relacionados} comCategoria={false} />
        </section>
      )}
    </main>
  );
}
