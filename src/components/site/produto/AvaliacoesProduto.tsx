// As avaliações na página do produto (23/10/2026, "melhore as avaliações").
// São as avaliações reais da FARMÁCIA no Google (não há avaliação por
// produto, e nenhuma é inventada): no alto, embaixo do nome, um selo com o
// "G", as estrelas, a nota e o total, com três rostos de clientes, que leva
// à página /avaliacoes (a aba Avaliações da página do produto saiu a
// pedido, na quarta volta do mesmo dia).
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
export function escolherAvaliacoes(todas: DepoimentoDTO[], semente: number, quantas = 6) {
  const comFoto = todas.filter((a) => a.fotoUrl && a.texto.trim().length > 40);
  const base = comFoto.length >= quantas ? comFoto : todas;
  if (base.length === 0) return [];
  const inicio = semente % base.length;
  return Array.from({ length: Math.min(quantas, base.length) }, (_, i) => base[(inicio + i) % base.length]);
}

/** O selo embaixo do nome do produto: leva à página de avaliações */
export function SeloAvaliacoes({ rostos }: { rostos: DepoimentoDTO[] }) {
  // 23/10/2026: menor ("quero as avaliações menor no site"): uma pílula baixa
  return (
    <Link
      href="/avaliacoes"
      className="group mt-2.5 inline-flex w-fit max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full bg-white py-1 pl-1 pr-2.5 ring-1 ring-inset ring-fio shadow-[0_8px_18px_-14px_rgba(13,35,64,0.4)] transition-colors hover:ring-ouro/50"
    >
      <span className="flex items-center gap-1.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-white ring-1 ring-fio">
          <IconeGoogle tamanho={12} />
        </span>
        <b className="text-[0.9rem] font-semibold text-navy tabular-nums leading-none">{notaTexto}</b>
        <Estrelas nota={Math.round(AVALIACOES_GOOGLE_NOTA)} tamanho={12} />
      </span>
      <span className="flex items-center gap-1.5">
        {rostos.length > 0 && (
          <span className="flex -space-x-1.5" aria-hidden="true">
            {rostos.slice(0, 3).map((a) => (
              <Rosto key={a.id} a={a} tamanho="size-5 text-[0.55rem]" />
            ))}
          </span>
        )}
        <span className="text-[0.76rem] text-cinza transition-colors group-hover:text-tinta">
          <span className="tabular-nums font-medium text-navy">{AVALIACOES_GOOGLE_TOTAL}</span> avaliações
        </span>
        <span className="flex size-5 items-center justify-center rounded-full bg-gelo text-navy transition-transform group-hover:translate-x-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
