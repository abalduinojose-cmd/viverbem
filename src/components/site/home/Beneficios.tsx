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
// 13/11/2026 ("modernize os ícones"): ícones em DOIS TONS (traço em ouro
// escuro com as faces num ouro bem claro, IconesVantagensDuo), cada um num
// quadrado arredondado em degradê creme e ouro, com um brilho em cima;
// no celular também (antes o ícone ficava solto).
import { IconeCaixaDuo, IconeEstrelaDuo, IconeFachadaDuo, IconeReceitaDuo } from "@/components/site/ui/IconesVantagensDuo";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, PERFIL_GOOGLE_URL, UNIDADES } from "@/lib/tipos";

const ITENS = [
  { icone: <IconeCaixaDuo tamanho={20} />, titulo: "Enviamos", texto: "para todo o Brasil" },
  { icone: <IconeFachadaDuo tamanho={20} />, titulo: "Retirada grátis", texto: `em ${UNIDADES.length} lojas` },
  { icone: <IconeReceitaDuo tamanho={20} />, titulo: "Receita conferida", texto: "pelo farmacêutico" },
  {
    icone: <IconeEstrelaDuo tamanho={19} />,
    titulo: `${AVALIACOES_GOOGLE_NOTA.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} no Google`,
    texto: `${AVALIACOES_GOOGLE_TOTAL} avaliações`,
    href: PERFIL_GOOGLE_URL,
  },
];

// 16/11/2026 ("coloque arrastando para o lado e com um layout mais clean"):
// no celular o cartão 2x2 virou uma faixa de pílulas brancas que arrasta
// para o lado, cada uma com o ícone num círculo creme e o texto numa linha
// só; a borda direita esmaece para mostrar que tem mais. O computador
// continua igual: quatro colunas separadas por um fio.
const classeItem =
  "group/vt flex h-full items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 ring-1 ring-inset ring-fio shadow-[0_10px_24px_-20px_rgba(16,42,74,0.5)] transition lg:h-[4.75rem] lg:justify-center lg:gap-3.5 lg:rounded-none lg:bg-transparent lg:px-5 lg:py-0 lg:shadow-none lg:ring-0";

export function Beneficios() {
  return (
    <section aria-label="Vantagens" className="entrada-vantagens max-w-7xl mx-auto px-5 md:px-8 pt-3.5 md:pt-5 pb-0 lg:pb-1.5">
      <ul className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pt-1 pb-2.5 scroll-px-5 rolagem-sem-barra [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] md:-mx-8 md:px-8 md:scroll-px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-0 lg:overflow-visible lg:border-y lg:border-fio lg:px-0 lg:py-0 lg:[mask-image:none]">
        {ITENS.map((i, indice) => {
          const miolo = (
            <>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#fdf9f0,#f3e6c8)] text-ouro-escuro ring-1 ring-inset ring-ouro/25 shadow-[inset_0_1px_0_#ffffff] transition duration-300 lg:size-12 lg:rounded-[1rem] lg:shadow-[inset_0_1px_0_#ffffff,0_6px_14px_-10px_rgba(133,101,47,0.6)] lg:group-hover/vt:-translate-y-0.5 lg:group-hover/vt:ring-ouro/50">
                {i.icone}
              </span>
              <span className="min-w-0 whitespace-nowrap leading-tight lg:whitespace-normal">
                <b className="block font-semibold text-navy text-[0.82rem] lg:text-[1rem] lg:tracking-[-0.01em]">{i.titulo}</b>
                <span className="block text-cinza text-[0.74rem] lg:text-[0.84rem] mt-0.5">{i.texto}</span>
              </span>
            </>
          );
          return (
            <li key={i.titulo} className={`shrink-0 snap-start lg:min-w-0 ${indice > 0 ? "lg:border-l lg:border-fio" : ""}`}>
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
