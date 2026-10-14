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
import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { obterMetricas } from "@/lib/metricas";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { CabecalhoAdmin, CartaoAdmin, CartaoNumero, ChipAdmin, Inicial, Selo, classeBotaoAdmin } from "@/components/admin/PecasAdmin";
import { Anel, BarraViva, Faisca } from "@/components/admin/PecasVivas";
import { ICONES } from "@/components/admin/iconesAdmin";
import { GraficoCatalogo, GraficoFaturamento, GraficoPedidosDia, GraficoEntregas } from "@/components/admin/Graficos";

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

// O lugar do gráfico quando ainda não há o que desenhar (13/10/2026): sem
// pedido nenhum o painel mostrava eixos e uma linha no zero, que parecia
// erro. Ocupa a mesma proporção do gráfico, para nada pular quando o
// primeiro pedido chegar.
function GraficoVazio({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="aspect-[520/190] rounded-2xl border border-dashed border-fio bg-nevoa/50 flex flex-col items-center justify-center text-center px-6 gap-2">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-tinta/60">
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="6" y="12" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="8" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <rect x="16" y="14" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <p className="font-semibold text-navy text-[0.95rem]">{titulo}</p>
      <p className="text-cinza text-sm max-w-xs leading-snug">{texto}</p>
    </div>
  );
}

