"use client";
// O formulário de contato (11/10/2026, "melhore a página de contato"): a
// pessoa escreve aqui, vê a mensagem como vai chegar e, ao enviar, o
// WhatsApp abre com o texto pronto. Nada passa pelo servidor nem fica
// gravado no site (funciona na vitrine estática e não guarda dado
// pessoal): a conversa fica só entre o cliente e a farmácia.
import { useId, useMemo, useState } from "react";
import { useEstadoLoja } from "./HorarioAtendimento";
import { IconeWhatsApp, SetaDireita } from "./icones";
import { WHATSAPP_NUMERO } from "@/lib/tipos";

const ASSUNTOS = ["Dúvida", "Orçamento", "Receita", "Retirada ou delivery"] as const;
type Assunto = (typeof ASSUNTOS)[number];

export function FormularioContato() {
  const estado = useEstadoLoja();
  const idNome = useId();
  const idMensagem = useId();
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState<Assunto>(ASSUNTOS[0]);
  const [mensagem, setMensagem] = useState("");

  // A mensagem como vai chegar no WhatsApp
  const texto = useMemo(() => {
    const linhas = ["Olá! Vim pelo site."];
    if (nome.trim()) linhas.push(`Meu nome é ${nome.trim()}.`);
    linhas.push(`Assunto: ${assunto.toLowerCase()}.`);
    if (mensagem.trim()) linhas.push(mensagem.trim());
    return linhas.join("\n");
  }, [nome, assunto, mensagem]);
  const link = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open(link, "_blank", "noopener,noreferrer");
      }}
      className="h-full flex flex-col rounded-[1.75rem] border border-fio bg-white p-5 md:p-7 shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rotulo-pilula">sua mensagem</span>
        {estado && (
          <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold">
            <span aria-hidden="true" className={`size-1.5 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
            <span className={estado.aberto ? "text-green-700" : "text-cinza"}>
              {estado.aberto ? "Online agora" : "Responde no horário"}
            </span>
          </span>
        )}
      </div>
      <h2 className="mt-4 text-[1.5rem] md:text-[1.75rem] font-semibold text-navy tracking-[-0.03em] leading-tight">
        Escreva e envie <span className="italic">pelo WhatsApp</span>
      </h2>
      <p className="mt-2 text-sm text-cinza leading-relaxed">
        Preencha o que quiser. A mensagem abre pronta no WhatsApp da farmácia.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor={idNome} className="block text-sm font-semibold text-navy mb-1.5">
            Seu nome <span className="font-normal text-cinza">(opcional)</span>
          </label>
          <input
            id={idNome}
            type="text"
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como podemos te chamar"
            className="campo"
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-navy mb-2">Assunto</legend>
          <div className="flex flex-wrap gap-2">
            {ASSUNTOS.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={assunto === a}
                onClick={() => setAssunto(a)}
                className={`chip ${assunto === a ? "chip-ativo" : ""}`}
              >
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={idMensagem} className="block text-sm font-semibold text-navy mb-1.5">
            Mensagem
          </label>
          <textarea
            id={idMensagem}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={4}
            placeholder="Conte o que você precisa. Se tiver receita, é só avisar: a foto vai no WhatsApp."
            className="campo resize-y min-h-[7rem]"
          />
        </div>
      </div>

      {/* A conversa como ela é: a mensagem montada, no balão de "enviada" */}
      <div className="mt-6 rounded-2xl bg-gelo/70 p-3">
        <p className="flex items-center gap-2 text-[0.7rem] font-medium text-cinza">
          <span className="flex size-5 items-center justify-center rounded-full bg-white text-[#25D366] ring-1 ring-fio">
            <IconeWhatsApp tamanho={11} />
          </span>
          Assim ela chega na Viver Bem
        </p>
        <p className="mt-2 ml-auto block w-fit max-w-[34ch] whitespace-pre-line rounded-2xl rounded-br-md bg-[#dcf8c6] px-3.5 py-2.5 text-[0.9rem] text-grafite leading-snug shadow-sm">
          {texto}
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-2.5 h-13 px-6 rounded-full whitespace-nowrap bg-[#128C4B] text-white text-[0.98rem] font-semibold shadow-[0_14px_28px_-16px_rgba(18,140,75,0.8)] transition-colors hover:bg-[#0f7a40] active:scale-[0.98]"
        >
          <IconeWhatsApp tamanho={18} />
          Enviar pelo WhatsApp
          <SetaDireita tamanho={15} />
        </button>
        <p className="text-xs text-cinza leading-relaxed">
          Abre o WhatsApp com a mensagem pronta. Nada fica gravado no site.
        </p>
      </div>
    </form>
  );
}
