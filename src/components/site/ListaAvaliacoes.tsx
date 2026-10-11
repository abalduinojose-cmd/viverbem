"use client";
// A lista da página /avaliacoes (11/10/2026, pedido: "uma página só para
// as avaliações, com 30, moderna e dinâmica"): busca por palavra, chips
// dos assuntos mais citados (atendimento, qualidade, preço, entrega,
// WhatsApp), a contagem do que está sendo mostrado, os cartões em colunas
// (como um mural) e o "ver mais" de nove em nove. Os cartões são os mesmos
// do carrossel da home: aspas em ouro, o texto como foi escrito e, embaixo,
// a foto (ou a inicial, para quem não tem foto no Google), o nome e as
// estrelas. Tudo no navegador, sobre a lista que a página já entregou.
import { useMemo, useState } from "react";
import { DepoimentoDTO, PERFIL_GOOGLE_URL } from "@/lib/tipos";
import { normalizar } from "@/lib/texto";
import { asset } from "@/lib/asset";
import { Estrelas } from "./Estrelas";

// Logotipo "G" do Google
function IconeGoogle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-3l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC04" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.4 6.8 9 4.8 12 4.8z" />
    </svg>
  );
}

const POR_PAGINA = 12;
const MAIS = 9;

// Os assuntos mais citados nas avaliações da farmácia
const ASSUNTOS = [
  { rotulo: "Atendimento", termos: ["atendimento", "atencios", "simpátic", "educad", "atendid"] },
  { rotulo: "Qualidade", termos: ["qualidade", "confian", "excelen", "procedência"] },
  { rotulo: "Preço", termos: ["preço", "preco", "valor", "acessível", "acessivel", "barat"] },
  { rotulo: "Entrega", termos: ["entrega", "delivery", "rápid", "rapid", "prazo"] },
  { rotulo: "WhatsApp", termos: ["whatsapp", "zap", "on-line", "online", "mensagem"] },
];

function IconeLupa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-cinza">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Aspas() {
  return (
    <svg width="26" height="20" viewBox="0 0 28 22" fill="currentColor" aria-hidden="true" className="text-ouro-claro">
      <path d="M0 22V12.6C0 5.4 3.9 1.3 11.7 0l1.1 2.6C8.4 3.9 6.2 6.3 6 10h5.8v12H0Zm16.2 0V12.6C16.2 5.4 20.1 1.3 27.9 0L29 2.6c-4.4 1.3-6.6 3.7-6.8 7.4H28v12H16.2Z" />
    </svg>
  );
}

export function ListaAvaliacoes({ avaliacoes }: { avaliacoes: DepoimentoDTO[] }) {
  const [busca, setBusca] = useState("");
  const [assunto, setAssunto] = useState<string | null>(null);
  const [mostrando, setMostrando] = useState(POR_PAGINA);

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    const chip = ASSUNTOS.find((a) => a.rotulo === assunto);
    return avaliacoes.filter((a) => {
      const alvo = normalizar(`${a.texto} ${a.nome}`);
      if (termo && !alvo.includes(termo)) return false;
      if (chip && !chip.termos.some((t) => alvo.includes(normalizar(t)))) return false;
      return true;
    });
  }, [avaliacoes, busca, assunto]);

  const visiveis = filtradas.slice(0, mostrando);

  function escolherAssunto(rotulo: string) {
    setAssunto((atual) => (atual === rotulo ? null : rotulo));
    setMostrando(POR_PAGINA);
  }

  return (
    <div>
      {/* ---------- Busca e assuntos ---------- */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <div className="relative w-full md:max-w-sm md:shrink-0">
          <IconeLupa />
          <input
            type="search"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setMostrando(POR_PAGINA);
            }}
            placeholder="Buscar nas avaliações..."
            aria-label="Buscar nas avaliações"
            className="w-full h-11 bg-gelo/70 border border-transparent rounded-full pl-11 pr-4 text-[0.95rem] text-grafite placeholder:text-grafite-claro focus:outline-none focus:ring-2 focus:ring-tinta/25 focus:border-tinta/40 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto rolagem-sem-barra -mx-5 px-5 md:mx-0 md:px-0 md:flex-1 md:min-w-0" role="group" aria-label="Filtrar por assunto">
          {ASSUNTOS.map((a) => (
            <button
              key={a.rotulo}
              type="button"
              onClick={() => escolherAssunto(a.rotulo)}
              aria-pressed={assunto === a.rotulo}
              className={`chip !min-h-10 !px-3.5 text-sm ${assunto === a.rotulo ? "chip-ativo" : ""}`}
            >
              {a.rotulo}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-cinza" aria-live="polite">
        {filtradas.length === avaliacoes.length
          ? `${avaliacoes.length} avaliações, como foram escritas no Google.`
          : `${filtradas.length} ${filtradas.length === 1 ? "avaliação" : "avaliações"}${assunto ? ` sobre ${assunto.toLowerCase()}` : ""}${busca.trim() ? ` com "${busca.trim()}"` : ""}.`}
      </p>

      {/* ---------- O mural ---------- */}
      {visiveis.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] bg-gelo/60 px-6 py-10 text-center">
          <p className="font-semibold text-navy">Nenhuma avaliação com essa palavra.</p>
          <p className="mt-1 text-sm text-cinza">Tente outra, ou limpe a busca para ver todas.</p>
        </div>
      ) : (
        <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {visiveis.map((a, i) => (
            <figure
              key={a.id}
              className="animar-surgir mb-5 break-inside-avoid rounded-[1.75rem] border border-fio bg-white p-5 flex flex-col gap-3.5 transition duration-300 hover:-translate-y-1 hover:border-ouro/40 hover:shadow-[0_26px_40px_-30px_rgba(16,42,74,0.45)]"
              style={{ animationDelay: `${Math.min(i % MAIS, 8) * 50}ms` }}
            >
              <Aspas />
              <blockquote className="text-[0.95rem] leading-relaxed text-grafite">{a.texto}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-fio/70 pt-4">
                {a.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(a.fotoUrl)}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                    draggable={false}
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gelo font-semibold text-tinta">
                    {a.nome.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.95rem] font-semibold text-navy">{a.nome}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-cinza">
                    <Estrelas nota={a.nota} tamanho={11} />
                    {a.fonte === "Google" && <span>no Google</span>}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* No fim: mais nove por vez e, sempre, o caminho para o perfil inteiro
          (11/10/2026, "no final coloque 'ver mais avaliações no Google'") */}
      <div className="mt-4 flex flex-col items-center gap-4">
        {mostrando < filtradas.length && (
          <button type="button" onClick={() => setMostrando((m) => m + MAIS)} className="botao botao-secundario">
            Ver mais avaliações
            <span className="ml-1 text-sm text-cinza tabular-nums">({filtradas.length - mostrando})</span>
          </button>
        )}
        <a href={PERFIL_GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="botao-link !text-[0.95rem]">
          <IconeGoogle />
          Ver mais avaliações no Google
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
