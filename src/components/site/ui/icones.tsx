// Ícones compartilhados do site (07/10/2026): um desenho só para cada
// símbolo, no lugar das cópias que viviam dentro de cada componente.
// Todos com aria-hidden: o sentido vem do texto ou do aria-label de quem
// usa. `tamanho` em px; `className` para cor e ajustes de posição.
type Props = { tamanho?: number; className?: string };

export function IconeWhatsApp({ tamanho = 22, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

export function IconeInstagram({ tamanho = 20, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

/** Seta para a direita (botões "ver mais", links de ação) */
export function SetaDireita({ tamanho = 16, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Chevron para a direita (listas, trilhas de navegação) */
export function Chevron({ tamanho = 16, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A sacola de compras, com a alça: o ícone do carrinho em todo o site */
export function IconeCarrinho({ tamanho = 24, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6.3 8.5h11.4l.9 10.6a1.7 1.7 0 0 1-1.7 1.9H7.1a1.7 1.7 0 0 1-1.7-1.9l.9-10.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Visto: confirmação ("Adicionado") */
export function IconeFeito({ tamanho = 17, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeRelogio({ tamanho = 20, className }: Props) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
