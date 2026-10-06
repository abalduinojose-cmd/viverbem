// Scooter de entrega (delivery): as entregas da Viver Bem são feitas de
// moto. O desenho parte do "moped" do Tabler Icons (MIT), que continua
// legível bem pequeno, nas pílulas de vantagens e na faixa do topo.
export function IconeMoto({ tamanho = 24 }: { tamanho?: number }) {
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
      {/* roda da frente */}
      <path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      {/* roda de trás, estribo, banco e coluna de direção */}
      <path d="M5 16v1a2 2 0 1 0 4 0v-5h-3a3 3 0 0 0 -3 3v1h10a6 6 0 0 1 5 -4v-5a2 2 0 0 0 -2 -2h-1" />
      {/* baú */}
      <path d="M6 9l3 0" />
    </svg>
  );
}
