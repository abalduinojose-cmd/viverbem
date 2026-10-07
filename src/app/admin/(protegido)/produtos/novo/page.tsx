// Cadastro de novo produto.
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { categoriaParaDTO } from "@/lib/produtoDTO";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { FormProduto } from "@/components/admin/FormProduto";

export const dynamic = "force-dynamic";

export default async function PaginaNovoProduto() {
  const [categorias, sessao] = await Promise.all([
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
    obterSessao(),
  ]);
  return <FormProduto categorias={categorias.map(categoriaParaDTO)} papel={sessao.papel ?? PAPEL_OPERADOR} />;
}
