// Abertura da home no modelo de loja (referência biovittare.com.br,
// 06/10/2026): um banner largo e arredondado, em azul-noite com a luz
// azul e dourada da marca, com o título em duas vozes à esquerda e a
// bancada de potes reais à direita (as fotos têm fundo transparente).
//
// O rótulo "Preparado para ..." em vidro é a assinatura do conceito: o
// rótulo de manipulado sai com o nome de quem vai usar. O nome é fictício
// e muda com o dia. Nenhum pote leva preço nem indicação: é imagem
// institucional (RDC 67/2007, risco avisado e aceito pelo cliente).
import Link from "next/link";
import { asset } from "@/lib/asset";
import { UNIDADES } from "@/lib/tipos";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";

// Nomes fictícios para o rótulo (nunca o de um cliente real). A escolha
// é feita uma vez, fora da renderização (componente precisa ser puro),
// pelo dia do mês: muda com o tempo sem variar entre servidor e cliente.
const NOMES = ["Ana Paula", "Marcelo", "Dona Lúcia", "Beatriz", "Seu João", "Renata"];
const NOME_DO_ROTULO = NOMES[new Date().getDate() % NOMES.length];

// Os potes, do fundo para a frente. O Ômega 3 é a maior imagem da dobra,
// por isso é ele que carrega com prioridade (LCP).
const POTES = [
  { src: "/uploads/vitaflex.png", classe: "left-[62%] h-[11.5rem] md:left-[58%] md:h-[19rem] z-[2]" },
  { src: "/uploads/omega3.png", classe: "left-[34%] h-[14rem] md:left-[22%] md:h-[23rem] z-[3]", prioridade: true },
  { src: "/uploads/citorepair.png", classe: "left-[8%] h-[10rem] md:-left-[3%] md:h-[17rem] z-[4]" },
  { src: "/uploads/glow-cream.png", classe: "left-1/2 h-[6rem] md:left-[44%] md:h-[10.5rem] z-[5]" },
];

function SetaBaixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Abertura() {
  const nome = NOME_DO_ROTULO;

  return (
    <section aria-labelledby="titulo-abertura" className="max-w-7xl mx-auto px-5 md:px-8 pt-4 md:pt-6">
      <div className="banner-noite em-noite relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] text-white">
        <div className="grid grid-cols-1 md:grid-cols-[6.4fr_5.6fr] md:items-center gap-4 md:gap-8 px-6 pt-9 pb-0 md:px-14 md:py-14 md:min-h-[32rem]">
          {/* ---------- Texto ---------- */}
          <div className="cascata relative z-[1]">
            <p className="rotulo">Manipulação e homeopatia · Petrópolis, desde 2007</p>

            <h1 id="titulo-abertura" className="titulo-display vao-rotulo !text-white">
              Sua fórmula começa
              <span className="italic">pela receita</span>
            </h1>

            <p className="texto-apoio mt-5 md:mt-6 max-w-[30rem]">
              Envie a foto da prescrição. O farmacêutico confere, passa o valor pelo WhatsApp
              e você retira numa das {UNIDADES.length} lojas ou recebe em casa.
            </p>

            <div className="mt-7 md:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <BotaoEnviarReceita className="botao bg-white text-navy hover:bg-gelo shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]" />
              <Link href="#como-funciona" className="botao-link self-center sm:self-auto">
                Como funciona
                <SetaBaixo />
              </Link>
            </div>
          </div>

          {/* ---------- A bancada ---------- */}
          <div className="cascata relative -mx-6 h-[17rem] md:mx-0 md:-mr-6 md:h-[27rem]" aria-hidden="true">
            {/* A luz dourada do tampo */}
            <div className="absolute inset-x-[5%] bottom-0 h-28 md:h-44 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(192,160,96,0.45),transparent_70%)]" />

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

            {/* O rótulo, em vidro. O giro fica no filho porque a cascata
                anima o transform do próprio item e apagaria a rotação. */}
            <div className="absolute right-6 top-0 md:right-auto md:left-0 md:top-6 z-[6]">
              <div className="rotate-[4deg] md:-rotate-[5deg] bg-white/10 backdrop-blur-md border border-white/25 rounded-lg px-3 py-2.5 md:px-4 md:py-3 flex flex-col gap-1 shadow-[0_24px_50px_-20px_rgba(3,12,30,0.6)]">
                <span className="rotulo text-[0.56rem] tracking-[0.2em]">Manipulação Viver Bem</span>
                <span className="text-[0.82rem] font-medium leading-tight">
                  Preparado para{" "}
                  <i className="font-[family-name:var(--font-destaque)] not-italic italic text-[1.15rem] text-ouro-claro border-b border-dashed border-ouro-claro/60 px-0.5">
                    {nome}
                  </i>
                </span>
                <span className="text-[0.6rem] text-white/60 leading-tight">Uso conforme prescrição · Val. 90 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
