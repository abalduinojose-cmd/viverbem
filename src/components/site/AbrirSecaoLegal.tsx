"use client";
// Nas páginas legais (25/10/2026) cada seção fica dobrada. Quando a pessoa
// chega por um link com âncora (#cookies, pelo sumário ou de fora), esta
// peça abre a seção certa antes de rolar até ela.
import { useEffect } from "react";

export function AbrirSecaoLegal() {
  useEffect(() => {
    const abrir = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const alvo = document.getElementById(id);
      if (alvo instanceof HTMLDetailsElement) {
        alvo.open = true;
        alvo.scrollIntoView({ block: "start" });
      }
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => window.removeEventListener("hashchange", abrir);
  }, []);
  return null;
}
