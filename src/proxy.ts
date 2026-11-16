// Teto de requisições na frente da API (15/11/2026, "força bruta: rate
// limit, teto de tentativas por IP e usuário, e 429 'calma, muitas
// requisições'"). No Next 16 o antigo middleware se chama proxy e roda no
// Node, antes de cada rota.
//
// Duas camadas, de propósito:
//   - AQUI, um freio rápido em memória, por janela de 1 minuto: corta a
//     rajada (um robô disparando centenas de chamadas) antes de chegar ao
//     banco. Conta por IP e, no painel, também por usuário logado (pelo
//     cookie da sessão), para um mesmo login não escapar trocando de IP.
//   - NAS ROTAS, o bloqueio que fica gravado no banco (protecaoLogin.ts e
//     limiteDeEnvios.ts): 5 senhas erradas por e-mail ou por IP bloqueiam o
//     login por 30 minutos; os pedidos do site têm teto por IP e por
//     WhatsApp. Esse vale mesmo com vários servidores.
// A memória daqui é por processo: numa hospedagem com várias instâncias,
// cada uma conta o seu (o bloqueio do banco continua valendo para todas).
//
// A prévia estática do GitHub não tem servidor: scripts/gerar-demo.js tira
// este arquivo do build, junto com a pasta da API.
import { NextResponse, type NextRequest } from "next/server";
import { ipDaRequisicao } from "@/lib/ipDaRequisicao";

type Regra = { prefixo: string; metodos?: string[]; limite: number };

// Por minuto. O login e os pedidos são públicos e curtos; o painel faz
// várias chamadas por tela (salvar, ordenar, enviar fotos), então o teto é
// folgado para quem trabalha e baixo para um robô.
const REGRAS: Regra[] = [
  { prefixo: "/api/auth/login", metodos: ["POST"], limite: 10 },
  { prefixo: "/api/pedidos", metodos: ["POST"], limite: 10 },
  { prefixo: "/api/admin/", limite: 120 },
];

const JANELA_MS = 60_000;
const contagens = new Map<string, { n: number; fim: number }>();
let ultimaLimpeza = 0;

/** Conta mais uma na chave; devolve quantos segundos faltam se passou do teto */
function estourou(chave: string, limite: number, agora: number): number | null {
  const atual = contagens.get(chave);
  if (!atual || atual.fim <= agora) {
    contagens.set(chave, { n: 1, fim: agora + JANELA_MS });
    return null;
  }
  atual.n += 1;
  return atual.n > limite ? Math.max(1, Math.ceil((atual.fim - agora) / 1000)) : null;
}

export function proxy(req: NextRequest) {
  const caminho = req.nextUrl.pathname;
  const regra = REGRAS.find((r) => caminho.startsWith(r.prefixo) && (!r.metodos || r.metodos.includes(req.method)));
  if (!regra) return NextResponse.next();

  const agora = Date.now();
  // De tempos em tempos joga fora as janelas vencidas (a memória não cresce)
  if (agora - ultimaLimpeza > JANELA_MS) {
    for (const [chave, valor] of contagens) if (valor.fim <= agora) contagens.delete(chave);
    ultimaLimpeza = agora;
  }

  const chaves = [`${regra.prefixo}|ip:${ipDaRequisicao(req.headers)}`];
  // No painel, também por usuário: o cookie da sessão (criptografado)
  // identifica o login, sem precisar abrir a sessão aqui
  const cookieSessao = req.cookies.get("viverbem_admin")?.value;
  if (regra.prefixo === "/api/admin/" && cookieSessao) chaves.push(`${regra.prefixo}|sessao:${cookieSessao.slice(-48)}`);

  let espera: number | null = null;
  for (const chave of chaves) {
    const s = estourou(chave, regra.limite, agora);
    if (s !== null) espera = Math.max(espera ?? 0, s);
  }
  if (espera === null) return NextResponse.next();

  return NextResponse.json(
    { erro: `Calma, muitas requisições. Espere ${espera} segundo${espera === 1 ? "" : "s"} e tente de novo.` },
    { status: 429, headers: { "Retry-After": String(espera) } }
  );
}

export const config = {
  matcher: ["/api/:path*"],
};
