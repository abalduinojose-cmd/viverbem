// Vantagens logo abaixo do banner: delivery, retirada, receita conferida
// e a nota do Google. Só o que dá para comprovar.
//
// No celular (08/10/2026, "modernize"): os quatro cartões com o ícone no
// círculo viraram UM cartão com a grade 2x2 dividida por fios, o ícone em
// ouro escuro ao lado do texto, alinhado à esquerda. Do md para cima
// seguem as pílulas numa fileira centralizada, com o ícone no círculo.
import { IconeMoto } from "./IconeMoto";
import { IconeReceita } from "./BotaoEnviarReceita";
import { IconeLoja, IconeEstrela } from "./IconesVantagens";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, PERFIL_GOOGLE_URL, UNIDADES } from "@/lib/tipos";

const ITENS = [
  { icone: <IconeMoto tamanho={20} />, titulo: "Delivery", texto: "por toda Petrópolis" },
  { icone: <IconeLoja tamanho={18} />, titulo: "Retirada sem taxa", texto: `em ${UNIDADES.length} lojas` },
  { icone: <IconeReceita tamanho={18} />, titulo: "Receita conferida", texto: "pelo farmacêutico" },
  {
    icone: <IconeEstrela tamanho={17} />,
    titulo: `${AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} no Google`,
    texto: `${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    href: PERFIL_GOOGLE_URL,
  },
];

// Célula do cartão no celular (ícone ao lado, à esquerda); pílula no computador
const classeItem =
  "flex h-full items-center gap-2.5 px-3 py-3.5 text-left transition md:h-14 md:gap-3 md:rounded-full md:border md:border-fio md:bg-white/90 md:py-0 md:pl-1.5 md:pr-5 md:shadow-[0_14px_30px_-24px_rgba(54,52,107,0.5)] md:backdrop-blur md:hover:border-ouro/40";

/** Os fios entre as células no celular: à esquerda das ímpares e em cima
 *  da segunda fileira. No computador cada pílula tem a própria borda. */
function fiosDaCelula(i: number) {
  return `border-fio ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t" : ""} md:border-0`;
}

export function Beneficios() {
  return (
    <section aria-label="Vantagens" className="max-w-7xl mx-auto px-5 md:px-8 pt-4 md:pt-5 pb-1.5">
      <ul className="grid grid-cols-2 overflow-hidden rounded-[1.5rem] border border-fio bg-white md:flex md:flex-wrap md:justify-center md:gap-2.5 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent">
        {ITENS.map((i, indice) => {
          const miolo = (
            <>
              <span className="shrink-0 w-6 h-6 md:w-11 md:h-11 md:rounded-full flex items-center justify-center text-ouro-escuro md:bg-ouro/10">
                {i.icone}
              </span>
              <span className="min-w-0 leading-tight">
                <b className="block font-semibold text-navy text-[0.8rem] md:text-[0.9rem]">{i.titulo}</b>
                <span className="block text-cinza text-[0.75rem] md:text-[0.78rem] mt-0.5">{i.texto}</span>
              </span>
            </>
          );
          return (
            <li key={i.titulo} className={`min-w-0 md:shrink-0 ${fiosDaCelula(indice)}`}>
              {i.href ? (
                <a href={i.href} target="_blank" rel="noopener noreferrer" className={classeItem}>
                  {miolo}
                </a>
              ) : (
                <div className={classeItem}>{miolo}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
