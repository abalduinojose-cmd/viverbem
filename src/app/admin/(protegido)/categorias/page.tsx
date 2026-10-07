// Gestão de categorias do painel. Gestor e colaborador entram; o que
// cada um pode fazer é decidido na tela (apagar e reordenar são do gestor).
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { ListaCategorias } from "@/components/admin/ListaCategorias";

export const dynamic = "force-dynamic";

export default async function PaginaCategorias() {
  const [sessao, categorias] = await Promise.all([
    obterSessao(),
    db.categoria.findMany({
      orderBy: { ordem: "asc" },
      include: { _count: { select: { produtos: true } } },
    }),
  ]);

  return (
    <ListaCategorias
      papel={sessao.papel ?? PAPEL_OPERADOR}
      categorias={categorias.map((c) => ({
        id: c.id,
        nome: c.nome,
        slug: c.slug,
        ordem: c.ordem,
        visivel: c.visivel,
        vitrineHome: c.vitrineHome,
        totalProdutos: c._count.produtos,
      }))}
    />
  );
}
