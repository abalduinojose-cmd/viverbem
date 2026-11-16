// O IP de quem fez a requisição, para os limites de tentativas (15/11/2026).
//
// Antes valia o PRIMEIRO endereço do X-Forwarded-For, que quem chama pode
// escrever o que quiser: trocando esse valor a cada tentativa, um robô
// escapava do bloqueio por IP. Agora vale, nesta ordem:
//   1. x-real-ip, que o servidor da hospedagem (nginx, Vercel e afins)
//      preenche com o endereço real da conexão;
//   2. o ÚLTIMO endereço do X-Forwarded-For, que é o que o proxy de
//      confiança, o mais perto do site, acrescentou;
//   3. "desconhecido" (todos sem IP dividem a mesma chave: o limite por
//      e-mail continua valendo de qualquer jeito).
// Funciona no proxy.ts e nas rotas da API (só lê os cabeçalhos).
export function ipDaRequisicao(cabecalhos: Headers): string {
  const real = cabecalhos.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 80);
  const encaminhado = cabecalhos.get("x-forwarded-for");
  if (encaminhado) {
    const ultimo = encaminhado.split(",").map((s) => s.trim()).filter(Boolean).pop();
    if (ultimo) return ultimo.slice(0, 80);
  }
  return "desconhecido";
}
