// Vantagens logo abaixo do banner: delivery, retirada, receita conferida
// e a nota do Google. Só o que dá para comprovar.
//
// No celular (08/10/2026, "modernize"): os quatro cartões com o ícone no
// círculo viraram UM cartão com a grade 2x2 dividida por fios, o ícone em
// ouro escuro ao lado do texto, alinhado à esquerda. Do md para cima
// seguem as pílulas numa fileira centralizada, com o ícone no círculo.
// 11/10/2026 ("na versão desktop pode aumentar 15%"): do lg para cima as
// pílulas crescem 15% (altura, círculo do ícone, ícone, letras e recuos).
// 22/10/2026 (auditoria em nove larguras): no tablet em pé (768 a 1023 px)
// só cabiam três pílulas na linha e a quarta ficava órfã embaixo; o cartão
// 2x2 do celular passou a valer até o lg, e as pílulas (já no tamanho
// maior) começam em 1024 px, onde as quatro cabem.
import { IconeMoto } from "./IconeMoto";
import { IconeReceita } from "./BotaoEnviarReceita";
import { IconeLoja, IconeEstrela } from "./IconesVantagens";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, PERFIL_GOOGLE_URL, UNIDADES } from "@/lib/tipos";

const ITENS = [
  { icone: <IconeMoto tamanho={20} />, titulo: "Delivery", texto: "Petrópolis e Região" },
  { icone: <IconeLoja tamanho={18} />, titulo: "Retirada grátis", texto: `em ${UNIDADES.length} lojas` },
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
  "flex h-full items-center gap-2.5 px-3 py-3.5 text-left transition lg:h-16 lg:gap-3.5 lg:rounded-full lg:border lg:border-fio lg:bg-white/90 lg:py-0 lg:pl-2 lg:pr-6 lg:shadow-[0_14px_30px_-24px_rgba(16,42,74,0.5)] lg:backdrop-blur lg:hover:border-ouro/40";

/** Os fios entre as células no celular: à esquerda das ímpares e em cima
 *  da segunda fileira. No computador cada pílula tem a própria borda. */
function fiosDaCelula(i: number) {
  return `border-fio ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t" : ""} lg:border-0`;
}

export function Beneficios() {
  return (
    <section aria-label="Vantagens" className="entrada-vantagens max-w-7xl mx-auto px-5 md:px-8 pt-4 md:pt-5 pb-1.5">
      <ul className="grid grid-cols-2 overflow-hidden rounded-[1.5rem] border border-fio bg-white lg:flex lg:flex-wrap lg:justify-center lg:gap-3 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent">
        {ITENS.map((i, indice) => {
          const miolo = (
            <>
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-ouro-escuro lg:w-[3.15rem] lg:h-[3.15rem] lg:rounded-full lg:bg-ouro/10 lg:[&>svg]:scale-115">
                {i.icone}
              </span>
              <span className="min-w-0 leading-tight">
                <b className="block font-semibold text-navy text-[0.8rem] lg:text-[1.035rem]">{i.titulo}</b>
                <span className="block text-cinza text-[0.75rem] lg:text-[0.9rem] mt-0.5">{i.texto}</span>
              </span>
            </>
          );
          return (
            <li key={i.titulo} className={`min-w-0 lg:shrink-0 ${fiosDaCelula(indice)}`}>
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
