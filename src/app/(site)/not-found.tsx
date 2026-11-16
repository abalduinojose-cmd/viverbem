// 404 de produto ou linha que saiu do catálogo (notFound() nas páginas do
// site): aparece dentro do cabeçalho e do rodapé.
import { PaginaNaoEncontrada } from "@/components/site/institucional/PaginaNaoEncontrada";

export default function NaoEncontradaNoSite() {
  return <PaginaNaoEncontrada />;
}
