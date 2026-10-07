// Layout das páginas protegidas do painel: exige sessão válida
// (senão redireciona para o login) e monta a casca com o menu.
//
// Dois painéis (07/10/2026):
//   GESTOR (ADMIN): o grupo "Gestão" vem primeiro (visão geral com os
//     números, clientes, log, acessos) e depois tudo do catálogo.
//   COLABORADOR (OPERADOR): só o catálogo e o site: produtos (com fotos e
//     preço no site), categorias (criar, renomear, tirar do site) e as
//     seções da home com a arte da dobra. Não vê números, clientes, log
//     nem acessos, e não apaga nem publica.
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { PAPEL_ADMIN, PAPEL_OPERADOR } from "@/lib/tipos";
import { CascaAdmin, type ItemNav } from "@/components/admin/CascaAdmin";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sessao = await obterSessao();
  if (!sessao.usuarioId) {
    redirect("/admin/login");
  }
  const ehGestor = sessao.papel === PAPEL_ADMIN;

  const itens: ItemNav[] = [];
  if (ehGestor) {
    itens.push(
      { href: "/admin/painel", rotulo: "Visão geral", icone: "painel", grupo: "Gestão" },
      { href: "/admin/clientes", rotulo: "Clientes captados", icone: "clientes", grupo: "Gestão" },
      { href: "/admin/log", rotulo: "Log de alterações", icone: "log", grupo: "Gestão" },
      { href: "/admin/usuarios", rotulo: "Acessos ao painel", icone: "acessos", grupo: "Gestão" }
    );
  }
  itens.push(
    { href: "/admin/produtos", rotulo: "Produtos e preços", icone: "produtos", grupo: "Catálogo" },
    { href: "/admin/categorias", rotulo: "Categorias", icone: "categorias", grupo: "Catálogo" },
    { href: "/admin/site", rotulo: "Home e arte da dobra", icone: "vitrine", grupo: "Catálogo" },
    { href: "/", rotulo: "Ver o site", icone: "site", grupo: "Site", externo: true }
  );

  return (
    <CascaAdmin itens={itens} nome={sessao.nome ?? "Usuário"} papel={sessao.papel ?? PAPEL_OPERADOR}>
      {children}
    </CascaAdmin>
  );
}
