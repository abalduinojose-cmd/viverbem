// As duas vozes do site (sistema "Receita e rótulo", 06/10/2026), num
// módulo próprio para que o layout e a animação da dobra usem a MESMA
// instância: um @font-face só, nada baixado em dobro.
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

// Instrument Sans: texto, títulos em peso 400 e rótulos em caixa alta.
// Trocou a Fraunces + Inter em 05/10/2026, a pedido ("uma fonte mais
// moderna"). A Bricolage Grotesque, que entrou nos títulos por um dia,
// saiu: o contraste vem do tamanho e da voz serifada, não de uma
// terceira fonte.
export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Instrument Serif itálico: a "tinta azul da receita", nas palavras em
// destaque dos títulos, nos números e nas frases dos clientes
export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});
