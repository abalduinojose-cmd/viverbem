"use client";
// O painel em modo DEMONSTRAÇÃO, na vitrine estática do GitHub Pages
// (10/10/2026; ver lib/adminDemo.ts). Só entra no ar com
// NEXT_PUBLIC_DEMO=1; no site de verdade nada daqui é montado.
//
//   GuardaDemo     envolve as páginas protegidas: lê a "sessão" guardada
//                  no navegador (quem entrou pela tela de login), manda
//                  para o login quem não entrou, mantém o colaborador fora
//                  das páginas do gestor, mostra a faixa "prévia" no alto e
//                  intercepta toda gravação (fetch em /api/) com um aviso
//                  de que nada é gravado.
//   useSessaoDemo  quem está "logado" na prévia (null fora dela): a casca
//                  e as listas usam para esconder o que o colaborador não vê.
//   EntradaDemo    o /admin da prévia: manda cada papel para a sua página.
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PAPEL_ADMIN, PAPEL_OPERADOR } from "@/lib/tipos";

export const EH_DEMO_CLIENTE = process.env.NEXT_PUBLIC_DEMO === "1";

const CHAVE = "viverbem_demo_sessao";

export interface SessaoDemo {
  email: string;
  nome: string;
  papel: string;
}

/** Os dois acessos da prévia (os mesmos do seed; a senha não é conferida) */
export const USUARIOS_DEMO: SessaoDemo[] = [
  { email: "admin@viverbem.com.br", nome: "Administrador", papel: PAPEL_ADMIN },
  { email: "operador@viverbem.com.br", nome: "Operador da Loja", papel: PAPEL_OPERADOR },
];

// Páginas que só o gestor abre (o layout de verdade decide pela sessão)
const SOMENTE_GESTOR = ["/admin/painel", "/admin/clientes", "/admin/log", "/admin/usuarios"];

export function lerSessaoDemo(): SessaoDemo | null {
  try {
    const guardada = localStorage.getItem(CHAVE);
    return guardada ? (JSON.parse(guardada) as SessaoDemo) : null;
  } catch {
    return null;
  }
}

// A mesma leitura, mas devolvendo o MESMO objeto enquanto o texto guardado
// não muda (useSyncExternalStore exige um valor estável entre renders)
let ultimoBruto: string | null | undefined;
let ultimaSessao: SessaoDemo | null = null;
function lerSessaoEstavel(): SessaoDemo | null {
  let bruto: string | null = null;
  try {
    bruto = localStorage.getItem(CHAVE);
  } catch {
    bruto = null;
  }
  if (bruto !== ultimoBruto) {
    ultimoBruto = bruto;
    try {
      ultimaSessao = bruto ? (JSON.parse(bruto) as SessaoDemo) : null;
    } catch {
      ultimaSessao = null;
    }
  }
  return ultimaSessao;
}
const semAssinatura = () => () => {};

export function entrarDemo(usuario: SessaoDemo) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
  } catch {
    /* sem armazenamento (janela privada): a pessoa volta ao login */
  }
}

export function sairDemo() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada a limpar */
  }
}

const Contexto = createContext<SessaoDemo | null>(null);

export function useSessaoDemo() {
  return useContext(Contexto);
}

export function GuardaDemo({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // No servidor (e antes de hidratar) não há navegador: nada é montado.
  // Depois, a sessão vem do localStorage, lida como um armazém externo.
  const montado = useSyncExternalStore(semAssinatura, () => true, () => false);
  const sessao = useSyncExternalStore(semAssinatura, lerSessaoEstavel, () => null);
  const [aviso, setAviso] = useState(false);

  // Quem não entrou vai para o login
  useEffect(() => {
    if (montado && !sessao) router.replace("/admin/login");
  }, [montado, sessao, router]);

  // O colaborador não abre as páginas do gestor nem pelo endereço
  useEffect(() => {
    if (sessao && sessao.papel !== PAPEL_ADMIN && SOMENTE_GESTOR.some((p) => pathname.startsWith(p))) {
      router.replace("/admin/produtos");
    }
  }, [sessao, pathname, router]);

  // Toda gravação vira um aviso: o fetch das telas é o mesmo do painel de
  // verdade, só que aqui ninguém atende em /api/
  useEffect(() => {
    const original = window.fetch.bind(window);
    let temporizador = 0;
    window.fetch = async (entrada: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof entrada === "string" ? entrada : entrada instanceof URL ? entrada.href : entrada.url;
      if (url.includes("/api/")) {
        if (url.includes("/api/auth/logout")) {
          sairDemo();
        } else {
          setAviso(true);
          window.clearTimeout(temporizador);
          temporizador = window.setTimeout(() => setAviso(false), 3800);
        }
        return new Response(JSON.stringify({ demo: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return original(entrada, init);
    };
    return () => {
      window.fetch = original;
      window.clearTimeout(temporizador);
    };
  }, []);

  if (!montado || !sessao) return null;

  return (
    <Contexto.Provider value={sessao}>
      {/* A faixa que diz onde a pessoa está */}
      <div className="sticky top-0 z-[60] flex items-center justify-center gap-2 bg-navy px-4 py-2 text-center text-xs font-medium text-white">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-[image:var(--ouro-degrade)]" />
        Prévia do painel: navegue à vontade. Nesta demonstração nada é gravado.
      </div>
      {children}
      {/* O aviso de cada tentativa de gravar */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-4 bottom-5 z-[70] flex justify-center transition duration-300 ${
          aviso ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-16px_rgba(13,35,64,0.7)]">
          Prévia: as alterações não são gravadas nesta demonstração.
        </span>
      </div>
    </Contexto.Provider>
  );
}

/** O /admin da prévia: o gestor vai para a visão geral, o colaborador para os produtos */
export function EntradaDemo() {
  const router = useRouter();
  useEffect(() => {
    const guardada = lerSessaoDemo();
    router.replace(!guardada ? "/admin/login" : guardada.papel === PAPEL_ADMIN ? "/admin/painel" : "/admin/produtos");
  }, [router]);
  return null;
}

/** Substitui o redirect() do servidor, que não existe no site estático */
export function RedirecionarDemo({ para }: { para: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(para);
  }, [router, para]);
  return null;
}
