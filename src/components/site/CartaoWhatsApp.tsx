"use client";
// O cartão do WhatsApp em "Fale com a gente" (14/10/2026, "modernize a
// seção fale com a gente"). O arranjo é o mesmo de antes (rótulo e estado,
// o número grande, a prévia da conversa e o botão verde); mudou o
// acabamento:
//
//   - a prévia virou uma conversa de verdade: a barra do contato (Viver Bem,
//     online ou o horário de voltar), o fundo bege do WhatsApp com a trama
//     fina, o balão enviado com a hora e os dois vistos; quando o cartão
//     entra na tela, o balão sobe, os vistos ficam azuis e a farmácia
//     "digita" e responde, como acontece do outro lado. Só com a loja
//     ABERTA: fechada, a mensagem fica só entregue (vistos cinza) e ninguém
//     responde, para o cartão não prometer resposta na hora à noite;
//   - o estado no alto: "Online agora" com o ponto pulsando quando a loja
//     está aberta; fechada, diz quando volta;
//   - o botão ocupa a largura toda no celular.
//
// A animação roda pela Web Animations API, então aparece também com
// "reduzir movimento" ligado, como o resto do site (o Windows do usuário
// está com as animações desligadas). Roda uma vez só, ao entrar na tela.
import { useEffect, useRef } from "react";
import type { EstadoLoja } from "./HorarioAtendimento";
import { IconeWhatsApp, SetaDireita } from "./icones";
import { WHATSAPP_LOJA, WHATSAPP_NUMERO } from "@/lib/tipos";

