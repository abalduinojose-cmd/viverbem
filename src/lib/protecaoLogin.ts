// Proteção do login do painel contra tentativa e erro (07/10/2026, pedido:
// "tentou 5 vezes, bloqueia e não deixa mais tentar").
//
// Cada erro conta em duas chaves: o e-mail tentado e o endereço IP de quem
// tentou. Na quinta falha a chave fica bloqueada por 30 minutos: nem a
// senha certa entra. Acertar zera a contagem. O gestor pode desbloquear um
// e-mail antes do prazo, em Acessos ao painel. As senhas já ficam só como
// hash (bcrypt) e a sessão vai num cookie criptografado (iron-session);
// esta camada cobre o que faltava, a repetição de tentativas.
import { db } from "@/lib/db";

export const LIMITE_TENTATIVAS = 5;
export const BLOQUEIO_MINUTOS = 30;

export const chaveEmail = (email: string) => `email:${email.toLowerCase().trim()}`;

/** O IP de quem chamou (atrás de proxy vem em x-forwarded-for). */
export function chaveIp(req: Request): string {
  const encaminhado = req.headers.get("x-forwarded-for");
  const ip = (encaminhado ? encaminhado.split(",")[0] : req.headers.get("x-real-ip")) || "desconhecido";
  return `ip:${ip.trim().slice(0, 80)}`;
}

export function minutosRestantes(ate: Date): number {
  return Math.max(1, Math.ceil((ate.getTime() - Date.now()) / 60_000));
}

/** Se alguma das chaves está bloqueada agora, devolve até quando (a maior). */
export async function verificarBloqueio(chaves: string[]): Promise<Date | null> {
  const registros = await db.tentativaLogin.findMany({ where: { chave: { in: chaves } } });
  const agora = Date.now();
  let maior: Date | null = null;
  for (const r of registros) {
    if (r.bloqueadoAte && r.bloqueadoAte.getTime() > agora && (!maior || r.bloqueadoAte > maior)) {
      maior = r.bloqueadoAte;
    }
  }
  return maior;
}

/** Conta mais uma falha em cada chave. Devolve quantas tentativas restam
 *  (a menor entre as chaves) e, se alguma chegou ao limite, até quando. */
export async function registrarFalha(chaves: string[]): Promise<{ restantes: number; bloqueadoAte: Date | null }> {
  const agora = Date.now();
  let restantes = LIMITE_TENTATIVAS;
  let bloqueado: Date | null = null;

  for (const chave of chaves) {
    const atual = await db.tentativaLogin.findUnique({ where: { chave } });
    // Bloqueio antigo que já venceu recomeça a contagem do zero
    const venceu = atual?.bloqueadoAte ? atual.bloqueadoAte.getTime() <= agora : false;
    const falhas = atual && !venceu ? atual.falhas + 1 : 1;
    const bloqueadoAte = falhas >= LIMITE_TENTATIVAS ? new Date(agora + BLOQUEIO_MINUTOS * 60_000) : null;
    await db.tentativaLogin.upsert({
      where: { chave },
      create: { chave, falhas, bloqueadoAte },
      update: { falhas, bloqueadoAte },
    });
    restantes = Math.min(restantes, Math.max(0, LIMITE_TENTATIVAS - falhas));
    if (bloqueadoAte) bloqueado = bloqueadoAte;
  }
  return { restantes, bloqueadoAte: bloqueado };
}

/** Acerto (ou desbloqueio pelo gestor): apaga a contagem das chaves. */
export async function limparFalhas(chaves: string[]) {
  await db.tentativaLogin.deleteMany({ where: { chave: { in: chaves } } });
}

/** Situação de um e-mail, para a tela de Acessos. */
export async function situacaoDoEmail(email: string): Promise<{ falhas: number; bloqueadoAte: Date | null } | null> {
  const r = await db.tentativaLogin.findUnique({ where: { chave: chaveEmail(email) } });
  if (!r) return null;
  const ativo = r.bloqueadoAte && r.bloqueadoAte.getTime() > Date.now() ? r.bloqueadoAte : null;
  return { falhas: r.falhas, bloqueadoAte: ativo };
}
