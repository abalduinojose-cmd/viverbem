// Rodapé do site em azul profundo, para fechar a página com peso.
//
// Abre com o "Fale com a gente" (ver FaleComAGente). Embaixo dele, desde
// 05/10/2026, o rodapé segue a estrutura do da Cabana Afrodite, a pedido:
// tudo centralizado, em três tempos. A marca respirando no alto com a
// frase no itálico do site; os contatos em ícones (que acendem em azul) e
// a navegação numa fileira de caixa alta; e a linha legal embaixo. Ao
// fundo, a assinatura "Viver Bem" em marca d'água, cortada pela base como
// um carimbo. É o único bloco escuro do site (sistema "Receita e rótulo").
import Link from "next/link";
import { asset } from "@/lib/asset";
import { FaleComAGente } from "./FaleComAGente";
import {
  ANOS_TRADICAO,
  CNPJ_FARMACIA,
  INSTAGRAM_URL,
  UNIDADES,
  WHATSAPP_NUMERO,
} from "@/lib/tipos";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;
const TELEFONE_FIXO = UNIDADES.find((u) => u.telefone)?.telefone ?? null;

const NAVEGACAO = [
  { href: "/", rotulo: "Início" },
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/sobre", rotulo: "A Viver Bem" },
  { href: "/sobre#como-funciona", rotulo: "Como funciona" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/contato", rotulo: "Contato" },
];

function IconeWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative size-[1.15rem]">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

function IconeInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative size-[1.15rem]">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconeTelefone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative size-[1.15rem]">
      <path
        d="M5 4h3.5l1.8 4.4-2.3 1.4a11 11 0 0 0 6.2 6.2l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeMapa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative size-[1.15rem]">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// Contatos em ícone: só o desenho, com o nome no aria-label e no title
const CONTATOS = [
  { id: "whatsapp", rotulo: "WhatsApp", href: LINK_WHATSAPP, externo: true, icone: IconeWhatsApp },
  { id: "instagram", rotulo: "Instagram", href: INSTAGRAM_URL, externo: true, icone: IconeInstagram },
  ...(TELEFONE_FIXO
    ? [
        {
          id: "telefone",
          rotulo: `Telefone fixo ${TELEFONE_FIXO}`,
          href: `tel:+55${TELEFONE_FIXO.replace(/\D/g, "")}`,
          externo: false,
          icone: IconeTelefone,
        },
      ]
    : []),
  { id: "lojas", rotulo: "Nossas lojas", href: "/lojas", externo: false, icone: IconeMapa },
];

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="em-noite relative isolate mt-auto overflow-hidden bg-noite text-white">
      {/* Assinatura gigante ao fundo, quase invisível, cortada pela base.
          É SVG, e não texto, porque texto quase transparente reprova o
          contraste no Lighthouse mesmo escondido. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 230"
        className="pointer-events-none select-none absolute -bottom-10 md:-bottom-16 left-1/2 -z-10 w-[64rem] max-w-none md:w-[78rem] -translate-x-1/2"
      >
        <text
          x="600"
          y="200"
          textAnchor="middle"
          fill="#c0a060"
          fillOpacity="0.07"
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontStyle: "italic",
            fontSize: 250,
          }}
        >
          Viver Bem
        </text>
      </svg>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ---------- Fale com a gente ---------- */}
        <FaleComAGente />
      </div>

      {/* ---------- Rodapé centralizado ---------- */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-28 md:pb-16 flex flex-col items-center text-center">
        {/* Luz azul bem baixa atrás da marca: profundidade sem chamar atenção */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-10 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-royal/20 blur-[110px]"
        />

        {/* O logo é colorido, então some no escuro: viramos ele em branco */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/logo.png")}
          alt="Manipulação Viver Bem"
          draggable={false}
          loading="lazy"
          decoding="async"
          width={220}
          height={97}
          className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
        />

        <p className="ouro-texto mt-6 max-w-[40ch] text-[1.25rem] md:text-[1.45rem] leading-relaxed italic [font-family:var(--font-destaque)]">
          Há {ANOS_TRADICAO} anos em Petrópolis, com manipulação, homeopatia e atendimento
          de gente que conhece você pelo nome.
        </p>

        {/* Contatos em ícones, que sobem e acendem em azul */}
        <ul className="mt-9 flex items-center gap-2.5">
          {CONTATOS.map((c) => {
            const Icone = c.icone;
            const classe =
              "group relative inline-flex size-12 items-center justify-center rounded-2xl border border-ouro/35 bg-white/[0.04] text-white/80 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:text-white hover:shadow-[0_16px_32px_-16px_rgba(28,105,181,0.95)]";
            const miolo = (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-tinta opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <Icone />
              </>
            );
            return (
              <li key={c.id}>
                {c.externo ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" aria-label={c.rotulo} title={c.rotulo} className={classe}>
                    {miolo}
                  </a>
                ) : c.href.startsWith("/") ? (
                  <Link href={c.href} aria-label={c.rotulo} title={c.rotulo} className={classe}>
                    {miolo}
                  </Link>
                ) : (
                  <a href={c.href} aria-label={c.rotulo} title={c.rotulo} className={classe}>
                    {miolo}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Navegação numa fileira só, em caixa alta discreta */}
        <nav aria-label="Links do rodapé" className="mt-10 w-full">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            {NAVEGACAO.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center min-h-11 rounded-full px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Aviso legal, curto e centralizado */}
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/40">
          Medicamentos manipulados são preparados somente mediante prescrição de profissional
          habilitado. Os dados informados no pedido (nome e WhatsApp) são usados apenas pela
          Viver Bem para atendimento e ofertas, conforme a LGPD.
        </p>

        {/* Linha final */}
        <div className="mt-10 w-full border-t border-white/10 pt-7">
          <div className="flex flex-col items-center gap-2 text-[0.75rem] text-white/45 sm:flex-row sm:justify-between">
            <p>
              © {ano} Manipulação Viver Bem · CNPJ {CNPJ_FARMACIA}
            </p>
            <p className="max-sm:order-first">Petrópolis · Centro, Corrêas e Posse</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
