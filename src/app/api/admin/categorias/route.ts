// POST /api/admin/categorias — cria uma categoria.
// Permissão: qualquer usuário logado. Desde 07/10/2026 o colaborador
// também cuida das categorias (criar, renomear, tirar do site); só
// APAGAR continua com o gestor.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirSessaoApi } from "@/lib/sessao";
import { gerarSlug } from "@/lib/slug";
import { registrarLog } from "@/lib/log";

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const nome = String(corpo.nome ?? "").trim().slice(0, 60);
  if (!nome) {
    return NextResponse.json({ erro: "Informe o nome da categoria." }, { status: 400 });
  }

  const slug = gerarSlug(nome);
  if (!slug) {
    return NextResponse.json({ erro: "Use letras ou números no nome." }, { status: 400 });
  }
  const jaExiste = await db.categoria.findUnique({ where: { slug } });
  if (jaExiste) {
    return NextResponse.json({ erro: "Já existe uma categoria com esse nome." }, { status: 409 });
  }

  // Nova categoria entra no final da lista
  const ultima = await db.categoria.findFirst({ orderBy: { ordem: "desc" } });
  const categoria = await db.categoria.create({
    data: { nome, slug, ordem: (ultima?.ordem ?? -1) + 1 },
  });
  await registrarLog(sessao.nome ?? "?", "criou categoria", `"${categoria.nome}"`);
  return NextResponse.json(categoria, { status: 201 });
}
