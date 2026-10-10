"use client";
// Gráficos do painel, em SVG puro (sem biblioteca: são formatos simples e
// o painel não precisa carregar 100 kB por causa disso).
//
// Regras seguidas: uma série = uma cor só e sem legenda (o título já
// diz o que é); barras finas com topo arredondado e base reta; linha
// de 2px com área lavada; grade em fio de 1px, discreta; rótulo só
// onde importa (o maior e o último), o resto vai no toque/hover. Quando
// há duas séries (entrega x retirada, manipulado x industrializado) a
// legenda vem junto, com o número ao lado de cada cor: identidade nunca
// fica só na cor. A dupla azul da marca + ouro é a mesma do site.

import { useState } from "react";
import { formatarPreco } from "@/lib/preco";

const AZUL = "#1c69b5"; // --color-tinta
const OURO = "#b3904f"; // --color-ouro
const GRADE = "#e4e8ee"; // --color-fio

/** Escala "bonita" para o topo do eixo (1, 2 ou 5 vezes potência de 10). */
function tetoRedondo(maior: number) {
  if (maior <= 0) return 1;
  const potencia = Math.pow(10, Math.floor(Math.log10(maior)));
  for (const passo of [1, 2, 2.5, 5, 10]) {
    const teto = passo * potencia;
    if (teto >= maior) return teto;
  }
  return 10 * potencia;
}

function compacto(centavos: number) {
  const reais = centavos / 100;
  if (reais >= 1000) return `R$ ${(reais / 1000).toFixed(reais >= 10000 ? 0 : 1)}k`;
  return `R$ ${Math.round(reais)}`;
}

// O balão do valor apontado, no canto do gráfico
function Balao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="absolute top-0 right-0 bg-navy text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg">
      <p className="font-semibold tabular-nums">{titulo}</p>
      <p className="text-white/70 tabular-nums">{texto}</p>
    </div>
  );
}

