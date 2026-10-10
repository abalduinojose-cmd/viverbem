// Foto do produto com fallback: se não houver foto cadastrada, mostra um
// desenho mínimo de frasco em traço fino, azul com o detalhe em ouro.
// (Usamos <img> comum em vez de next/image porque as fotos são enviadas
// pelo painel em tempo de execução e também há SVGs.)
import { asset } from "@/lib/asset";

export function FotoProduto({
  fotoUrl,
  nome,
  className = "",
  prioritaria = false,
}: {
  fotoUrl: string | null;
  nome: string;
  className?: string;
  /** Só para a foto grande da página do produto, que é o que a pessoa
   *  vê primeiro. O resto carrega conforme aparece na tela. */
  prioritaria?: boolean;
}) {
  if (!fotoUrl) {
    return (
      <div className={`flex items-center justify-center ${className}`} aria-label={nome}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="7" y="2.5" width="10" height="19" rx="5" stroke="#1C69B5" strokeWidth="1.5" opacity="0.55" />
          <path d="M7 12h10" stroke="#c9a56b" strokeWidth="1.5" opacity="0.7" />
        </svg>
      </div>
    );
  }
  // Os desenhos neutros (.svg) têm um fundo claro próprio: fundidos por
  // multiplicação, o fundo some no gelo do ladrilho e eles não aparecem
  // como uma caixa branca; e sem a sombra, que contornaria o retângulo
  // (10/10/2026, "acerte os erros de enquadramento")
  const desenho = fotoUrl.toLowerCase().endsWith(".svg");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(fotoUrl)}
      alt={nome}
      width={500}
      height={500}
      className={`object-cover ${className}`}
      style={desenho ? { mixBlendMode: "multiply", filter: "none" } : undefined}
      draggable={false}
      loading={prioritaria ? "eager" : "lazy"}
      decoding="async"
      {...(prioritaria ? { fetchPriority: "high" as const } : {})}
    />
  );
}
