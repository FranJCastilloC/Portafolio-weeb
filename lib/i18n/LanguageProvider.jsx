"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ui } from "@/lib/i18n/ui";
import { STORAGE_KEY } from "@/lib/i18n/boot";

export const LANGS = ["en", "es"];

const LanguageContext = createContext(null);

function lookup(dict, path) {
  return path.split(".").reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

export function LanguageProvider({ children }) {
  // Always "en" for the server render and hydration; the real choice is applied
  // right after, from what the boot script already decided.
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const chosen = document.documentElement.getAttribute("data-lang");
    if (chosen && chosen !== "en" && LANGS.includes(chosen)) setLangState(chosen);
    else document.documentElement.removeAttribute("data-i18n-pending");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.setAttribute("data-lang", lang);
    if (lang !== "en" || !root.hasAttribute("data-i18n-pending")) {
      root.removeAttribute("data-i18n-pending");
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just won't persist
    }
  }, []);

  const t = useCallback(
    (path) => {
      const value = lookup(ui[lang], path);
      return value === undefined ? lookup(ui.en, path) : value;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
