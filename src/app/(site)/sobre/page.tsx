// A VIVER BEM: a história da farmácia contada em capítulos, com efeitos
// de rolagem.
//
// Texto da própria farmácia (passado pelo usuário em 07/10/2026): 1999 a
// Drogaria Viver Bem na Posse, outubro de 2006 a farmácia de manipulação,
// 2012 Corrêas, 2017 Centro, 20 anos construindo cuidado. As três fotos
// vieram dos posts do Instagram da farmácia (public/fotos/sobre/), cada
// uma com a frase do próprio post.
//
// Terceira versão (08/10/2026, pedido: "clean e moderna, com efeitos de
// scroll para dar mais valor, design profissional feito em JavaScript",
// refinada com a skill ui-ux-pro-max, padrão "narrativa por capítulos"):
//   abertura   o título sobe palavra por palavra, a foto se abre e os três
//              números rolam como contador (na carga)
//   01         o propósito: o parágrafo da fundação, grande, acende
//              palavra por palavra enquanto a pessoa lê rolando
//   02         a evolução: no computador a seção prende e os marcos andam
//              para o lado com a régua dos anos; no celular, o trilho de
//              ouro desce marcando cada ano
//   03         a folha escura dos 20 anos: o número cresce, a foto tem
//              paralaxe e o miolo recua quando a folha seguinte sobe
//   04         o futuro: a citação acende como o manifesto, com a foto
// e depois o "Como funciona" e as avaliações. Uma barra de ouro no alto
// mostra quanto falta da história. O movimento é do motor em
// src/components/site/historia/motor.ts (um laço só, rolagem nativa, roda
// também no Safari do iPhone); sem JavaScript tudo aparece no estado final.
//
// Sistema "Branco, azul e ouro" (06/10/2026): título em navy com a
// palavra-chave em ouro, fios em vez de caixas, uma folha escura só.
import type { Metadata } from "next";
import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import { obterAvaliacoes } from "@/lib/catalogo";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { ANOS_TRADICAO, UNIDADES } from "@/lib/tipos";
import { ProgressoLeitura } from "@/components/site/historia/ProgressoLeitura";
import { FotoParalaxe } from "@/components/site/historia/FotoParalaxe";
import { NumeroRolante } from "@/components/site/historia/NumeroRolante";
import { TextoRevelado } from "@/components/site/historia/TextoRevelado";
import { LinhaDoTempo } from "@/components/site/historia/LinhaDoTempo";
import { CapituloVinteAnos } from "@/components/site/historia/CapituloVinteAnos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "A Viver Bem · Manipulação Viver Bem",
  description: `Desde 1999 em Petrópolis, ${ANOS_TRADICAO} anos de manipulação e homeopatia. Conheça a nossa história, como funciona o pedido pela receita e as ${UNIDADES.length} lojas.`,
};

// Os marcos, na ordem.
const MARCOS = [
  {
    ano: "1999",
    titulo: "Nasce a Drogaria Viver Bem",
    texto:
      "No bairro da Posse, em Petrópolis. Desde o primeiro dia, o nosso propósito sempre foi simples e poderoso: cuidar das pessoas de forma próxima, humana e personalizada.",
  },
  {
    ano: "2006",
    titulo: "O cuidado sob medida",
    texto:
      "Em outubro, um passo transformador: nasce a nossa farmácia de manipulação, na loja matriz da Posse, o ponto de partida de tudo. Tratamentos individualizados, desenvolvidos para a necessidade única de cada paciente, com fórmulas manipuladas com rigor científico.",
  },
  {
    ano: "2012",
    titulo: "Corrêas",
    texto: "Inauguração da filial em Corrêas, levando saúde personalizada para ainda mais famílias.",
  },
  {
    ano: "2017",
    titulo: "Centro de Petrópolis",
    texto:
      "Chegada ao Centro, ampliando a nossa missão com tecnologia, excelência em qualidade e o mesmo acolhimento de sempre.",
  },
];

const NUMEROS = [
  { valor: "1999", rotulo: "o começo, na Posse" },
  { valor: String(ANOS_TRADICAO), rotulo: "anos de manipulação" },
  { valor: String(UNIDADES.length), rotulo: "lojas em Petrópolis" },
];

// Para todas as âncoras da página caírem abaixo do cabeçalho preso
const ANCORA = "scroll-mt-[calc(var(--altura-cabecalho)+1rem)]";

