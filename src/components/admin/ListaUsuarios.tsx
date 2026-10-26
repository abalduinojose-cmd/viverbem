"use client";
// Controle de acessos ao painel, exclusivo do gestor: criar acesso de
// colaborador (ou de outro gestor), desligar quem saiu da equipe e trocar
// senha esquecida.
//
// 26/10/2026 ("melhore o acesso ao painel"): os números no alto (ativos,
// gestores, colaboradores, bloqueados), a lista num cartão só com as
// linhas e a situação de cada um ("entrou há 2 h", "nunca entrou",
// "login bloqueado"), as ações em botões pequenos, a troca de senha num
// campo na própria linha (com "gerar uma senha", em vez do prompt do
// navegador), e o formulário de novo acesso com o mesmo gerador.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAPEL_ADMIN, PAPEL_OPERADOR, nomePapel } from "@/lib/tipos";
import { AvisoAdmin, BotaoAdmin, CabecalhoAdmin, CampoAdmin, CartaoNumero, IconeMais, Inicial, Selo, classeCampoAdmin } from "./PecasAdmin";
import { ICONES } from "./iconesAdmin";

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
  ultimoAcesso: string | null;
  criadoEm: string;
  // Login travado por tentativas erradas (até quando) e quantas falhas há
  bloqueadoAte: string | null;
  falhasLogin: number;
}

