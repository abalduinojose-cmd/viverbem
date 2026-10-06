// Fileira de estrelas (avaliação). nota = 1..5. Em ouro, a cor da paleta;
// a vazia fica no fio.
export function Estrelas({ nota, tamanho = 18 }: { nota: number; tamanho?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={tamanho}
          height={tamanho}
          viewBox="0 0 24 24"
          fill={i <= nota ? "#C0A060" : "#E4E8EE"}
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}
