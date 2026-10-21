"use client";
// O selo "Aberto agora · fecha às 19h" ao vivo, numa pílula branca
// (21/10/2026). Nasce vazio no servidor (sem horário congelado no HTML) e
// no navegador mostra o estado do minuto. Usado nas páginas das lojas e
// de contato.
import { useEstadoLoja } from "./HorarioAtendimento";

export function SeloAoVivo({ className = "" }: { className?: string }) {
  const estado = useEstadoLoja();
  if (!estado) {
    return <p className={`inline-flex items-center h-10 rounded-full bg-white ring-1 ring-fio px-4 text-sm text-cinza shadow-sm ${className}`}>Horário de atendimento</p>;
  }
  return (
    <p role="status" className={`inline-flex items-center gap-2.5 h-10 rounded-full bg-white ring-1 ring-fio pl-3.5 pr-4 text-sm shadow-sm ${className}`}>
      <span aria-hidden="true" className="relative flex size-2.5">
        {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/50 animate-ping" />}
        <span className={`relative size-2.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/60"}`} />
      </span>
      <span className={`font-semibold ${estado.aberto ? "text-green-700" : "text-grafite"}`}>{estado.aberto ? "Aberto agora" : "Fechado agora"}</span>
      <span className="text-cinza">· {estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1)}</span>
    </p>
  );
}
