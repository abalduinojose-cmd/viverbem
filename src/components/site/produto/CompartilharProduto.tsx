"use client";
// O "Compartilhar" da página do produto (23/10/2026). Primeira versão: folha
// do aparelho no celular, copiar o link no computador. Segunda versão, no
// mesmo dia ("ative o botão de compartilhar": no navegador do computador a
// área de transferência pode estar bloqueada e o botão parecia morto): se o
// navegador tem a folha de compartilhar, abre; senão abre um MENU pequeno
// com WhatsApp, Copiar link (com reserva por seleção de texto, para quando
// a área de transferência é negada) e o aviso "Link copiado".
import { useEffect, useRef, useState } from "react";

function copiar(texto: string): boolean {
  // Reserva antiga, que funciona mesmo sem permissão da área de transferência
  const campo = document.createElement("textarea");
  campo.value = texto;
  campo.setAttribute("readonly", "");
  campo.style.position = "fixed";
  campo.style.opacity = "0";
  document.body.appendChild(campo);
  campo.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(campo);
  return ok;
}

export function CompartilharProduto({ nome, compacto = false }: { nome: string; compacto?: boolean }) {
  const [aberto, setAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  // O endereço só existe no navegador; fica em estado para o HTML do
  // servidor e o do cliente baterem
  const [url, setUrl] = useState("");
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  async function aoClicar() {
    const atual = window.location.href;
    setUrl(atual);
    // A folha de compartilhar só no toque (celular e tablet): no computador
    // ela nem sempre existe ou fica pendurada, e o menu é mais direto
    const toque = window.matchMedia("(pointer: coarse)").matches;
    if (toque && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: nome, text: `${nome} na Manipulação Viver Bem`, url: atual });
        return;
      } catch {
        /* a pessoa cancelou ou o navegador recusou: cai no menu */
      }
    }
    setAberto((a) => !a);
  }

  async function copiarLink() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      ok = copiar(url);
    }
    if (ok) {
      setCopiado(true);
      window.setTimeout(() => {
        setCopiado(false);
        setAberto(false);
      }, 1400);
    }
  }

  const textoWhats = `${nome} na Manipulação Viver Bem: ${url}`;

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        onClick={aoClicar}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={compacto ? "Compartilhar" : undefined}
        title={compacto ? "Compartilhar" : undefined}
        className={
          compacto
            ? "flex size-10 items-center justify-center rounded-full bg-white/90 text-navy ring-1 ring-fio shadow-[0_10px_24px_-14px_rgba(13,35,64,0.5)] backdrop-blur transition-colors hover:ring-ouro/60 hover:text-ouro-escuro"
            : "inline-flex items-center gap-1.5 h-9 rounded-full px-3 text-[0.8rem] font-semibold text-navy ring-1 ring-inset ring-fio bg-white transition-colors hover:ring-ouro/50"
        }
      >
        <svg width={compacto ? 17 : 15} height={compacto ? 17 : 15} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        {!compacto && "Compartilhar"}
      </button>

      {aberto && (
        <div role="menu" className="animar-surgir absolute right-0 top-[calc(100%+0.5rem)] z-30 w-52 overflow-hidden rounded-2xl bg-white p-1.5 ring-1 ring-fio shadow-[0_24px_50px_-24px_rgba(13,35,64,0.45)]">
          <a
            role="menuitem"
            href={`https://wa.me/?text=${encodeURIComponent(textoWhats)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAberto(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gelo"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C4B]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.4 1.5.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" />
              </svg>
            </span>
            WhatsApp
          </a>
          <button role="menuitem" type="button" onClick={copiarLink} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gelo">
            <span className="flex size-7 items-center justify-center rounded-full bg-gelo text-tinta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M6 15H5.5A2.5 2.5 0 0 1 3 12.5v-7A2.5 2.5 0 0 1 5.5 3h7A2.5 2.5 0 0 1 15 5.5V6" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <span aria-live="polite">{copiado ? "Link copiado" : "Copiar link"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