const MENSAGEM = "Olá! Vim pelo site e gostaria de tirar uma dúvida.";
const RESPOSTA = "Oi! Como podemos ajudar?";
const LINK = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM)}`;
const MOLA = "cubic-bezier(0.34, 1.4, 0.64, 1)";

function Vistos() {
  return (
    <svg data-vistos width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true" style={{ color: "#8696a0" }}>
      <path d="M1 5.5 3.6 8 8.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 7.4 6.8 8 11.8 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CartaoWhatsApp({ estado, className = "" }: { estado: EstadoLoja; className?: string }) {
  const conversa = useRef<HTMLSpanElement>(null);
  const aberto = estado?.aberto ?? false;

  // A conversa acontece uma vez, quando o cartão aparece
  useEffect(() => {
    const el = conversa.current;
    if (!el) return;
    const enviada = el.querySelector<HTMLElement>("[data-enviada]");
    const vistos = el.querySelector<SVGElement>("[data-vistos]");
    const digitando = el.querySelector<HTMLElement>("[data-digitando]");
    const resposta = el.querySelector<HTMLElement>("[data-resposta]");
    const pontos = el.querySelectorAll<HTMLElement>("[data-ponto]");
    if (!enviada || !vistos) return;

    const animacoes: Animation[] = [];
    const tempos: number[] = [];
    const depois = (ms: number, fn: () => void) => tempos.push(window.setTimeout(fn, ms));

    const tocar = () => {
      animacoes.push(
        enviada.animate(
          [
            { opacity: 0, transform: "translateY(14px) scale(0.92)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 420, easing: MOLA, fill: "both" }
        )
      );
      // Fechada: a mensagem chega, mas ninguém lê nem responde agora
      if (!aberto || !digitando || !resposta) return;
      depois(700, () => (vistos.style.color = "#53bdeb"));
      depois(1000, () => {
        animacoes.push(digitando.animate([{ opacity: 0, transform: "scale(0.8)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: MOLA, fill: "both" }));
        pontos.forEach((p, i) =>
          animacoes.push(
            p.animate([{ transform: "translateY(0)" }, { transform: "translateY(-3px)" }, { transform: "translateY(0)" }], {
              duration: 600,
              delay: i * 140,
              iterations: Infinity,
              easing: "ease-in-out",
            })
          )
        );
      });
      depois(2300, () => {
        animacoes.push(digitando.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "both" }));
        animacoes.push(
          resposta.animate(
            [
              { opacity: 0, transform: "translateY(10px) scale(0.92)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 420, easing: MOLA, fill: "both" }
          )
        );
      });
    };

    // Estado de partida: o balão enviado escondido, os vistos cinza
    enviada.style.opacity = "0";
    if (resposta) resposta.style.opacity = "0";
    if (digitando) digitando.style.opacity = "0";
    vistos.style.color = "#8696a0";

    const observador = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observador.disconnect();
        tocar();
      },
      { threshold: 0.5 }
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      tempos.forEach((t) => window.clearTimeout(t));
      animacoes.forEach((a) => a.cancel());
    };
  }, [aberto]);

  // Fechada, diz quando volta ("Abre amanhã às 9h")
  const status = estado ? (estado.aberto ? "online" : estado.detalhe.toLowerCase()) : "";

  return (
    <a
      href={LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative h-full w-full flex flex-col text-left overflow-hidden rounded-[1.75rem] border border-fio bg-white shadow-[0_18px_40px_-32px_rgba(16,42,74,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#25D366]/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)] active:scale-[0.99] p-6 md:p-7 ${className}`}
    >
      {/* Um sopro do verde do WhatsApp no canto, para o cartão ter a cor dele */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.16),transparent_65%)]"
      />

      <span className="relative flex items-center justify-between gap-3">
        <span className="rotulo-pilula">whatsapp</span>
        {estado && (
          <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold">
            <span aria-hidden="true" className="relative flex size-2">
              {estado.aberto && <span className="absolute inset-0 rounded-full bg-green-500/60 animate-ping" />}
              <span className={`relative size-2 rounded-full ${estado.aberto ? "bg-green-500" : "bg-cinza/50"}`} />
            </span>
            <span className={estado.aberto ? "text-green-700" : "text-cinza"}>
              {estado.aberto ? "Online agora" : estado.detalhe}
            </span>
          </span>
        )}
      </span>

      <span className="relative mt-5 block text-[1.75rem] md:text-[1.9rem] font-semibold text-navy tracking-[-0.035em] tabular-nums leading-none">
        {WHATSAPP_LOJA}
      </span>
      <span className="relative mt-2 block text-sm text-cinza leading-snug">Dúvidas, pedidos e retirada.</span>

      {/* A conversa, do jeito que ela aparece no celular */}
      <span
        ref={conversa}
        aria-hidden="true"
        className="relative mt-5 block overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-[0_14px_30px_-22px_rgba(16,42,74,0.5)]"
      >
        {/* A barra do contato */}
        <span className="flex items-center gap-2.5 bg-[#f0f2f5] px-3 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[image:var(--ouro-degrade)] text-[0.62rem] font-bold text-navy">
            VB
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-[0.85rem] font-semibold text-[#111b21]">Viver Bem</span>
            <span className={`block text-[0.7rem] ${estado?.aberto ? "text-[#1DA851]" : "text-[#667781]"}`}>
              {status || "farmácia"}
            </span>
          </span>
          <span className="ml-auto text-[#25D366]">
            <IconeWhatsApp tamanho={18} />
          </span>
        </span>

        {/* O fundo bege com a trama fina e os balões */}
        <span
          className="flex flex-col gap-2 px-3 py-3.5"
          style={{
            backgroundColor: "#efeae2",
            backgroundImage: "radial-gradient(rgba(17,27,33,0.06) 1px, transparent 1.2px)",
            backgroundSize: "12px 12px",
          }}
        >
          <span
            data-enviada
            className="relative ml-auto block w-fit max-w-[30ch] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 pt-2 pb-1.5 text-[0.88rem] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
          >
            {MENSAGEM}
            <span className="mt-0.5 flex items-center justify-end gap-1 text-[0.65rem] text-[#667781]">
              agora <Vistos />
            </span>
          </span>

          {aberto && (
          <span className="relative h-9">
            <span
              data-digitando
              className="absolute left-0 top-0 inline-flex items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} data-ponto className="block size-1.5 rounded-full bg-[#8696a0]" />
              ))}
            </span>
            <span
              data-resposta
              className="absolute left-0 top-0 block w-fit max-w-[30ch] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-[0.88rem] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
            >
              {RESPOSTA}
            </span>
          </span>
          )}
        </span>
      </span>

      <span className="relative mt-auto pt-6 block">
        <span className="flex w-full sm:w-auto sm:inline-flex items-center justify-center gap-2.5 h-[3.25rem] px-5 rounded-full bg-[#1DA851] text-white text-[0.98rem] font-semibold shadow-[0_14px_28px_-16px_rgba(29,168,81,0.8)] transition-colors group-hover:bg-[#178a43]">
          <IconeWhatsApp tamanho={19} />
          Chamar no WhatsApp
          <span className="ml-1 flex size-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
            <SetaDireita tamanho={14} />
          </span>
        </span>
      </span>
    </a>
  );
}
