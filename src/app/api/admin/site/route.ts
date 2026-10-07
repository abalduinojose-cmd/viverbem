// PATCH /api/admin/site — liga e desliga as seções da home.
// Corpo: { secoesHome: { categorias: true, reels: false, ... } } (só as
// chaves enviadas mudam; as outras ficam como estão).
// Permissão: qualquer usuário logado (gestor ou colaborador).
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { CHAVE_SECOES, gravarConfiguracao, lerConfiguracao } from "@/lib/configuracao";
import { SECOES_HOME, normalizarSecoes } from "@/lib/secoes";
import { registrarLog } from "@/lib/log";

export async function PATCH(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const enviado = corpo.secoesHome;
  if (!enviado || typeof enviado !== "object") {
    return NextResponse.json({ erro: "Nada para alterar." }, { status: 400 });
  }

  const atual = normalizarSecoes(await lerConfiguracao<unknown>(CHAVE_SECOES, null));
  const mudancas: string[] = [];
  for (const s of SECOES_HOME) {
    const valor = (enviado as Record<string, unknown>)[s.chave];
    if (typeof valor === "boolean" && valor !== atual[s.chave]) {
      atual[s.chave] = valor;
      mudancas.push(`${s.titulo} ${valor ? "ligada" : "desligada"}`);
    }
  }
  if (mudancas.length === 0) {
    return NextResponse.json({ secoesHome: atual });
  }

  await gravarConfiguracao(CHAVE_SECOES, atual);
  await registrarLog(sessao.nome ?? "?", "alterou a home", mudancas.join(", "));
  return NextResponse.json({ secoesHome: atual });
}
