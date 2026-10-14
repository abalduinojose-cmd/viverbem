// /admin/painel — a visão geral, EXCLUSIVA DO GESTOR.
//
// A parte administrativa vem primeiro e com mais peso (pedido de
// 07/10/2026): os números do mês com a variação, os dois gráficos, o
// retrato do catálogo, como os clientes recebem, o que precisa de
// atenção e a equipe (acessos e as últimas ações do log). Os últimos
// pedidos e os atalhos do catálogo fecham a página. O colaborador não vê
// números do negócio: cai direto nos produtos.
//
// 14/10/2026 ("modernize, quero um dashboard de alta qualidade e premium"):
// o cumprimento ganhou o nome em itálico serifado e, embaixo, a data e a
// hora viva; o número que manda (pedidos no mês) virou o cartão escuro em
// azul-noite e os quatro ganharam ícone e contagem animada; as barras de
// proporção enchem ao aparecer; os gráficos ganharam degradê; os atalhos
// deixaram de ser cinco colunas espremidas (na tela do usuário, com a
// lateral, o conteúdo tem uns 720px) e ganharam a seta. A informação é a
// mesma.
//
// 14/10/2026, mais tarde ("um filtro para filtrar e comparar com o mesmo
// período do ano ou do mês passado, com gráficos"): os números do mês, os
// dois gráficos, como recebem e os mais pedidos viraram o PainelPeriodo
// (filtro de período, comparação e um gráfico só com a escolha do que
// medir); o catálogo virou três barras (no site, com foto, preço no site).
import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { obterMetricas } from "@/lib/metricas";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { CabecalhoAdmin, CartaoAdmin, ChipAdmin, Inicial, Selo, classeBotaoAdmin } from "@/components/admin/PecasAdmin";
import { BarraViva } from "@/components/admin/PecasVivas";
import { ICONES } from "@/components/admin/iconesAdmin";
import { PainelPeriodo } from "@/components/admin/PainelPeriodo";

export const dynamic = "force-dynamic";

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "há 5 min", "há 3 h", "ontem", "há 4 dias" */
function tempoRelativo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ontem" : `há ${d} dias`;
}

