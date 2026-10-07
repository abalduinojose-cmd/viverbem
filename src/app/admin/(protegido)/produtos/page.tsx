// Listagem de produtos do painel (carrega tudo no servidor, com a galeria).
// Passa o papel do usuário para o cliente: o colaborador não vê "Apagar",
// não reordena e não publica o que cadastrou (isso é do gestor).
// As categorias alimentam o filtro por categoria.
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { INCLUIR_PRODUTO, categoriaParaDTO, produtoParaDTO } from "@/lib/produtoDTO";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { ListaProdutos } from "@/components/admin/ListaProdutos";

export const dynamic = "force-dynamic";

export default async function PaginaProdutos() {
  const [produtos, categorias, sessao] = await Promise.all([
    db.produto.findMany({
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      include: INCLUIR_PRODUTO,
    }),
    db.categoria.findMany({ orderBy: { ordem: "asc" } }),
    obterSessao(),
  ]);

  return (
    <ListaProdutos
      papel={sessao.papel ?? PAPEL_OPERADOR}
      categorias={categorias.map(categoriaParaDTO)}
      produtos={produtos.map(produtoParaDTO)}
    />
  );
}
