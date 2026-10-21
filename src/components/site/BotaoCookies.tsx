"use client";
// O link "Cookies" do rodapé: abre o aviso de novo para mudar a escolha.
import { pedirParaAbrirCookies } from "./consentimento";

export function BotaoCookies({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={pedirParaAbrirCookies} className={className}>
      Cookies
    </button>
  );
}
