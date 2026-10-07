// /admin/painel — a visão geral, EXCLUSIVA DO GESTOR.
//
// A parte administrativa vem primeiro e com mais peso (pedido de
// 07/10/2026): os números do mês com a variação, os dois gráficos, o
// retrato do catálogo, como os clientes recebem, o que precisa de
// atenção e a equipe (acessos e as últimas ações do log). Os últimos
// pedidos e os atalhos do catálogo fecham a página. O colaborador não vê
// números do negócio: cai direto nos produtos.
import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { obterMetricas } from "@/lib/metricas";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { CabecalhoAdmin, CartaoAdmin, CartaoNumero, Inicial, Selo, classeBotaoAdmin } from "@/components/admin/PecasAdmin";
import { ICONES } from "@/components/admin/iconesAdmin";
import {
  GraficoCatalogo,
  GraficoFaturamento,
  GraficoPedidosDia,
  GraficoEntregas,
} from "@/components/admin/Graficos";

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

// Selo de variação contra o mês passado
function Variacao({ valor }: { valor: number | null }) {
  if (valor === null) return null;
  const subiu = valor > 0;
  const parado = valor === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[0.68rem] font-semibold rounded-full px-2 py-0.5 tabular-nums ${
        parado ? "bg-nevoa text-cinza" : subiu ? "bg-green-50 text-green-700" : "bg-carimbo/10 text-carimbo"
      }`}
      title="Em relação ao mês passado"
    >
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
  const mes = new Date().toLocaleDateString("pt-BR", { month: "long" });
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
        titulo={`Olá, ${(sessao.nome ?? "").split(" ")[0]}`}
        descricao={`Como está o mês de ${mes} na Viver Bem.`}
        acao={
          <>
            <Link href="/admin/clientes" className={classeBotaoAdmin("secundario")}>
              Clientes captados
            </Link>
            <Link href="/admin/log" className={classeBotaoAdmin("secundario")}>
              Ver o log
            </Link>
          </>
        }
      />

      {/* ---------- Números do mês ---------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <CartaoNumero
          rotulo="Pedidos no mês"
          valor={String(m.pedidosMes)}
          extra={<Variacao valor={m.pedidosVariacao} />}
          apoio={`${m.totalPedidos} desde o início`}
        />
        <CartaoNumero
          rotulo="Receitas no mês"
          valor={String(m.receitasMes)}
          extra={<Variacao valor={m.receitasVariacao} />}
          apoio="pedidos com foto de receita"
        />
        <CartaoNumero
          rotulo="Faturamento"
          valor={formatarPreco(m.faturamentoMes)}
          extra={<Variacao valor={m.faturamentoVariacao} />}
          apoio="só produtos com preço no site"
        />
        <CartaoNumero rotulo="Clientes no mês" valor={String(m.clientesUnicos)} apoio="WhatsApps diferentes" />
      </div>

      {/* ---------- Gráficos ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <CartaoAdmin titulo="Faturamento por mês" apoio="Últimos 6 meses, só produtos com preço">
          <div className="px-5 pb-5 mt-4">
            <GraficoFaturamento dados={m.porMes} />
          </div>
        </CartaoAdmin>
        <CartaoAdmin titulo="Pedidos por dia" apoio="Últimos 14 dias, receitas incluídas">
          <div className="px-5 pb-5 mt-4">
            <GraficoPedidosDia dados={m.porDia} />
          </div>
        </CartaoAdmin>
      </div>

      {/* ---------- Catálogo, entregas e os mais pedidos ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <CartaoAdmin
          titulo="O catálogo"
          apoio={`${m.catalogo.noSite} de ${m.catalogo.total} produtos no site`}
          acao={
            <Link href="/admin/produtos" className="text-tinta text-sm font-medium hover:underline shrink-0">
              Abrir
            </Link>
          }
        >
          <div className="px-5 pb-5">
            <GraficoCatalogo
              manipulados={m.catalogo.manipulados}
              industrializados={m.catalogo.industrializados}
              comPrecoNoSite={m.catalogo.comPrecoNoSite}
            />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-nevoa px-3.5 py-3">
                <dt className="text-[0.66rem] font-semibold tracking-[0.12em] uppercase text-cinza">Com foto</dt>
                <dd className="mt-1 font-semibold text-navy tabular-nums">
                  {m.catalogo.comFoto} <span className="text-grafite-claro font-normal">de {m.catalogo.total}</span>
                </dd>
              </div>
              <div className="rounded-xl bg-nevoa px-3.5 py-3">
                <dt className="text-[0.66rem] font-semibold tracking-[0.12em] uppercase text-cinza">Categorias</dt>
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
                      {/* Barra proporcional ao campeão */}
                      <div className="h-1.5 bg-nevoa rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[image:var(--ouro-degrade)]"
                          style={{ width: `${Math.round((p.quantidade / maior) * 100)}%` }}
                        />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <CartaoAdmin titulo="O que precisa de atenção" apoio={`${m.totalProdutos} produtos cadastrados`}>
          <div className="px-5 pb-5">
            {alertas.length === 0 ? (
              <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm mt-4 leading-relaxed">
                Catálogo em ordem: nada esperando publicação, e todos os produtos têm foto e categoria.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {alertas.map((a) => (
                  <Link
                    key={a.r}
                    href={a.href}
                    className={`rounded-xl px-4 py-3 border transition-colors ${
                      a.grave ? "border-carimbo/30 bg-carimbo/5 hover:border-carimbo/60" : "border-fio hover:border-tinta/40"
                    }`}
                  >
                    <p className={`text-2xl font-semibold tabular-nums tracking-tight ${a.grave ? "text-carimbo" : "text-navy"}`}>{a.n}</p>
                    <p className="text-cinza text-xs mt-0.5">{a.r}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CartaoAdmin>

        <CartaoAdmin
          titulo="Equipe e atividade"
          apoio={`${m.equipe.ativos} ${m.equipe.ativos === 1 ? "acesso ativo" : "acessos ativos"}: ${m.equipe.gestores} gestor${m.equipe.gestores === 1 ? "" : "es"}, ${m.equipe.colaboradores} colaborador${m.equipe.colaboradores === 1 ? "" : "es"}`}
          acao={
            <Link href="/admin/usuarios" className="text-tinta text-sm font-medium hover:underline shrink-0">
              Acessos
            </Link>
          }
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
                        <b className="font-semibold">{a.usuario}</b> {a.acao}{" "}
                        <span className="text-cinza">{a.detalhe}</span>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-grafite-claro tabular-nums pt-0.5" title={formatarData(a.criadoEm)}>
                      {tempoRelativo(a.criadoEm)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/admin/log" className="mt-2 inline-flex text-sm font-medium text-tinta hover:underline">
              Ver o log completo
            </Link>
          </div>
        </CartaoAdmin>
      </div>

      {/* ---------- Últimos pedidos ---------- */}
      <CartaoAdmin
        className="mt-4"
        titulo="Últimos pedidos"
        acao={
          <Link href="/admin/clientes" className="text-tinta text-sm font-medium hover:underline shrink-0">
            Ver todos
          </Link>
        }
      >
        <div className="px-5 pb-5">
          {m.ultimos.length === 0 ? (
            <p className="text-cinza text-sm mt-3">Nenhum pedido registrado ainda.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-fio mt-1">
              {m.ultimos.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
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
        <p className="rotulo-pilula !text-[0.62rem]">Atalhos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
          {ATALHOS.map((a) => (
            <Link
              key={a.titulo}
              href={a.href}
              className="group bg-white rounded-2xl border border-fio hover:border-tinta/40 px-4 py-3.5 flex items-center gap-3 transition-colors"
            >
              <span className="shrink-0 w-9 h-9 rounded-xl bg-nevoa text-grafite-claro group-hover:bg-gelo group-hover:text-tinta flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {ICONES[a.icone]}
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-navy">{a.titulo}</span>
                <span className="block text-xs text-grafite-claro">{a.apoio}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
