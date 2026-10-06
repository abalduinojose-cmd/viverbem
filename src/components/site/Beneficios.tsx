// Faixa de vantagens logo abaixo do banner (modelo de loja): entrega,
// retirada, receita conferida e a nota do Google. Só o que dá para
// comprovar. Substituiu a faixa de números.
import { IconeMoto } from "./IconeMoto";
import { IconeReceita } from "./BotaoEnviarReceita";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, PERFIL_GOOGLE_URL, UNIDADES } from "@/lib/tipos";

function IconeLoja() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconeEstrela() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
    </svg>
  );
}

const BAIRROS = UNIDADES.map((u) => u.bairro)
  .join(", ")
  .replace(/, ([^,]*)$/, " e $1");

const ITENS = [
  { icone: <IconeMoto tamanho={24} />, titulo: "Entrega de moto", texto: "por toda Petrópolis" },
  { icone: <IconeLoja />, titulo: `Retirada sem taxa em ${UNIDADES.length} lojas`, texto: BAIRROS },
  { icone: <IconeReceita tamanho={22} />, titulo: "Receita conferida", texto: "pelo farmacêutico, antes do preparo" },
  {
    icone: <IconeEstrela />,
    titulo: `${AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} no Google`,
    texto: `${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    href: PERFIL_GOOGLE_URL,
    ouro: true,
  },
];

export function Beneficios() {
  return (
    <section aria-label="Vantagens" className="max-w-7xl mx-auto px-5 md:px-8 pt-5 md:pt-6">
      <ul className="grid grid-cols-1 min-[560px]:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 md:gap-y-5 py-5 md:py-6 border-b border-fio">
        {ITENS.map((i) => {
          const miolo = (
            <>
              <span
                className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                  i.ouro ? "bg-ouro/10 text-ouro" : "bg-gelo text-tinta"
                }`}
              >
                {i.icone}
              </span>
              <span className="min-w-0">
                <b className="block font-semibold text-navy text-[0.95rem] leading-tight">{i.titulo}</b>
                <span className="block text-cinza text-sm leading-snug mt-0.5">{i.texto}</span>
              </span>
            </>
          );
          return (
            <li key={i.titulo}>
              {i.href ? (
                <a href={i.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  {miolo}
                </a>
              ) : (
                <div className="flex items-center gap-3">{miolo}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
