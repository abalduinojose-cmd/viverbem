"use client";
// Botão de logout do painel.
import { useRouter } from "next/navigation";

export function BotaoSair() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={sair}
      className="w-full flex items-center gap-2.5 rounded-xl px-3 h-10 text-sm font-medium text-cinza border border-fio hover:text-carimbo hover:border-carimbo/40 hover:bg-carimbo/5 transition-colors"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <path
          d="M15 7.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1.5M10 12h10m0 0-3-3m3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Sair do painel
    </button>
  );
}
