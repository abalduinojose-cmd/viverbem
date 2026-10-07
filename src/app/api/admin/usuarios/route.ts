// POST /api/admin/usuarios — cria um acesso ao painel.
// Permissão: SOMENTE ADMIN (o gestor decide quem entra).
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { exigirAdminApi } from "@/lib/sessao";
import { registrarLog } from "@/lib/log";
import { PAPEL_ADMIN, PAPEL_OPERADOR } from "@/lib/tipos";

export async function POST(req: Request) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas o gestor pode criar acessos." },
      { status: 403 }
    );
  }

  const corpo = await req.json().catch(() => ({}));
  const nome = String(corpo.nome ?? "").trim().slice(0, 80);
  const email = String(corpo.email ?? "").trim().toLowerCase().slice(0, 120);
  const senha = String(corpo.senha ?? "");
  const papel = corpo.papel === PAPEL_ADMIN ? PAPEL_ADMIN : PAPEL_OPERADOR;

  if (!nome || !email) {
    return NextResponse.json({ erro: "Informe o nome e o e-mail." }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }
  if (senha.length < 6) {
    return NextResponse.json(
      { erro: "A senha precisa ter pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const jaExiste = await db.usuario.findUnique({ where: { email } });
  if (jaExiste) {
    return NextResponse.json({ erro: "Já existe um acesso com esse e-mail." }, { status: 409 });
  }

  const usuario = await db.usuario.create({
    data: { nome, email, papel, senhaHash: bcrypt.hashSync(senha, 12) },
  });
  await registrarLog(
    sessao.nome ?? "?",
    "criou acesso",
    `${usuario.nome} (${usuario.email}) como ${papel === PAPEL_ADMIN ? "gestor" : "operador"}`
  );

  return NextResponse.json({ id: usuario.id }, { status: 201 });
}
