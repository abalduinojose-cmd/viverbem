// O mapa pequeno de UMA loja (21/10/2026, "melhore a parte das lojas,
// mais moderna e clean"): as peças do OpenStreetMap em volta da loja, no
// zoom de rua, com o pino da marca no centro. É só HTML e imagens (sem
// script, sem chave, sem o Google Maps embutido, que pesava e abria em
// branco): a conta das peças é feita aqui, no servidor, e as imagens
// carregam quando chegam à tela. Seis peças por loja: as três colunas em
// volta e as duas linhas mais perto do ponto, o que cobre uma caixa de até
// 512 px de largura por 256 px de altura em volta do centro.
//
// O crédito "© OpenStreetMap" é o que a licença das peças pede.
const PECA = 256;
const ZOOM = 16;

/** Latitude e longitude para pixels do mundo no zoom (Web Mercator) */
function projetar(lat: number, lon: number, z: number) {
  const n = PECA * 2 ** z;
  const rad = (lat * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n,
  };
}

function pecasEmVolta(lat: number, lon: number) {
  const p = projetar(lat, lon, ZOOM);
  const tx = Math.floor(p.x / PECA);
  const ty = Math.floor(p.y / PECA);
  // A segunda linha é a mais próxima do ponto (em cima ou embaixo)
  const linhas = [ty, p.y - ty * PECA < PECA / 2 ? ty - 1 : ty + 1];
  const max = 2 ** ZOOM;
  const pecas: { chave: string; src: string; dx: number; dy: number }[] = [];
  for (const y of linhas) {
    if (y < 0 || y >= max) continue;
    for (let x = tx - 1; x <= tx + 1; x++) {
      const xr = ((x % max) + max) % max;
      pecas.push({
        chave: `${xr}/${y}`,
        src: `https://tile.openstreetmap.org/${ZOOM}/${xr}/${y}.png`,
        // Onde a peça fica em relação ao centro da caixa (o ponto da loja)
        dx: x * PECA - p.x,
        dy: y * PECA - p.y,
      });
    }
  }
  return pecas;
}

export function MapaLoja({ lat, lon, nome, className = "" }: { lat: number; lon: number; nome: string; className?: string }) {
  const pecas = pecasEmVolta(lat, lon);
  return (
    <div className={`relative overflow-hidden bg-[#eef0ec] ${className}`} role="img" aria-label={`Mapa da região da loja ${nome}`}>
      {/* As peças, um pouco desbotadas para o azul da marca aparecer */}
      <div aria-hidden="true" className="absolute inset-0 [filter:saturate(0.55)_contrast(0.96)_brightness(1.04)]">
        {pecas.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.chave}
            src={p.src}
            alt=""
            width={PECA}
            height={PECA}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute max-w-none"
            style={{ left: `calc(50% + ${p.dx}px)`, top: `calc(50% + ${p.dy}px)`, width: PECA, height: PECA }}
          />
        ))}
      </div>
      {/* Um véu leve nas bordas, para o mapa não brigar com o cartão */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(13,35,64,0.12))]" />
      {/* O pino da marca, com a ponta no lugar da loja */}
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-full">
        <span className="absolute left-1/2 top-full h-2 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy/25 blur-[2px]" />
        <svg width="30" height="38" viewBox="0 0 24 30" className="block drop-shadow-[0_4px_4px_rgba(13,35,64,0.35)]">
          <path d="M12 29c-6.2-7-10.4-12-10.4-17.2a10.4 10.4 0 1 1 20.8 0C22.4 17 18.2 22 12 29Z" fill="#1c69b5" stroke="#ffffff" strokeWidth="1.6" />
          <circle cx="12" cy="11.8" r="3.8" fill="#ffffff" />
        </svg>
      </span>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-1.5 right-2 rounded bg-white/85 px-1.5 py-0.5 text-[0.625rem] leading-none text-cinza hover:text-navy"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}
