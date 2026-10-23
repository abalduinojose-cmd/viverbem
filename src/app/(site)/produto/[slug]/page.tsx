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
//
// 10/10/2026 ("deixe mais moderna e acerte os erros de enquadramento"; "os
// produtos já estão prontos, não precisa enfatizar a receita"): a galeria
// virou um ladrilho quadrado sem fio com o pote centrado (GaleriaProduto);
// a frase da segunda voz é "Pronta entrega nas lojas" para todos; saíram o
// selo "Receita conferida", o link "Tenho receita" e o parágrafo sobre a
// receita no fim: isso fica na seção Como funciona. "Como pedir" em gelo.
//
// 21/10/2026 ("tire a localização e horários, deixe com menos coisas";
// "os mais pedidos e você viu recentemente maior e um do lado do outro"):
// saíram a coluna presa ao lado do produto e o "Fale com a gente" do pé
// (as lojas com mapa e o horário, que não são desta página). Os selos
// Delivery/Retirada saíram e VOLTARAM no mesmo dia ("volte com o delivery
// e retirada na loja"), agora três, com "valor pelo WhatsApp", logo
// embaixo do cartão de compra em todas as telas.
// "Mais procurados" e "Você viu recentemente" ficam lado a lado, maiores,
// logo embaixo do produto, em todas as telas.
//
// 23/10/2026 ("quero a página do produto mais completa, como um marketplace
// famoso, tá muito simples"): no alto, a marca, o código do produto e o
// Compartilhar; embaixo do nome, a nota da FARMÁCIA no Google (é da loja,
// e está escrito assim: não há avaliação por produto); os selos do tipo
// (manipulado sob receita ou pronta entrega); o cartão de compra com o
// lugar do preço, o "Pedir agora pelo WhatsApp" e quem vende; os três selos
// de logística e uma linha de compra segura. Embaixo, ABAS como num
// marketplace: Descrição (com a ficha técnica), Como pedir, Entrega e
// retirada e Dúvidas. Manipulado continua sem preço, indicação, modo de
// uso e apresentação (RDC 67/2007): isso só aparece em industrializado.
import { notFound } from "next/navigation";
import { dadosDeMigalhas, dadosDoProduto } from "@/lib/seo";
import { DadosEstruturados } from "@/components/site/DadosEstruturados";
import Link from "next/link";
import type { Metadata } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { listarItens, ehIndustrializado, UNIDADES, AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL } from "@/lib/tipos";
import { GaleriaProduto } from "@/components/site/GaleriaProduto";
import { AcoesProduto } from "@/components/site/AcoesProduto";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { BotaoVerMais } from "@/components/site/BotaoVerMais";
import { ColunaLateralProduto } from "@/components/site/ColunaLateralProduto";
import { IconeMoto } from "@/components/site/IconeMoto";
import { IconeLoja } from "@/components/site/IconesVantagens";
import { IconeWhatsApp } from "@/components/site/icones";
import { Estrelas } from "@/components/site/Estrelas";
import { AbasProduto } from "@/components/site/produto/AbasProduto";
import { CompartilharProduto } from "@/components/site/produto/CompartilharProduto";
import { PERGUNTAS } from "@/components/site/PerguntasFrequentes";

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
    alternates: { canonical: `/produto/${produto.slug}` },
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

// Uma linha da ficha técnica (aba Descrição)
function LinhaFicha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr] gap-4 px-4 py-3 odd:bg-gelo/50">
      <dt className="text-sm text-cinza">{rotulo}</dt>
      <dd className="text-sm font-medium text-navy">{children}</dd>
    </div>
  );
}

