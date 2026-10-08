// Abertura da home no modelo de loja (referência biovittare.com.br,
// 06/10/2026): um banner largo e arredondado, em azul-noite com a luz
// azul e dourada da marca. Desde 08/10/2026 o conteúdo do banner é a
// animação de 7 s (heroAnimado/), no celular e no desktop; a bancada de
// potes estática saiu. (Um vídeo dos produtos no computador foi testado
// em 06/10/2026 e reprovado pelo usuário: "volte o que era antes".)
//
// Dois modos (07/10/2026, "prepare a estrutura"): quando a farmácia manda
// a própria ARTE (src/lib/hero.ts lê public/uploads/hero/), a dobra vira a
// arte inteira com só os três botões por cima, centralizados; sem arte,
// fica a animação. Os botões são os mesmos nos dois modos (BotoesDaDobra).
//
// Nenhum pote leva preço nem indicação: é imagem institucional (RDC
// 67/2007, risco avisado e aceito pelo cliente). Os dois potes que ficam
// na frente no fecho da animação são industrializados com registro
// (creatina).
import Link from "next/link";
import { asset } from "@/lib/asset";
import { UNIDADES } from "@/lib/tipos";
import type { ArteHero } from "@/lib/hero";
import { CarrosselArte } from "./CarrosselArte";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { HeroAnimado } from "./heroAnimado/HeroAnimado";

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

/** Os três botões da dobra, em três níveis bem distintos (07/10/2026,
 *  "modernize os botões, mais clean": os círculos internos saíram;
 *  08/10/2026, "moderno e atual, condizente com a animação da hero"):
 *  a receita (principal) em branco com o ícone em ouro escuro e o fio de
 *  ouro que percorre a borda (.botao-vivo), "Ver produtos" (secundário) em
 *  vidro (.botao-vidro) e "Como funciona" (terciário) só texto com a seta
 *  que acena para baixo. No celular a receita ocupa a linha e os outros
 *  dois dividem a seguinte; de 1280px em diante os três cabem numa linha. */
function BotoesDaDobra({ centralizados = false }: { centralizados?: boolean }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 ${
        centralizados ? "sm:justify-center" : ""
      }`}
    >
      <BotaoEnviarReceita
        comIcone={false}
        className="botao botao-vivo !gap-2.5"
      >
        <span className="text-ouro-escuro">
          <IconeReceita tamanho={20} />
        </span>
        Enviar receita
      </BotaoEnviarReceita>
      <div className={`grid grid-cols-2 gap-3 sm:flex ${centralizados ? "" : "xl:contents"}`}>
        <Link
          href="/produtos"
          className="botao botao-vidro !gap-2.5 !px-4 sm:!px-6 !text-[0.95rem] sm:!text-[1.05rem]"
        >
          <IconeGrade />
          Ver produtos
        </Link>
        <Link
          href="#como-funciona"
          className="botao text-white/85 transition-colors hover:text-white !gap-2 !px-3 sm:!px-4 !text-[0.95rem] sm:!text-[1.05rem]"
        >
          Como funciona
          <span className="acenar-baixo">
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

  // ---------- Modo padrão: a animação da dobra ----------
  // Desde 08/10/2026 (pedido do usuário) o banner é a animação de 7 s
  // (HeroAnimado), no celular e no desktop: a frase, os potes e os passos
  // estão dentro dela. O h1 e o texto de apoio seguem no HTML só para
  // leitores de tela e o Google, e os botões ficam por cima, na base (à
  // esquerda no desktop, alinhados com o título da animação).
  return (
    <section aria-labelledby="titulo-abertura" className="max-w-[90rem] mx-auto px-3 md:px-5 pt-3 md:pt-4">
      <div className="banner-noite em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-inset ring-white/10 text-white h-[min(calc((100vw-1.5rem)*2),46rem)] md:h-[30rem] lg:h-[34rem] xl:h-[36rem]">
        <HeroAnimado />
        <div className="absolute inset-x-0 bottom-0 z-[1] px-5 pb-6 md:px-12 md:pb-10">
          <h1 id="titulo-abertura" className="sr-only">
            Especialistas em saúde personalizada
          </h1>
          <p className="sr-only">
            Manipulação e homeopatia em Petrópolis desde 2006. Envie a foto da prescrição: o
            farmacêutico confere, passa o valor pelo WhatsApp e você retira numa das{" "}
            {UNIDADES.length} lojas ou recebe em casa.
          </p>
          <BotoesDaDobra />
        </div>
      </div>
    </section>
  );
}
