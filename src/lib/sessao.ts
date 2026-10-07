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

/** Obtém a sessão atual (funciona em Server Components e rotas de API). */
export async function obterSessao() {
  return getIronSession<DadosSessao>(await cookies(), opcoesSessao);
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
