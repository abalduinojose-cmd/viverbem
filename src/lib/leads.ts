// Leads (26/10/2026, "quero uma parte para guardar os leads, separados por
// mês, semana e ano"): quem entrou em contato com a farmácia. Entram
// sozinhos quando alguém finaliza um pedido pelo site (api/pedidos) e à mão
// pelo painel (WhatsApp, Instagram, loja, indicação). Sem gravar nada do
// formulário de contato nem do WhatsApp: o site promete que ali nada fica
// guardado, e a política de privacidade diz o mesmo.
export const ORIGENS_LEAD = ["SITE", "WHATSAPP", "INSTAGRAM", "LOJA", "INDICACAO", "OUTRO"] as const;
export type OrigemLead = (typeof ORIGENS_LEAD)[number];
export const ROTULO_ORIGEM: Record<OrigemLead, string> = {
  SITE: "Pedido pelo site",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  LOJA: "Na loja",
  INDICACAO: "Indicação",
  OUTRO: "Outro",
};

export const SITUACOES_LEAD = ["NOVO", "EM_CONTATO", "CONVERTIDO", "PERDIDO"] as const;
export type SituacaoLead = (typeof SITUACOES_LEAD)[number];
export const ROTULO_SITUACAO: Record<SituacaoLead, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  CONVERTIDO: "Virou cliente",
  PERDIDO: "Não fechou",
};

export function origemValida(v: unknown): v is OrigemLead {
  return typeof v === "string" && (ORIGENS_LEAD as readonly string[]).includes(v);
}
export function situacaoValida(v: unknown): v is SituacaoLead {
  return typeof v === "string" && (SITUACOES_LEAD as readonly string[]).includes(v);
}

/** O lead como o painel recebe (datas em ISO). */
export interface LeadDTO {
  id: number;
  nome: string;
  whatsapp: string;
  origem: string;
  interesse: string;
  situacao: string;
  observacao: string;
  codigoPedido: string;
  criadoEm: string;
  atualizadoEm: string;
}

/** Só os dígitos, com o 55 na frente, para o link do WhatsApp */
export function zapDoLead(whatsapp: string) {
  const d = whatsapp.replace(/\D/g, "");
  return d.startsWith("55") ? d : `55${d}`;
}

/** A hora em que a página do painel foi montada (fica fora do componente
 *  para o React não reclamar de impureza na renderização). */
export function agoraEmMs() {
  return Date.now();
}
