// A ficha "Dados da farmácia" (12/11/2026, "as informações para passar a
// credibilidade; não têm que ficar na cara do site, mas têm que ter no
// site; coloque na privacidade e nos termos de uso"): razão social, CNPJ,
// sede, contato, horário, o farmacêutico responsável e as licenças. Fica no
// fim das páginas legais (PaginaLegal), com os rótulos à esquerda no computador.
import { CNPJ_FARMACIA, DADOS_LEGAIS } from "@/lib/tipos";

// O horário em três cartões (12/11/2026, "tira o WhatsApp; melhora os
// horários, mais moderno, mais claro"). É o mesmo de HorarioAtendimento.
const HORARIO_FICHA = [
  { dias: "Segunda a sexta", abre: "9h", fecha: "19h" },
  { dias: "Sábado", abre: "9h", fecha: "13h" },
  { dias: "Domingo", abre: null, fecha: null },
];

function Horario() {
  return (
    <div>
      <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">Horário de atendimento</h3>
      <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {HORARIO_FICHA.map((h) => (
          <li
            key={h.dias}
            className={`flex items-center justify-between gap-3 rounded-[1.1rem] px-4 py-3.5 ring-1 ring-inset sm:flex-col sm:items-start sm:justify-start sm:gap-1.5 ${
              h.abre ? "bg-gelo/60 ring-tinta/10" : "bg-white ring-fio"
            }`}
          >
            <span className="text-[0.8rem] font-medium text-cinza">{h.dias}</span>
            {h.abre ? (
              <span className="text-[1.15rem] font-semibold tracking-[-0.02em] text-navy tabular-nums">
                {h.abre} <span className="font-normal text-cinza">às</span> {h.fecha}
              </span>
            ) : (
              <span className="text-[1.15rem] font-semibold tracking-[-0.02em] text-grafite-claro">Fechado</span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[0.8rem] text-cinza">O mesmo horário nas três lojas.</p>
    </div>
  );
}

type Linha = { rotulo: string; valor: React.ReactNode };

function Grupo({ titulo, linhas }: { titulo: string; linhas: Linha[] }) {
  return (
    <div>
      <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">{titulo}</h3>
      <dl className="mt-3 flex flex-col divide-y divide-fio">
        {linhas.map((l) => (
          <div key={l.rotulo} className="grid grid-cols-1 gap-0.5 py-2.5 sm:grid-cols-[13rem_1fr] sm:gap-4">
            <dt className="text-[0.82rem] text-cinza">{l.rotulo}</dt>
            <dd className="min-w-0 text-[0.92rem] leading-snug text-navy [overflow-wrap:anywhere]">{l.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function FichaFarmacia() {
  const d = DADOS_LEGAIS;
  return (
    <section
      id="dados-da-farmacia"
      aria-labelledby="dados-da-farmacia-titulo"
      className="mt-5 scroll-mt-[calc(var(--altura-cabecalho)+1.5rem)] rounded-[2rem] bg-white px-5 py-6 ring-1 ring-fio/80 shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)] md:px-8 md:py-7"
    >
      <h2 id="dados-da-farmacia-titulo" className="text-[1.15rem] font-semibold tracking-[-0.02em] text-navy md:text-[1.3rem]">
        Dados da farmácia
      </h2>
      <p className="mt-1 text-sm text-cinza">Identificação, horário, responsável técnico e licenças sanitárias.</p>

      <div className="mt-5 grid grid-cols-1 gap-7">
        <Grupo
          titulo="Identificação"
          linhas={[
            { rotulo: "Razão social", valor: d.razaoSocial },
            { rotulo: "CNPJ", valor: <span className="tabular-nums">{CNPJ_FARMACIA}</span> },
            { rotulo: "Endereço", valor: d.sede },
            {
              rotulo: "E-mail",
              valor: (
                <a href={`mailto:${d.email}`} className="text-tinta underline-offset-4 hover:underline">
                  {d.email}
                </a>
              ),
            },
          ]}
        />
        <Horario />
        <Grupo
          titulo="Responsabilidade técnica e licenças"
          linhas={[
            { rotulo: "Farmacêutico responsável", valor: d.farmaceuticoResponsavel },
            { rotulo: "CRF", valor: <span className="tabular-nums">{d.crf}</span> },
            { rotulo: "AFE", valor: <span className="tabular-nums">{d.afe}</span> },
            { rotulo: "AE", valor: <span className="tabular-nums">{d.ae}</span> },
            { rotulo: "Licença sanitária", valor: <span className="tabular-nums">{d.licencaSanitaria}</span> },
            { rotulo: "Certidão de regularidade", valor: <span className="tabular-nums">{d.certidaoRegularidade}</span> },
          ]}
        />
      </div>

      <div className="mt-6 flex flex-col gap-1.5 rounded-[1.25rem] bg-gelo/70 px-4 py-3.5 text-[0.85rem] leading-relaxed text-grafite">
        <p>
          Esta farmácia segue as determinações da ANVISA:{" "}
          <a href="https://www.gov.br/anvisa" target="_blank" rel="noopener noreferrer" className="font-medium text-tinta underline-offset-4 hover:underline">
            www.anvisa.gov.br
          </a>
          .
        </p>
        <p className="text-cinza">A manipulação de medicamentos controlados é realizada exclusivamente mediante indicação médica.</p>
      </div>
    </section>
  );
}
