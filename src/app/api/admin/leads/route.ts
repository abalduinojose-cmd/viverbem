// /api/admin/leads (26/10/2026): os leads do painel.
//   POST   { nome, whatsapp, origem?, interesse?, observacao?, situacao? } cria um
//   PATCH  { id, situacao?, observacao?, interesse?, nome?, whatsapp?, origem? } muda um
//   DELETE { id } apaga um
// Permissão (27/10/2026): gestor e colaborador criam e alteram; só o gestor apaga.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi, exigirSessaoApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";
import { origemValida, situacaoValida } from "@/lib/leads";

function limpar(v: unknown, max: number) {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const corpo = await req.json().catch(() => ({}));
  const nome = limpar(corpo.nome, 120);
  const whatsapp = limpar(corpo.whatsapp, 30);
  const digitos = whatsapp.replace(/\D/g, "");
  if (!nome || digitos.length < 8 || digitos.length > 13) {
    return NextResponse.json({ erro: "Informe o nome e um WhatsApp válido." }, { status: 400 });
  }
  const lead = await db.lead.create({
    data: {
      nome,
      whatsapp,
      origem: origemValida(corpo.origem) ? corpo.origem : "OUTRO",
      interesse: limpar(corpo.interesse, 200),
      observacao: limpar(corpo.observacao, 1000),
      situacao: situacaoValida(corpo.situacao) ? corpo.situacao : "NOVO",
    },
  });
  await registrarLog(sessao.nome ?? "?", "cadastrou lead", nome);
  return NextResponse.json({ lead: { ...lead, criadoEm: lead.criadoEm.toISOString(), atualizadoEm: lead.atualizadoEm.toISOString() } }, { status: 201 });
}

export async function PATCH(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const corpo = await req.json().catch(() => ({}));
  const id = Number(corpo.id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ erro: "Lead inválido." }, { status: 400 });

  const dados: Record<string, string> = {};
  if (situacaoValida(corpo.situacao)) dados.situacao = corpo.situacao;
  if (origemValida(corpo.origem)) dados.origem = corpo.origem;
  if (typeof corpo.observacao === "string") dados.observacao = limpar(corpo.observacao, 1000);
  if (typeof corpo.interesse === "string") dados.interesse = limpar(corpo.interesse, 200);
  if (typeof corpo.nome === "string" && corpo.nome.trim()) dados.nome = limpar(corpo.nome, 120);
  if (typeof corpo.whatsapp === "string" && corpo.whatsapp.replace(/\D/g, "").length >= 8) dados.whatsapp = limpar(corpo.whatsapp, 30);
  if (Object.keys(dados).length === 0) return NextResponse.json({ erro: "Nada para alterar." }, { status: 400 });

  const lead = await db.lead.update({ where: { id }, data: dados }).catch(() => null);
  if (!lead) return NextResponse.json({ erro: "Lead não encontrado." }, { status: 404 });
  await registrarLog(sessao.nome ?? "?", "alterou lead", `${lead.nome}: ${Object.keys(dados).join(", ")}`);
  return NextResponse.json({ lead: { ...lead, criadoEm: lead.criadoEm.toISOString(), atualizadoEm: lead.atualizadoEm.toISOString() } });
}

export async function DELETE(req: Request) {
  const sessao = await exigirAdminApi();
  if (!sessao) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const corpo = await req.json().catch(() => ({}));
  const id = Number(corpo.id);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ erro: "Lead inválido." }, { status: 400 });
  const lead = await db.lead.delete({ where: { id } }).catch(() => null);
  if (!lead) return NextResponse.json({ erro: "Lead não encontrado." }, { status: 404 });
  await registrarLog(sessao.nome ?? "?", "apagou lead", lead.nome);
  return NextResponse.json({ ok: true });
}
