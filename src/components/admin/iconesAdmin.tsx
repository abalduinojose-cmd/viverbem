// Ícones do menu do painel (traço 1,7, 24x24), num módulo sem "use client":
// a casca (cliente) e a visão geral (servidor) usam os mesmos desenhos. Um
// objeto exportado de um módulo cliente, importado num Server Component,
// vira uma referência de cliente e não renderiza nada; por isso vive aqui.

export const ICONES = {
  painel: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="15.5" width="7.5" height="5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  acessos: (
    <>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c.8-3.4 3.5-5.3 7-5.3s6.2 1.9 7 5.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  produtos: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m3.5 7.5 8.5 4.6 8.5-4.6M12 21v-8.9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  categorias: (
    <>
      <rect x="3.5" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="4" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="13" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  // A home em blocos: a dobra larga em cima e as seções embaixo
  vitrine: (
    <>
      <rect x="3.5" y="4" width="17" height="6" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13.5" width="7.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="13.5" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  log: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  clientes: (
    <>
      <circle cx="9" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19.5c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.8M18 15.2c1.4.8 2.3 2.2 2.6 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  site: (
    <>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
};

export type NomeIcone = keyof typeof ICONES;