/** Faturamento por mês — barras, uma série. */
export function GraficoFaturamento({
  dados,
}: {
  dados: { rotulo: string; faturamento: number; pedidos: number }[];
}) {
  const [ativo, setAtivo] = useState<number | null>(null);

  const L = 520;
  const A = 190;
  const margem = { topo: 16, base: 28, esq: 46, dir: 8 };
  const largura = L - margem.esq - margem.dir;
  const altura = A - margem.topo - margem.base;

  const maior = Math.max(...dados.map((d) => d.faturamento), 0);
  const teto = tetoRedondo(maior);
  const banda = largura / dados.length;
  // Barra fina: no máximo 24px, e sempre deixando ar na banda
  const larguraBarra = Math.min(24, banda * 0.5);
  const indiceMaior = dados.findIndex((d) => d.faturamento === maior && maior > 0);

  const ticks = [0, teto / 2, teto];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${L} ${A}`} className="w-full h-auto" role="img" aria-label="Faturamento por mês">
        {/* Grade e eixo */}
        {ticks.map((t) => {
          const y = margem.topo + altura - (t / teto) * altura;
          return (
            <g key={t}>
              <line x1={margem.esq} y1={y} x2={L - margem.dir} y2={y} stroke={GRADE} strokeWidth="1" />
              <text
                x={margem.esq - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-grafite-claro"
                style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}
              >
                {t === 0 ? "0" : compacto(t)}
              </text>
            </g>
          );
        })}

        {dados.map((d, i) => {
          const h = teto > 0 ? (d.faturamento / teto) * altura : 0;
          const x = margem.esq + banda * i + (banda - larguraBarra) / 2;
          const y = margem.topo + altura - h;
          const destacado = ativo === i;
          const opacidade = ativo === null || destacado ? 1 : 0.45;
          return (
            <g key={d.rotulo + i}>
              {/* Área de toque maior que a barra */}
              <rect
                x={margem.esq + banda * i}
                y={margem.topo}
                width={banda}
                height={altura}
                fill="transparent"
                onMouseEnter={() => setAtivo(i)}
                onMouseLeave={() => setAtivo(null)}
              />
              {h > 0 && (
                <rect x={x} y={y} width={larguraBarra} height={h} rx="4" fill={AZUL} opacity={opacidade} className="transition-opacity" pointerEvents="none" />
              )}
              {/* Base reta: tampa o arredondamento de baixo da barra */}
              {h > 4 && (
                <rect x={x} y={margem.topo + altura - 4} width={larguraBarra} height={4} fill={AZUL} opacity={opacidade} pointerEvents="none" />
              )}
              <text x={margem.esq + banda * i + banda / 2} y={A - 8} textAnchor="middle" className="fill-grafite-claro" style={{ fontSize: 10 }}>
                {d.rotulo}
              </text>
              {/* Rótulo só no maior mês */}
              {i === indiceMaior && (
                <text x={margem.esq + banda * i + banda / 2} y={y - 6} textAnchor="middle" className="fill-navy" style={{ fontSize: 10, fontWeight: 600 }}>
                  {compacto(d.faturamento)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {ativo !== null && (
        <Balao
          titulo={dados[ativo].rotulo}
          texto={`${formatarPreco(dados[ativo].faturamento)} · ${dados[ativo].pedidos} ${dados[ativo].pedidos === 1 ? "pedido" : "pedidos"}`}
        />
      )}
    </div>
  );
}

/** Pedidos por dia — linha com área, uma série. */
export function GraficoPedidosDia({ dados }: { dados: { rotulo: string; pedidos: number }[] }) {
  const [ativo, setAtivo] = useState<number | null>(null);

  const L = 520;
  const A = 170;
  const margem = { topo: 16, base: 26, esq: 30, dir: 14 };
  const largura = L - margem.esq - margem.dir;
  const altura = A - margem.topo - margem.base;

  const maior = Math.max(...dados.map((d) => d.pedidos), 0);
  const teto = tetoRedondo(maior);
  const passo = dados.length > 1 ? largura / (dados.length - 1) : 0;

  const ponto = (i: number, v: number) => ({
    x: margem.esq + passo * i,
    y: margem.topo + altura - (teto > 0 ? (v / teto) * altura : 0),
  });

  const pontos = dados.map((d, i) => ponto(i, d.pedidos));
  const linha = pontos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area =
    `${linha} L${pontos[pontos.length - 1].x},${margem.topo + altura} ` +
    `L${pontos[0].x},${margem.topo + altura} Z`;

  const ticks = [0, teto];
  const ultimo = pontos[pontos.length - 1];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${L} ${A}`} className="w-full h-auto" role="img" aria-label="Pedidos por dia">
        {ticks.map((t) => {
          const y = margem.topo + altura - (teto > 0 ? (t / teto) * altura : 0);
          return (
            <g key={t}>
              <line x1={margem.esq} y1={y} x2={L - margem.dir} y2={y} stroke={GRADE} strokeWidth="1" />
              <text x={margem.esq - 8} y={y + 4} textAnchor="end" className="fill-grafite-claro" style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}>
                {t}
              </text>
            </g>
          );
        })}

        {/* Área lavada e linha */}
        <path d={area} fill={AZUL} opacity="0.1" />
        <path d={linha} fill="none" stroke={AZUL} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Marcador do último dia, em ouro: é o "hoje" */}
        <circle cx={ultimo.x} cy={ultimo.y} r="5" fill={OURO} stroke="#ffffff" strokeWidth="2" />

        {/* Faixas de toque + marcador do ponto ativo */}
        {dados.map((d, i) => (
          <g key={d.rotulo + i}>
            <rect
              x={margem.esq + passo * i - passo / 2}
              y={margem.topo}
              width={passo || largura}
              height={altura}
              fill="transparent"
              onMouseEnter={() => setAtivo(i)}
              onMouseLeave={() => setAtivo(null)}
            />
            {ativo === i && (
              <>
                <line x1={pontos[i].x} y1={margem.topo} x2={pontos[i].x} y2={margem.topo + altura} stroke={GRADE} strokeWidth="1" />
                <circle cx={pontos[i].x} cy={pontos[i].y} r="5" fill={AZUL} stroke="#ffffff" strokeWidth="2" />
              </>
            )}
          </g>
        ))}

        {/* Só as pontas no eixo, para não virar um muro de datas */}
        <text x={margem.esq} y={A - 8} textAnchor="start" className="fill-grafite-claro" style={{ fontSize: 10 }}>
          {dados[0]?.rotulo}
        </text>
        <text x={L - margem.dir} y={A - 8} textAnchor="end" className="fill-grafite-claro" style={{ fontSize: 10 }}>
          {dados[dados.length - 1]?.rotulo}
        </text>
      </svg>

      {ativo !== null && (
        <Balao titulo={dados[ativo].rotulo} texto={`${dados[ativo].pedidos} ${dados[ativo].pedidos === 1 ? "pedido" : "pedidos"}`} />
      )}
    </div>
  );
}

