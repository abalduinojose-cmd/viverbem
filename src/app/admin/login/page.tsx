"use client";
// Tela de login do painel (gestor e equipe entram pela mesma porta; o
// papel decide o que cada um vê depois).
//
// Cinco senhas erradas bloqueiam por 30 minutos (a API responde 429 com
// "bloqueadoAte"); a tela mostra o tempo que falta e desliga o botão.
//
// Na vitrine estática (NEXT_PUBLIC_DEMO=1, 10/10/2026) não há API: a tela
// aceita os dois e-mails do seed com qualquer senha e guarda quem entrou no
// navegador (ModoDemo). É só para a cliente ver e navegar pelo painel.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { AvisoAdmin, classeCampoAdmin } from "@/components/admin/PecasAdmin";
import { EH_DEMO_CLIENTE, USUARIOS_DEMO, entrarDemo } from "@/components/admin/ModoDemo";

export default function PaginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  // Até quando o acesso está bloqueado (null = livre)
  const [bloqueadoAte, setBloqueadoAte] = useState<Date | null>(null);
  const [agora, setAgora] = useState(() => Date.now());

  // Com bloqueio, o relógio anda a cada 15s para o texto acompanhar
  useEffect(() => {
    if (!bloqueadoAte) return;
    const relogio = setInterval(() => setAgora(Date.now()), 15_000);
    return () => clearInterval(relogio);
  }, [bloqueadoAte]);

  const bloqueado = bloqueadoAte !== null && bloqueadoAte.getTime() > agora;
  const minutos = bloqueadoAte ? Math.max(1, Math.ceil((bloqueadoAte.getTime() - agora) / 60_000)) : 0;

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (bloqueado) return;
    setErro("");

    // A prévia: sem servidor, entra pelo e-mail e segue
    if (EH_DEMO_CLIENTE) {
      const usuario = USUARIOS_DEMO.find((u) => u.email === email.trim().toLowerCase());
      if (!usuario) {
        setErro("Na prévia, entre com admin@viverbem.com.br (gestor) ou operador@viverbem.com.br (equipe).");
        return;
      }
      entrarDemo(usuario);
      router.push("/admin");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        if (resposta.status === 429 && dados.bloqueadoAte) {
          setBloqueadoAte(new Date(dados.bloqueadoAte));
          setAgora(Date.now());
        }
        setErro(dados.erro || "Não foi possível entrar.");
        return;
      }
      // /admin decide o destino pelo papel: gestor vai para a visão
      // geral, colaborador para os produtos
      router.push("/admin");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  // 3,25rem de altura: campo de entrada de painel pede alvo maior
  const campo = `${classeCampoAdmin} !pl-11 !h-[3.25rem]`;

  return (
    <div className="banner-noite em-noite flex-1 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <span aria-hidden="true" className="malha-banner" />
      {/* Luz de ouro atrás do cartão: o azul era chapado atrás dele e o
          cartão parecia colado. Só atmosfera, não encosta no conteúdo. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,165,107,0.18), rgba(201,165,107,0.06) 45%, transparent 68%)",
        }}
      />

      <div className="relative w-full max-w-[25.5rem]">
        {/* O fio de ouro no alto do cartão é a assinatura da marca: sai do
            nada nas pontas e acende no meio */}
        <div className="em-claro relative overflow-hidden rounded-[2rem] bg-white p-7 sm:p-9 shadow-[0_2px_4px_rgba(5,17,33,0.06),0_40px_80px_-32px_rgba(5,17,33,0.7)]">
          <span
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,165,107,0.85),transparent)]"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/logo.png")}
            alt="Manipulação Viver Bem"
            draggable={false}
            width={560}
            height={246}
            className="h-12 w-auto object-contain mx-auto"
          />

          <p className="rotulo-pilula !flex mx-auto mt-7 !text-[0.6875rem]">Painel</p>
          <h1 className="text-[1.75rem] font-semibold text-navy text-center tracking-[-0.035em] leading-[1.15] mt-3">
            Entrar no painel
          </h1>
          <p className="text-cinza text-[0.95rem] text-center mt-2">
            Gestor e equipe entram pela mesma porta.
          </p>

          <form onSubmit={entrar} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-navy">E-mail</span>
              <div className="relative">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grafite-claro"
                >
                  <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m3.8 7 7.2 5.4a1.7 1.7 0 0 0 2 0L20.2 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  disabled={bloqueado}
                  className={campo}
                  placeholder="voce@viverbem.com.br"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-navy">Senha</span>
              <div className="relative">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grafite-claro"
                >
                  <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  type={verSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={bloqueado}
                  className={`${campo} !pr-12`}
                  placeholder="••••••••"
                />
                {/* Ver a senha evita metade dos erros de digitação */}
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? "Esconder senha" : "Mostrar senha"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg text-grafite-claro hover:text-tinta hover:bg-gelo flex items-center justify-center transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.7" />
                    {verSenha && <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
                  </svg>
                </button>
              </div>
            </label>

            {EH_DEMO_CLIENTE && !erro && (
              <AvisoAdmin tom="info">
                Prévia do painel: entre com <b>admin@viverbem.com.br</b> (gestor) ou{" "}
                <b>operador@viverbem.com.br</b> (equipe), com qualquer senha. Nada é gravado.
              </AvisoAdmin>
            )}
            {bloqueado ? (
              <AvisoAdmin className="animar-surgir">
                Acesso bloqueado por tentativas erradas. Tente de novo em {minutos} min, ou peça ao gestor
                para desbloquear em Acessos ao painel.
              </AvisoAdmin>
            ) : (
              erro && <AvisoAdmin className="animar-surgir">{erro}</AvisoAdmin>
            )}

            <button
              type="submit"
              disabled={carregando || bloqueado}
              className="bg-navy hover:bg-tinta disabled:opacity-60 disabled:hover:bg-navy text-white font-semibold rounded-2xl h-[3.25rem] px-4 mt-2 flex items-center justify-center gap-2.5 shadow-[0_12px_26px_-14px_rgba(5,17,33,0.9)] transition-colors active:scale-[0.98]"
            >
              {carregando && (
                <span aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {bloqueado ? `Bloqueado por ${minutos} min` : carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-white/70 text-[0.78rem] text-center mt-7 leading-relaxed">
          Esqueceu a senha? Peça ao gestor para gerar uma nova
          <br />
          em Acessos ao painel. Cinco erros bloqueiam por 30 minutos.
        </p>

        <Link
          href="/"
          className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar para o site
        </Link>
      </div>
    </div>
  );
}
