// Edição de um produto existente (com a galeria de fotos).
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { INCLUIR_PRODUTO, categoriaParaDTO, produtoParaDTO } from "@/lib/produtoDTO";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { FormProduto } from "@/components/admin/FormProduto";

export const dynamic = "force-dynamic";

export default async function PaginaEditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [produto, categorias, sessao] = await Promise.all([
    db.produto.findUnique({ where: { id: Number(id) }, include: INCLUIR_PRODUTO }),
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
    obterSessao(),
  ]);

  if (!produto) notFound();

  return (
    <FormProduto
      categorias={categorias.map(categoriaParaDTO)}
      produto={produtoParaDTO(produto)}
      papel={sessao.papel ?? PAPEL_OPERADOR}
    />
  );
}
