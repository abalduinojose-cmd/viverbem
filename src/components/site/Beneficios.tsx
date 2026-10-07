// Vantagens logo abaixo do banner: delivery, retirada, receita conferida
// e a nota do Google. No celular são quatro cartões em 2x2 com ícone e
// textos centralizados (pedidos do usuário em 06/10/2026); do md para cima viram
// pílulas numa fileira centralizada. Ícones em ouro. Só o que dá para
// comprovar.
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

// Cartão no celular (ícone em cima), pílula no computador (ícone ao lado)
const classeItem =
  "flex h-full flex-col items-center text-center gap-2.5 rounded-2xl border border-fio bg-white/90 px-3 py-4 md:shadow-[0_14px_30px_-24px_rgba(16,42,74,0.5)] transition hover:border-ouro/40 md:h-14 md:flex-row md:items-center md:text-left md:gap-3 md:rounded-full md:py-0 md:pl-1.5 md:pr-5 md:backdrop-blur";

export function Beneficios() {
  return (
    <section aria-label="Vantagens" className="max-w-7xl mx-auto px-5 md:px-8 pt-4 md:pt-5 pb-1.5">
      <ul className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:justify-center">
        {ITENS.map((i) => {
          const miolo = (
            <>
              <span className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-ouro/10 text-ouro-escuro">
                {i.icone}
              </span>
              <span className="min-w-0 leading-tight">
                <b className="block font-semibold text-navy text-[0.85rem] md:text-[0.9rem]">{i.titulo}</b>
                <span className="block text-cinza text-[0.75rem] md:text-[0.78rem] mt-0.5">{i.texto}</span>
              </span>
            </>
          );
          return (
            <li key={i.titulo} className="min-w-0 md:shrink-0">
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
