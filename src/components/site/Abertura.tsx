// Abertura da home no modelo de loja (referência biovittare.com.br,
// 06/10/2026): um banner largo e arredondado, em azul-noite com a luz
// azul e dourada da marca, com o título em duas vozes à esquerda e a
// bancada de potes reais à direita (as fotos têm fundo transparente).
// (Um vídeo dos produtos no lugar dos potes, no computador, foi testado
// em 06/10/2026 e reprovado pelo usuário: "volte o que era antes".)
//
// Nenhum pote leva preço nem indicação: é imagem institucional (RDC
// 67/2007, risco avisado e aceito pelo cliente). O rótulo "Preparado
// para ..." em vidro, que ficava sobre a bancada, saiu do site inteiro a
// pedido do usuário em 06/10/2026.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { UNIDADES } from "@/lib/tipos";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";

// Os potes, do fundo para a frente. O Ômega 3 é a maior imagem da dobra,
// por isso é ele que carrega com prioridade (LCP).
const POTES = [
  { src: "/uploads/vitaflex.png", classe: "left-[62%] h-[9rem] md:left-[58%] md:h-[15.5rem] z-[2]" },
  { src: "/uploads/omega3.png", classe: "left-[34%] h-[11rem] md:left-[22%] md:h-[18.5rem] z-[3]", prioridade: true },
  { src: "/uploads/citorepair.png", classe: "left-[8%] h-[8rem] md:-left-[3%] md:h-[14rem] z-[4]" },
  { src: "/uploads/glow-cream.png", classe: "left-1/2 h-[4.75rem] md:left-[44%] md:h-[8.5rem] z-[5]" },
];

// Grade de quatro quadrados, do botão "Ver produtos" (o mesmo desenho da
// pílula "Todos" do cabeçalho)
function IconeGrade() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SetaBaixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Abertura() {
  return (
    <section aria-labelledby="titulo-abertura" className="max-w-[90rem] mx-auto px-3 md:px-5 pt-3 md:pt-4">
      <div className="banner-noite em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] text-white">
        <div className="grid grid-cols-1 md:grid-cols-[6.4fr_5.6fr] md:items-center gap-2 md:gap-8 px-5 pt-7 pb-0 md:px-12 md:py-9 md:min-h-[26rem]">
          {/* ---------- Texto ---------- */}
          <div className="cascata relative z-[1]">
            <p className="rotulo">Manipulação e homeopatia · Petrópolis, desde 2007</p>

            <h1 id="titulo-abertura" className="titulo-display vao-rotulo !text-white">
              Sua fórmula começa
              <span className="italic">pela receita</span>
            </h1>

            <p className="texto-apoio mt-4 md:mt-5 max-w-[30rem]">
              Envie a foto da prescrição. O farmacêutico confere, passa o valor pelo WhatsApp
              e você retira numa das {UNIDADES.length} lojas ou recebe em casa.
            </p>

            {/* Três botões, uma hierarquia: a receita (principal) em branco
                com o ícone num círculo de ouro; "Ver produtos" (secundário) em
                vidro com o ícone; "Como funciona" (terciário) só com o contorno.
                No celular a receita ocupa a linha e os outros dois dividem a
                seguinte, com ícone menor; de 640 a 1279px os dois ficam juntos numa
                segunda linha; de 1280px em diante os três cabem numa linha só
                (medido: 190 + 177 + 175 + 2 x 12 = 566px numa coluna de 572). */}
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <BotaoEnviarReceita
                comIcone={false}
                className="botao bg-white text-navy hover:bg-gelo shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] !pl-2 !pr-6 !gap-3"
              >
                <span className="w-10 h-10 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
                  <IconeReceita tamanho={20} />
                </span>
                Enviar receita
              </BotaoEnviarReceita>
              <div className="grid grid-cols-2 gap-3 sm:flex xl:contents">
                <Link
                  href="/produtos"
                  className="botao bg-white/10 border border-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/15 !pl-1.5 !pr-3 sm:!pl-2 sm:!pr-4 !gap-2 sm:!gap-2.5 !text-[0.875rem] sm:!text-[1.05rem]"
                >
                  <span className="shrink-0 flex w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 items-center justify-center">
                    <IconeGrade />
                  </span>
                  Ver produtos
                </Link>
                <Link
                  href="#como-funciona"
                  className="botao border border-white/20 text-white transition-colors hover:bg-white/10 !px-3 sm:!px-4 !gap-1.5 !text-[0.875rem] sm:!text-[1.05rem]"
                >
                  Como funciona
                  <span className="shrink-0 inline-flex">
                    <SetaBaixo />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* ---------- A bancada ---------- */}
          {/* A bancada desce um pouco mais devagar que a página (paralaxe, scroll-driven) */}
          <div
            className="cascata paralaxe relative -mx-5 h-[13.5rem] md:mx-0 md:-mr-6 md:h-[22rem]"
            style={{ "--paralaxe": "3rem" } as React.CSSProperties}
            aria-hidden="true"
          >
            {/* A luz dourada do tampo */}
            <div className="absolute inset-x-[5%] bottom-0 h-24 md:h-36 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(192,160,96,0.45),transparent_70%)]" />

            {POTES.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.src}
                src={asset(p.src)}
                alt=""
                width={500}
                height={500}
                loading={p.prioridade ? "eager" : "lazy"}
                decoding="async"
                {...(p.prioridade ? { fetchPriority: "high" as const } : {})}
                className={`absolute bottom-3 md:bottom-7 w-auto drop-shadow-[0_24px_22px_rgba(3,12,30,0.55)] ${p.classe}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
