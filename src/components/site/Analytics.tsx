"use client";
// Google Analytics 4 com o Modo de Consentimento (21/10/2026).
//
// Só entra quando NEXT_PUBLIC_GA_ID está definido (o ID "G-..." da
// propriedade, ver PRODUCAO.md); sem ele, não carrega nada. Antes do script
// do Google, o consentimento nasce NEGADO para tudo (nada de cookie de
// medição nem de anúncio) e passa a concedido só depois que a pessoa aceita
// no aviso de cookies (ConsentimentoCookies), ou de imediato se ela já
// tinha aceitado numa visita anterior. Quem recusa continua sem nada.
// O endereço vai sem a busca (?busca=termo não é dado pessoal, mas também
// não precisa ir).
import Script from "next/script";
import { useEffect } from "react";
import { lerConsentimento, aoMudarConsentimento } from "./consentimento";

const ID_GA = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  useEffect(() => {
    if (!ID_GA) return;
    const aplicar = (aceitou: boolean) => {
      if (typeof window.gtag !== "function") return;
      window.gtag("consent", "update", {
        analytics_storage: aceitou ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    };
    const atual = lerConsentimento();
    if (atual !== null) aplicar(atual);
    return aoMudarConsentimento(aplicar);
  }, []);

  if (!ID_GA) return null;
  return (
    <>
      {/* O consentimento padrão (tudo negado) vai inline, antes de qualquer
          script do Google carregar; a escolha guardada vira "update" no
          efeito acima, e o gtag espera até 500 ms por ela */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID_GA}`} strategy="afterInteractive" />
      <Script id="ga-inicio" strategy="afterInteractive">
        {`gtag('js',new Date());gtag('config','${ID_GA}',{anonymize_ip:true,page_location:location.origin+location.pathname});`}
      </Script>
    </>
  );
}
