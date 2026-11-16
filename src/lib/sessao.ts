// Sessão do painel administrativo (cookie criptografado com iron-session).
// Uso:
//   const sessao = await obterSessao();          -> ler/gravar sessão
//   const sessao = await exigirSessaoApi();      -> nas rotas de API (retorna null se não logado)
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// Dados guardados dentro do cookie (criptografado, o navegador não lê)
export interface DadosSessao {
  usuarioId?: number;
  nome?: string;
  papel?: string; // "ADMIN" | "OPERADOR" (Fase 2)
}

const opcoesSessao: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "viverbem_admin",
  // A sessão vence em 12 horas: quem esqueceu o painel aberto precisa entrar de novo
  ttl: 60 * 60 * 12,
  cookieOptions: {
    // secure exige HTTPS — ativado só em produção para funcionar em localhost
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

/** Obtém a sessão atual (funciona em Server Components e rotas de API).
 *  Na vitrine estática (DEMO=1) não há cookie nem servidor: as páginas do
 *  painel são geradas com a sessão fixa do gestor, e quem decide o que a
 *  pessoa vê é o navegador (components/admin/ModoDemo.tsx). */
export async function obterSessao() {
  if (process.env.DEMO === "1") {
    const { SESSAO_DEMO } = await import("./adminDemo");
    return { ...SESSAO_DEMO } as unknown as Awaited<ReturnType<typeof getIronSession<DadosSessao>>>;
  }
  const sessao = await getIronSession<DadosSessao>(await cookies(), opcoesSessao);

  // ISOLAMENTO (15/11/2026, "cada usuário só vê os próprios dados"): o
  // banco do projeto (Prisma: SQLite aqui, MySQL ou Postgres na hospedagem)
  // não tem RLS como o Supabase; o equivalente é o servidor decidir, a cada
  // pedido, quem é a pessoa e o que o papel dela permite. Antes, o papel e o
  // "ativo" ficavam congelados no cookie do login: um colaborador desligado,
  // ou um gestor rebaixado, seguia com o acesso antigo por até 12 horas.
  // Agora toda leitura da sessão confere no banco: quem não existe mais ou
  // foi desligado perde a sessão na hora, e o papel e o nome vêm sempre do
  // cadastro atual. Todas as rotas e páginas do painel passam por aqui.
  if (sessao.usuarioId) {
    const { db } = await import("./db");
    const usuario = await db.usuario.findUnique({
      where: { id: sessao.usuarioId },
      select: { nome: true, papel: true, ativo: true },
    });
    if (!usuario || !usuario.ativo) {
      sessao.usuarioId = undefined;
      sessao.nome = undefined;
      sessao.papel = undefined;
    } else {
      sessao.nome = usuario.nome;
      sessao.papel = usuario.papel;
    }
  }
  return sessao;
}

/** Para rotas de API protegidas: retorna a sessão ou null se não estiver logado. */
export async function exigirSessaoApi() {
  const sessao = await obterSessao();
  if (!sessao.usuarioId) return null;
  return sessao;
}

/** Para rotas exclusivas de ADMIN (operador não pode): sessão ou null. */
export async function exigirAdminApi() {
  const sessao = await exigirSessaoApi();
  if (!sessao || sessao.papel !== "ADMIN") return null;
  return sessao;
}