// Selo de variação contra o mês passado
function Variacao({ valor, noite = false }: { valor: number | null; noite?: boolean }) {
  if (valor === null) return null;
  const subiu = valor > 0;
  const parado = valor === 0;
  const classe = noite
    ? parado
      ? "bg-white/10 text-white/70"
      : subiu
        ? "bg-green-400/20 text-green-200"
        : "bg-white/10 text-[#f6c7c9]"
    : parado
      ? "bg-nevoa text-cinza"
      : subiu
        ? "bg-green-50 text-green-700"
        : "bg-carimbo/10 text-carimbo";
  return (
    <span className={`inline-flex items-center gap-1 text-[0.6875rem] font-semibold rounded-full px-2 py-0.5 tabular-nums ${classe}`} title="Em relação ao mês passado">
      {!parado && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={subiu ? "M12 19V5m0 0-6 6m6-6 6 6" : "M12 5v14m0 0 6-6m-6 6-6-6"} stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {subiu ? "+" : ""}
      {valor}%
    </span>
  );
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
  // Sem pedido nenhum, as setas de "em relação ao mês passado" não dizem nada
  const semPedidos = m.totalPedidos === 0;
  const mes = new Date().toLocaleDateString("pt-BR", { month: "long" });
  // Os mini-gráficos dos números: só quando há o que desenhar
  const faiscaPedidos = m.porDia.some((x) => x.pedidos > 0) ? m.porDia.map((x) => x.pedidos) : null;
  const faiscaReceitas = m.porDia.some((x) => x.receitas > 0) ? m.porDia.map((x) => x.receitas) : null;
  const faiscaFaturamento = m.porMes.some((x) => x.faturamento > 0) ? m.porMes.map((x) => x.faturamento) : null;
  const parteReceitas = m.pedidosMes > 0 ? Math.round((m.receitasMes / m.pedidosMes) * 100) : null;
  const parteClientes = m.pedidosMes > 0 ? (m.clientesUnicos / m.pedidosMes) * 100 : null;
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
        descricao={`Como está o mês de ${mes} na Viver Bem.`}
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

      {/* ---------- Números do mês ---------- */}
      <div className="cascata grid grid-cols-2 xl:grid-cols-4 gap-4 mt-7">
        <CartaoNumero
          tom="noite"
          icone={ICONES.pedidos}
          rotulo="Pedidos no mês"
          valor={String(m.pedidosMes)}
          extra={<Variacao noite valor={semPedidos ? null : m.pedidosVariacao} />}
          apoio={`${m.totalPedidos} desde o início · 14 dias`}
          visual={faiscaPedidos && <Faisca valores={faiscaPedidos} cor="ouro" className="h-10 w-32" />}
        />
        <CartaoNumero
          icone={ICONES.receita}
          rotulo="Receitas no mês"
          valor={String(m.receitasMes)}
          extra={<Variacao valor={semPedidos ? null : m.receitasVariacao} />}
          apoio={parteReceitas !== null ? `${parteReceitas}% dos pedidos · 14 dias` : "pedidos com foto de receita"}
          visual={faiscaReceitas && <Faisca valores={faiscaReceitas} className="h-10 w-32" />}
        />
        <CartaoNumero
          icone={ICONES.faturamento}
          rotulo="Faturamento"
          valor={formatarPreco(m.faturamentoMes)}
          extra={<Variacao valor={semPedidos ? null : m.faturamentoVariacao} />}
          apoio="só produtos com preço no site"
          visual={faiscaFaturamento && <Faisca valores={faiscaFaturamento} className="h-10 w-32" />}
        />
        <CartaoNumero
          icone={ICONES.clientes}
          rotulo="Clientes no mês"
          valor={String(m.clientesUnicos)}
          apoio="WhatsApps diferentes"
          visual={parteClientes !== null && <Anel pct={parteClientes} rotulo="por pedido" cor="ouro" />}
        />
      </div>

      {/* ---------- Gráficos ---------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <CartaoAdmin titulo="Faturamento por mês" apoio="Últimos 6 meses, só produtos com preço">
          <div className="px-5 pb-5 mt-4">
            {m.porMes.every((x) => x.faturamento === 0) ? (
              <GraficoVazio titulo="Ainda sem faturamento" texto="As barras aparecem quando entrar o primeiro pedido de um produto com preço no site." />
            ) : (
              <GraficoFaturamento dados={m.porMes} />
            )}
          </div>
        </CartaoAdmin>
        <CartaoAdmin titulo="Pedidos por dia" apoio="Últimos 14 dias, receitas incluídas">
          <div className="px-5 pb-5 mt-4">
            {m.porDia.every((x) => x.pedidos === 0) ? (
              <GraficoVazio titulo="Nenhum pedido nos últimos 14 dias" texto="Cada pedido feito pelo site, pelo carrinho ou pela foto da receita, vira um ponto aqui." />
            ) : (
              <GraficoPedidosDia dados={m.porDia} />
            )}
          </div>
        </CartaoAdmin>
      </div>

      {/* ---------- Catálogo, entregas e os mais pedidos ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <CartaoAdmin titulo="O catálogo" apoio={`${m.catalogo.noSite} de ${m.catalogo.total} produtos no site`} acao={<LinkCanto href="/admin/produtos">Abrir</LinkCanto>}>
          <div className="px-5 pb-5">
            <GraficoCatalogo manipulados={m.catalogo.manipulados} industrializados={m.catalogo.industrializados} comPrecoNoSite={m.catalogo.comPrecoNoSite} />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-nevoa px-3.5 py-3">
                <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza">Com foto</dt>
                <dd className="mt-1 font-semibold text-navy tabular-nums">
                  {m.catalogo.comFoto} <span className="text-grafite-claro font-normal">de {m.catalogo.total}</span>
                </dd>
              </div>
              <div className="rounded-2xl bg-nevoa px-3.5 py-3">
                <dt className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-cinza">Categorias</dt>
                <dd className="mt-1 font-semibold text-navy tabular-nums">
                  {m.catalogo.categoriasNoSite} <span className="text-grafite-claro font-normal">de {m.catalogo.categorias} no site</span>
                </dd>
              </div>
            </dl>
          </div>
        </CartaoAdmin>

        <CartaoAdmin titulo="Como recebem o pedido" apoio="Neste mês">
          <div className="px-5 pb-5">
            <GraficoEntregas entregas={m.entregas} retiradas={m.retiradas} />
          </div>
        </CartaoAdmin>

        <CartaoAdmin titulo="Mais pedidos no mês" apoio="Produtos com preço">
          <div className="px-5 pb-5">
            {m.maisPedidos.length === 0 ? (
              <p className="text-cinza text-sm mt-3 leading-relaxed">
                Nenhum produto com preço pedido neste mês. Os pedidos pela receita contam em &quot;Receitas no mês&quot;.
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5 mt-4">
                {m.maisPedidos.map((p, i) => {
                  const maior = m.maisPedidos[0].quantidade;
                  return (
                    <li key={p.nome}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-navy truncate">
                          <span className="text-grafite-claro tabular-nums mr-1.5">{i + 1}.</span>
                          {p.nome}
                        </span>
                        <span className="font-semibold text-navy tabular-nums shrink-0">{p.quantidade}</span>
                      </div>
                      {/* Barra proporcional ao campeão, que enche ao aparecer */}
                      <div className="h-1.5 bg-nevoa rounded-full mt-1.5 overflow-hidden">
                        <BarraViva pct={Math.round((p.quantidade / maior) * 100)} className="h-full rounded-full bg-[image:var(--ouro-degrade)]" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </CartaoAdmin>
      </div>

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