/** Link discreto no canto dos cartões ("Abrir", "Ver todos") */
function LinkCanto({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group/lc inline-flex items-center gap-1 shrink-0 text-tinta text-sm font-medium">
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover/lc:translate-x-0.5">
        <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

const ATALHOS = [
  { href: "/admin/produtos/novo", titulo: "Novo produto", apoio: "cadastrar no catálogo", icone: "produtos" as const },
  { href: "/admin/produtos", titulo: "Produtos e preços", apoio: "fotos, preço no site, falta", icone: "produtos" as const },
  { href: "/admin/categorias", titulo: "Categorias", apoio: "no site e vitrine na home", icone: "categorias" as const },
  { href: "/admin/site", titulo: "Home e arte da dobra", apoio: "seções e a arte", icone: "vitrine" as const },
  { href: "/admin/usuarios", titulo: "Acessos ao painel", apoio: "quem entra e o que faz", icone: "acessos" as const },
];

export default async function PaginaPainel() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) redirect("/admin/produtos");

  const m = await obterMetricas();
  const alertas = [
    { n: m.alertas.aguardando, r: "aguardando você publicar", href: "/admin/produtos", grave: true },
    { n: m.alertas.semPreco, r: "industrializados sem preço", href: "/admin/produtos", grave: true },
    { n: m.alertas.semFoto, r: "sem foto", href: "/admin/produtos", grave: false },
    { n: m.alertas.semCategoria, r: "sem categoria", href: "/admin/produtos", grave: false },
    { n: m.alertas.inativos, r: "escondidos do site", href: "/admin/produtos", grave: false },
    { n: m.alertas.categoriasForaDoSite, r: "categorias fora do site", href: "/admin/categorias", grave: false },
  ].filter((a) => a.n > 0);

  return (
    <div className="max-w-6xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Olá,"
        tituloDestaque={(sessao.nome ?? "").split(" ")[0]}
        descricao="Como anda a Viver Bem. Escolha o período e compare com o mês ou o ano passado."
        chips={
          <>
            <ChipAdmin tom={alertas.some((a) => a.grave) ? "ouro" : "verde"}>
              <span aria-hidden="true" className={`size-1.5 rounded-full ${alertas.some((a) => a.grave) ? "bg-ouro-escuro" : "bg-green-600"}`} />
              {alertas.some((a) => a.grave) ? `${alertas.filter((a) => a.grave).reduce((s, a) => s + a.n, 0)} pendências no catálogo` : "Catálogo em dia"}
            </ChipAdmin>
            <ChipAdmin>
              {m.catalogo.noSite} de {m.catalogo.total} produtos no site
            </ChipAdmin>
            <ChipAdmin>
              {m.equipe.ativos} {m.equipe.ativos === 1 ? "acesso ativo" : "acessos ativos"}
            </ChipAdmin>
          </>
        }
        acao={
          <>
            <Link href="/admin/clientes" className={classeBotaoAdmin("secundario")}>
              Clientes captados
            </Link>
            <Link href="/admin/log" className={classeBotaoAdmin("secundario")}>
              Ver o log
            </Link>
            <Link href="/admin/produtos/novo" className={classeBotaoAdmin("primario")}>
              Novo produto
            </Link>
          </>
        }
      />

      {/* ---------- O período: filtro, números, gráfico comparativo, como
           recebem e os mais pedidos (14/10/2026, PainelPeriodo) ---------- */}
      <PainelPeriodo historico={m.historico} agora={m.agora} />

      {/* ---------- Catálogo ---------- */}
      <CartaoAdmin className="mt-4" titulo="O catálogo" apoio={`${m.catalogo.total} produtos cadastrados em ${m.catalogo.categorias} categorias`} acao={<LinkCanto href="/admin/produtos">Abrir</LinkCanto>}>
        <div className="px-5 pb-5 mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { rotulo: "No site", n: m.catalogo.noSite, de: m.catalogo.total, cor: "bg-green-600" },
            { rotulo: "Com foto", n: m.catalogo.comFoto, de: m.catalogo.total, cor: "bg-tinta" },
            { rotulo: "Preço no site", n: m.catalogo.comPrecoNoSite, de: m.catalogo.total, cor: "bg-[image:var(--ouro-degrade)]" },
          ].map((c) => (
            <div key={c.rotulo} className="rounded-2xl bg-nevoa/70 px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-cinza">{c.rotulo}</span>
                <span className="text-xs text-grafite-claro tabular-nums">{c.de > 0 ? Math.round((c.n / c.de) * 100) : 0}%</span>
              </div>
              <p className="mt-1.5 tabular-nums">
                <span className="text-[1.5rem] font-semibold text-navy tracking-[-0.03em] leading-none">{c.n}</span>
                <span className="text-sm text-grafite-claro"> de {c.de}</span>
              </p>
              <div className="mt-2.5 h-1.5 rounded-full bg-white overflow-hidden">
                <BarraViva pct={c.de > 0 ? (c.n / c.de) * 100 : 0} className={`h-full rounded-full ${c.cor}`} />
              </div>
            </div>
          ))}
          <p className="md:col-span-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center h-7 rounded-full bg-gelo px-3 font-medium text-tinta tabular-nums">{m.catalogo.manipulados} manipulados</span>
            <span className="inline-flex items-center h-7 rounded-full bg-ouro/10 px-3 font-medium text-ouro-escuro tabular-nums">{m.catalogo.industrializados} industrializados</span>
            <span className="inline-flex items-center h-7 rounded-full bg-white ring-1 ring-fio px-3 font-medium text-cinza tabular-nums">
              {m.catalogo.categoriasNoSite} de {m.catalogo.categorias} categorias no site
            </span>
          </p>
        </div>
      </CartaoAdmin>

      {/* ---------- Atenção e equipe ---------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <CartaoAdmin titulo="O que precisa de atenção" apoio={`${m.totalProdutos} produtos cadastrados`}>
          <div className="px-5 pb-5">
            {alertas.length === 0 ? (
              <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm mt-4 leading-relaxed">
                Catálogo em ordem: nada esperando publicação, e todos os produtos têm foto e categoria.
              </p>
            ) : (
              /* Uma linha por item, com a seta: um ladrilho solto num cartão
                 vazio parecia erro (14/10/2026) */
              <ul className="mt-3 flex flex-col gap-2">
                {alertas.map((a) => (
                  <li key={a.r}>
                    <Link
                      href={a.href}
                      className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 ring-1 ring-inset transition-colors ${
                        a.grave ? "ring-carimbo/25 bg-carimbo/5 hover:ring-carimbo/60" : "ring-fio bg-nevoa/60 hover:ring-tinta/40"
                      }`}
                    >
                      <span className={`w-12 shrink-0 text-2xl font-semibold tabular-nums tracking-tight ${a.grave ? "text-carimbo" : "text-navy"}`}>{a.n}</span>
                      <span className="min-w-0 flex-1 text-sm text-navy">{a.r}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-grafite-claro transition-transform group-hover:translate-x-0.5 group-hover:text-navy">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CartaoAdmin>

        <CartaoAdmin
          titulo="Equipe e atividade"
          apoio={`${m.equipe.ativos} ${m.equipe.ativos === 1 ? "acesso ativo" : "acessos ativos"}: ${m.equipe.gestores} gestor${m.equipe.gestores === 1 ? "" : "es"}, ${m.equipe.colaboradores} colaborador${m.equipe.colaboradores === 1 ? "" : "es"}`}
          acao={<LinkCanto href="/admin/usuarios">Acessos</LinkCanto>}
        >
          <div className="px-5 pb-5">
            {m.equipe.ultimasAcoes.length === 0 ? (
              <p className="text-cinza text-sm mt-4">Nenhuma alteração registrada ainda.</p>
            ) : (
              <ul className="mt-3 divide-y divide-fio">
                {m.equipe.ultimasAcoes.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 py-2.5">
                    <Inicial nome={a.usuario} tamanho="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-navy leading-snug">
                        <b className="font-semibold">{a.usuario}</b> {a.acao} <span className="text-cinza">{a.detalhe}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-grafite-claro tabular-nums pt-0.5" title={formatarData(a.criadoEm)}>
                      {tempoRelativo(a.criadoEm)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2">
              <LinkCanto href="/admin/log">Ver o log completo</LinkCanto>
            </div>
          </div>
        </CartaoAdmin>
      </div>

      {/* ---------- Últimos pedidos ---------- */}
      <CartaoAdmin className="mt-4" titulo="Últimos pedidos" acao={<LinkCanto href="/admin/clientes">Ver todos</LinkCanto>}>
        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          {m.ultimos.length === 0 ? (
            <p className="text-cinza text-sm mt-3 px-2">
              Nenhum pedido registrado ainda. Os pedidos feitos pelo site aparecem aqui, com o nome, o WhatsApp e o código de cada um.
            </p>
          ) : (
            <ul className="flex flex-col mt-2">
              {m.ultimos.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-nevoa/70">
                  <div className="min-w-0 flex items-center gap-3">
                    <Inicial nome={p.nome} tamanho="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-navy truncate">{p.nome}</p>
                      <p className="text-grafite-claro text-xs tabular-nums">
                        {p.codigo} · {formatarData(p.criadoEm)}
                        {p.entrega ? ` · ${p.entrega}` : ""}
                      </p>
                    </div>
                  </div>
                  {/* Pedido pela receita ainda não tem valor: é passado depois */}
                  <span className="shrink-0 text-right flex flex-col items-end gap-1">
                    {p.receita && <Selo tom="azul">receita</Selo>}
                    <span className="font-semibold text-navy tabular-nums text-sm">
                      {p.totalCentavos > 0 ? formatarPreco(p.totalCentavos) : p.receita ? "a combinar" : formatarPreco(0)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CartaoAdmin>

      {/* ---------- Atalhos do dia a dia, por último de propósito ---------- */}
      <div className="mt-6 mb-2">
        <p className="rotulo-pilula !text-[0.6875rem]">Atalhos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3 mt-3">
          {ATALHOS.map((a) => (
            <Link
              key={a.titulo}
              href={a.href}
              className="group relative overflow-hidden bg-white rounded-[1.25rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] hover:ring-tinta/40 hover:-translate-y-0.5 px-4 py-4 flex items-center gap-3 transition duration-300"
            >
              {/* A marca de ouro que cresce na borda de baixo */}
              <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-[image:var(--ouro-degrade)] transition-transform duration-300 group-hover:scale-x-100" />
              <span className="shrink-0 w-10 h-10 rounded-xl bg-gelo text-tinta group-hover:bg-navy group-hover:text-white flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {ICONES[a.icone]}
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-navy truncate">{a.titulo}</span>
                <span className="block text-xs text-grafite-claro truncate">{a.apoio}</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-grafite-claro transition-transform group-hover:translate-x-0.5 group-hover:text-navy">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
