// Log de alterações do painel: quem alterou o quê e quando.
// SOMENTE gestor. Registros gerados automaticamente pelas rotas de API.
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { CabecalhoAdmin, Inicial, VazioAdmin } from "@/components/admin/PecasAdmin";

export const dynamic = "force-dynamic";

export default async function PaginaLog() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) {
    redirect("/admin/produtos");
  }

  // Mostra os 200 registros mais recentes
  const registros = await db.logAlteracao.findMany({
    orderBy: { criadoEm: "desc" },
    take: 200,
  });

  const formatarData = (data: Date) =>
    data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-3xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Log de alterações"
        descricao={`Registro automático das últimas ${registros.length} ações no painel.`}
      />

      <div className="mt-6 bg-white rounded-2xl border border-fio overflow-hidden">
        {registros.length === 0 ? (
          <VazioAdmin
            titulo="Nenhuma alteração registrada"
            descricao="Assim que alguém mexer no catálogo, aparece aqui."
          />
        ) : (
          registros.map((r) => (
            <div
              key={r.id}
              className="px-5 py-4 border-b border-fio last:border-b-0 flex items-start gap-3.5 hover:bg-nevoa/70 transition-colors"
            >
              {/* Inicial de quem fez, para bater o olho e achar */}
              <Inicial nome={r.usuario} tamanho="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-navy leading-snug text-[0.95rem]">
                  <b className="font-semibold">{r.usuario}</b> {r.acao}{" "}
                  <span className="text-cinza">{r.detalhe}</span>
                </p>
                <p className="text-xs text-grafite-claro tabular-nums mt-1">{formatarData(r.criadoEm)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
