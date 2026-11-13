// Abertura da home no modelo de loja (referência biovittare.com.br,
// 06/10/2026): um banner largo e arredondado, em azul-noite com a luz
// azul e dourada da marca. Desde 08/10/2026 o conteúdo do banner é a
// animação de 7 s (heroAnimado/), no celular e no desktop; a bancada de
// potes estática saiu. (Um vídeo dos produtos no computador foi testado
// em 06/10/2026 e reprovado pelo usuário: "volte o que era antes".)
//
// Dois modos (07/10/2026, "prepare a estrutura"): quando a farmácia manda
// a própria ARTE (src/lib/hero.ts lê public/uploads/hero/), a dobra vira a
// arte inteira com só os botões por cima, centralizados; sem arte,
// fica a animação. Os botões são os mesmos nos dois modos (BotoesDaDobra).
//
// Nenhum pote leva preço nem indicação: é imagem institucional (RDC
// 67/2007, risco avisado e aceito pelo cliente). Os dois potes que ficam
// na frente no fecho da animação são industrializados com registro
// (creatina).
import Link from "next/link";
import { INSTAGRAM_URL, UNIDADES } from "@/lib/tipos";
import { linkComMensagem } from "@/lib/whatsapp";
import { IconeInstagram, IconeWhatsApp } from "./icones";
import type { ArteHero } from "@/lib/hero";
import { CarrosselArte } from "./CarrosselArte";
import { MidiaBanner } from "./MidiaBanner";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { HeroAnimado } from "./heroAnimado/HeroAnimado";

// Grade de quatro quadrados, do botão "Ver produtos" (o mesmo desenho da
// pílula "Todos" do cabeçalho)
function IconeGrade() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/** Os QUATRO atalhos da dobra, no celular e no computador (12 e
 *  13/11/2026). Pedidos: "divida em quatro: enviar receita e fale conosco
 *  em cima, ver produtos e Instagram embaixo"; os ladrilhos com o ícone em
 *  cima do nome pareciam quebrados e viraram pílulas; o "Fale conosco"
 *  verde foi recusado ("o verde não combina"); e no dia 13, "coloque na
 *  versão desktop, um do lado do outro; modernize mais; não está tão
 *  centralizado". Cada pílula leva o ícone num círculo e o NOME
 *  CENTRALIZADO junto com ele. A receita é branca com o fio de ouro que
 *  corre a borda e o ícone num círculo em degradê de ouro; os outros três
 *  em vidro, com o ícone num círculo de vidro mais claro. Celular: 2x2;
 *  de 640px: quatro numa linha; de 1024px: pílulas maiores, do tamanho do
 *  texto. "Como funciona" saiu (o cabeçalho do computador tem a pílula e,
 *  no celular, a seção vem logo abaixo). */
function BotoesDaDobra({ centralizados = false }: { centralizados?: boolean }) {
  const pilula =
    "group/at flex h-[3.25rem] min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-[0.82rem] font-semibold leading-none tracking-[-0.015em] whitespace-nowrap transition active:scale-[0.97] lg:h-14 lg:gap-2.5 lg:pl-2 lg:pr-6 lg:text-[1rem]";
  const circulo =
    "flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow] duration-300 lg:size-10";
  const circuloVidro = `${circulo} bg-white/[0.14] ring-1 ring-inset ring-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover/at:bg-white/[0.24]`;
  return (
    <div
      className={`grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:flex lg:w-fit lg:gap-3 ${centralizados ? "lg:mx-auto" : ""}`}
    >
      <BotaoEnviarReceita comIcone={false} className={`botao-vivo ${pilula}`}>
        <span className={`${circulo} bg-[image:var(--ouro-degrade)] text-navy shadow-[0_6px_14px_-8px_rgba(133,101,47,0.9)]`}>
          <IconeReceita tamanho={16} />
        </span>
        Enviar receita
      </BotaoEnviarReceita>
      <a
        href={linkComMensagem("Olá! Vim pelo site da Viver Bem e gostaria de falar com vocês.")}
        target="_blank"
        rel="noopener noreferrer"
        className={`botao-vidro ${pilula}`}
      >
        <span className={circuloVidro}>
          <IconeWhatsApp tamanho={16} />
        </span>
        Fale conosco
      </a>
      <Link href="/produtos" className={`botao-vidro ${pilula}`}>
        <span className={circuloVidro}>
          <IconeGrade />
        </span>
        Ver produtos
      </Link>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`botao-vidro ${pilula}`}>
        <span className={circuloVidro}>
          <IconeInstagram tamanho={16} />
        </span>
        Instagram
      </a>
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
              {/* Foto, GIF ou vídeo (14/10/2026, ver MidiaBanner) */}
              <MidiaBanner
                desktop={artes[0].desktop}
                celular={artes[0].celular}
                prioridade
                largura={1920}
                altura={760}
                className="block w-full h-auto min-h-[26rem] md:min-h-[22rem] md:max-h-[34rem] object-cover"
              />
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
  // 12/10/2026 ("na versão mobile a cena está muito grande de altura,
  // diminua 10%" e depois "volte com o tamanho da cena, quero que o
  // retângulo azul diminua 10%"): o banner do celular foi de 2x a largura
  // (teto 46rem) para 1,8x (teto 41,4rem), 10% mais baixo, e a cena segue
  // no tamanho de antes: o palco do retrato em cena.ts (FORMATOS.dobra)
  // também encurtou 10%, apertando só o vão entre os passos e os potes.
  // (HeroAnimado), no celular e no desktop: a frase, os potes e os passos
  // estão dentro dela. O h1 e o texto de apoio seguem no HTML só para
  // leitores de tela e o Google, e os botões ficam por cima, na base (à
  // esquerda no desktop, alinhados com o título da animação).
  return (
    <section aria-labelledby="titulo-abertura" className="max-w-[90rem] mx-auto px-3 md:px-5 pt-3 md:pt-4">
      <div className="banner-noite em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-inset ring-white/10 text-white h-[min(calc((100vw-1.5rem)*1.8),41.4rem)] md:h-[30rem] lg:h-[34rem] xl:h-[36rem]">
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