function formatarData(iso: string | null) {
  if (!iso) return "nunca entrou";
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

/** "entrou agora", "há 3 h", "ontem", "há 5 dias" ou a data */
function quando(iso: string | null) {
  if (!iso) return "nunca entrou";
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return "entrou agora";
  if (min < 60) return `entrou há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `entrou há ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return "entrou ontem";
  if (d < 30) return `entrou há ${d} dias`;
  return `último acesso ${new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })}`;
}

/** Uma senha de 10 caracteres, fácil de ditar (sem 0/O, 1/l) */
function gerarSenha() {
  const letras = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const valores = new Uint32Array(10);
  crypto.getRandomValues(valores);
  return [...valores].map((v) => letras[v % letras.length]).join("");
}

const PAPEIS = [
  {
    valor: PAPEL_OPERADOR,
    titulo: "Colaborador",
    texto: "Cuida do catálogo: produtos, fotos, preço no site, categorias e as seções da home.",
  },
  {
    valor: PAPEL_ADMIN,
    titulo: "Gestor",
    texto: "Tudo do colaborador, mais publicar, apagar, os números, pedidos, leads, o log e os acessos.",
  },
];

function IconeChave() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12.5 12h8m-3 0v3m-3-3v2.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function ListaUsuarios({ usuarios, meuId }: { usuarios: UsuarioDTO[]; meuId: number }) {
  const router = useRouter();
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState(PAPEL_OPERADOR);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);
  // A troca de senha aberta numa linha
  const [trocando, setTrocando] = useState<number | null>(null);
  const [novaSenha, setNovaSenha] = useState("");

  function falhou(m: string) {
    setErro(m);
    setAviso("");
  }
  function deuCerto(m: string) {
    setAviso(m);
    setErro("");
    router.refresh();
  }

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setOcupado(true);
    try {
      const r = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, papel }),
      });
      const dados = await r.json().catch(() => ({}));
      if (!r.ok) {
        falhou(dados.erro ?? "Não foi possível criar o acesso.");
        return;
      }
      setNome("");
      setEmail("");
      setSenha("");
      setPapel(PAPEL_OPERADOR);
      setCriando(false);
      deuCerto(`Acesso de ${nome} criado. Passe a senha inicial para a pessoa e peça para trocar no primeiro acesso.`);
    } finally {
      setOcupado(false);
    }
  }

  async function patch(u: UsuarioDTO, corpo: Record<string, unknown>, mensagem: string) {
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const dados = await r.json().catch(() => ({}));
    if (!r.ok) {
      falhou(dados.erro ?? "Não foi possível alterar.");
      return false;
    }
    deuCerto(mensagem);
    return true;
  }

  async function salvarSenha(u: UsuarioDTO) {
    if (novaSenha.length < 6) {
      falhou("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    const ok = await patch(u, { senha: novaSenha }, `Senha de ${u.nome} atualizada. Passe a nova senha para a pessoa.`);
    if (ok) {
      setTrocando(null);
      setNovaSenha("");
    }
  }

  async function remover(u: UsuarioDTO) {
    if (!window.confirm(`Remover o acesso de ${u.nome} de vez?`)) return;
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, { method: "DELETE" });
    const dados = await r.json().catch(() => ({}));
    if (!r.ok) falhou(dados.erro ?? "Não foi possível remover.");
    else deuCerto(`Acesso de ${u.nome} removido.`);
  }

  const ativos = usuarios.filter((u) => u.ativo);
  const gestores = ativos.filter((u) => u.papel === PAPEL_ADMIN).length;
  const colaboradores = ativos.filter((u) => u.papel !== PAPEL_ADMIN).length;
  const bloqueados = usuarios.filter((u) => u.bloqueadoAte).length;

  return (
    <div className="max-w-5xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Acessos ao painel"
        descricao="Quem pode entrar e o que cada um consegue fazer. Gestor vê tudo; colaborador cuida do catálogo e da home."
        acao={
          !criando ? (
            <BotaoAdmin variante="primario" onClick={() => setCriando(true)}>
              <IconeMais />
              Novo acesso
            </BotaoAdmin>
          ) : undefined
        }
      />

      {/* ---------- Os números ---------- */}
      <div className="cascata grid grid-cols-2 xl:grid-cols-4 gap-3 mt-6">
        <CartaoNumero tom="noite" icone={ICONES.acessos} rotulo="Acessos ativos" valor={ativos.length} apoio={`${usuarios.length - ativos.length} desligado${usuarios.length - ativos.length === 1 ? "" : "s"}`} />
        <CartaoNumero icone={ICONES.painel} rotulo="Gestores" valor={gestores} apoio="veem tudo" />
        <CartaoNumero icone={ICONES.produtos} rotulo="Colaboradores" valor={colaboradores} apoio="catálogo e home" />
        <CartaoNumero tom={bloqueados > 0 ? "ambar" : "navy"} icone={ICONES.log} rotulo="Login bloqueado" valor={bloqueados} apoio={bloqueados > 0 ? "por senha errada" : "nenhum travado"} />
      </div>

      {erro && <AvisoAdmin className="mt-4">{erro}</AvisoAdmin>}
      {aviso && (
        <AvisoAdmin tom="ok" className="mt-4">
          {aviso}
        </AvisoAdmin>
      )}

      {/* ---------- Novo acesso ---------- */}
      {criando && (
        <form onSubmit={criar} className="bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] p-5 md:p-6 mt-5 flex flex-col gap-5 animar-surgir">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ouro-escuro">Novo acesso</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoAdmin rotulo="Nome" obrigatorio>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="off" className={classeCampoAdmin} placeholder="Como a pessoa é chamada" />
            </CampoAdmin>
            <CampoAdmin rotulo="E-mail" obrigatorio>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" className={classeCampoAdmin} placeholder="pessoa@viverbem.com.br" />
            </CampoAdmin>
            <CampoAdmin rotulo="Senha inicial" obrigatorio dica="Mínimo de 6 caracteres. A pessoa troca depois.">
              <div className="flex gap-2">
                <input value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} autoComplete="new-password" className={`${classeCampoAdmin} font-mono`} />
                <BotaoAdmin onClick={() => setSenha(gerarSenha())} className="shrink-0" title="Gerar uma senha">
                  <IconeChave />
                  Gerar
                </BotaoAdmin>
              </div>
            </CampoAdmin>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-navy">Permissão</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {PAPEIS.map((o) => {
                const marcado = papel === o.valor;
                return (
                  <label
                    key={o.valor}
                    className={`rounded-2xl p-4 cursor-pointer ring-1 ring-inset transition-colors ${marcado ? "ring-tinta bg-gelo/60 shadow-[0_0_0_4px_rgba(28,105,181,0.1)]" : "ring-fio bg-white hover:ring-tinta/40"}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input type="radio" name="papel" value={o.valor} checked={marcado} onChange={() => setPapel(o.valor)} className="w-4 h-4 accent-[#1c69b5]" />
                      <span className="font-semibold text-navy">{o.titulo}</span>
                    </span>
                    <span className="block text-xs text-cinza mt-1.5 leading-relaxed pl-[1.65rem]">{o.texto}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex gap-2">
            <BotaoAdmin type="submit" variante="primario" disabled={ocupado}>
              {ocupado ? "Criando..." : "Criar acesso"}
            </BotaoAdmin>
            <BotaoAdmin
              variante="fantasma"
              onClick={() => {
                setCriando(false);
                setErro("");
              }}
            >
              Cancelar
            </BotaoAdmin>
          </div>
        </form>
      )}

      {/* ---------- A lista ---------- */}
      <ul className="mt-5 bg-white rounded-[1.5rem] ring-1 ring-fio/80 shadow-[0_18px_40px_-34px_rgba(16,42,74,0.35)] overflow-hidden divide-y divide-fio">
        {usuarios.map((u) => {
          const souEu = u.id === meuId;
          const abertaSenha = trocando === u.id;
          return (
            <li key={u.id} className={`px-4 md:px-5 py-4 transition-colors ${u.ativo ? "" : "bg-nevoa/50"}`}>
              <div className="flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-3">
                {u.ativo ? (
                  <Inicial nome={u.nome} tamanho="lg" />
                ) : (
                  <span aria-hidden="true" className="w-11 h-11 shrink-0 rounded-full bg-grafite-claro/40 text-white flex items-center justify-center font-semibold">
                    {u.nome.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-semibold truncate ${u.ativo ? "text-navy" : "text-cinza"}`}>{u.nome}</p>
                    <Selo tom={u.papel === PAPEL_ADMIN ? "azul" : "cinza"}>{nomePapel(u.papel)}</Selo>
                    {souEu && <Selo tom="ouro">você</Selo>}
                    {!u.ativo && <Selo tom="vermelho">desligado</Selo>}
                    {u.bloqueadoAte && <Selo tom="ambar">login bloqueado</Selo>}
                  </div>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-cinza">
                    <span className="truncate">{u.email}</span>
                    <span aria-hidden="true" className="text-fio">·</span>
                    <span className="text-xs text-grafite-claro tabular-nums" title={`Último acesso: ${formatarData(u.ultimoAcesso)}`}>
                      {quando(u.ultimoAcesso)}
                    </span>
                    {u.falhasLogin > 0 && !u.bloqueadoAte && (
                      <span className="text-xs text-ouro-escuro tabular-nums">
                        · {u.falhasLogin} erro{u.falhasLogin === 1 ? "" : "s"} de senha
                      </span>
                    )}
                  </p>
                </div>

                {/* As ações */}
                <div className="flex flex-wrap items-center gap-2 md:shrink-0">
                  <BotaoAdmin
                    tamanho="pequeno"
                    onClick={() => {
                      setTrocando(abertaSenha ? null : u.id);
                      setNovaSenha("");
                    }}
                    aria-expanded={abertaSenha}
                  >
                    <IconeChave />
                    Trocar senha
                  </BotaoAdmin>
                  {(u.bloqueadoAte || u.falhasLogin > 0) && (
                    <BotaoAdmin tamanho="pequeno" onClick={() => patch(u, { desbloquear: true }, `Login de ${u.nome} liberado.`)}>
                      {u.bloqueadoAte ? "Desbloquear" : "Zerar erros"}
                    </BotaoAdmin>
                  )}
                  {!souEu && (
                    <>
                      <BotaoAdmin tamanho="pequeno" onClick={() => patch(u, { ativo: !u.ativo }, `Acesso de ${u.nome} ${u.ativo ? "desligado" : "religado"}.`)}>
                        {u.ativo ? "Desligar" : "Religar"}
                      </BotaoAdmin>
                      <button
                        type="button"
                        onClick={() => remover(u)}
                        aria-label={`Remover o acesso de ${u.nome}`}
                        title="Remover de vez"
                        className="flex size-9 items-center justify-center rounded-full text-grafite-claro transition-colors hover:bg-carimbo/10 hover:text-carimbo"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* A troca de senha, na linha */}
              {abertaSenha && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    salvarSenha(u);
                  }}
                  className="animar-surgir mt-3 flex flex-col gap-2 rounded-2xl bg-nevoa/70 ring-1 ring-inset ring-fio/70 p-3 sm:flex-row sm:items-center md:ml-[3.75rem]"
                >
                  <input
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    minLength={6}
                    autoComplete="new-password"
                    placeholder={`Nova senha para ${u.nome} (mínimo 6)`}
                    aria-label={`Nova senha para ${u.nome}`}
                    className={`${classeCampoAdmin} font-mono sm:flex-1`}
                  />
                  <div className="flex gap-2">
                    <BotaoAdmin tamanho="pequeno" onClick={() => setNovaSenha(gerarSenha())}>
                      Gerar
                    </BotaoAdmin>
                    <BotaoAdmin tamanho="pequeno" variante="primario" type="submit">
                      Salvar senha
                    </BotaoAdmin>
                    <BotaoAdmin tamanho="pequeno" variante="fantasma" onClick={() => setTrocando(null)}>
                      Cancelar
                    </BotaoAdmin>
                  </div>
                </form>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-grafite-claro">Cinco senhas erradas travam o login por 30 minutos; o gestor desbloqueia aqui. Nenhuma senha fica visível depois de salva.</p>
    </div>
  );
}
