// As artes da dobra (abertura da home), enviadas pelo painel. Até duas
// artes, cada uma com a versão do computador e a do celular.
//   POST   /api/admin/hero  multipart: "arquivo" + "alvo"
//          alvo: desktop | celular (arte 1), desktop2 | celular2 (arte 2)
//          -> grava a imagem e guarda a URL na Configuracao; devolve { url }
//   DELETE /api/admin/hero  JSON: { alvo }  -> tira aquela imagem
// Permissão: qualquer usuário logado (o colaborador cuida das fotos).
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { salvarImagem } from "@/lib/armazenamento";
import { validarImagem } from "@/lib/imagens";
import { MAX_ARTES_HERO, apagarConfiguracao, chavesDaArte, gravarConfiguracao } from "@/lib/configuracao";
import { registrarLog } from "@/lib/log";

type Alvo = { chave: string; nome: string };

/** "desktop" -> arte 1 do computador; "celular2" -> arte 2 do celular. */
function lerAlvo(valor: unknown): Alvo | null {
  if (typeof valor !== "string") return null;
  const m = valor.match(/^(desktop|celular)(\d?)$/);
  if (!m) return null;
  const indice = m[2] ? Number(m[2]) - 1 : 0;
  if (indice < 0 || indice >= MAX_ARTES_HERO) return null;
  const chaves = chavesDaArte(indice);
  const tela = m[1] === "desktop" ? "computador" : "celular";
  return { chave: m[1] === "desktop" ? chaves.desktop : chaves.celular, nome: `arte ${indice + 1}, ${tela}` };
}

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const formulario = await req.formData();
  const alvo = lerAlvo(formulario.get("alvo"));
  if (!alvo) {
    return NextResponse.json({ erro: "Diga qual arte e qual tela (computador ou celular)." }, { status: 400 });
  }
  const arquivo = formulario.get("arquivo");
  const conferido = validarImagem(arquivo);
  if ("erro" in conferido) {
    return NextResponse.json({ erro: conferido.erro }, { status: 400 });
  }

  const url = await salvarImagem(arquivo as File, conferido.extensao);
  await gravarConfiguracao(alvo.chave, url);
  await registrarLog(sessao.nome ?? "?", "trocou a arte da dobra", alvo.nome);
  return NextResponse.json({ url }, { status: 201 });
}

export async function DELETE(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const alvo = lerAlvo(corpo.alvo);
  if (!alvo) {
    return NextResponse.json({ erro: "Diga qual arte e qual tela (computador ou celular)." }, { status: 400 });
  }

  await apagarConfiguracao(alvo.chave);
  await registrarLog(sessao.nome ?? "?", "removeu a arte da dobra", alvo.nome);
  return NextResponse.json({ ok: true });
}
