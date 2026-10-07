// Números do negócio para o painel do gestor.
//
// Tudo sai da tabela Cliente, que guarda um pedido por linha com os
// itens em JSON. Como o volume é pequeno (uma farmácia, não um
// marketplace), lemos os pedidos do período e contamos em memória —
// mais simples do que espalhar SQL pelo código.
//
// Desde 07/10/2026 a visão geral também traz o retrato do catálogo
// (manipulados x industrializados, fotos, preço no site) e a atividade da
// equipe (acessos ativos e as últimas ações do log).
import { db } from "./db";
import { ENTREGA_RETIRADA, PAPEL_ADMIN, VENDA_INDUSTRIALIZADO } from "./tipos";

export interface ItemDoPedido {
  nome: string;
  dosagem: string | null;
  quantidade: number;
  precoCentavos: number;
}

/** Lê os itens de um pedido, tolerando registro antigo ou corrompido. */
export function lerItens(json: string): ItemDoPedido[] {
  try {
    const lista = JSON.parse(json);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function inicioDoMes(deslocamento = 0) {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth() + deslocamento, 1);
}

/** Variação percentual entre dois números (null quando não dá para comparar). */
function variacao(atual: number, anterior: number): number | null {
  if (anterior === 0) return atual === 0 ? 0 : null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export async function obterMetricas() {
  const comecoDesteMes = inicioDoMes();
  const comecoDoMesPassado = inicioDoMes(-1);
  // Janela dos gráficos: 6 meses cheios contando o atual
  const comecoDaJanela = inicioDoMes(-5);

  const [doMes, doMesPassado, totalPedidos, produtos, ultimos, daJanela, categorias, usuarios, ultimasAcoes] =
    await Promise.all([
      db.cliente.findMany({ where: { criadoEm: { gte: comecoDesteMes } } }),
      db.cliente.findMany({
        where: { criadoEm: { gte: comecoDoMesPassado, lt: comecoDesteMes } },
      }),
      db.cliente.count(),
      db.produto.findMany({
        select: {
          id: true,
          nome: true,
          ativo: true,
          aprovado: true,
          venda: true,
          precoCentavos: true,
          mostrarPreco: true,
          fotoUrl: true,
          categoriaId: true,
        },
      }),
      db.cliente.findMany({ orderBy: { criadoEm: "desc" }, take: 5 }),
      db.cliente.findMany({
        where: { criadoEm: { gte: comecoDaJanela } },
        select: { criadoEm: true, totalCentavos: true },
      }),
      db.categoria.findMany({ select: { id: true, nome: true, visivel: true, vitrineHome: true } }),
      db.usuario.findMany({ select: { id: true, nome: true, papel: true, ativo: true, ultimoAcesso: true } }),
      db.logAlteracao.findMany({ orderBy: { criadoEm: "desc" }, take: 6 }),
    ]);

  // Faturamento = só o que tem preço no site (industrializados). Pedido
  // só de receita entra com total zero: o valor do manipulado é passado
  // depois, pelo farmacêutico, e não passa pelo site.
  const faturamentoMes = doMes.reduce((s, c) => s + c.totalCentavos, 0);
  const faturamentoAnterior = doMesPassado.reduce((s, c) => s + c.totalCentavos, 0);
  const comPreco = doMes.filter((c) => c.totalCentavos > 0);

  const receitasMes = doMes.filter((c) => c.receita).length;
  const receitasAnterior = doMesPassado.filter((c) => c.receita).length;

  // Quantas vezes cada produto foi pedido no mês (soma as quantidades)
  const contagem = new Map<string, number>();
  for (const pedido of doMes) {
    for (const item of lerItens(pedido.itens)) {
      const qtd = Number(item.quantidade) || 0;
      contagem.set(item.nome, (contagem.get(item.nome) ?? 0) + qtd);
    }
  }
  const maisPedidos = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, quantidade]) => ({ nome, quantidade }));

  const retiradas = doMes.filter((c) => c.entrega === ENTREGA_RETIRADA).length;
  const entregas = doMes.filter((c) => c.entrega && c.entrega !== ENTREGA_RETIRADA).length;

  // O que precisa de atenção no catálogo. "Sem preço" só conta para
  // industrializado: manipulado não tem preço no site de propósito.
  const alertas = {
    aguardando: produtos.filter((p) => !p.aprovado).length,
    inativos: produtos.filter((p) => !p.ativo).length,
    semFoto: produtos.filter((p) => !p.fotoUrl).length,
    semPreco: produtos.filter((p) => p.venda === VENDA_INDUSTRIALIZADO && p.precoCentavos <= 0).length,
    semCategoria: produtos.filter((p) => p.categoriaId === null).length,
    categoriasForaDoSite: categorias.filter((c) => !c.visivel).length,
  };

  // O retrato do catálogo: o que é manipulado e o que é industrializado,
  // e quantos industrializados expõem o preço no site
  const industrializados = produtos.filter((p) => p.venda === VENDA_INDUSTRIALIZADO);
  const catalogo = {
    total: produtos.length,
    noSite: produtos.filter((p) => p.ativo && p.aprovado).length,
    manipulados: produtos.length - industrializados.length,
    industrializados: industrializados.length,
    comPrecoNoSite: industrializados.filter((p) => p.mostrarPreco).length,
    comFoto: produtos.filter((p) => Boolean(p.fotoUrl)).length,
    categorias: categorias.length,
    categoriasNoSite: categorias.filter((c) => c.visivel).length,
  };

  // A equipe: quem pode entrar e o que andou mudando
  const equipe = {
    ativos: usuarios.filter((u) => u.ativo).length,
    gestores: usuarios.filter((u) => u.ativo && u.papel === PAPEL_ADMIN).length,
    colaboradores: usuarios.filter((u) => u.ativo && u.papel !== PAPEL_ADMIN).length,
    ultimasAcoes: ultimasAcoes.map((a) => ({
      id: a.id,
      usuario: a.usuario,
      acao: a.acao,
      detalhe: a.detalhe,
      criadoEm: a.criadoEm.toISOString(),
    })),
  };

  // Faturamento dos 6 meses da janela, inclusive os zerados: um mês
  // sem venda precisa aparecer como vale, não sumir do gráfico.
  const hoje = new Date();
  const porMes = new Map<string, { faturamento: number; pedidos: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    porMes.set(`${d.getFullYear()}-${d.getMonth()}`, { faturamento: 0, pedidos: 0 });
  }
  for (const p of daJanela) {
    const chave = `${p.criadoEm.getFullYear()}-${p.criadoEm.getMonth()}`;
    const atual = porMes.get(chave);
    if (atual) {
      atual.faturamento += p.totalCentavos;
      atual.pedidos += 1;
    }
  }
  const porMesLista = [...porMes.entries()].map(([chave, v]) => {
    const [ano, mes] = chave.split("-").map(Number);
    return {
      rotulo: MESES_CURTOS[mes],
      ano,
      faturamento: v.faturamento,
      pedidos: v.pedidos,
    };
  });

  // Pedidos por dia nos últimos 14 dias, mesma lógica dos vazios
  const porDia = new Map<string, number>();
  const diasRotulo: { chave: string; rotulo: string }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - i);
    const chave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    porDia.set(chave, 0);
    diasRotulo.push({
      chave,
      rotulo: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  for (const p of daJanela) {
    const d = p.criadoEm;
    const chave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (porDia.has(chave)) porDia.set(chave, (porDia.get(chave) ?? 0) + 1);
  }
  const porDiaLista = diasRotulo.map((d) => ({
    rotulo: d.rotulo,
    pedidos: porDia.get(d.chave) ?? 0,
  }));

  return {
    porMes: porMesLista,
    porDia: porDiaLista,
    pedidosMes: doMes.length,
    pedidosVariacao: variacao(doMes.length, doMesPassado.length),
    receitasMes,
    receitasVariacao: variacao(receitasMes, receitasAnterior),
    faturamentoMes,
    faturamentoVariacao: variacao(faturamentoMes, faturamentoAnterior),
    // Ticket só entre os pedidos com preço, senão as receitas puxam para baixo
    ticketMedio: comPreco.length > 0 ? Math.round(faturamentoMes / comPreco.length) : 0,
    clientesUnicos: new Set(doMes.map((c) => c.whatsapp.replace(/\D/g, ""))).size,
    totalPedidos,
    maisPedidos,
    retiradas,
    entregas,
    alertas,
    catalogo,
    equipe,
    totalProdutos: produtos.length,
    ultimos: ultimos.map((c) => ({
      id: c.id,
      nome: c.nome,
      codigo: c.codigo,
      totalCentavos: c.totalCentavos,
      entrega: c.entrega,
      receita: c.receita,
      criadoEm: c.criadoEm.toISOString(),
    })),
  };
}
