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
// famoso, tá muito simples"). Segunda volta no mesmo dia ("tire a ficha
// técnica, o valor sob consulta, o código e a marca, é tudo da Viver Bem;
// melhore o pedir pelo WhatsApp, as avaliações e o botão de quantidade"):
// saíram a marca, o código, a ficha técnica e o "Vendido por"; a nota virou
// um selo com o "G", rostos de clientes e o total, que abre a aba nova
// AVALIAÇÕES (resumo + três avaliações reais com foto). Primeira volta: no
// alto, a marca, o código do produto e o
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
import { obterCatalogo, obterTodasAvaliacoes } from "@/lib/catalogo";
import { listarItens, ehIndustrializado, UNIDADES, linkMapaUnidade } from "@/lib/tipos";
import { GaleriaProduto } from "@/components/site/GaleriaProduto";
import { AcoesProduto } from "@/components/site/AcoesProduto";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { BotaoVerMais } from "@/components/site/BotaoVerMais";
import { ColunaLateralProduto } from "@/components/site/ColunaLateralProduto";
import { IconeMoto } from "@/components/site/IconeMoto";
import { IconeLoja } from "@/components/site/IconesVantagens";
import { IconeWhatsApp } from "@/components/site/icones";
import { SeloAvaliacoes, escolherAvaliacoes } from "@/components/site/produto/AvaliacoesProduto";
import { BotaoEnviarReceita } from "@/components/site/BotaoEnviarReceita";
import { AbasProduto } from "@/components/site/produto/AbasProduto";
import { CompartilharProduto } from "@/components/site/produto/CompartilharProduto";

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
  { icone: <IconeWhatsApp tamanho={15} />, titulo: "Valor no WhatsApp", texto: "no horário das lojas" },
];

