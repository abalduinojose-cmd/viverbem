// A escolha de cookies da pessoa, guardada no navegador (21/10/2026).
// true = aceitou a medição (Google Analytics), false = só os necessários,
// null = ainda não escolheu. Um evento avisa quem precisa reagir (o
// Analytics) e outro pede para o aviso abrir de novo (o link "Cookies" do
// rodapé). Tudo em try/catch: em navegação anônima o armazenamento pode
// estar bloqueado, e aí o site segue como se nada tivesse sido escolhido.
const CHAVE = "vb-cookies";
const EVENTO_MUDOU = "vb:cookies-mudou";
const EVENTO_ABRIR = "vb:cookies-abrir";

export function lerConsentimento(): boolean | null {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === "aceitos" ? true : v === "necessarios" ? false : null;
  } catch {
    return null;
  }
}

export function guardarConsentimento(aceitou: boolean) {
  try {
    window.localStorage.setItem(CHAVE, aceitou ? "aceitos" : "necessarios");
  } catch {
    /* sem armazenamento: vale só nesta página */
  }
  window.dispatchEvent(new CustomEvent(EVENTO_MUDOU, { detail: aceitou }));
}

export function aoMudarConsentimento(fn: (aceitou: boolean) => void) {
  const ouvinte = (e: Event) => fn(Boolean((e as CustomEvent<boolean>).detail));
  window.addEventListener(EVENTO_MUDOU, ouvinte);
  return () => window.removeEventListener(EVENTO_MUDOU, ouvinte);
}

export function pedirParaAbrirCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR));
}

export function aoPedirParaAbrir(fn: () => void) {
  window.addEventListener(EVENTO_ABRIR, fn);
  return () => window.removeEventListener(EVENTO_ABRIR, fn);
}
