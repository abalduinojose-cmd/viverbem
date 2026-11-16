// "Quem responde pela sua fórmula": os dados da empresa no fim da página
// Como funciona (16/11/2026, "no final dela coloque as informações da
// empresa"). São os mesmos da ficha das páginas legais (DADOS_LEGAIS), em
// outro desenho: à esquerda o título e o farmacêutico responsável num
// cartão com o traço de ouro; à direita as quatro licenças em azulejos e a
// identificação da empresa em linhas com fio. Só dados reais, conferidos
// no site antigo da farmácia.
import { CNPJ_FARMACIA, DADOS_LEGAIS } from "@/lib/tipos";

function IconeSelo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 5.8v5.4c0 4.4 3 8.3 7 9.8 4-1.5 7-5.4 7-9.8V5.8L12 3Z" fill="currentColor" fillOpacity="0.14" />
      <path d="M12 3 5 5.8v5.4c0 4.4 3 8.3 7 9.8 4-1.5 7-5.4 7-9.8V5.8L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m9.3 12 1.9 1.9 3.6-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DadosDaEmpresa() {
  const d = DADOS_LEGAIS;
  const licencas = [
    { sigla: "AFE", nome: "Autorização de funcionamento", valor: d.afe },
    { sigla: "AE", nome: "Autorização especial", valor: d.ae },
    { sigla: "Licença", nome: "Licença sanitária", valor: d.licencaSanitaria },
    { sigla: "Certidão", nome: "Certidão de regularidade", valor: d.certidaoRegularidade },
  ];
  const identificacao = [
    { rotulo: "Razão social", valor: d.razaoSocial },
    { rotulo: "CNPJ", valor: <span className="tabular-nums">{CNPJ_FARMACIA}</span> },
    { rotulo: "Sede", valor: d.sede },
    {
      rotulo: "E-mail",
      valor: (
        <a href={`mailto:${d.email}`} className="text-tinta underline-offset-4 hover:underline">
          {d.email}
        </a>
      ),
    },
  ];

  return (
    <section
      id="dados-da-empresa"
      aria-labelledby="titulo-dados-empresa"
      className="max-w-7xl mx-auto px-5 md:px-8 pb-14 md:pb-20 scroll-mt-[calc(var(--altura-cabecalho)+1rem)]"
    >
      <div className="revelar grid grid-cols-1 gap-x-12 gap-y-8 border-t border-fio pt-[clamp(2.5rem,1.6rem+3vw,4.5rem)] lg:grid-cols-12">
        {/* Título e o responsável técnico */}
        <div className="lg:col-span-5">
          <p className="rotulo-pilula">a farmácia</p>
          <h2 id="titulo-dados-empresa" className="titulo-secao vao-rotulo">
            Quem responde <span className="italic">pela sua fórmula</span>
          </h2>
          <p className="texto-apoio mt-4 max-w-md">
            Uma farmácia de manipulação registrada, com farmacêutico responsável e as licenças em dia.
          </p>

          <div className="relative mt-7 overflow-hidden rounded-[1.5rem] bg-white p-5 ring-1 ring-inset ring-fio shadow-[0_26px_50px_-40px_rgba(16,42,74,0.55)] md:p-6">
            <span aria-hidden="true" className="absolute left-8 top-0 h-[2px] w-9 rounded-full bg-[image:var(--ouro-degrade)]" />
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(145deg,#fdf9f0,#f3e6c8)] text-ouro-escuro ring-1 ring-inset ring-ouro/25 shadow-[inset_0_1px_0_#ffffff]">
                <IconeSelo />
              </span>
              <div className="min-w-0">
                <p className="text-[0.76rem] text-cinza">Farmacêutico responsável</p>
                <p className="mt-0.5 text-[1.1rem] font-semibold leading-tight tracking-[-0.02em] text-navy md:text-[1.2rem]">
                  {d.farmaceuticoResponsavel}
                </p>
                <p className="mt-1 text-[0.85rem] text-grafite">
                  CRF <span className="tabular-nums font-medium">{d.crf}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Licenças e identificação */}
        <div className="lg:col-span-7">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">Licenças sanitárias</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 md:gap-3">
            {licencas.map((l) => (
              <li key={l.sigla} className="flex flex-col justify-between gap-1 rounded-[1.1rem] bg-gelo/60 px-4 py-3.5 ring-1 ring-inset ring-tinta/10">
                <span className="block text-[0.74rem] leading-snug text-cinza">{l.nome}</span>
                <span className="mt-1 block text-[1.05rem] font-semibold tabular-nums tracking-[-0.01em] text-navy md:text-[1.15rem]">{l.valor}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-7 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">Identificação</h3>
          <dl className="mt-2 flex flex-col divide-y divide-fio">
            {identificacao.map((l) => (
              <div key={l.rotulo} className="grid grid-cols-1 gap-0.5 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
                <dt className="text-[0.82rem] text-cinza">{l.rotulo}</dt>
                <dd className="min-w-0 text-[0.92rem] leading-snug text-navy [overflow-wrap:anywhere]">{l.valor}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 rounded-[1.25rem] bg-gelo/70 px-4 py-3.5 text-[0.85rem] leading-relaxed text-grafite">
            Esta farmácia segue as determinações da ANVISA:{" "}
            <a href="https://www.gov.br/anvisa" target="_blank" rel="noopener noreferrer" className="font-medium text-tinta underline-offset-4 hover:underline">
              www.anvisa.gov.br
            </a>
            . <span className="text-cinza">A manipulação de medicamentos controlados é realizada exclusivamente mediante indicação médica.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
