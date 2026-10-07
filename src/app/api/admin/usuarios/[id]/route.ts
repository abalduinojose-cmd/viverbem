// PATCH  /api/admin/usuarios/:id — liga/desliga o acesso, troca a senha ou
//        desbloqueia o login travado por tentativas erradas ({ desbloquear: true })
// DELETE /api/admin/usuarios/:id — remove o acesso
// Permissão: SOMENTE ADMIN.
//
// Duas travas de segurança: ninguém desliga ou apaga a si mesmo (senão
// o gestor se tranca do lado de fora) e a farmácia nunca fica sem
// nenhum gestor ativo.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { chaveEmail, limparFalhas } from "@/lib/protecaoLogin";

type Contexto = { params: Promise<{ id: string }> };

/** Impede que sobre zero gestor ativo no painel. */
async function ehOUltimoGestor(id: number) {
  const alvo = await db.usuario.findUnique({ where: { id } });
  if (!alvo || alvo.papel !== PAPEL_ADMIN || !alvo.ativo) return false;
  const gestoresAtivos = await db.usuario.count({
    where: { papel: PAPEL_ADMIN, ativo: true },
  });
  return gestoresAtivos <= 1;
}

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Apenas o gestor pode alterar acessos." }, { status: 403 });
  }

  const { id } = await contexto.params;
  const alvoId = Number(id);
  const corpo = await req.json().catch(() => ({}));

  const usuario = await db.usuario.findUnique({ where: { id: alvoId } });
  if (!usuario) {
    return NextResponse.json({ erro: "Acesso não encontrado." }, { status: 404 });
  }

  // Desbloqueio do login (cinco senhas erradas travam por 30 minutos)
  if (corpo.desbloquear === true) {
    await limparFalhas([chaveEmail(usuario.email)]);
    await registrarLog(sessao.nome ?? "?", "desbloqueou o login", `de ${usuario.nome}`);
    return NextResponse.json({ ok: true });
  }

  // Troca de senha
  if (typeof corpo.senha === "string") {
    if (corpo.senha.length < 6) {
      return NextResponse.json(
        { erro: "A senha precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }
    await db.usuario.update({
      where: { id: alvoId },
      data: { senhaHash: bcrypt.hashSync(corpo.senha, 12) },
    });
    await registrarLog(sessao.nome ?? "?", "trocou a senha", `de ${usuario.nome}`);
    return NextResponse.json({ ok: true });
  }

  // Ligar/desligar o acesso
  if (typeof corpo.ativo === "boolean") {
    if (alvoId === sessao.usuarioId) {
      return NextResponse.json(
        { erro: "Você não pode desligar o seu próprio acesso." },
        { status: 400 }
      );
    }
    if (!corpo.ativo && (await ehOUltimoGestor(alvoId))) {
      return NextResponse.json(
        { erro: "Precisa sobrar pelo menos um gestor ativo." },
        { status: 400 }
      );
    }
    await db.usuario.update({ where: { id: alvoId }, data: { ativo: corpo.ativo } });
    await registrarLog(
      sessao.nome ?? "?",
      corpo.ativo ? "religou acesso" : "desligou acesso",
      `${usuario.nome} (${usuario.email})`
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ erro: "Nada para alterar." }, { status: 400 });
}

export async function DELETE(_req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Apenas o gestor pode remover acessos." }, { status: 403 });
  }

  const { id } = await contexto.params;
  const alvoId = Number(id);

  if (alvoId === sessao.usuarioId) {
    return NextResponse.json(
      { erro: "Você não pode remover o seu próprio acesso." },
      { status: 400 }
    );
  }
  if (await ehOUltimoGestor(alvoId)) {
    return NextResponse.json(
      { erro: "Precisa sobrar pelo menos um gestor ativo." },
      { status: 400 }
    );
  }

  const usuario = await db.usuario.findUnique({ where: { id: alvoId } });
  if (!usuario) {
    return NextResponse.json({ erro: "Acesso não encontrado." }, { status: 404 });
  }

  await db.usuario.delete({ where: { id: alvoId } });
  await registrarLog(sessao.nome ?? "?", "removeu acesso", `${usuario.nome} (${usuario.email})`);
  return NextResponse.json({ ok: true });
}
