// A VIVER BEM, no formato do "Quem somos" da Formularis: abertura com
// foto e a história, depois as linhas no estilo missão/visão/valores,
// o "Como funciona" e as avaliações do Google.
//
// As linhas usam só o que a Viver Bem já tem (história, como trabalha,
// onde está). Missão, visão e valores não foram inventados: se a
// farmácia mandar os dela, entram no lugar destas linhas.
//
// Sistema "Branco, azul e ouro" (06/10/2026): título em navy com a
// palavra-chave em ouro, foto em ladrilho, linhas com fio.
import Link from "next/link";
import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import { obterAvaliacoes } from "@/lib/catalogo";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { ANOS_TRADICAO, UNIDADES, linkMapaUnidade } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "A Viver Bem · Manipulação Viver Bem",
  description: `Há ${ANOS_TRADICAO} anos em Petrópolis, com manipulação e homeopatia. Conheça a nossa história, como funciona o pedido pela receita e as ${UNIDADES.length} lojas.`,
};

const LINHAS = [
  {
    rotulo: "Nossa história",
    texto:
      "Desde 2007 em Petrópolis, com manipulação, homeopatia e atendimento de gente que conhece você pelo nome.",
  },
  {
    rotulo: "Como trabalhamos",
    texto:
      "Toda fórmula parte de uma receita. O farmacêutico confere a prescrição antes do preparo, e o rótulo sai com o nome de quem vai usar, a composição e a validade.",
  },
];

export default async function PaginaSobre() {
  const avaliacoes = await obterAvaliacoes();

  return (
    <main className="flex-1">
      {/* ---------- Abertura: foto e história ---------- */}
      <section id="historia" className="halo-marca px-5 md:px-8 pt-12 md:pt-16 scroll-mt-[calc(var(--altura-cabecalho)+1rem)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
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

          <div className="md:col-span-7 order-1 md:order-2">
            <p className="rotulo">a viver bem</p>
            <h1 className="titulo-secao vao-rotulo">
              {ANOS_TRADICAO} anos cuidando
              <br />
              <span className="italic">de você em Petrópolis</span>
            </h1>
            <p className="texto-apoio mt-6">
              Somos especialistas em saúde personalizada e acreditamos que a beleza
              autêntica é o reflexo de uma autoestima lá no alto. Bem-estar é se sentir bem
              na sua própria pele.
            </p>
            <p className="text-cinza text-lg mt-4 leading-relaxed">
              Manipulação e homeopatia, em {UNIDADES.length} lojas, com o atendimento de
              quem conhece você pelo nome.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Linhas: história, como trabalhamos, onde estamos ---------- */}
      <section className="px-5 md:px-8 pt-16 md:pt-20">
        <div className="escalonado max-w-6xl mx-auto border-t border-fio">
          {LINHAS.map((l) => (
            <div key={l.rotulo} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-10 py-9 md:py-12 border-b border-fio">
              <h2 className="md:col-span-5 text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-tight">
                {l.rotulo}
              </h2>
              <p className="md:col-span-7 text-cinza text-lg leading-relaxed md:pt-2">{l.texto}</p>
            </div>
          ))}

          {/* Onde estamos: as lojas, com o mapa de cada uma */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-10 py-9 md:py-12 border-b border-fio">
            <h2 className="md:col-span-5 text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.035em] text-navy leading-tight">
              Onde estamos
            </h2>
            <div className="md:col-span-7 md:pt-2">
              <p className="text-cinza text-lg leading-relaxed">
                {UNIDADES.length} lojas em Petrópolis. Retire sem taxa na que for mais perto,
                ou receba em casa, de moto.
              </p>
              <ul className="flex flex-wrap gap-2.5 mt-5">
                {UNIDADES.map((u) => (
                  <li key={u.bairro}>
                    <a
                      href={linkMapaUnidade(u.bairro, u.endereco)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip"
                      title={u.endereco}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mr-1.5 -ml-1 text-ouro">
                        <path d="M12 21s-6.5-5.1-6.5-10a6.5 6.5 0 1 1 13 0c0 4.9-6.5 10-6.5 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        <circle cx="12" cy="11" r="2.3" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                      {u.bairro}
                    </a>
                  </li>
                ))}
              </ul>
              <Link href="/lojas" className="botao-link mt-5">
                Horários e contatos das lojas
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
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
