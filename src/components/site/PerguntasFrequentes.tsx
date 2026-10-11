// Perguntas frequentes do pedido pela receita (página /como-funciona,
// 11/10/2026). Sanfonas nativas (<details>): fechadas por padrão, abrem no
// clique, funcionam sem JavaScript. Texto de processo, sem promessa de
// efeito nem de prazo (RDC 67/2007): prazo e valor são sempre informados
// pelo farmacêutico, caso a caso.
import { UNIDADES } from "@/lib/tipos";

const PERGUNTAS = [
  {
    pergunta: "Preciso de receita para pedir?",
    resposta:
      "Para manipulados, sim: a lei exige receita de profissional habilitado, dentro da validade. Os produtos de pronta entrega do catálogo podem ser pedidos direto pelo carrinho.",
  },
  {
    pergunta: "Como envio a receita?",
    resposta:
      "Pelo botão Enviar receita, o pedido abre com um código e a conversa do WhatsApp; é só anexar a foto na conversa. Se preferir, traga a receita em uma das lojas.",
  },
  {
    pergunta: "Quanto tempo leva?",
    resposta:
      "Depende da fórmula. O farmacêutico confere a receita e informa o prazo junto com o valor, antes de você confirmar.",
  },
  {
    pergunta: "Como fico sabendo o valor?",
    resposta:
      "O valor é passado pelo WhatsApp depois da conferência da receita. Você confirma só se estiver de acordo; nada é cobrado pelo site.",
  },
  {
    pergunta: "Como recebo o pedido?",
    resposta: `Retirada sem custo em uma das ${UNIDADES.length} lojas (${UNIDADES.map((u) => u.bairro).join(", ")}) ou Delivery em Petrópolis e Região. A taxa e o prazo da entrega são combinados pelo WhatsApp.`,
  },
  {
    pergunta: "O que acontece com a minha receita e os meus dados?",
    resposta:
      "Ficam só com a nossa equipe, para o preparo e o atendimento, conforme a LGPD. Nada é compartilhado.",
  },
];

function IconeChevron() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gelo text-tinta transition-transform duration-300 group-open:rotate-180">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function PerguntasFrequentes() {
  return (
    <section aria-labelledby="titulo-perguntas" className="max-w-7xl mx-auto px-5 md:px-8 secao">
      <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 lg:items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-[calc(var(--altura-cabecalho)+1.5rem)]">
          <p className="rotulo-pilula">perguntas frequentes</p>
          <h2 id="titulo-perguntas" className="titulo-secao vao-rotulo">
            Dúvidas comuns <span className="italic">antes de pedir</span>
          </h2>
          <p className="texto-apoio mt-4 max-w-sm">
            O que mais perguntam no WhatsApp. Se a sua dúvida não estiver aqui, é só chamar.
          </p>
        </div>
        <div className="lg:col-span-8 escalonado flex flex-col gap-3">
          {PERGUNTAS.map((p) => (
            <details key={p.pergunta} className="group rounded-[1.5rem] bg-gelo/50 open:bg-white open:ring-1 open:ring-fio transition-colors">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-[1.05rem] md:text-[1.15rem] font-semibold text-navy marker:content-['']">
                {p.pergunta}
                <IconeChevron />
              </summary>
              <p className="px-5 pb-5 md:px-6 md:pb-6 -mt-1 max-w-[62ch] text-[0.95rem] md:text-base leading-relaxed text-grafite">{p.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
