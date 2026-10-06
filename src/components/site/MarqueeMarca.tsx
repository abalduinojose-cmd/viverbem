// Pilares da marca, logo abaixo do carrossel. Faixa na estrutura da
// prova social da Cabana Afrodite: fundo noite, quatro colunas separadas
// por fios, número grande em azul-claro com a unidade no itálico serifado,
// rótulo em caixa alta embaixo e uma frase entre dois fios fechando.
// Cada coluna entra em cascata quando aparece na tela.
//
// Só números que dá para comprovar: anos, lojas, nota do Google e a
// entrega de moto (a mesma promessa da SecaoDelivery).
import { Revelar } from "./Revelar";
import { IconeMoto } from "./IconeMoto";
import {
  ANOS_TRADICAO,
  UNIDADES,
  AVALIACOES_GOOGLE_TOTAL,
  AVALIACOES_GOOGLE_NOTA,
} from "@/lib/tipos";

type Pilar = {
  numero: React.ReactNode;
  unidade?: string;
  rotulo: string;
};

const PILARES: Pilar[] = [
  { numero: `+${ANOS_TRADICAO}`, unidade: "anos", rotulo: "de tradição em Petrópolis" },
  { numero: `${UNIDADES.length}`, unidade: "lojas", rotulo: "Centro, Corrêas e Posse" },
  {
    numero: AVALIACOES_GOOGLE_NOTA.toFixed(1).replace(".", ","),
    unidade: "no Google",
    rotulo: `${AVALIACOES_GOOGLE_TOTAL} avaliações`,
  },
  {
    // A moto faz o papel do número, para a coluna ter o mesmo peso das outras
    numero: (
      <span className="inline-block align-[-0.08em] h-[0.82em] [&>svg]:h-full [&>svg]:w-auto">
        <IconeMoto tamanho={48} />
      </span>
    ),
    unidade: "delivery",
    rotulo: "de moto, em Petrópolis",
  },
];

// Fio entre as colunas: no celular a grade tem 2 colunas (fio só na da
// direita); a partir do md são 4 em linha (fio em todas menos a primeira)
function classeFio(i: number) {
  if (i === 0) return "";
  if (i === 2) return "md:border-l";
  return "border-l";
}

export function MarqueeMarca() {
  return (
    <section className="relative bg-noite text-white overflow-hidden">
      {/* Brilho de fundo, o mesmo tratamento da seção de entrega */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 120% at 100% 0%, rgba(47,124,196,0.35), transparent 60%), radial-gradient(50% 110% at 0% 100%, rgba(224,33,41,0.16), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-16">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {PILARES.map((p, i) => (
            // O div do Revelar é o agrupador do par dt/dd (único nível
            // de div que o <dl> aceita)
            <Revelar
              key={p.rotulo}
              atraso={i * 110}
              className={`flex flex-col-reverse justify-end items-center gap-3 px-2 md:px-6 text-center border-white/12 ${classeFio(i)}`}
            >
              <dt className="selo-secao text-[0.625rem] text-white/55">{p.rotulo}</dt>
              <dd className="font-display font-semibold leading-none text-[#8ab8ea] text-[clamp(1.9rem,3.4vw,2.9rem)] tracking-tight tabular-nums">
                {p.numero}
                {p.unidade && (
                  <>
                    {" "}
                    {/* tamanho inline: a regra global dá 1.1em ao .italic
                        dentro de .font-display e venceria a classe */}
                    <span className="italic text-white/90" style={{ fontSize: "0.62em" }}>
                      {p.unidade}
                    </span>
                  </>
                )}
              </dd>
            </Revelar>
          ))}
        </dl>

        <Revelar atraso={200}>
          <p className="mx-auto mt-11 flex max-w-3xl items-center justify-center gap-5 text-center text-sm leading-relaxed text-white/75">
            <span aria-hidden="true" className="hidden sm:block h-px flex-1 bg-white/15" />
            Peça pelo site, finalize no WhatsApp e receba em casa ou retire na loja.
            <span aria-hidden="true" className="hidden sm:block h-px flex-1 bg-white/15" />
          </p>
        </Revelar>
      </div>
    </section>
  );
}
