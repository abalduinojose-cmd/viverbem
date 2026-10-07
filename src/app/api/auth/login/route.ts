// POST /api/auth/login — autentica o usuário do painel.
// Corpo: { email, senha }. Grava a sessão num cookie criptografado.
//
// Proteção contra tentativa e erro (src/lib/protecaoLogin.ts): cinco
// senhas erradas para o mesmo e-mail, ou vindas do mesmo IP, bloqueiam por
// 30 minutos (resposta 429 com "bloqueadoAte"). Um pequeno atraso
// aleatório em toda tentativa deixa a adivinhação automática mais lenta.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";
import {
  BLOQUEIO_MINUTOS,
  LIMITE_TENTATIVAS,
  chaveEmail,
  chaveIp,
  limparFalhas,
  minutosRestantes,
  registrarFalha,
  verificarBloqueio,
} from "@/lib/protecaoLogin";

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

function respostaBloqueio(ate: Date) {
  const min = minutosRestantes(ate);
  return NextResponse.json(
    {
      erro: `Muitas tentativas. O acesso ficou bloqueado por ${BLOQUEIO_MINUTOS} minutos; tente de novo em ${min} min.`,
      bloqueadoAte: ate.toISOString(),
    },
    { status: 429 }
  );
}

export async function POST(req: Request) {
  const { email, senha } = await req.json().catch(() => ({}));

  if (!email || !senha) {
    return NextResponse.json({ erro: "Informe e-mail e senha." }, { status: 400 });
  }

  const emailLimpo = String(email).toLowerCase().trim().slice(0, 120);
  const chaves = [chaveEmail(emailLimpo), chaveIp(req)];

  const bloqueio = await verificarBloqueio(chaves);
  if (bloqueio) return respostaBloqueio(bloqueio);

  // Toda tentativa demora um pouco, certa ou errada
  await esperar(250 + Math.random() * 350);

  const usuario = await db.usuario.findUnique({ where: { email: emailLimpo } });

  // Mensagem genérica de propósito: não revela se o e-mail existe
  if (!usuario || !bcrypt.compareSync(String(senha), usuario.senhaHash)) {
    const falha = await registrarFalha(chaves);
    if (falha.bloqueadoAte) {
      await registrarLog(
        "Sistema",
        "bloqueou o login",
        `${emailLimpo}: ${LIMITE_TENTATIVAS} tentativas erradas, bloqueado por ${BLOQUEIO_MINUTOS} min`
      );
      return respostaBloqueio(falha.bloqueadoAte);
    }
    const aviso =
      falha.restantes === 1
        ? "Última tentativa antes do bloqueio."
        : `${falha.restantes} tentativas antes do bloqueio.`;
    return NextResponse.json({ erro: `E-mail ou senha incorretos. ${aviso}` }, { status: 401 });
  }

  // Acesso desligado pelo gestor: a senha até confere, mas não entra
  if (!usuario.ativo) {
    return NextResponse.json(
      { erro: "Este acesso foi desligado. Fale com o gestor." },
      { status: 403 }
    );
  }

  // Acertou: zera a contagem e carimba a entrada, para o gestor ver quem
  // anda usando o painel
  await Promise.all([
    limparFalhas(chaves),
    db.usuario.update({ where: { id: usuario.id }, data: { ultimoAcesso: new Date() } }),
  ]);

  const sessao = await obterSessao();
  sessao.usuarioId = usuario.id;
  sessao.nome = usuario.nome;
  sessao.papel = usuario.papel;
  await sessao.save();

  return NextResponse.json({ ok: true, nome: usuario.nome });
}
