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
// 12/11/2026 ("melhore essa seção para desktop e melhore os ícones"): no
// computador as quatro vantagens viraram quatro colunas iguais, separadas por
// um fio, com o ícone num círculo gelo com contorno de ouro, o título maior e
// o texto embaixo; a nota do Google acende no hover. Ícones novos: a fachada
// da loja (era o pino) e a prancheta com o visto (era a folha da receita).
// No celular o cartão 2x2 continua, com os ícones novos.
import { IconeCaixa } from "./IconeCaixa";
import { IconeEstrela, IconeFachada, IconeReceitaConferida } from "./IconesVantagens";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, PERFIL_GOOGLE_URL, UNIDADES } from "@/lib/tipos";

const ITENS = [
  { icone: <IconeCaixa tamanho={20} />, titulo: "Enviamos", texto: "para todo o Brasil" },
  { icone: <IconeFachada tamanho={19} />, titulo: "Retirada grátis", texto: `em ${UNIDADES.length} lojas` },
  { icone: <IconeReceitaConferida tamanho={19} />, titulo: "Receita conferida", texto: "pelo farmacêutico" },
  {
    icone: <IconeEstrela tamanho={17} />,
    titulo: `${AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} no Google`,
    texto: `${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    href: PERFIL_GOOGLE_URL,
  },
];

// Célula do cartão no celular (ícone ao lado, à esquerda); pílula no computador
// 25/10/2026 (clean, marca de beleza): no computador as pílulas com borda,
// sombra e vidro viraram texto com o ícone em ouro, separados por um fio
const classeItem =
  "group/vt flex h-full items-center gap-2.5 px-3 py-3.5 text-left transition lg:h-[4.75rem] lg:justify-center lg:gap-3.5 lg:py-0 lg:px-5";

/** Os fios entre as células no celular: à esquerda das ímpares e em cima
 *  da segunda fileira. No computador cada pílula tem a própria borda. */
function fiosDaCelula(i: number) {
  return `border-fio ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t" : ""} lg:border-t-0 ${i > 0 ? "lg:border-l" : "lg:border-0"}`;
}

export function Beneficios() {
  return (
    <section aria-label="Vantagens" className="entrada-vantagens max-w-7xl mx-auto px-5 md:px-8 pt-4 md:pt-5 pb-1.5">
      <ul className="grid grid-cols-2 overflow-hidden rounded-[1.5rem] border border-fio bg-white lg:grid-cols-4 lg:overflow-visible lg:rounded-none lg:border-0 lg:border-y lg:border-fio lg:bg-transparent">
        {ITENS.map((i, indice) => {
          const miolo = (
            <>
              <span className="shrink-0 w-6 h-6 flex items-center justify-center text-ouro-escuro lg:size-11 lg:rounded-full lg:bg-gelo lg:ring-1 lg:ring-inset lg:ring-ouro/30 lg:transition-colors lg:duration-300 lg:group-hover/vt:bg-white lg:group-hover/vt:ring-ouro/60">
                {i.icone}
              </span>
              <span className="min-w-0 leading-tight">
                <b className="block font-semibold text-navy text-[0.8rem] lg:text-[1rem] lg:tracking-[-0.01em]">{i.titulo}</b>
                <span className="block text-cinza text-[0.75rem] lg:text-[0.84rem] mt-0.5">{i.texto}</span>
              </span>
            </>
          );
          return (
            <li key={i.titulo} className={`min-w-0 ${fiosDaCelula(indice)}`}>
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
