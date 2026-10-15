// A situação dos pedidos no painel e as mensagens prontas para o WhatsApp
// (15/10/2026, "faça o 4": antes "Clientes captados" era só uma lista; o
// pedido não tinha andamento, e responder ao cliente era abrir o WhatsApp
// e escrever do zero).
//
// O caminho: Novo -> Em preparo -> Pronto -> Concluído (entregue ou
// retirado). Cancelado fica de lado e não conta nos números do painel.
// Arquivo sem nada de servidor: o navegador também usa.
import { ENTREGA_RETIRADA } from "./tipos";

export const STATUS_PEDIDO = ["NOVO", "EM_PREPARO", "PRONTO", "CONCLUIDO", "CANCELADO"] as const;
export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export const ROTULO_STATUS: Record<StatusPedido, string> = {
  NOVO: "Novo",
  EM_PREPARO: "Em preparo",
  PRONTO: "Pronto",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

/** O próximo passo natural (o botão de avançar na lista) */
export const PROXIMO_STATUS: Partial<Record<StatusPedido, StatusPedido>> = {
  NOVO: "EM_PREPARO",
  EM_PREPARO: "PRONTO",
  PRONTO: "CONCLUIDO",
};

export function statusValido(v: unknown): v is StatusPedido {
  return typeof v === "string" && (STATUS_PEDIDO as readonly string[]).includes(v);
}

/** O WhatsApp do cliente em formato internacional (só dígitos, com o 55) */
export function zapInternacional(whatsapp: string) {
  const d = whatsapp.replace(/\D/g, "");
  return d.startsWith("55") && d.length >= 12 ? d : `55${d}`;
}

/** A mensagem pronta para a situação do pedido. Texto de andamento, sem
 *  promessa de efeito (o que vale para manipulado vale aqui também). */
export function mensagemDoStatus(p: { nome: string; codigo: string; status: string; entrega: string; local: string; receita: boolean }) {
  const primeiro = p.nome.trim().split(/\s+/)[0] || "";
  const ola = `Olá, ${primeiro}! Aqui é da Manipulação Viver Bem.`;
  const retirada = p.entrega === ENTREGA_RETIRADA;
  switch (p.status) {
    case "EM_PREPARO":
      return `${ola} O seu pedido ${p.codigo} já está em preparo no nosso laboratório. Avisamos assim que estiver pronto.`;
    case "PRONTO":
      return retirada
        ? `${ola} O seu pedido ${p.codigo} está pronto para retirar${p.local ? ` na loja ${p.local.split(",")[0]}` : " na loja escolhida"}. Estamos à disposição.`
        : `${ola} O seu pedido ${p.codigo} está pronto e vai sair para entrega. Confirmamos o horário por aqui.`;
    case "CONCLUIDO":
      return `${ola} Obrigado pela preferência! Qualquer dúvida sobre o pedido ${p.codigo}, é só chamar por aqui.`;
    case "CANCELADO":
      return `${ola} Sobre o pedido ${p.codigo}: ele foi cancelado. Se quiser refazer ou tirar alguma dúvida, estamos por aqui.`;
    default:
      return p.receita
        ? `${ola} Recebemos o seu pedido ${p.codigo}. Pode enviar a foto da receita por aqui que o farmacêutico confere e já passa o valor e o prazo.`
        : `${ola} Recebemos o seu pedido ${p.codigo}. Já vamos conferir e confirmar o valor e o prazo com você.`;
  }
}

export function linkResposta(p: { nome: string; whatsapp: string; codigo: string; status: string; entrega: string; local: string; receita: boolean }) {
  return `https://wa.me/${zapInternacional(p.whatsapp)}?text=${encodeURIComponent(mensagemDoStatus(p))}`;
}