// Barra empilhada horizontal com duas partes e a legenda com os números
function BarraDupla({
  partes,
}: {
  partes: { cor: string; rotulo: string; valor: number }[];
}) {
  const total = partes.reduce((s, p) => s + p.valor, 0);
  return (
    <>
      <div className="flex h-4 rounded-full overflow-hidden bg-nevoa gap-[2px]">
        {partes.map((p, i) => (
          <div
            key={p.rotulo}
            style={{ width: `${(p.valor / total) * 100}%`, backgroundColor: p.cor }}
            className={i === 0 ? "rounded-l-full" : i === partes.length - 1 ? "rounded-r-full" : ""}
          />
        ))}
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
        {partes.map((p) => (
          <div key={p.rotulo} className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.cor }} aria-hidden="true" />
            <dt className="text-cinza">{p.rotulo}</dt>
            <dd className="flex items-baseline gap-1">
              <b className="text-navy tabular-nums">{p.valor}</b>
              <span className="text-grafite-claro tabular-nums text-xs">({Math.round((p.valor / total) * 100)}%)</span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/** Entrega x retirada — barra empilhada, duas categorias. */
export function GraficoEntregas({ entregas, retiradas }: { entregas: number; retiradas: number }) {
  const total = entregas + retiradas;
  if (total === 0) {
    return <p className="text-cinza text-sm mt-3">Ainda sem pedidos com essa informação neste mês.</p>;
  }

  const pctEntrega = Math.round((entregas / total) * 100);

  return (
    <div className="mt-4">
      <BarraDupla
        partes={[
          { cor: AZUL, rotulo: "Entrega", valor: entregas },
          { cor: OURO, rotulo: "Retirada", valor: retiradas },
        ]}
      />
      <p className="text-grafite-claro text-xs mt-4 leading-relaxed">
        {pctEntrega >= 50
          ? "A maior parte sai pelo Delivery: vale acompanhar a fila de entrega."
          : "A maior parte é retirada na loja: vale ter o pedido pronto na frente."}
      </p>
    </div>
  );
}

/** Manipulados x industrializados no catálogo, com quantos industrializados
 *  expõem o preço no site. */
export function GraficoCatalogo({
  manipulados,
  industrializados,
  comPrecoNoSite,
}: {
  manipulados: number;
  industrializados: number;
  comPrecoNoSite: number;
}) {
  const total = manipulados + industrializados;
  if (total === 0) {
    return <p className="text-cinza text-sm mt-3">Nenhum produto cadastrado ainda.</p>;
  }
  return (
    <div className="mt-4">
      <BarraDupla
        partes={[
          { cor: AZUL, rotulo: "Manipulados", valor: manipulados },
          { cor: OURO, rotulo: "Industrializados", valor: industrializados },
        ]}
      />
      <p className="text-grafite-claro text-xs mt-4 leading-relaxed">
        {industrializados === 0
          ? "Só manipulados: nenhum produto mostra preço no site, como pede a RDC 67/2007."
          : comPrecoNoSite === 0
            ? "Nenhum industrializado mostra o preço no site ainda. A chave fica em Produtos e preços."
            : `${comPrecoNoSite} de ${industrializados} industrializados mostram o preço no site.`}
      </p>
    </div>
  );
}
