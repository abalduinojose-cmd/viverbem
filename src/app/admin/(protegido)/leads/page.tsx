// Leads (26/10/2026): quem entrou em contato com a farmácia, separado por
// semana, mês e ano. Entram sozinhos quando alguém finaliza um pedido pelo
// site e à mão pelo painel. Desde 27/10/2026 gestor E colaborador entram
// (a equipe do WhatsApp também cadastra e acompanha); só o gestor apaga.
// Na vitrine estática (DEMO=1) os leads são FICTÍCIOS, gerados no build.
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
    return <ListaLeads leads={a.leads ?? []} agora={agoraEmMs()} podeApagar />;
  }

  const sessao = await obterSessao();

  const leads = await db.lead.findMany({ orderBy: { criadoEm: "desc" }, take: 2000 });
  return (
    <ListaLeads
      agora={agoraEmMs()}
      podeApagar={sessao.papel === PAPEL_ADMIN}
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
