// Leads (26/10/2026): quem entrou em contato com a farmácia, separado por
// semana, mês e ano. Entram sozinhos quando alguém finaliza um pedido pelo
// site e à mão pelo painel. SOMENTE ADMIN (dado de cliente, como os pedidos).
// Na vitrine estática (DEMO=1) os leads são FICTÍCIOS, gerados no build.
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EH_DEMO, lerAdminDemo } from "@/lib/adminDemo";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { ListaLeads } from "@/components/admin/ListaLeads";
import { agoraEmMs } from "@/lib/leads";

export const dynamic = "force-dynamic";

export default async function PaginaLeads() {
  if (EH_DEMO) {
    const a = await lerAdminDemo();
    return <ListaLeads leads={a.leads ?? []} agora={agoraEmMs()} />;
  }

  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  const leads = await db.lead.findMany({ orderBy: { criadoEm: "desc" }, take: 2000 });
  return (
    <ListaLeads
      agora={agoraEmMs()}
      leads={leads.map((l) => ({
        id: l.id,
        nome: l.nome,
        whatsapp: l.whatsapp,
        origem: l.origem,
        interesse: l.interesse,
        situacao: l.situacao,
        observacao: l.observacao,
        codigoPedido: l.codigoPedido,
        criadoEm: l.criadoEm.toISOString(),
        atualizadoEm: l.atualizadoEm.toISOString(),
      }))}
    />
  );
}
