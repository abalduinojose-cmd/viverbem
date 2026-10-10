// Edição de um produto existente (com a galeria de fotos).
// Na vitrine estática (DEMO=1) cada produto do retrato vira uma página
// gerada no build (generateStaticParams); fora dela a lista fica vazia e
// a página é montada a cada pedido.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EH_DEMO, SESSAO_DEMO, lerAdminDemo } from "@/lib/adminDemo";
import { obterSessao } from "@/lib/sessao";
import { INCLUIR_PRODUTO, categoriaParaDTO, produtoParaDTO } from "@/lib/produtoDTO";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { FormProduto } from "@/components/admin/FormProduto";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  if (!EH_DEMO) return [];
  const a = await lerAdminDemo();
  return a.produtos.map((p) => ({ id: String(p.id) }));
}

export default async function PaginaEditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (EH_DEMO) {
    const a = await lerAdminDemo();
    const produto = a.produtos.find((p) => p.id === Number(id));
    if (!produto) notFound();
    return <FormProduto categorias={a.categorias} produto={produto} papel={SESSAO_DEMO.papel} />;
  }

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
