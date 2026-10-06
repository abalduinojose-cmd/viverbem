"use client";
// Horário das lojas com o estado ao vivo: além de "Aberto" ou
// "Fechado", diz a que horas fecha (ou quando volta a abrir), que é
// a informação que a pessoa realmente procura.
//
// O cálculo roda só depois de montar, no fuso de Brasília: se saísse
// do servidor, o horário do build ficaria congelado no HTML e poderia
// dizer "aberto" de madrugada.

import { useMemo, useSyncExternalStore } from "react";

// Índice 0 = domingo, igual ao getDay() do JavaScript
const GRADE = [
  { curto: "domingo", abre: null, fecha: null },
  { curto: "segunda", abre: 9, fecha: 19 },
  { curto: "terça", abre: 9, fecha: 19 },
  { curto: "quarta", abre: 9, fecha: 19 },
  { curto: "quinta", abre: 9, fecha: 19 },
  { curto: "sexta", abre: 9, fecha: 19 },
  { curto: "sábado", abre: 9, fecha: 13 },
];

// Como as linhas aparecem na lista (dias úteis agrupados)
export const HORARIOS = [
  { rotulo: "Seg a sex", horas: "9h às 19h", dias: [1, 2, 3, 4, 5] },
  { rotulo: "Sábado", horas: "9h às 13h", dias: [6] },
  { rotulo: "Domingo", horas: "Fechado", dias: [0] },
];

export type EstadoLoja = { aberto: boolean; dia: number; detalhe: string } | null;

/** Próximo dia em que a loja abre, a partir de (e incluindo) `apartirDe`. */
function proximaAbertura(apartirDe: number) {
  for (let salto = 0; salto < 7; salto++) {
    const dia = (apartirDe + salto) % 7;
    if (GRADE[dia].abre !== null) return { dia, salto };
  }
  return null;
}

/** Estado da loja agora, em texto (o mesmo texto no mesmo minuto). */
function calcularChave(): string {
  // Hora de Brasília, independente do fuso de quem acessa
  const agora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const dia = agora.getDay();
  const faixa = GRADE[dia];
  const minutos = agora.getHours() * 60 + agora.getMinutes();

  const aberto =
    faixa.abre !== null &&
    faixa.fecha !== null &&
    minutos >= faixa.abre * 60 &&
    minutos < faixa.fecha * 60;

  let detalhe = "";
  if (aberto) {
    detalhe = `Fecha às ${faixa.fecha}h`;
  } else {
    // Ainda abre hoje? Senão, procura o próximo dia útil
    const abreHojeAinda = faixa.abre !== null && minutos < faixa.abre * 60;
    const proximo = abreHojeAinda ? { dia, salto: 0 } : proximaAbertura((dia + 1) % 7);
    if (proximo) {
      const hora = GRADE[proximo.dia].abre;
      const quando = abreHojeAinda ? "hoje" : proximo.salto === 0 ? "amanhã" : GRADE[proximo.dia].curto;
      detalhe = `Abre ${quando} às ${hora}h`;
    }
  }
  return JSON.stringify({ aberto, dia, detalhe });
}

// Reavalia a cada minuto para virar o selo na hora certa
function assinarMinuto(avisar: () => void) {
  const relogio = setInterval(avisar, 60_000);
  return () => clearInterval(relogio);
}

/** Aberto ou fechado agora. No servidor é sempre null (nada de horário
 *  congelado no HTML); no navegador, o estado do minuto atual. */
export function useEstadoLoja(): EstadoLoja {
  const chave = useSyncExternalStore(assinarMinuto, calcularChave, () => "");
  return useMemo(() => (chave ? (JSON.parse(chave) as EstadoLoja) : null), [chave]);
}

export function HorarioAtendimento() {
  const estado = useEstadoLoja();

  // Ficha clara, no sistema "Receita e rótulo": fio em vez de caixa escura
  return (
    <div className="bg-white border border-fio rounded-caixa overflow-hidden">
      {/* Estado atual */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-fio min-h-[4.25rem]">
        {estado && (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                aria-hidden="true"
                className={`inline-flex w-2.5 h-2.5 shrink-0 rounded-full ${
                  estado.aberto ? "bg-green-500" : "bg-fio"
                }`}
              />
              <div className="min-w-0">
                <p
                  className={`font-semibold leading-tight ${
                    estado.aberto ? "text-green-700" : "text-grafite"
                  }`}
                >
                  {estado.aberto ? "Aberto agora" : "Fechado agora"}
                </p>
                <p className="text-cinza text-xs mt-0.5">{estado.detalhe}</p>
              </div>
            </div>

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-grafite-claro"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5.2l3.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </div>

      {/* Grade da semana, com o dia de hoje em destaque */}
      <ul className="flex flex-col px-5 py-2">
        {HORARIOS.map((linha) => {
          const hoje = estado ? linha.dias.includes(estado.dia) : false;
          return (
            <li
              key={linha.rotulo}
              className={`flex items-center justify-between gap-4 text-sm py-2 ${
                hoje ? "text-grafite" : "text-cinza"
              }`}
            >
              <span className="flex items-center gap-2">
                {hoje && (
                  <span
                    className="w-1 h-3.5 rounded-full bg-tinta -ml-2.5"
                    aria-hidden="true"
                  />
                )}
                {linha.rotulo}
              </span>
              <span className={`tabular-nums ${hoje ? "font-semibold" : ""}`}>
                {linha.horas}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
