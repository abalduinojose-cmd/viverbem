// Pílula "ver mais" das vitrines, do catálogo e da página do produto: o
// texto e a seta num círculo em ouro, que vira azul-noite no hover.
import Link from "next/link";

function SetaDireita({ tamanho = 14 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
      className={`group/vm inline-flex items-center gap-2.5 h-10 pl-4 pr-1.5 rounded-full border border-fio bg-white text-navy text-[0.88rem] font-medium whitespace-nowrap transition-colors hover:border-navy/40 ${className}`}
    >
      {children}
      <span className="w-7 h-7 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center transition-colors group-hover/vm:bg-none group-hover/vm:bg-navy group-hover/vm:text-white">
        <SetaDireita />
      </span>
    </Link>
  );
}
