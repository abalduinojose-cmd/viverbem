// Folha: cada seção da home é uma lâmina com o topo arredondado que
// desliza por cima da anterior ao rolar (ver .folha em globals.css). A
// variante "noite" é a única folha escura do site, a vitrine; a "gelo"
// tem um degradê bem leve.
export function Folha({
  tema = "papel",
  className = "",
  children,
}: {
  tema?: "papel" | "gelo" | "noite";
  className?: string;
  children: React.ReactNode;
}) {
  const variante = tema === "noite" ? "folha-noite em-noite" : tema === "gelo" ? "folha-gelo" : "";
  return <div className={`folha ${variante} ${className}`}>{children}</div>;
}
