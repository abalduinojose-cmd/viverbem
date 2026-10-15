// Limite de envios por janela de tempo (15/10/2026): a rota pública de
// pedidos não tinha freio, e um robô podia encher "Pedidos" de lixo.
//
// Usa a mesma tabela da proteção do login (TentativaLogin), com chaves
// próprias ("pedido:ip:...", "pedido:zap:..."): `falhas` vira a contagem
// de envios e `bloqueadoAte` marca o fim da janela. Assim não precisa de
// tabela nova e funciona igual em vários servidores (o limite fica no
// banco, não na memória de um processo só).
import { db } from "@/lib/db";

/** Conta mais um envio em cada chave. Devolve false quando alguma passou
 *  do limite dentro da janela (o envio deve ser recusado). */
export async function cabeMaisUmEnvio(chaves: string[], limite: number, janelaMinutos: number): Promise<boolean> {
  const agora = Date.now();
  let cabe = true;
  for (const chave of chaves) {
    const atual = await db.tentativaLogin.findUnique({ where: { chave } });
    const janelaAberta = atual?.bloqueadoAte ? atual.bloqueadoAte.getTime() > agora : false;
    const envios = janelaAberta && atual ? atual.falhas + 1 : 1;
    const fim = janelaAberta && atual?.bloqueadoAte ? atual.bloqueadoAte : new Date(agora + janelaMinutos * 60_000);
    await db.tentativaLogin.upsert({
      where: { chave },
      create: { chave, falhas: envios, bloqueadoAte: fim },
      update: { falhas: envios, bloqueadoAte: fim },
    });
    if (envios > limite) cabe = false;
  }
  return cabe;
}
