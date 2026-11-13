"use client";
// O horário da página das lojas (13/11/2026, "modernize toda essa página,
// inclusive lá embaixo, no final, o horário"): no alto, o estado ao vivo
// numa linha ("Aberto agora · fecha às 19h"); embaixo, TRÊS CARTÕES de dias
// (segunda a sexta, sábado, domingo) com a hora grande, e o dia de hoje
// aceso em azul-noite com a etiqueta "hoje". No servidor nada vem aceso
// (sem horário congelado no HTML); o navegador acende o cartão do dia.
import { HORARIOS, useEstadoLoja } from "./HorarioAtendimento";

const ROTULOS: Record<string, string> = {
  "Seg a sex": "Segunda a sexta",
  Sábado: "Sábado",
  Domingo: "Domingo",
};

export function HorarioLojas() {
  const estado = useEstadoLoja();
  return (
    <div>
      {/* O estado ao vivo */}
      <p role="status" className="flex min-h-6 items-center gap-2.5 text-[0.95rem]">
        {estado && (
          <>
            <span aria-hidden="true" className="relative flex size-2.5">
              {estado.aberto && <span className="absolute inset-0 animate-ping rounded-full bg-green-500/50" />}
              <span className={`relative size-2.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-grafite-claro"}`} />
            </span>
            <span className={`font-semibold ${estado.aberto ? "text-green-700" : "text-navy"}`}>
              {estado.aberto ? "Aberto agora" : "Fechado agora"}
            </span>
            <span className="text-cinza">· {estado.detalhe.charAt(0).toLowerCase() + estado.detalhe.slice(1)}</span>
          </>
        )}
      </p>

      {/* Os três cartões de dias */}
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {HORARIOS.map((linha) => {
          const hoje = estado ? linha.dias.includes(estado.dia) : false;
          const fechado = linha.horas === "Fechado";
          const [abre, fecha] = fechado ? [null, null] : linha.horas.split(" às ");
          return (
            <li
              key={linha.rotulo}
              className={`relative flex items-center justify-between gap-3 rounded-[1.25rem] px-5 py-4 transition-colors duration-300 sm:flex-col sm:items-start sm:justify-start sm:gap-2 sm:py-5 ${
                hoje
                  ? "bg-navy text-white shadow-[0_22px_40px_-26px_rgba(13,35,64,0.8)]"
                  : "bg-white ring-1 ring-inset ring-fio"
              }`}
            >
              <span className={`flex items-center gap-2 whitespace-nowrap text-[0.82rem] font-medium ${hoje ? "text-white/70" : "text-cinza"}`}>
                {ROTULOS[linha.rotulo] ?? linha.rotulo}
                {/* "hoje": ao lado do dia no celular, no canto do cartão de 640px em diante */}
                {hoje && (
                  <span className="rounded-full bg-[image:var(--ouro-degrade)] px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-navy sm:absolute sm:right-3 sm:top-3">
                    hoje
                  </span>
                )}
              </span>
              {fechado ? (
                <span className={`text-[1.35rem] font-semibold tracking-[-0.03em] ${hoje ? "text-white/80" : "text-grafite-claro"}`}>Fechado</span>
              ) : (
                <span className={`text-[1.35rem] font-semibold tracking-[-0.03em] tabular-nums ${hoje ? "text-white" : "text-navy"}`}>
                  {abre}
                  <span className={`mx-1.5 text-[0.9rem] font-normal ${hoje ? "text-white/60" : "text-cinza"}`}>às</span>
                  {fecha}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
