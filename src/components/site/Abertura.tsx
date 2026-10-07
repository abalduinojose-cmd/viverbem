// Abertura da home no modelo de loja (referência biovittare.com.br,
// 06/10/2026): um banner largo e arredondado, em azul-noite com a luz
// azul e dourada da marca, com o título em duas vozes à esquerda e a
// bancada de potes reais à direita (as fotos têm fundo transparente).
// (Um vídeo dos produtos no lugar dos potes, no computador, foi testado
// em 06/10/2026 e reprovado pelo usuário: "volte o que era antes".)
//
// Dois modos (07/10/2026, "prepare a estrutura"): quando a farmácia manda
// a própria ARTE (src/lib/hero.ts lê public/uploads/hero/), a dobra vira a
// arte inteira com só os três botões por cima, centralizados; sem arte,
// fica a composição padrão abaixo. Os botões são os mesmos nos dois
// modos (BotoesDaDobra).
//
// Nenhum pote leva preço nem indicação: é imagem institucional (RDC
// 67/2007, risco avisado e aceito pelo cliente). Os dois potes atuais são
// industrializados com registro (creatina), então não há promessa de
// manipulado na dobra.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { UNIDADES } from "@/lib/tipos";
import type { ArteHero } from "@/lib/hero";
import { CarrosselArte } from "./CarrosselArte";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";

// Os potes, do fundo para a frente. Provisórios (07/10/2026, "coloque os
// produtos em anexo na dobra"), até a arte da farmácia chegar: o Caramelo
// de Creatina e a Creatina Gummy, fotos com fundo transparente. O da
// frente é a maior imagem da dobra, por isso carrega com prioridade (LCP).
const POTES = [
  { src: "/uploads/caramelo-creatina.png", classe: "left-[6%] h-[12.5rem] md:-left-[2%] md:h-[14rem] lg:left-[4%] lg:h-[20rem] z-[3]" },
  { src: "/uploads/creatina-gummy.png", classe: "left-[46%] h-[13.5rem] md:left-[34%] md:h-[15rem] lg:left-[44%] lg:h-[21.5rem] z-[4]", prioridade: true },
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

/** Os três botões da dobra, uma hierarquia: a receita (principal) em
 *  branco com o ícone num círculo de ouro; "Ver produtos" (secundário) em
 *  vidro com o ícone; "Como funciona" (terciário) em vidro mais leve com a
 *  seta num círculo. No celular a receita ocupa a linha e os outros dois
 *  dividem a seguinte; de 1280px em diante os três cabem numa linha. */
function BotoesDaDobra({ centralizados = false }: { centralizados?: boolean }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 ${
        centralizados ? "sm:justify-center" : ""
      }`}
    >
      <BotaoEnviarReceita
        comIcone={false}
        className="botao bg-white text-navy hover:bg-gelo shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] !pl-2 !pr-6 !gap-3"
      >
        <span className="w-10 h-10 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
          <IconeReceita tamanho={20} />
        </span>
        Enviar receita
      </BotaoEnviarReceita>
      <div className={`grid grid-cols-2 gap-3 sm:flex ${centralizados ? "" : "xl:contents"}`}>
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
          className="group botao bg-white/[0.06] border border-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/12 !pl-4 sm:!pl-5 !pr-1.5 sm:!pr-2 !gap-2.5 !text-[0.875rem] sm:!text-[1.05rem]"
        >
          Como funciona
          <span className="shrink-0 inline-flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 ring-1 ring-inset ring-white/20 items-center justify-center transition-transform duration-300 group-hover:translate-y-0.5">
            <SetaBaixo />
          </span>
        </Link>
      </div>
    </div>
  );
}

export function Abertura({ artes = [] }: { artes?: ArteHero[] }) {
  // ---------- Modo arte: a(s) arte(s) da farmácia e só os botões por cima ----------
  // Uma arte: a imagem no fluxo. Duas: alternam num fade (CarrosselArte).
  if (artes.length > 0) {
    const sobreposicao = (
      <>
        {/* O título fica só para leitores de tela: a arte já diz o resto */}
        <h1 id="titulo-abertura" className="sr-only">
          Manipulação Viver Bem
        </h1>
        <div className="absolute inset-x-0 bottom-6 md:inset-0 flex items-end md:items-center justify-center px-5">
          <BotoesDaDobra centralizados />
        </div>
      </>
    );
    return (
      <section aria-labelledby="titulo-abertura" className="max-w-[90rem] mx-auto px-3 md:px-5 pt-3 md:pt-4">
        <div className="em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] bg-navy ring-1 ring-inset ring-white/10 text-white">
          {artes.length === 1 ? (
            <>
              <picture>
                {artes[0].celular && <source media="(max-width: 767px)" srcSet={asset(artes[0].celular)} />}
                <img
                  src={asset(artes[0].desktop)}
                  alt=""
                  width={1920}
                  height={760}
                  decoding="async"
                  fetchPriority="high"
                  className="block w-full h-auto min-h-[26rem] md:min-h-[22rem] md:max-h-[34rem] object-cover"
                />
              </picture>
              {sobreposicao}
            </>
          ) : (
            <CarrosselArte artes={artes}>{sobreposicao}</CarrosselArte>
          )}
        </div>
      </section>
    );
  }

  // ---------- Modo padrão: texto em duas vozes e a bancada de potes ----------
  return (
    <section aria-labelledby="titulo-abertura" className="max-w-[90rem] mx-auto px-3 md:px-5 pt-3 md:pt-4">
      <div className="banner-noite em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-inset ring-white/10 text-white">
        <div className="grid grid-cols-1 md:grid-cols-[6.4fr_5.6fr] md:items-center gap-2 md:gap-8 px-5 pt-7 pb-0 md:px-12 md:py-9 md:min-h-[26rem]">
          {/* ---------- Texto ---------- */}
          <div className="cascata relative z-[1]">
            <p className="rotulo-pilula">Manipulação e homeopatia · Petrópolis, desde 2006</p>

            <h1 id="titulo-abertura" className="titulo-display vao-rotulo !text-white">
              Sua fórmula começa
              <span className="italic">pela receita</span>
            </h1>

            <p className="texto-apoio mt-4 md:mt-5 max-w-[30rem]">
              Envie a foto da prescrição. O farmacêutico confere, passa o valor pelo WhatsApp
              e você retira numa das {UNIDADES.length} lojas ou recebe em casa.
            </p>

            <div className="mt-6">
              <BotoesDaDobra />
            </div>
          </div>

          {/* ---------- A bancada ---------- */}
          {/* A bancada desce um pouco mais devagar que a página (paralaxe, scroll-driven) */}
          <div
            className="cascata paralaxe relative -mx-5 h-[14rem] md:mx-0 md:-mr-6 md:h-[23rem]"
            style={{ "--paralaxe": "3rem" } as React.CSSProperties}
            aria-hidden="true"
          >
            {/* Uma luz azul atrás dos potes e a luz dourada do tampo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] w-[22rem] h-[22rem] md:w-[30rem] md:h-[30rem] rounded-full bg-[radial-gradient(circle,rgba(63,146,224,0.32),transparent_62%)]" />
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
                className={`absolute bottom-3 md:bottom-7 w-auto drop-shadow-[0_10px_12px_rgba(3,12,30,0.5)] ${p.classe}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
