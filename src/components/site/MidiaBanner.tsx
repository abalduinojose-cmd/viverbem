// A mídia de um banner (14/10/2026): imagem, GIF ou vídeo, com a versão do
// celular quando houver. Imagem vira <picture> (a do celular entra pela
// largura); vídeo vira <video> sem som, em laço, inline. Quando as duas
// versões são de tipos diferentes (foto no celular, vídeo no computador),
// saem dois elementos e o CSS mostra um por largura. Serve no servidor e
// no cliente (não tem estado).
import { asset } from "@/lib/asset";
import type { Midia } from "@/lib/banners";

type Props = {
  desktop: Midia;
  celular?: Midia | null;
  className?: string;
  alt?: string;
  /** A dobra: carrega com prioridade */
  prioridade?: boolean;
  largura?: number;
  altura?: number;
};

function Video({ midia, className, prioridade }: { midia: Midia; className: string; prioridade: boolean }) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={prioridade ? "auto" : "metadata"}
      aria-hidden="true"
      disablePictureInPicture
    >
      <source src={asset(midia.url)} />
    </video>
  );
}

function Imagem({ midia, className, alt, prioridade, largura, altura }: { midia: Midia; className: string; alt: string; prioridade: boolean; largura?: number; altura?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(midia.url)}
      alt={alt}
      width={largura}
      height={altura}
      decoding="async"
      loading={prioridade ? "eager" : "lazy"}
      {...(prioridade ? { fetchPriority: "high" as const } : {})}
      className={className}
    />
  );
}

export function MidiaBanner({ desktop, celular = null, className = "", alt = "", prioridade = false, largura, altura }: Props) {
  // Só imagens: um <picture> resolve as duas larguras
  if (desktop.tipo === "imagem" && (!celular || celular.tipo === "imagem")) {
    return (
      <picture>
        {celular && <source media="(max-width: 767px)" srcSet={asset(celular.url)} />}
        <Imagem midia={desktop} className={className} alt={alt} prioridade={prioridade} largura={largura} altura={altura} />
      </picture>
    );
  }
  // Só o vídeo do computador (sem versão de celular): vale nas duas larguras
  if (!celular) return <Video midia={desktop} className={className} prioridade={prioridade} />;
  // Tipos diferentes, ou dois vídeos: um elemento por largura
  const comum = className.replace(/\bblock\b/, "");
  return (
    <>
      {celular.tipo === "video" ? (
        <Video midia={celular} className={`${comum} md:hidden`} prioridade={prioridade} />
      ) : (
        <Imagem midia={celular} className={`${comum} md:hidden`} alt={alt} prioridade={prioridade} largura={largura} altura={altura} />
      )}
      {desktop.tipo === "video" ? (
        <Video midia={desktop} className={`${comum} hidden md:block`} prioridade={prioridade} />
      ) : (
        <Imagem midia={desktop} className={`${comum} hidden md:block`} alt={alt} prioridade={prioridade} largura={largura} altura={altura} />
      )}
    </>
  );
}