// Uma lista de itens com o ponto de ouro (indicações, composição)
function ListaItens({ titulo, itens }: { titulo: string; itens: string[] }) {
  if (itens.length === 0) return null;
  return (
    <div>
      <h3 className="font-semibold text-navy">{titulo}</h3>
      <ul className="mt-2.5 flex flex-col gap-2">
        {itens.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-cinza leading-relaxed">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[image:var(--ouro-degrade)]" aria-hidden="true" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A linha de compra segura, embaixo dos selos
const SEGURANCA = ["Farmacêutico confere cada pedido", "Você só paga depois de confirmar", "Seus dados ficam com a farmácia (LGPD)"];

// Como o pedido chega até a pessoa, em três passos de processo
const PASSOS_PEDIDO = [
  { titulo: "Adicione ao carrinho", texto: "e envie o pedido pelo WhatsApp." },
  { titulo: "O farmacêutico confere", texto: "e passa o valor e o prazo." },
  { titulo: "Retire ou receba", texto: `Numa das ${UNIDADES.length} lojas, sem custo, ou em casa, pelo Delivery.` },
];

// Selos de logística, logo embaixo do cartão de compra: só o que dá para
// comprovar (voltaram em 21/10/2026, com o terceiro)
const SELOS = [
  { icone: <IconeMoto tamanho={16} />, titulo: "Delivery", texto: "Petrópolis e Região" },
  { icone: <IconeLoja tamanho={15} />, titulo: "Retirada grátis", texto: `em ${UNIDADES.length} lojas` },
  { icone: <IconeWhatsApp tamanho={15} />, titulo: "Valor pelo WhatsApp", texto: "em minutos, no horário das lojas" },
];

function Selos() {
  return (
    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {SELOS.map((s) => (
        <li key={s.titulo} className="flex items-center gap-2.5 rounded-2xl border border-fio bg-white px-3 py-2.5 text-[0.78rem] text-cinza">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ouro/10 text-ouro-escuro">{s.icone}</span>
          <span className="min-w-0 leading-tight">
            <b className="block text-[0.82rem] font-semibold text-navy">{s.titulo}</b>
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
  const categoria = categorias.find((c) => c.id === produto.categoriaId) ?? null;
  const hrefCategoria = categoria ? `/produtos/${categoria.slug}` : "/produtos";

  // O código do produto, como num marketplace (o número do cadastro)
  const codigo = `VB-${String(produto.id).padStart(4, "0")}`;

  const abaDescricao = (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-navy">Sobre o produto</h3>
          <p className="mt-2.5 text-cinza leading-relaxed">{produto.descricao}</p>
          {!industrializado && (
            <p className="mt-3 text-cinza leading-relaxed">
              É um produto manipulado: preparado no laboratório da Viver Bem a partir da receita, na fórmula e na quantidade que o
              profissional indicou. O farmacêutico confere a receita e passa o valor e o prazo antes de você confirmar.
            </p>
          )}
        </div>
        {industrializado && (
          <>
            <ListaItens titulo="Indicações" itens={listarItens(produto.indicacoes)} />
            <ListaItens titulo="Composição" itens={listarItens(produto.composicao)} />
            {produto.modoUso && (
              <div>
                <h3 className="font-semibold text-navy">Modo de uso</h3>
                <p className="mt-2.5 text-cinza leading-relaxed whitespace-pre-line">{produto.modoUso}</p>
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-navy">Ficha técnica</h3>
        <dl className="mt-2.5 overflow-hidden rounded-2xl ring-1 ring-inset ring-fio">
          <LinhaFicha rotulo="Produto">{produto.nome}</LinhaFicha>
          <LinhaFicha rotulo="Marca">Viver Bem</LinhaFicha>
          {produto.categoriaNome && <LinhaFicha rotulo="Categoria">{produto.categoriaNome}</LinhaFicha>}
          <LinhaFicha rotulo="Tipo">{industrializado ? "Industrializado, com registro" : "Manipulado sob receita"}</LinhaFicha>
          {industrializado && produto.apresentacao && <LinhaFicha rotulo="Apresentação">{produto.apresentacao}</LinhaFicha>}
          <LinhaFicha rotulo="Código">{codigo}</LinhaFicha>
          <LinhaFicha rotulo="Vendido por">Manipulação Viver Bem, Petrópolis/RJ</LinhaFicha>
        </dl>
      </div>
    </div>
  );

  const abaComoPedir = (
    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PASSOS_PEDIDO.map((p, i) => (
        <li key={p.titulo} className="rounded-[1.25rem] bg-white ring-1 ring-inset ring-fio p-5">
          <span aria-hidden="true" className="numero-tinta text-[1.8rem]">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-2 font-semibold text-navy leading-snug">{p.titulo}</p>
          <p className="mt-1 text-cinza text-[0.95rem] leading-relaxed">{p.texto}</p>
        </li>
      ))}
    </ol>
  );

  const abaEntrega = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-[1.25rem] bg-white ring-1 ring-inset ring-fio p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-ouro/10 text-ouro-escuro">
          <IconeMoto tamanho={20} />
        </span>
        <p className="mt-3 font-semibold text-navy">Delivery em Petrópolis e Região</p>
        <p className="mt-1 text-cinza text-[0.95rem] leading-relaxed">
          Entregamos em casa. A taxa e o prazo da entrega são combinados pelo WhatsApp, junto com o valor do pedido.
        </p>
      </div>
      <div className="rounded-[1.25rem] bg-white ring-1 ring-inset ring-fio p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-ouro/10 text-ouro-escuro">
          <IconeLoja tamanho={19} />
        </span>
        <p className="mt-3 font-semibold text-navy">Retirada grátis em {UNIDADES.length} lojas</p>
        <p className="mt-1 text-cinza text-[0.95rem] leading-relaxed">
          {UNIDADES.map((u) => u.bairro).join(", ").replace(/, ([^,]*)$/, " e $1")}. Você escolhe a loja na hora de enviar o pedido.
        </p>
        <Link href="/lojas" className="botao-link !min-h-10 !text-sm mt-2">
          Ver as lojas
          <Chevron />
        </Link>
      </div>
    </div>
  );

  const abaDuvidas = (
    <div className="max-w-3xl divide-y divide-fio border-y border-fio">
      {PERGUNTAS.map((q) => (
        <details key={q.pergunta} className="group py-1">
          <summary className="flex items-center justify-between gap-4 min-h-14 cursor-pointer list-none font-semibold text-navy marker:content-['']">
            {q.pergunta}
            <span aria-hidden="true" className="shrink-0 text-tinta transition-transform duration-300 group-open:rotate-45">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="pb-4 text-cinza leading-relaxed">{q.resposta}</p>
        </details>
      ))}
    </div>
  );

  const relacionados = produtos
    .filter((p) => p.categoriaId === produto.categoriaId && p.id !== produto.id)
    .slice(0, 8);

  // Para os blocos de baixo: os primeiros do catálogo com foto real, sem este
  const maisProcurados = produtos
    .filter((p) => p.id !== produto.id && p.fotoUrl && !p.fotoUrl.toLowerCase().endsWith(".svg"))
    .slice(0, 10);

  return (
    <main className="flex-1">
      {/* Para o Google: o produto e o caminho até ele (21/10/2026) */}
      <DadosEstruturados dados={dadosDoProduto(produto)} />
      <DadosEstruturados
        dados={dadosDeMigalhas([
          { nome: "Produtos", caminho: "/produtos" },
          ...(produto.categoriaNome && produto.categoriaId ? [{ nome: produto.categoriaNome, caminho: `/produtos/${categorias.find((c) => c.id === produto.categoriaId)?.slug ?? ""}` }] : []),
          { nome: produto.nome, caminho: `/produto/${produto.slug}` },
        ])}
      />
      {/* Trilha de navegação */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-6">
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
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-4 pb-10 md:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 items-start">
          {/* ---------- Foto e selos ---------- */}
          <div className="lg:sticky lg:top-[calc(var(--altura-cabecalho)+1.5rem)]">
            {/* A galeria: até 5 fotos, a primeira com prioridade */}
            <GaleriaProduto fotos={produto.fotos} nome={produto.nome} novidade={industrializado && produto.novidade} />
          </div>

          {/* ---------- Texto e ação ---------- */}
          <div className="flex flex-col">
            {/* Marca, código e compartilhar, como num marketplace */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-cinza">
                Marca{" "}
                <Link href="/produtos" className="font-semibold text-tinta hover:underline underline-offset-4">
                  Viver Bem
                </Link>
                <span className="mx-2 text-fio" aria-hidden="true">|</span>
                <span className="tabular-nums">Cód. {codigo}</span>
              </p>
              <CompartilharProduto nome={produto.nome} />
            </div>

            <h1 className="mt-4 text-[2.2rem] md:text-[3rem] font-semibold tracking-[-0.045em] text-navy leading-[1.02]">
              {produto.nome}
            </h1>

            {/* A nota é da FARMÁCIA no Google, e o texto diz isso */}
            <Link href="/avaliacoes" className="group mt-3 inline-flex w-fit flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={16} />
              <b className="font-semibold text-navy tabular-nums">{AVALIACOES_GOOGLE_NOTA.toFixed(1).replace(".", ",")}</b>
              <span className="text-cinza group-hover:text-tinta transition-colors">
                <span className="tabular-nums">{AVALIACOES_GOOGLE_TOTAL}</span> avaliações da farmácia no Google
              </span>
            </Link>

            {/* O tipo e a área */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 h-8 rounded-full px-3 text-[0.78rem] font-semibold ${industrializado ? "bg-green-50 text-green-700" : "bg-gelo text-tinta"}`}>
                <span aria-hidden="true" className={`size-1.5 rounded-full ${industrializado ? "bg-green-600" : "bg-tinta"}`} />
                {industrializado ? "Pronta entrega" : "Manipulado sob receita"}
              </span>
              {produto.categoriaNome && (
                <Link
                  href={hrefCategoria}
                  className="inline-flex items-center gap-1.5 h-8 rounded-full px-3 text-[0.78rem] font-semibold text-ouro-escuro ring-1 ring-inset ring-ouro/40 bg-white transition-colors hover:bg-ouro/5"
                >
                  {produto.categoriaNome}
                </Link>
              )}
              {industrializado && produto.apresentacao && (
                <span className="inline-flex items-center h-8 rounded-full px-3 text-[0.78rem] font-semibold text-cinza bg-gelo">{produto.apresentacao}</span>
              )}
            </div>

            <p className="texto-apoio mt-5 max-w-[34rem]">{produto.descricao}</p>

            <AcoesProduto produto={produto} />
            <Selos />

            {/* Compra segura */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-cinza">
              {SEGURANCA.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[#1DA851]">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Os detalhes em abas, como num marketplace (23/10/2026) */}
      <section aria-label="Detalhes do produto" className="max-w-6xl mx-auto px-5 md:px-8 pb-12 md:pb-16">
        <AbasProduto
          abas={[
            { id: "descricao", rotulo: "Descrição", conteudo: abaDescricao },
            { id: "como-pedir", rotulo: "Como pedir", conteudo: abaComoPedir },
            { id: "entrega", rotulo: "Entrega e retirada", conteudo: abaEntrega },
            { id: "duvidas", rotulo: "Dúvidas", conteudo: abaDuvidas },
          ]}
        />
      </section>

      {/* Mais procurados e o que a pessoa já viu, em faixas que arrastam, embaixo do produto */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-8 md:pb-10">
        <ColunaLateralProduto slugAtual={produto.slug} catalogo={produtos} maisProcurados={maisProcurados} />
      </section>

      {/* Da mesma área */}
      {relacionados.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-4 pb-12 border-t border-fio">
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
