// PATCH /api/admin/site — liga e desliga as seções da home, e a ordem delas.
// Corpo: { secoesHome: { categorias: true, reels: false, ... } } (só as
// chaves enviadas mudam; as outras ficam como estão) e/ou
//        { secoesOrdem: ["categorias", "comoFunciona", ...] } (14/10/2026:
// a ordem da página; chaves que faltarem entram no fim).
// Permissão: qualquer usuário logado (gestor ou colaborador).
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { CHAVE_ORDEM, CHAVE_SECOES, gravarConfiguracao, lerConfiguracao } from "@/lib/configuracao";
import { SECOES_HOME, normalizarOrdem, normalizarSecoes } from "@/lib/secoes";
import { registrarLog } from "@/lib/log";

export async function PATCH(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const enviado = corpo.secoesHome;
  const ordemEnviada = corpo.secoesOrdem;
  const temSecoes = enviado && typeof enviado === "object";
  const temOrdem = Array.isArray(ordemEnviada);
  if (!temSecoes && !temOrdem) {
    return NextResponse.json({ erro: "Nada para alterar." }, { status: 400 });
  }

  const atual = normalizarSecoes(await lerConfiguracao<unknown>(CHAVE_SECOES, null));
  const mudancas: string[] = [];
  if (temSecoes) {
    for (const s of SECOES_HOME) {
      const valor = (enviado as Record<string, unknown>)[s.chave];
      if (typeof valor === "boolean" && valor !== atual[s.chave]) {
        atual[s.chave] = valor;
        mudancas.push(`${s.titulo} ${valor ? "ligada" : "desligada"}`);
      }
    }
    if (mudancas.length > 0) await gravarConfiguracao(CHAVE_SECOES, atual);
  }

  let ordem = normalizarOrdem(await lerConfiguracao<unknown>(CHAVE_ORDEM, null));
  if (temOrdem) {
    const nova = normalizarOrdem(ordemEnviada);
    if (nova.join(",") !== ordem.join(",")) {
      ordem = nova;
      await gravarConfiguracao(CHAVE_ORDEM, ordem);
      mudancas.push("ordem das seções");
    }
  }

  if (mudancas.length > 0) await registrarLog(sessao.nome ?? "?", "alterou a home", mudancas.join(", "));
  return NextResponse.json({ secoesHome: atual, secoesOrdem: ordem });
}
