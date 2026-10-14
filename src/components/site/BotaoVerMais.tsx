// "Ver mais" das vitrines, do catálogo, da Saúde da Mulher e da página do
// produto. Era uma pílula com borda e a seta num círculo de ouro;
// 14/10/2026 ("melhore todos esses links, quero algo mais clean"): ficou
// só o texto com a seta. No hover, um fio de ouro cresce embaixo do texto
// e a seta dá um passo. A altura mínima de 44px segue, para o toque.
import Link from "next/link";
import { SetaDireita } from "./icones";

export function BotaoVerMais({
  href,
  children = "ver mais",
  className = "",
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group/vm inline-flex items-center gap-2 min-h-11 text-[0.9rem] font-medium text-navy whitespace-nowrap transition-colors hover:text-tinta ${className}`}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[image:var(--ouro-degrade)] transition-transform duration-300 group-hover/vm:scale-x-100"
        />
      </span>
      <span className="text-ouro-escuro transition-transform duration-300 group-hover/vm:translate-x-1">
        <SetaDireita tamanho={16} />
      </span>
    </Link>
  );
}
