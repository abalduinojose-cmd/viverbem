// A VIVER BEM: a história da farmácia contada como uma linha do tempo.
//
// Texto da própria farmácia (passado pelo usuário em 07/10/2026): 1999 a
// Drogaria Viver Bem na Posse, outubro de 2006 a farmácia de manipulação,
// 2012 Corrêas, 2017 Centro, 20 anos construindo cuidado. Pedido: "deixe
// essa parte bem conceitual e moderna". Composição: abertura com a frase
// do propósito e três números grandes em ouro; a linha do tempo em quatro
// cartões ligados pela linha de ouro que cresce com a rolagem (mesma
// receita do "Como funciona"); e o fecho em azul-noite com o "20" gigante.
// Depois, "Como funciona" e as avaliações do Google.
//
// Sistema "Branco, azul e ouro" (06/10/2026): título em navy com a
// palavra-chave em ouro, foto em ladrilho, pílulas e cartões brancos.
import type { Metadata } from "next";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { obterAvaliacoes } from "@/lib/catalogo";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { BotaoEnviarReceita, IconeReceita } from "@/components/site/BotaoEnviarReceita";
import { ANOS_TRADICAO, UNIDADES } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "A Viver Bem · Manipulação Viver Bem",
  description: `Desde 1999 em Petrópolis, ${ANOS_TRADICAO} anos de manipulação e homeopatia. Conheça a nossa história, como funciona o pedido pela receita e as ${UNIDADES.length} lojas.`,
};

// Os marcos, na ordem. A parte entre *asteriscos* do título sai em itálico ouro.
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

function SetaDireita() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function PaginaSobre() {
  const avaliacoes = await obterAvaliacoes();

  return (
    <main className="flex-1">
      {/* ---------- Abertura: o propósito, os números e a foto ---------- */}
      <section
        id="historia"
        className="halo-marca px-5 md:px-8 pt-10 md:pt-14 scroll-mt-[calc(var(--altura-cabecalho)+1rem)]"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-7">
            <p className="rotulo-pilula">a viver bem · desde 1999</p>
            <h1 className="titulo-secao vao-rotulo">
              Tudo começou <span className="italic">com um propósito</span>
            </h1>
            <p className="texto-apoio mt-6 max-w-xl">
              Em 1999, nasceu a Drogaria Viver Bem no bairro da Posse, em Petrópolis. Desde o
              primeiro dia, o nosso propósito sempre foi simples e poderoso: cuidar das pessoas
              de forma próxima, humana e personalizada.
            </p>

            {/* Três números, em ouro */}
            <ul className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
              {NUMEROS.map((n) => (
                <li key={n.rotulo} className="border-l border-fio pl-4">
                  <span className="numero-tinta text-[2.4rem] md:text-[3rem]">{n.valor}</span>
                  <span className="block mt-1 text-sm text-cinza leading-snug">{n.rotulo}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="ladrilho ladrilho-luz p-3 max-w-md mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/fotos/laboratorio.webp")}
                alt="Técnica no laboratório de manipulação da Viver Bem"
                width={576}
                height={720}
                decoding="async"
                className="w-full aspect-[4/5] object-cover rounded-[1.25rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- A linha do tempo ---------- */}
      <section aria-labelledby="titulo-linha-do-tempo" className="secao max-w-6xl mx-auto px-5 md:px-8">
        <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">a evolução</p>
            <h2 id="titulo-linha-do-tempo" className="titulo-secao vao-rotulo">
              Do balcão <span className="italic">ao cuidado sob medida</span>
            </h2>
          </div>
          <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5">
            Queríamos ir além do atendimento tradicional. O compromisso com o bem-estar gerou
            frutos e nos permitiu expandir a nossa presença pela região.
          </p>
        </div>

        <ol className="revelar vao-titulo relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-4">
          <span aria-hidden="true" className="trilha-h-linha hidden lg:block" />
          <span aria-hidden="true" className="trilha-h-progresso hidden lg:block" />
          {MARCOS.map((m) => (
            <li key={m.ano} className="relative pt-7">
              {/* O ano, saindo pela borda de cima do cartão */}
              <span aria-hidden="true" className="marco-ano">
                {m.ano}
              </span>
              <div className="h-full rounded-[1.5rem] bg-white ring-1 ring-fio/80 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)] p-5 pt-8 md:p-6 md:pt-9 flex flex-col transition duration-300 hover:-translate-y-0.5 hover:ring-ouro/40">
                <h3 className="text-[1.15rem] md:text-[1.25rem] font-semibold tracking-[-0.03em] text-navy leading-snug">
                  <span className="sr-only">{m.ano}: </span>
                  {m.titulo}
                </h3>
                <p className="mt-2 text-grafite text-[0.95rem] leading-relaxed">{m.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- 20 anos construindo cuidado ---------- */}
      <section aria-labelledby="titulo-vinte-anos" className="secao max-w-6xl mx-auto px-5 md:px-8">
        <div className="revelar relative overflow-hidden rounded-[2rem] banner-noite em-noite text-white ring-1 ring-inset ring-white/10 p-7 md:p-10 lg:p-12 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
          <span aria-hidden="true" className="malha-banner" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(192,160,96,0.3),transparent_62%)]"
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-4 flex items-end gap-3">
              <span className="numero-tinta text-[6.5rem] md:text-[8rem] lg:text-[9rem] leading-[0.85]">{ANOS_TRADICAO}</span>
              <span className="pb-3 md:pb-4 text-white/80 text-[1.1rem] md:text-[1.25rem] leading-tight max-w-[8ch]">
                anos construindo cuidado
              </span>
            </div>
            <div className="lg:col-span-8">
              <h2 id="titulo-vinte-anos" className="titulo-banner text-[1.7rem] md:text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
                Uma trajetória guiada pela ciência, <span className="italic">pelo carinho e pela dedicação.</span>
              </h2>
              <p className="mt-4 text-white/75 text-[1rem] md:text-[1.05rem] leading-relaxed max-w-[60ch]">
                Ao longo de {ANOS_TRADICAO} anos de história, construímos uma trajetória sólida guiada
                pela ciência, pelo carinho e pela dedicação exclusiva a cada vida que cruza o
                nosso caminho. Mais do que preparar fórmulas, temos o privilégio de acompanhar
                gerações inteiras de famílias. E, enquanto celebramos essa jornada, seguimos
                olhando para o futuro com a mesma paixão e o mesmo propósito do nosso primeiro
                dia.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <BotaoEnviarReceita
                  comIcone={false}
                  className="botao bg-white text-navy hover:bg-gelo !pl-2 !pr-6 !gap-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
                >
                  <span className="w-10 h-10 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center">
                    <IconeReceita tamanho={20} />
                  </span>
                  Enviar receita
                </BotaoEnviarReceita>
                <Link href="/lojas" className="botao border border-white/20 text-white transition-colors hover:bg-white/10 !gap-2">
                  Nossas {UNIDADES.length} lojas
                  <SetaDireita />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Como funciona ---------- */}
      <ComoFunciona />

      {/* ---------- Avaliações ---------- */}
      {avaliacoes.length > 0 && (
        <div id="avaliacoes" className="scroll-mt-[calc(var(--altura-cabecalho)+1rem)] pb-20">
          <CarrosselAvaliacoes avaliacoes={avaliacoes} />
        </div>
      )}
    </main>
  );
}
