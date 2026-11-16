"use client";
// Disponibiliza o carrinho (estado + botão flutuante + gaveta) em todas
// as páginas do site. O pedido é finalizado pelo WhatsApp da farmácia.
import { CarrinhoProvider } from "@/lib/carrinho";
import { CarrinhoDrawer } from "./CarrinhoDrawer";
import type { ItemSugestao } from "./SugestoesCarrinho";

export function CarrinhoGlobal({ children, sugestoes = [] }: { children: React.ReactNode; sugestoes?: ItemSugestao[] }) {
  return (
    <CarrinhoProvider>
      {children}
      <CarrinhoDrawer sugestoes={sugestoes} />
    </CarrinhoProvider>
  );
}
