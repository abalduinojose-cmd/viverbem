// Cadastro de novo produto.
// Na vitrine estática (DEMO=1) as categorias vêm do retrato.
import { db } from "@/lib/db";
import { EH_DEMO, SESSAO_DEMO, lerAdminDemo } from "@/lib/adminDemo";
import { obterSessao } from "@/lib/sessao";
import { categoriaParaDTO } from "@/lib/produtoDTO";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { FormProduto } from "@/components/admin/FormProduto";

export const dynamic = "force-dynamic";

export default async function PaginaNovoProduto() {
  if (EH_DEMO) {
    const a = await lerAdminDemo();
    return <FormProduto categorias={a.categorias} papel={SESSAO_DEMO.papel} />;
  }
  const [categorias, sessao] = await Promise.all([
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
    obterSessao(),
  ]);
  return <FormProduto categorias={categorias.map(categoriaParaDTO)} papel={sessao.papel ?? PAPEL_OPERADOR} />;
}
