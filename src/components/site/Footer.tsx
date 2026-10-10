// Rodapé do site em azul profundo, para fechar a página com peso.
//
// Logo acima vem o "Fale com a gente" (FaleComAGente), em bloco CLARO
// desde 06/10/2026; o rodapé em si, desde 05/10/2026, segue a estrutura do da Cabana Afrodite, a pedido:
// tudo centralizado, em três tempos. A marca respirando no alto com a
// frase no itálico do site; os contatos em ícones (que acendem em azul) e
// a navegação numa fileira de caixa alta; e a linha legal embaixo. Ao
// fundo, a malha fina de laboratório e a luz de ouro dos cartões em azul-noite
// (a assinatura em marca d'água saiu em 07/10/2026; o rodapé em grade, testado
// no mesmo dia, foi reprovado: "aperfeiçoe o que já estava").
// um carimbo. É o único bloco escuro do site (sistema "Receita e rótulo").
//
// 10/10/2026 ("mantenha a estrutura do rodapé, só modernize ele
// levemente"): mesma ordem e mesmos blocos; os ícones viraram círculos com
// um fio branco fino (o fio de ouro saiu), a navegação ficou com o
// espaçamento de letras menor (o mesmo das pílulas de rótulo), o aviso
// legal encurtou em português simples, e a linha final usa pontos de ouro
// como separador (os mesmos da linha dos números da página de produtos).
import Link from "next/link";
import { asset } from "@/lib/asset";
import { FaleComAGente } from "./FaleComAGente";
import { IconeWhatsApp, IconeInstagram } from "./icones";
import {
  ANOS_TRADICAO,
  CNPJ_FARMACIA,
  INSTAGRAM_URL,
  WHATSAPP_NUMERO,
} from "@/lib/tipos";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;

const NAVEGACAO = [
  { href: "/", rotulo: "Início" },
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/sobre", rotulo: "A Viver Bem" },
  { href: "/sobre#como-funciona", rotulo: "Como funciona" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/contato", rotulo: "Contato" },
];

function IconeMapa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative size-[1.15rem]">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

// Os ícones compartilhados no tamanho do rodapé
function IconeWhatsAppRodape() {
  return <IconeWhatsApp className="relative size-[1.15rem]" />;
}
function IconeInstagramRodape() {
  return <IconeInstagram className="relative size-[1.15rem]" />;
}

// Contatos em ícone: só o desenho, com o nome no aria-label e no title
const CONTATOS = [
  { id: "whatsapp", rotulo: "WhatsApp", href: LINK_WHATSAPP, externo: true, icone: IconeWhatsAppRodape },
  { id: "instagram", rotulo: "Instagram", href: INSTAGRAM_URL, externo: true, icone: IconeInstagramRodape },
  { id: "lojas", rotulo: "Nossas lojas", href: "/lojas", externo: false, icone: IconeMapa },
];

// Ponto de ouro: o separador da linha final
function Ponto() {
  return <span aria-hidden="true" className="mx-2.5 inline-block size-1 rounded-full bg-ouro-claro/80 align-middle" />;
}

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <div className="mt-auto">
      <FaleComAGente />
    <footer className="em-noite relative isolate overflow-hidden bg-noite text-white">
      {/* Fio de ouro no alto, a malha fina e a luz de ouro: a mesma atmosfera dos cartões em azul-noite */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ouro/60 to-transparent" />
      <span aria-hidden="true" className="malha-banner" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(192,160,96,0.18),transparent_62%)]"
      />
      {/* ---------- Rodapé centralizado ---------- */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-9 md:pb-10 flex flex-col items-center text-center">
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

        {/* Contatos em ícones, círculos que sobem e acendem em azul */}
        <ul className="mt-9 flex items-center gap-3">
          {CONTATOS.map((c) => {
            const Icone = c.icone;
            const classe =
              "group relative inline-flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/85 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:text-white hover:shadow-[0_16px_32px_-16px_rgba(16,42,74,0.95)]";
            const miolo = (
              <>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-tinta opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
                  className="inline-flex items-center min-h-11 rounded-full px-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/65 transition-colors duration-300 hover:bg-white/[0.07] hover:text-white"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Aviso legal, curto e centralizado */}
        <p className="mt-8 max-w-xl text-xs leading-relaxed text-white/55">
          Manipulados só com receita de profissional habilitado. O nome e o WhatsApp do
          pedido ficam com a Viver Bem, só para o atendimento, conforme a LGPD.
        </p>

        {/* Linha final, com pontos de ouro no lugar dos separadores */}
        <div className="mt-10 w-full border-t border-white/10 pt-7">
          <div className="flex flex-col items-center gap-2 text-[0.78rem] text-white/55 sm:flex-row sm:justify-between">
            <p>
              © {ano} Manipulação Viver Bem
              <Ponto />
              <span className="tabular-nums">CNPJ {CNPJ_FARMACIA}</span>
            </p>
            <p className="max-sm:order-first">
              Petrópolis
              <Ponto />
              Centro, Corrêas e Posse
            </p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}
