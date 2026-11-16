// 404 para endereço que não existe no site (e o 404.html da prévia
// estática). Fora do layout do site: a página traz a própria logo.
import type { Metadata } from "next";
import { PaginaNaoEncontrada } from "@/components/site/PaginaNaoEncontrada";

export const metadata: Metadata = {
  title: "Página não encontrada · Manipulação Viver Bem",
  robots: { index: false, follow: true },
};

export default function NaoEncontrada() {
  return <PaginaNaoEncontrada comMarca />;
}
