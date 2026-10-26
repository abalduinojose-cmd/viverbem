// Log de alterações do painel: quem alterou o quê e quando.
// SOMENTE gestor. Registros gerados automaticamente pelas rotas de API.
// Na vitrine estática (DEMO=1) os registros vêm do retrato.
// 26/10/2026: a tela virou a linha do tempo com números, busca e filtros
// (ver components/admin/LogAlteracoes).
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { EH_DEMO, lerAdminDemo } from "@/lib/adminDemo";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { agoraEmMs } from "@/lib/leads";
import { LogAlteracoes } from "@/components/admin/LogAlteracoes";

export const dynamic = "force-dynamic";

export default async function PaginaLog() {
  const sessao = await obterSessao();
  if (!EH_DEMO && sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  // Mostra os 300 registros mais recentes
  const registros = EH_DEMO
    ? (await lerAdminDemo()).log
    : (await db.logAlteracao.findMany({ orderBy: { criadoEm: "desc" }, take: 300 })).map((r) => ({
        id: r.id,
        usuario: r.usuario,
        acao: r.acao,
        detalhe: r.detalhe,
        criadoEm: r.criadoEm.toISOString(),
      }));

  return <LogAlteracoes registros={registros} agora={agoraEmMs()} />;
}
