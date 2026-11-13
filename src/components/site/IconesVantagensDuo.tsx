// Os ícones das vantagens em DOIS TONS (13/11/2026, "modernize os ícones"):
// o traço em ouro escuro e as faces preenchidas com o mesmo ouro bem claro,
// como os ícones dos apps atuais. Partem dos desenhos do Tabler Icons (MIT)
// que já estavam no site (a caixa, a fachada, a prancheta com o visto e a
// estrela), para continuarem reconhecíveis.
type Props = { tamanho?: number };

const traco = {
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Caixa de encomenda: a tampa preenchida */
export function IconeCaixaDuo({ tamanho = 22 }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l8 4.5v9l-8 4.5l-8-4.5v-9z" fill="currentColor" fillOpacity="0.12" />
      <path d="M12 3l8 4.5l-8 4.5l-8-4.5z" fill="currentColor" fillOpacity="0.28" />
      <path d="M12 3l8 4.5v9l-8 4.5l-8-4.5v-9z" {...traco} />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5M16 5.25l-8 4.5" {...traco} />
    </svg>
  );
}

/** Fachada da loja: o toldo preenchido */
export function IconeFachadaDuo({ tamanho = 22 }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 10.85V21h14V10.85" fill="currentColor" fillOpacity="0.12" />
      <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2-4h14l2 4" fill="currentColor" fillOpacity="0.3" />
      <path d="M3 21h18" {...traco} />
      <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2-4h14l2 4" {...traco} />
      <path d="M5 21v-10.15M19 21v-10.15" {...traco} />
      <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" {...traco} />
    </svg>
  );
}

/** Prancheta com o visto: a folha preenchida */
export function IconeReceitaDuo({ tamanho = 22 }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 5h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="currentColor" fillOpacity="0.14" />
      <path d="M9 5h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2h-2" {...traco} />
      <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.3" {...traco} />
      <path d="M9 14l2 2l4-4" {...traco} strokeWidth={1.9} />
    </svg>
  );
}

/** Estrela da nota do Google: cheia, com o contorno */
export function IconeEstrelaDuo({ tamanho = 22 }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="currentColor" fillOpacity="0.32" {...traco} />
    </svg>
  );
}
