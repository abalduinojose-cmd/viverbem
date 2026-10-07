// A arte da dobra (abertura da home), enviada pelo painel.
//   POST   /api/admin/hero  multipart: "arquivo" + "alvo" (desktop | celular)
//          -> grava a imagem e guarda a URL na Configuracao; devolve { url }
//   DELETE /api/admin/hero  JSON: { alvo }  -> volta para a dobra padrão
// Permissão: qualquer usuário logado (o colaborador cuida das fotos).
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { salvarImagem } from "@/lib/armazenamento";
import { validarImagem } from "@/lib/imagens";
import {
  CHAVE_HERO_CELULAR,
  CHAVE_HERO_DESKTOP,
  apagarConfiguracao,
  gravarConfiguracao,
} from "@/lib/configuracao";
import { registrarLog } from "@/lib/log";

const ALVOS = {
  desktop: { chave: CHAVE_HERO_DESKTOP, nome: "computador" },
  celular: { chave: CHAVE_HERO_CELULAR, nome: "celular" },
} as const;

function lerAlvo(valor: unknown) {
  return valor === "desktop" || valor === "celular" ? ALVOS[valor] : null;
}

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const formulario = await req.formData();
  const alvo = lerAlvo(formulario.get("alvo"));
  if (!alvo) {
    return NextResponse.json({ erro: "Diga se a arte é do computador ou do celular." }, { status: 400 });
  }
  const arquivo = formulario.get("arquivo");
  const conferido = validarImagem(arquivo);
  if ("erro" in conferido) {
    return NextResponse.json({ erro: conferido.erro }, { status: 400 });
  }

  const url = await salvarImagem(arquivo as File, conferido.extensao);
  await gravarConfiguracao(alvo.chave, url);
  await registrarLog(sessao.nome ?? "?", "trocou a arte da dobra", `versão do ${alvo.nome}`);
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
    return NextResponse.json({ erro: "Diga se a arte é do computador ou do celular." }, { status: 400 });
  }

  await apagarConfiguracao(alvo.chave);
  await registrarLog(sessao.nome ?? "?", "removeu a arte da dobra", `versão do ${alvo.nome}`);
  return NextResponse.json({ ok: true });
}
