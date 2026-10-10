// /admin — porta de entrada: o gestor cai na visão geral, o operador
// vai direto para os produtos, que é tudo o que ele pode mexer.
// Na vitrine estática não há redirect de servidor: o navegador decide.
import { redirect } from "next/navigation";
import { EH_DEMO } from "@/lib/adminDemo";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { EntradaDemo } from "@/components/admin/ModoDemo";

export default async function PaginaAdmin() {
  if (EH_DEMO) return <EntradaDemo />;
  const sessao = await obterSessao();
  redirect(sessao.papel === PAPEL_ADMIN ? "/admin/painel" : "/admin/produtos");
}