/** As palavras do título, cada uma dentro de uma máscara, subindo uma depois da outra */
function PalavrasQueSobem({ texto, inicio = 0 }: { texto: string; inicio?: number }) {
  return (
    <>
      {texto.split(" ").map((palavra, i, todas) => (
        <Fragment key={i}>
          <span className="mascara">
            <span className="palavra" style={{ "--i": inicio + i } as CSSProperties}>
              {palavra}
            </span>
          </span>
          {i < todas.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function SetaDireita() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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

export default async function PaginaSobre() {
  const avaliacoes = await obterAvaliacoes();

  return (
    <main className="flex-1">
      {/* A barra de leitura: enche até o fim do capítulo 04 */}
      <ProgressoLeitura ateId="futuro" />

      {/* ---------- Abertura ---------- */}
      <section id="historia" aria-labelledby="titulo-historia" className={`halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-10 md:pb-14 ${ANCORA}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula entra">a viver bem · desde 1999</p>
            <h1 id="titulo-historia" className="historia-titulo mt-5 md:mt-6">
              <span className="linha">
                <PalavrasQueSobem texto="Tudo começou" />
              </span>{" "}
              <span className="linha voz">
                <PalavrasQueSobem texto="com um propósito" inicio={2} />
              </span>
            </h1>

            {/* Os três números, rolando como contador */}
            <ul className="entra mt-9 md:mt-11 grid grid-cols-3 border-y border-fio max-w-xl" style={{ "--atraso": "550ms" } as CSSProperties}>
              {NUMEROS.map((n, i) => (
                <li key={n.rotulo} className={`py-5 md:py-6 ${i > 0 ? "border-l border-fio pl-4 md:pl-6" : "pr-4"}`}>
                  <NumeroRolante valor={n.valor} className="text-[clamp(2.3rem,1.6rem+2.2vw,3.5rem)]" />
                  <span className="mt-2 block text-[0.8rem] md:text-sm text-cinza leading-snug">{n.rotulo}</span>
                </li>
              ))}
            </ul>

            <a href="#proposito" className="entra botao-link mt-8 !text-[0.95rem]" style={{ "--atraso": "850ms" } as CSSProperties}>
              A nossa história
              <span className="acenar-baixo">
                <SetaBaixo />
              </span>
            </a>
          </div>

          <figure className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <FotoParalaxe
              src="/fotos/sobre/geracoes.webp"
              alt="A equipe da Viver Bem na entrada de uma das lojas, entre as prateleiras"
              largura={638}
              altura={611}
              revelar="carga"
              prioritaria
              className="w-full aspect-[4/5] lg:aspect-square rounded-[1.75rem] shadow-[0_30px_60px_-40px_rgba(16,42,74,0.5)]"
            />
            <figcaption className="legenda-foto entra mt-4" style={{ "--atraso": "1000ms" } as CSSProperties}>
              Acompanhamos gerações inteiras de famílias.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- 01 · O propósito ---------- */}
      <section id="proposito" aria-labelledby="titulo-proposito" className={`capitulo max-w-6xl mx-auto px-5 md:px-8 ${ANCORA}`}>
        <p className="rotulo-pilula">01 · o propósito</p>
        <h2 id="titulo-proposito" className="sr-only">
          O propósito
        </h2>
        <TextoRevelado
          className="manifesto mt-8 md:mt-10 max-w-[25em]"
          partes={[
            {
              texto:
                "Em 1999, nasceu a Drogaria Viver Bem no bairro da Posse, em Petrópolis. Desde o primeiro dia, o nosso propósito sempre foi simples e poderoso: cuidar das pessoas de forma",
            },
            { texto: "próxima, humana e personalizada.", destaque: true },
          ]}
        />
      </section>

      {/* ---------- 02 · A evolução ---------- */}
      <section id="evolucao" aria-labelledby="titulo-linha-do-tempo" className={`capitulo-tempo relative ${ANCORA}`}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">02 · a evolução</p>
            <h2 id="titulo-linha-do-tempo" className="titulo-secao vao-rotulo">
              Do balcão <span className="italic">ao cuidado sob medida</span>
            </h2>
          </div>
          <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5">
            Queríamos ir além do atendimento tradicional. O compromisso com o bem-estar gerou
            frutos e nos permitiu expandir a nossa presença pela região.
          </p>
        </div>
        <div className="mt-[clamp(2.5rem,1.5rem+3vw,4.5rem)]">
          <LinhaDoTempo
            marcos={MARCOS}
            foto={{
              ano: "2006",
              src: "/fotos/laboratorio.webp",
              alt: "Técnica no laboratório de manipulação da Viver Bem",
              largura: 576,
              altura: 720,
            }}
          />
        </div>
      </section>

      {/* ---------- 03 · 20 anos: a folha escura ---------- */}
      <CapituloVinteAnos anos={ANOS_TRADICAO} lojas={UNIDADES.length} />

      {/* ---------- 04 · O futuro: a folha branca sobe por cima da escura ---------- */}
      <section
        id="futuro"
        aria-labelledby="titulo-futuro"
        className={`relative z-[2] -mt-9 rounded-t-[2.25rem] md:rounded-t-[3rem] bg-white shadow-[0_-30px_60px_-40px_rgba(13,35,64,0.45)] ${ANCORA}`}
      >
        <div className="capitulo max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">04 · o mesmo propósito</p>
            <h2 id="titulo-futuro" className="sr-only">
              O mesmo propósito
            </h2>
            <TextoRevelado
              como="blockquote"
              className="citacao-historia mt-6 max-w-[15em]"
              partes={[
                { texto: "E seguimos olhando para o futuro com" },
                { texto: "o mesmo propósito do primeiro dia.", destaque: true },
              ]}
            />
            <p className="texto-apoio mt-7 max-w-lg">
              Três lojas em Petrópolis, a mesma equipe de farmacêuticos e o mesmo jeito de
              atender: pela receita, com a fórmula feita para cada pessoa.
            </p>
            <Link href="/lojas" className="botao-link mt-7">
              Conheça as {UNIDADES.length} lojas
              <SetaDireita />
            </Link>
          </div>
          <FotoParalaxe
            src="/fotos/sobre/futuro.webp"
            alt="A equipe da Viver Bem dentro da loja, ao lado da poltrona de atendimento"
            largura={599}
            altura={598}
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none aspect-square rounded-[1.75rem] shadow-[0_30px_60px_-40px_rgba(16,42,74,0.5)]"
          />
        </div>
      </section>

      {/* ---------- Como funciona ---------- */}
      <ComoFunciona />

      {/* ---------- Avaliações ---------- */}
      {avaliacoes.length > 0 && (
        <div id="avaliacoes" className={`pb-14 ${ANCORA}`}>
          <CarrosselAvaliacoes avaliacoes={avaliacoes} />
        </div>
      )}
    </main>
  );
}
