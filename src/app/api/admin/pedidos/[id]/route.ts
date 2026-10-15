// PATCH /api/admin/pedidos/[id] { status } — muda a situação de um pedido
// (15/10/2026). Só o gestor, como a tela de pedidos. Vai para o log.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";
import { ROTULO_STATUS, statusValido } from "@/lib/pedidos";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) return NextResponse.json({ erro: "Apenas o gestor muda a situação dos pedidos." }, { status: 403 });

  const { id } = await contexto.params;
  const corpo = await req.json().catch(() => ({}));
  const status: unknown = corpo.status;
  if (!statusValido(status)) return NextResponse.json({ erro: "Situação inválida." }, { status: 400 });

  const anterior = await db.cliente.findUnique({ where: { id: Number(id) } });
  if (!anterior) return NextResponse.json({ erro: "Pedido não encontrado." }, { status: 404 });
  if (anterior.status === status) return NextResponse.json({ ok: true, status: anterior.status });

  const pedido = await db.cliente.update({
    where: { id: anterior.id },
    data: { status, statusEm: new Date() },
  });
  await registrarLog(sessao.nome ?? "?", "mudou o pedido", `${pedido.codigo} de ${pedido.nome}: ${ROTULO_STATUS[status]}`);
  return NextResponse.json({ ok: true, status: pedido.status, statusEm: pedido.statusEm?.toISOString() });
}
