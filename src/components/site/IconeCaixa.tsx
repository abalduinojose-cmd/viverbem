// Caixa de encomenda (12/11/2026, "enviamos para todo o Brasil"): no lugar
// da moto do Delivery, que só valia para Petrópolis e Região. O desenho
// parte do "package" do Tabler Icons (MIT), legível bem pequeno, nas
// pílulas de vantagens e na faixa do topo.
export function IconeCaixa({ tamanho = 24 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9l8 -4.5" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12v9" />
      <path d="M12 12l-8 -4.5" />
      <path d="M16 5.25l-8 4.5" />
    </svg>
  );
}
