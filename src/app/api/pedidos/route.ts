// POST /api/pedidos — registra o cliente e o resumo do pedido no momento
// da finalização (antes de abrir o WhatsApp). É a base de pedidos e de
// clientes do painel do gestor.
//
// Rota pública (o cliente do site não tem login). Nenhum dado sensível
// além de nome e WhatsApp, com consentimento informado na tela de
// finalização (LGPD). A foto da receita NUNCA passa por aqui: só a
// marcação de que ela vai chegar pelo WhatsApp.
//
// Um pedido pode ser só a receita, só itens do carrinho, ou os dois.
//
// 15/10/2026 (revisão de segurança): antes o preço de cada item vinha do
// navegador, e qualquer pessoa podia mandar um valor falso que entrava no
// faturamento do painel; a quantidade não tinha limite; e não havia freio
// de envios. Agora:
//   - o preço sai do banco, pelo código do produto, e só conta se o
//     produto mostra o preço no site (precoVisivel); o nome também vem do
//     banco quando o produto existe;
//   - quantidade de 1 a 20 por item, até 30 itens;
//   - até 6 pedidos a cada 10 minutos por IP e 4 por WhatsApp (429 acima
//     disso). O site abre o WhatsApp mesmo assim: o freio só protege a
//     base do painel.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { precoVisivel } from "@/lib/tipos";
import { chaveIp } from "@/lib/protecaoLogin";
import { cabeMaisUmEnvio } from "@/lib/limiteDeEnvios";

const MAX_ITENS = 30;
const MAX_QUANTIDADE = 20;

export async function POST(req: Request) {
  const corpo = await req.json().catch(() => ({}));

  const nome = String(corpo.nome ?? "").trim().slice(0, 120);
  const whatsapp = String(corpo.whatsapp ?? "").trim().slice(0, 30);
  const digitos = whatsapp.replace(/\D/g, "");
  const pagamento = String(corpo.pagamento ?? "").trim().slice(0, 40);
  const entrega = String(corpo.entrega ?? "").trim().slice(0, 40);
  const local = String(corpo.local ?? "").trim().slice(0, 200);
  const codigo = String(corpo.codigo ?? "").trim().slice(0, 12);
  const receita = corpo.receita === true;
  const itensBrutos: Record<string, unknown>[] = Array.isArray(corpo.itens) ? corpo.itens.slice(0, MAX_ITENS) : [];

  // Sem receita e sem itens não há pedido
  if (!nome || digitos.length < 10 || digitos.length > 13 || (!receita && itensBrutos.length === 0)) {
    return NextResponse.json({ erro: "Dados incompletos." }, { status: 400 });
  }

  // O freio de envios (por IP e por WhatsApp)
  const ip = chaveIp(req).replace(/^ip:/, "");
  const cabe = await cabeMaisUmEnvio([`pedido:ip:${ip}`], 6, 10);
  const cabeZap = await cabeMaisUmEnvio([`pedido:zap:${digitos}`], 4, 10);
  if (!cabe || !cabeZap) {
    return NextResponse.json({ erro: "Muitos pedidos em pouco tempo. Tente de novo em alguns minutos." }, { status: 429 });
  }

  // Os produtos citados, lidos do banco (o preço nunca vem do navegador)
  const ids = [...new Set(itensBrutos.map((i) => Number(i.produtoId)).filter((n) => Number.isInteger(n) && n > 0))];
  const produtos = ids.length
    ? await db.produto.findMany({
        where: { id: { in: ids }, ativo: true, aprovado: true },
        select: { id: true, nome: true, venda: true, mostrarPreco: true, precoCentavos: true },
      })
    : [];
  const porId = new Map(produtos.map((p) => [p.id, p]));

  const itensLimpos = itensBrutos.map((i) => {
    const produto = porId.get(Number(i.produtoId));
    const quantidade = Math.min(MAX_QUANTIDADE, Math.max(1, Math.floor(Number(i.quantidade)) || 1));
    return {
      produtoId: produto?.id ?? null,
      nome: (produto?.nome ?? String(i.nome ?? "")).slice(0, 120),
      dosagem: i.dosagem ? String(i.dosagem).slice(0, 40) : null,
      quantidade,
      precoCentavos: produto ? (precoVisivel(produto) ?? 0) : 0,
    };
  });

  // O total refeito aqui. Pedido só de receita fica em zero: o valor do
  // manipulado é passado depois, pelo farmacêutico.
  const totalCentavos = itensLimpos.reduce((soma, i) => soma + i.precoCentavos * i.quantidade, 0);

  await db.cliente.create({
    data: {
      nome,
      whatsapp,
      pagamento,
      entrega,
      local,
      codigo,
      receita,
      totalCentavos,
      itens: JSON.stringify(itensLimpos),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
