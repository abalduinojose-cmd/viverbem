"use client";
// O aviso de pedido novo no painel do gestor (15/10/2026, "faça o 4").
// De 30 em 30 segundos (só com a aba à vista) o painel pergunta quantos
// pedidos estão como "Novo" e qual foi o último a chegar:
//   - a contagem aparece no item Pedidos do menu e no título da aba;
//   - quando chega um pedido depois que a página abriu, sobe um aviso no
//     canto com o nome e o código, e o atalho para os novos.
// Na prévia estática não há servidor: o aviso fica desligado.
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const INTERVALO = 30_000;
const EH_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

interface Ultimo {
  id: number;
  nome: string;
  codigo: string;
  receita: boolean;
}

export function usePedidosNovos(ligado: boolean) {
  const [novos, setNovos] = useState(0);
  const [aviso, setAviso] = useState<Ultimo | null>(null);
  const ultimoVisto = useRef<number | null>(null);

  useEffect(() => {
    if (!ligado || EH_DEMO) return;
    let vivo = true;
    const consultar = async () => {
      if (document.hidden) return;
      try {
        const r = await fetch("/api/admin/pedidos/novos", { cache: "no-store" });
        if (!r.ok || !vivo) return;
        const dados: { novos: number; ultimo: Ultimo | null } = await r.json();
        setNovos(dados.novos);
        const id = dados.ultimo?.id ?? 0;
        // Na primeira consulta só guarda onde estava; depois, avisa
        if (ultimoVisto.current !== null && id > ultimoVisto.current && dados.ultimo) setAviso(dados.ultimo);
        ultimoVisto.current = Math.max(ultimoVisto.current ?? 0, id);
      } catch {
        /* sem rede: tenta na próxima */
      }
    };
    void consultar();
    const relogio = window.setInterval(consultar, INTERVALO);
    document.addEventListener("visibilitychange", consultar);
    return () => {
      vivo = false;
      window.clearInterval(relogio);
      document.removeEventListener("visibilitychange", consultar);
    };
  }, [ligado]);

  // A contagem no título da aba: "(2) Pedidos · ..."
  useEffect(() => {
    if (EH_DEMO) return;
    const limpo = document.title.replace(/^\(\d+\)\s*/, "");
    document.title = novos > 0 ? `(${novos}) ${limpo}` : limpo;
  }, [novos]);

  const fecharAviso = useCallback(() => setAviso(null), []);
  return { novos, aviso, fecharAviso };
}

/** O aviso no canto, quando chega um pedido */
export function AvisoPedidoNovo({ aviso, aoFechar }: { aviso: Ultimo | null; aoFechar: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aviso || !caixa.current) return;
    const a = caixa.current.animate(
      [
        { transform: "translateY(16px) scale(0.98)", opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    const fechar = window.setTimeout(aoFechar, 20_000);
    return () => {
      a.cancel();
      window.clearTimeout(fechar);
    };
  }, [aviso, aoFechar]);
  if (!aviso) return null;
  return (
    <div
      ref={caixa}
      role="status"
      className="fixed right-4 bottom-4 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.25rem] banner-noite em-noite text-white ring-1 ring-inset ring-white/15 shadow-[0_24px_50px_-20px_rgba(13,35,64,0.7)] p-4"
    >
      <span aria-hidden="true" className="malha-banner" />
      <div className="relative flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#e1c68f]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5.5 8.5h13l-.9 10.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5.5 8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#e1c68f]">Pedido novo</p>
          <p className="mt-0.5 font-semibold leading-snug truncate">{aviso.nome}</p>
          <p className="text-xs text-white/65">
            {aviso.codigo}
            {aviso.receita ? " · com receita" : ""}
          </p>
          <Link
            href="/admin/clientes?status=NOVO"
            onClick={aoFechar}
            className="mt-3 inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[0.8rem] font-semibold text-navy hover:bg-[#f3ead9]"
          >
            Ver os pedidos novos
          </Link>
        </div>
        <button type="button" onClick={aoFechar} aria-label="Fechar o aviso" className="size-8 shrink-0 rounded-full text-white/60 hover:bg-white/10 hover:text-white flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
