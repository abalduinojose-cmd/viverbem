// Revela o conteúdo quando ele entra na tela, ao rolar.
//
// Desde 06/10/2026 é só CSS (ver .revelar em globals.css): a animação
// anda com a rolagem da própria pessoa (scroll-driven), então roda também
// com "reduzir movimento", de forma contida. Sem suporte do navegador, o
// conteúdo aparece direto. Por não ter estado nem efeito, pode ser usado
// de qualquer componente, inclusive de servidor.
export function Revelar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`revelar ${className}`}>{children}</div>;
}