// 23/10/2026 (terceira volta, "melhore"): três colunas em TODA tela, o
// ícone em cima num círculo de ouro, o título e o apoio centrados, numa
// tira só com fio (no celular eram três linhas empilhadas que ocupavam
// meia tela)
function Selos() {
  return (
    <ul className="mt-5 grid grid-cols-3 divide-x divide-fio overflow-hidden rounded-2xl border border-fio bg-white">
      {SELOS.map((s) => (
        <li key={s.titulo} className="flex flex-col items-center gap-1.5 px-2 py-3.5 text-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-ouro/10 text-ouro-escuro">{s.icone}</span>
          <b className="text-[0.8rem] font-semibold leading-tight text-navy">{s.titulo}</b>
          <span className="text-[0.7rem] leading-tight text-cinza">{s.texto}</span>
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

  // Três avaliações reais da farmácia, trocando conforme o produto
  const avaliacoesDoProduto = escolherAvaliacoes(await obterTodasAvaliacoes(), produto.id);

  // 23/10/2026 (quarta volta: "melhore por dentro o Sobre o produto, Entrega
  // e retirada e Como pedir; exclua a aba Avaliações"): cada aba ganhou
  // cartões com ícone, e não só texto corrido.
  const destaques = industrializado
    ? [
        { titulo: "Pronta entrega", texto: "Com registro na Anvisa, disponível nas lojas e pelo Delivery." },
        { titulo: "Preço no site", texto: "Você vê o valor aqui e confirma pelo WhatsApp." },
        { titulo: "Conferido pelo farmacêutico", texto: "Cada pedido passa pela equipe antes de sair." },
        { titulo: `Retirada em ${UNIDADES.length} lojas`, texto: "Ou entrega em casa, em Petrópolis e Região." },
      ]
    : [
        { titulo: "Preparado sob receita", texto: "Feito no nosso laboratório a partir da prescrição do seu profissional." },
        { titulo: "Na dose indicada", texto: "A fórmula e a quantidade são exatamente as da receita." },
        { titulo: "Conferido pelo farmacêutico", texto: "A receita é conferida e o valor e o prazo vêm antes de você confirmar." },
        { titulo: `Retirada em ${UNIDADES.length} lojas`, texto: "Ou entrega em casa, em Petrópolis e Região." },
      ];

  const abaDescricao = (
    <div className="max-w-4xl">
      <h3 className="font-semibold text-navy">Sobre o produto</h3>
      <p className="mt-2.5 text-cinza leading-relaxed">{produto.descricao}</p>
      {!industrializado && (
        <p className="mt-3 text-cinza leading-relaxed">
          É um produto manipulado: preparado no laboratório da Viver Bem a partir da receita, na fórmula e na quantidade que o
          profissional indicou.
        </p>
      )}

      {/* Os destaques, em quatro cartões com o visto de ouro */}
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {destaques.map((d) => (
          <li key={d.titulo} className="flex items-start gap-3 rounded-[1.25rem] bg-white p-4 ring-1 ring-inset ring-fio">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-ouro/10 text-ouro-escuro">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-navy leading-snug">{d.titulo}</span>
              <span className="mt-0.5 block text-[0.9rem] leading-relaxed text-cinza">{d.texto}</span>
            </span>
          </li>
        ))}
      </ul>

      {industrializado && (
        <div className="mt-8 flex flex-col gap-6">
          <ListaItens titulo="Indicações" itens={listarItens(produto.indicacoes)} />
          <ListaItens titulo="Composição" itens={listarItens(produto.composicao)} />
          {produto.modoUso && (
            <div>
              <h3 className="font-semibold text-navy">Modo de uso</h3>
              <p className="mt-2.5 text-cinza leading-relaxed whitespace-pre-line">{produto.modoUso}</p>
            </div>
          )}
        </div>
      )}

      {/* O aviso que a lei pede, em tom de serviço */}
      <p className="mt-6 flex items-start gap-2.5 rounded-2xl bg-gelo/60 px-4 py-3 text-[0.85rem] leading-relaxed text-cinza">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-tinta">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 11v5M12 7.5v.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        <span>
          {industrializado
            ? "Em caso de dúvida sobre o uso, fale com o farmacêutico pelo WhatsApp ou numa das lojas."
            : "Manipulado só com receita válida de profissional habilitado. Valor, prazo e orientações de uso são passados pelo farmacêutico."}
        </span>
      </p>
    </div>
  );

  // Os passos com ícone, ligados por um fio de ouro no computador
  const iconesPassos = [
    <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 7h12l-1.2 9.5a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>,
    <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 6v5.5c0 4.2 2.9 8 7 9.5 4.1-1.5 7-5.3 7-9.5V6l-7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    <IconeMoto key="3" tamanho={20} />,
  ];
  const abaComoPedir = (
    <div className="max-w-4xl">
      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* O fio que liga os três passos, só no computador */}
        <span aria-hidden="true" className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-ouro/60 via-ouro/40 to-ouro/60 md:block" />
        {PASSOS_PEDIDO.map((p, i) => (
          <li key={p.titulo} className="relative flex gap-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-inset ring-fio md:flex-col md:gap-0">
            <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-gelo text-tinta ring-4 ring-white">
              {iconesPassos[i]}
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[image:var(--ouro-degrade)] text-[0.65rem] font-bold text-navy tabular-nums">{i + 1}</span>
            </span>
            <span className="min-w-0 md:mt-4">
              <span className="block font-semibold text-navy leading-snug">{p.titulo}</span>
              <span className="mt-1 block text-[0.92rem] leading-relaxed text-cinza">{p.texto}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] bg-gelo/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.92rem] leading-relaxed text-cinza">
          {industrializado ? "Prefere falar direto com a equipe? É só chamar no WhatsApp." : "Já tem a receita? Envie a foto e o farmacêutico responde com o valor e o prazo."}
        </p>
        <BotaoEnviarReceita className="botao botao-principal botao-compacto shrink-0 !min-h-11" produtoVisto={produto.nome} />
      </div>
    </div>
  );

  const abaEntrega = (
    <div className="grid max-w-4xl grid-cols-1 md:grid-cols-2 gap-4">
      {/* Delivery */}
      <div className="rounded-[1.25rem] bg-white ring-1 ring-inset ring-fio p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ouro/10 text-ouro-escuro">
            <IconeMoto tamanho={20} />
          </span>
          <p className="font-semibold text-navy">Delivery</p>
        </div>
        <ul className="mt-4 flex flex-col gap-2.5 text-[0.92rem] leading-relaxed text-cinza">
          {["Entregamos em Petrópolis e Região", "A taxa e o prazo são combinados pelo WhatsApp, junto com o valor", "Você confirma o pedido só depois de saber o total"].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[image:var(--ouro-degrade)]" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      {/* Retirada */}
      <div className="rounded-[1.25rem] bg-white ring-1 ring-inset ring-fio p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ouro/10 text-ouro-escuro">
            <IconeLoja tamanho={19} />
          </span>
          <p className="font-semibold text-navy">Retirada grátis em {UNIDADES.length} lojas</p>
        </div>
        <ul className="mt-4 divide-y divide-fio">
          {UNIDADES.map((u) => (
            <li key={u.bairro} className="flex items-center justify-between gap-3 py-2.5">
              <span className="min-w-0">
                <span className="block text-[0.95rem] font-semibold text-navy">{u.bairro}</span>
                <span className="block truncate text-xs text-cinza">{u.endereco}</span>
              </span>
              <a
                href={linkMapaUnidade(u.bairro, u.endereco)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-tinta hover:underline underline-offset-4"
              >
                Como chegar
                <Chevron />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-cinza">Você escolhe a loja na hora de enviar o pedido.</p>
      </div>
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
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[2.2rem] md:text-[3rem] font-semibold tracking-[-0.045em] text-navy leading-[1.02]">{produto.nome}</h1>
              <span className="mt-1.5 shrink-0">
                <CompartilharProduto nome={produto.nome} />
              </span>
            </div>

            {/* A nota da farmácia no Google, com rostos de clientes; abre a aba Avaliações */}
            <SeloAvaliacoes rostos={avaliacoesDoProduto} />

            {/* O tipo e a área */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* O selo "Manipulado sob receita" saiu a pedido (23/10/2026); o de pronta entrega fica */}
              {industrializado && (
                <span className="inline-flex items-center gap-1.5 h-8 rounded-full px-3 text-[0.78rem] font-semibold bg-green-50 text-green-700">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-green-600" />
                  Pronta entrega
                </span>
              )}
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
