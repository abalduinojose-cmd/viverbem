// Controle de acessos ao painel — EXCLUSIVO DO GESTOR.
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { ListaUsuarios } from "@/components/admin/ListaUsuarios";
import { situacaoDoEmail } from "@/lib/protecaoLogin";

export const dynamic = "force-dynamic";

export default async function PaginaUsuarios() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) redirect("/admin/produtos");

  const usuarios = await db.usuario.findMany({
    orderBy: [{ ativo: "desc" }, { papel: "asc" }, { nome: "asc" }],
  });
  // Quem está com o login travado por tentativas erradas
  const situacoes = await Promise.all(usuarios.map((u) => situacaoDoEmail(u.email)));

  return (
    <ListaUsuarios
      meuId={sessao.usuarioId ?? 0}
      usuarios={usuarios.map((u, i) => ({
        id: u.id,
        bloqueadoAte: situacoes[i]?.bloqueadoAte ? situacoes[i]!.bloqueadoAte!.toISOString() : null,
        falhasLogin: situacoes[i]?.falhas ?? 0,
        nome: u.nome,
        email: u.email,
        papel: u.papel,
        ativo: u.ativo,
        ultimoAcesso: u.ultimoAcesso ? u.ultimoAcesso.toISOString() : null,
        criadoEm: u.criadoEm.toISOString(),
      }))}
    />
  );
}
