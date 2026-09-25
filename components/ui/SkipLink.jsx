"use client";

import { useLang } from "@/lib/i18n/LanguageProvider";

export default function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
    >
      {t("skip")}
    </a>
  );
}
