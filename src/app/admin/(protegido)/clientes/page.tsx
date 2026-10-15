// Pedidos feitos pelo site e a base de clientes (marketing e recompra).
// Desde 15/10/2026 com a situação de cada pedido (ver lib/pedidos.ts) e o
// filtro inicial por ?status= (o aviso de pedido novo leva para os novos).
// SOMENTE ADMIN (painel do gestor).
// Na vitrine estática (DEMO=1) os pedidos são FICTÍCIOS, gerados no build
// (dado de cliente de verdade não vai para um site público).
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EH_DEMO, lerAdminDemo } from "@/lib/adminDemo";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { ListaClientes } from "@/components/admin/ListaClientes";

export const dynamic = "force-dynamic";

export default async function PaginaClientes({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  if (EH_DEMO) {
    const a = await lerAdminDemo();
    return <ListaClientes clientes={a.pedidos} />;
  }

  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  const { status } = await searchParams;
  const clientes = await db.cliente.findMany({
    orderBy: { criadoEm: "desc" },
    take: 500,
  });

  return (
    <ListaClientes
      statusInicial={status}
      clientes={clientes.map((c) => ({
        id: c.id,
        nome: c.nome,
        whatsapp: c.whatsapp,
        pagamento: c.pagamento,
        entrega: c.entrega,
        local: c.local,
        receita: c.receita,
        codigo: c.codigo,
        totalCentavos: c.totalCentavos,
        itens: c.itens,
        criadoEm: c.criadoEm.toISOString(),
        status: c.status,
        statusEm: c.statusEm?.toISOString() ?? null,
      }))}
    />
  );
}
