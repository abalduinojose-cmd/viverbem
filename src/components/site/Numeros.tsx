// Os números da casa, na primeira folha que cobre a abertura: quatro
// ladrilhos brancos com o número em ouro, a unidade na sans e o rótulo em
// caixa alta. Só o que dá para comprovar: anos, lojas, nota do Google e a
// entrega de moto.
import {
  ANOS_TRADICAO,
  UNIDADES,
  AVALIACOES_GOOGLE_TOTAL,
  AVALIACOES_GOOGLE_NOTA,
  PERFIL_GOOGLE_URL,
} from "@/lib/tipos";

const BAIRROS = UNIDADES.map((u) => u.bairro)
  .join(", ")
  .replace(/, ([^,]*)$/, " e $1");

const NUMEROS = [
  { numero: `+${ANOS_TRADICAO}`, unidade: "anos", rotulo: "de tradição em Petrópolis" },
  { numero: `${UNIDADES.length}`, unidade: "lojas", rotulo: BAIRROS },
  {
    numero: AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 }),
    unidade: "no Google",
    rotulo: `${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    href: PERFIL_GOOGLE_URL,
  },
  { numero: "Entrega", unidade: "de moto", rotulo: "por toda Petrópolis" },
];

export function Numeros() {
  return (
    <section aria-label="A Viver Bem em números" className="max-w-7xl mx-auto px-5 md:px-8 pt-6 md:pt-10">
      <ul className="escalonado grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {NUMEROS.map((n) => {
          const miolo = (
            <>
              <p className="flex flex-wrap items-baseline gap-x-2 md:gap-x-2.5 text-navy">
                <span className="numero-tinta text-[length:var(--tam-numero)]">{n.numero}</span>
                <span className="text-base md:text-[1.05rem] whitespace-nowrap text-grafite">{n.unidade}</span>
              </p>
              <p className="rotulo !text-cinza mt-2.5 md:mt-3">{n.rotulo}</p>
            </>
          );
          return (
            <li key={n.rotulo} className="ladrilho p-5 md:px-7 md:py-6">
              {n.href ? (
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-opacity hover:opacity-80"
                >
                  {miolo}
                </a>
              ) : (
                miolo
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
