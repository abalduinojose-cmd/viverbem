// Gestão de avaliações — DESATIVADA a pedido do cliente.
// A tela saiu do menu e o acesso direto pela URL é redirecionado.
// As avaliações continuam aparecendo no totem (cadastradas no seed).
// Para reativar: restaure a listagem e devolva o item no menu do
// layout em src/app/admin/(protegido)/layout.tsx.
// Na vitrine estática o redirect é feito pelo navegador.
import { redirect } from "next/navigation";
import { EH_DEMO } from "@/lib/adminDemo";
import { RedirecionarDemo } from "@/components/admin/ModoDemo";

export default function PaginaDepoimentos() {
  if (EH_DEMO) return <RedirecionarDemo para="/admin/produtos" />;
  redirect("/admin/produtos");
}
