// "Cada pessoa tem sua fórmula": a seção de personalização da home (no
// lugar da que a Formularis tem), com o texto e o convite de um lado e
// quatro fatos do processo do outro. Sem as linhas de diagrama da
// referência: a cliente já pediu duas vezes para tirar linhas decorativas.
//
// ATENÇÃO AO TEXTO DESTA SEÇÃO. Farmácia de manipulação segue regras
// próprias de comunicação (RDC 67/2007 e RDC 96/2008), então o texto
// aqui é deliberadamente descritivo, e não promocional:
//   - fala em PRESCRIÇÃO, nunca em comprar manipulado sem receita;
//   - descreve o PROCESSO (avaliação farmacêutica, preparo, rótulo),
//     nunca resultado, eficácia ou benefício de saúde;
//   - não compara com industrializado nem sugere trocar/ajustar o que
//     o médico prescreveu;
//   - não menciona nome de ativo, indicação ou preço.
// Antes de mexer, confirme com o farmacêutico responsável da loja.
import { WHATSAPP_LOJA } from "@/lib/tipos";
import { BotaoEnviarReceita } from "./BotaoEnviarReceita";

// Fatos do processo, não do resultado. Desde 05/10/2026 viram uma ficha:
// a palavra-chave no itálico do site, no lugar dos cartões com ícone.
const FATOS = [
  {
    palavra: "receita",
    titulo: "Feita a partir da receita",
    texto: "Cada preparação é individual, conforme a prescrição.",
  },
  {
    palavra: "farmacêutico",
    titulo: "Conferida pelo farmacêutico",
    texto: "A receita passa por avaliação farmacêutica antes do preparo.",
  },
  {
    palavra: "sob pedido",
    titulo: "Preparada depois do pedido",
    texto: "Nada fica pronto na prateleira: o preparo começa quando você pede.",
  },
  {
    palavra: "rótulo",
    titulo: "Rótulo com os seus dados",
    texto: "Seu nome, a composição e a validade.",
  },
];

export function EnviarReceita() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
      <div className="bg-royal-nevoa border border-linha rounded-[2rem] px-6 md:px-12 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center gap-2 bg-white border border-linha rounded-full px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-escarlate" aria-hidden="true" />
            <span className="text-xs font-medium text-grafite-medio">mediante prescrição</span>
          </span>
          <h2 className="font-display text-[2.35rem] md:text-[3.25rem] font-extrabold tracking-[-0.035em] text-grafite leading-[1.04] mt-4">
            Cada pessoa
            <br />
            <span className="italic text-royal">tem sua fórmula</span>
          </h2>
          <p className="text-grafite-medio text-base md:text-lg leading-relaxed mt-4">
            O medicamento manipulado é preparado sob prescrição de profissional
            habilitado, na dose e na forma farmacêutica que constam da receita.
          </p>

          <BotaoEnviarReceita className="mt-8 bg-royal hover:bg-royal-escuro inline-flex items-center justify-center gap-3 text-white text-lg font-semibold rounded-2xl px-8 py-4 active:scale-[0.98] transition" />

          {/* Aviso legal, discreto mas presente */}
          <p className="text-grafite-claro text-xs leading-relaxed mt-4 max-w-md">
            {WHATSAPP_LOJA} · Medicamentos manipulados são preparados somente mediante
            prescrição de profissional habilitado, dentro da validade. A sua receita e os
            seus dados ficam apenas com a nossa equipe.
          </p>
        </div>

        <ul className="lg:col-span-7 bg-white border border-linha rounded-[1.75rem] sombra-card divide-y divide-linha">
          {FATOS.map((f) => (
            <li
              key={f.titulo}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8 px-6 md:px-8 py-5 md:py-6"
            >
              <span className="shrink-0 sm:w-36 italic text-royal text-xl md:text-[1.65rem] leading-none [font-family:var(--font-destaque)]">
                {f.palavra}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-grafite leading-snug">{f.titulo}</h3>
                <p className="text-grafite-medio leading-relaxed mt-1">{f.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
