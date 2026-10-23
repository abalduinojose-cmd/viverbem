// As avaliações na página do produto (23/10/2026, "melhore as avaliações").
// São as avaliações reais da FARMÁCIA no Google (não há avaliação por
// produto, e nenhuma é inventada): no alto, embaixo do nome, um selo com o
// "G", as estrelas, a nota e o total, com três rostos de clientes, que leva
// à aba Avaliações; na aba, o resumo grande e três avaliações com foto,
// trocando conforme o produto para as páginas não repetirem as mesmas.
import Link from "next/link";
import { asset } from "@/lib/asset";
import { AVALIACOES_GOOGLE_NOTA, AVALIACOES_GOOGLE_TOTAL, type DepoimentoDTO } from "@/lib/tipos";
import { Estrelas } from "../Estrelas";

export function IconeGoogle({ tamanho = 18 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-3l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC04" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.4 6.8 9 4.8 12 4.8z" />
    </svg>
  );
}

const notaTexto = AVALIACOES_GOOGLE_NOTA.toFixed(1).replace(".", ",");

function Rosto({ a, tamanho }: { a: DepoimentoDTO; tamanho: string }) {
  return a.fotoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(a.fotoUrl)} alt="" width={64} height={64} loading="lazy" decoding="async" className={`${tamanho} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <span className={`${tamanho} flex items-center justify-center rounded-full bg-gelo font-semibold text-tinta ring-2 ring-white`}>{a.nome.charAt(0).toUpperCase()}</span>
  );
}

/** As avaliações de um produto: as com foto primeiro, a partir de um ponto
 *  que depende do produto (cada página mostra outras) */
export function escolherAvaliacoes(todas: DepoimentoDTO[], semente: number, quantas = 3) {
  const comFoto = todas.filter((a) => a.fotoUrl && a.texto.trim().length > 40);
  const base = comFoto.length >= quantas ? comFoto : todas;
  if (base.length === 0) return [];
  const inicio = semente % base.length;
  return Array.from({ length: Math.min(quantas, base.length) }, (_, i) => base[(inicio + i) % base.length]);
}

/** O selo embaixo do nome do produto: leva à aba Avaliações */
export function SeloAvaliacoes({ rostos }: { rostos: DepoimentoDTO[] }) {
  return (
    <a
      href="#avaliacoes"
      className="group mt-3 inline-flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[1.25rem] sm:rounded-full bg-white py-1.5 pl-1.5 pr-4 ring-1 ring-inset ring-fio shadow-[0_10px_24px_-18px_rgba(13,35,64,0.45)] transition-colors hover:ring-ouro/50"
    >
      <span className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-white ring-1 ring-fio">
          <IconeGoogle tamanho={16} />
        </span>
        <b className="text-[1.05rem] font-semibold text-navy tabular-nums leading-none">{notaTexto}</b>
        <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={15} />
      </span>
      <span className="flex items-center gap-2">
        {rostos.length > 0 && (
          <span className="flex -space-x-2" aria-hidden="true">
            {rostos.slice(0, 3).map((a) => (
              <Rosto key={a.id} a={a} tamanho="size-6 text-[0.65rem]" />
            ))}
          </span>
        )}
        <span className="text-[0.85rem] text-cinza transition-colors group-hover:text-tinta">
          <span className="tabular-nums font-medium text-navy">{AVALIACOES_GOOGLE_TOTAL}</span> avaliações no Google
        </span>
      </span>
    </a>
  );
}

/** O conteúdo da aba Avaliações */
export function AbaAvaliacoes({ avaliacoes }: { avaliacoes: DepoimentoDTO[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-6 lg:gap-8 items-start">
      {/* O resumo */}
      <div className="banner-noite em-noite relative overflow-hidden rounded-[1.5rem] p-6 text-white">
        <span aria-hidden="true" className="malha-banner" />
        <span className="relative inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-[0.78rem] font-semibold ring-1 ring-white/15">
          <span className="flex size-6 items-center justify-center rounded-full bg-white">
            <IconeGoogle tamanho={13} />
          </span>
          Avaliações no Google
        </span>
        <p className="relative mt-5 flex items-end gap-2">
          <span className="text-[3.4rem] font-semibold leading-[0.9] tracking-[-0.04em] tabular-nums">{notaTexto}</span>
          <span className="pb-1 text-sm text-white/70">de 5</span>
        </p>
        <div className="relative mt-3">
          <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={18} />
        </div>
        <p className="relative mt-3 text-sm text-white/75">
          <span className="tabular-nums font-semibold text-white">{AVALIACOES_GOOGLE_TOTAL}</span> avaliações da farmácia, nas três lojas
        </p>
        <Link href="/avaliacoes" className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e1c68f] hover:underline underline-offset-4">
          Ver todas
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Três avaliações reais */}
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {avaliacoes.map((a) => (
          <li key={a.id} className="flex flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-inset ring-fio shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)]">
            <div className="flex items-center justify-between gap-2">
              <Estrelas nota={a.nota} tamanho={14} />
              <IconeGoogle tamanho={15} />
            </div>
            <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-grafite line-clamp-6">{a.texto}</p>
            <div className="mt-4 flex items-center gap-2.5">
              <Rosto a={a} tamanho="size-9 text-sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-navy">{a.nome}</span>
                <span className="block text-xs text-cinza">Cliente no Google</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
