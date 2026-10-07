"use client";
// Controle de acessos ao painel, exclusivo do gestor: criar acesso de
// colaborador (ou de outro gestor), desligar quem saiu da equipe e trocar
// senha esquecida.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAPEL_ADMIN, PAPEL_OPERADOR, nomePapel } from "@/lib/tipos";
import {
  AvisoAdmin,
  BotaoAdmin,
  CabecalhoAdmin,
  CampoAdmin,
  IconeMais,
  Inicial,
  Selo,
  classeCampoAdmin,
} from "./PecasAdmin";

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
  ultimoAcesso: string | null;
  criadoEm: string;
}

function formatarData(iso: string | null) {
  if (!iso) return "nunca entrou";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    texto: "Tudo do colaborador, mais publicar, apagar, os números, os clientes, o log e os acessos.",
  },
];

export function ListaUsuarios({ usuarios, meuId }: { usuarios: UsuarioDTO[]; meuId: number }) {
  const router = useRouter();
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState(PAPEL_OPERADOR);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

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
      const dados = await r.json();
      if (!r.ok) {
        setErro(dados.erro ?? "Não foi possível criar o acesso.");
        return;
      }
      setNome("");
      setEmail("");
      setSenha("");
      setPapel(PAPEL_OPERADOR);
      setCriando(false);
      router.refresh();
    } finally {
      setOcupado(false);
    }
  }

  async function alternarAtivo(u: UsuarioDTO) {
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !u.ativo }),
    });
    const dados = await r.json();
    if (!r.ok) setErro(dados.erro ?? "Não foi possível alterar.");
    router.refresh();
  }

  async function trocarSenha(u: UsuarioDTO) {
    const nova = window.prompt(`Nova senha para ${u.nome} (mínimo 6 caracteres):`);
    if (!nova) return;
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha: nova }),
    });
    const dados = await r.json();
    if (!r.ok) setErro(dados.erro ?? "Não foi possível trocar a senha.");
    else window.alert(`Senha de ${u.nome} atualizada.`);
  }

  async function remover(u: UsuarioDTO) {
    if (!window.confirm(`Remover o acesso de ${u.nome} de vez?`)) return;
    setErro("");
    const r = await fetch(`/api/admin/usuarios/${u.id}`, { method: "DELETE" });
    const dados = await r.json();
    if (!r.ok) setErro(dados.erro ?? "Não foi possível remover.");
    router.refresh();
  }

  const ativos = usuarios.filter((u) => u.ativo).length;

  return (
    <div className="max-w-3xl">
      <CabecalhoAdmin
        rotulo="Gestão"
        titulo="Acessos ao painel"
        descricao={`Quem pode entrar e o que cada um consegue fazer. ${ativos} ${ativos === 1 ? "acesso ativo" : "acessos ativos"}.`}
        acao={
          !criando ? (
            <BotaoAdmin variante="primario" onClick={() => setCriando(true)}>
              <IconeMais />
              Novo acesso
            </BotaoAdmin>
          ) : undefined
        }
      />

      {erro && <AvisoAdmin className="mt-5">{erro}</AvisoAdmin>}

      {/* Criação */}
      {criando && (
        <form onSubmit={criar} className="bg-white rounded-2xl border border-fio p-5 md:p-6 mt-5 flex flex-col gap-5 animar-surgir">
          <h2 className="font-semibold text-navy">Novo acesso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoAdmin rotulo="Nome" obrigatorio>
              <input value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="off" className={classeCampoAdmin} />
            </CampoAdmin>
            <CampoAdmin rotulo="E-mail" obrigatorio>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                className={classeCampoAdmin}
                placeholder="pessoa@viverbem.com.br"
              />
            </CampoAdmin>
            <CampoAdmin rotulo="Senha inicial" obrigatorio dica="Mínimo de 6 caracteres. A pessoa pode pedir uma nova depois.">
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={classeCampoAdmin}
              />
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
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                      marcado ? "border-tinta bg-gelo/60 ring-4 ring-tinta/10" : "border-fio bg-white hover:border-tinta/40"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="papel"
                        value={o.valor}
                        checked={marcado}
                        onChange={() => setPapel(o.valor)}
                        className="w-4 h-4 accent-[#1c69b5]"
                      />
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

      {/* Lista */}
      <div className="flex flex-col gap-3 mt-5">
        {usuarios.map((u) => {
          const souEu = u.id === meuId;
          return (
            <div key={u.id} className={`bg-white rounded-2xl border border-fio p-4 sm:p-5 ${u.ativo ? "" : "opacity-70"}`}>
              <div className="flex items-start gap-3.5">
                {u.ativo ? (
                  <Inicial nome={u.nome} tamanho="lg" />
                ) : (
                  <span aria-hidden="true" className="w-11 h-11 shrink-0 rounded-full bg-grafite-claro/40 text-white flex items-center justify-center font-semibold">
                    {u.nome.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-navy truncate">{u.nome}</p>
                    <Selo tom={u.papel === PAPEL_ADMIN ? "azul" : "cinza"}>{nomePapel(u.papel)}</Selo>
                    {souEu && <Selo tom="ouro">você</Selo>}
                    {!u.ativo && <Selo tom="vermelho">desligado</Selo>}
                  </div>
                  <p className="text-cinza text-sm truncate mt-0.5">{u.email}</p>
                  <p className="text-grafite-claro text-xs mt-1 tabular-nums">Último acesso: {formatarData(u.ultimoAcesso)}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-fio">
                <BotaoAdmin tamanho="pequeno" onClick={() => trocarSenha(u)}>
                  Trocar senha
                </BotaoAdmin>
                {!souEu && (
                  <>
                    <BotaoAdmin tamanho="pequeno" onClick={() => alternarAtivo(u)}>
                      {u.ativo ? "Desligar acesso" : "Religar acesso"}
                    </BotaoAdmin>
                    <BotaoAdmin tamanho="pequeno" variante="perigo" onClick={() => remover(u)} className="ml-auto">
                      Remover
                    </BotaoAdmin>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
