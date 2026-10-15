// GET /api/admin/pedidos/novos — quantos pedidos estão como "Novo" e qual
// foi o último a chegar. O painel consulta de tempos em tempos para avisar
// o gestor de pedido novo (15/10/2026). Só o gestor.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessao = await exigirAdminApi();
  if (!sessao) return NextResponse.json({ erro: "Não autorizado." }, { status: 403 });
  const [novos, ultimo] = await Promise.all([
    db.cliente.count({ where: { status: "NOVO" } }),
    db.cliente.findFirst({ orderBy: { id: "desc" }, select: { id: true, nome: true, codigo: true, receita: true } }),
  ]);
  return NextResponse.json({ novos, ultimo }, { headers: { "Cache-Control": "no-store" } });
}
