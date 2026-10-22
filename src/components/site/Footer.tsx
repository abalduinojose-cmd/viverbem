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
import { BotaoCookies } from "./BotaoCookies";

const LINK_WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}`;

// As páginas legais e a escolha de cookies, na linha final (21/10/2026)
const LEGAIS = [
  { href: "/privacidade", rotulo: "Privacidade" },
  { href: "/termos", rotulo: "Termos de uso" },
  { href: "/reembolso", rotulo: "Trocas e reembolso" },
];

const NAVEGACAO = [
  { href: "/", rotulo: "Início" },
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/sobre", rotulo: "A Viver Bem" },
  { href: "/como-funciona", rotulo: "Como funciona" },
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
        className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.18),transparent_62%)]"
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
          src={asset("/logo.webp")}
          alt="Manipulação Viver Bem"
          draggable={false}
          loading="lazy"
          decoding="async"
          width={220}
          height={97}
          className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
        />

        <p className="ouro-texto mt-6 max-w-[40ch] text-[1.25rem] md:text-[1.45rem] leading-relaxed italic [font-family:var(--font-destaque)]">
          Há {ANOS_TRADICAO} anos em Petrópolis, com manipulação, homeopatia e um
          atendimento próximo, de quem conhece cada cliente.
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

        {/* Navegação em texto, centrada e com ar (21/10/2026, "mais clean":
            a pílula de vidro saiu; o link acende em branco e ganha um fio
            de ouro embaixo ao passar o mouse) */}
        {/* Navegação em texto, centrada e com ar (21/10/2026, "mais clean":
            a pílula de vidro saiu; o link acende em branco e ganha um fio
            de ouro embaixo ao passar o mouse). 22/10/2026: uma versão em
            duas colunas com pontos foi reprovada na hora ("estava melhor
            antes, só queria mais clean"): ficou a mesma fileira, só que em
            caixa normal, peso médio e um pouco maior, sem o espaçamento
            de caixa alta. */}
        <nav aria-label="Links do rodapé" className="mt-10 w-full">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1 sm:gap-x-10">
            {NAVEGACAO.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex min-h-11 items-center text-[0.9rem] font-medium tracking-[-0.005em] text-white/70 transition-colors duration-300 hover:text-white"
                >
                  <span className="relative py-1">
                    {l.rotulo}
                    <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[image:var(--ouro-degrade)] transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* As páginas legais e os cookies, centrados; os pontos de ouro só
            a partir do tablet (no celular a linha quebra e os pontos sobravam) */}
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.76rem] text-white/55 sm:gap-x-0">
          {LEGAIS.map((l, i) => (
            <li key={l.href} className="flex items-center">
              {i > 0 && <span className="hidden sm:inline-flex"><Ponto /></span>}
              <Link href={l.href} className="inline-flex items-center min-h-10 transition-colors hover:text-white">
                {l.rotulo}
              </Link>
            </li>
          ))}
          <li className="flex items-center">
            <span className="hidden sm:inline-flex"><Ponto /></span>
            <BotaoCookies className="inline-flex items-center min-h-10 transition-colors hover:text-white" />
          </li>
        </ul>

        {/* Linha final, com pontos de ouro no lugar dos separadores */}
        <div className="mt-6 w-full border-t border-white/10 pt-7">
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
