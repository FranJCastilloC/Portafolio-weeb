"use client";

import { useMemo } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { es } from "@/data/i18n/es";
import { bioData } from "@/data/bioData";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { portfolioData, filterButtons } from "@/data/portfolioData";
import { blogData } from "@/data/blogs";
import { awards } from "@/data/awards";
import { books } from "@/data/books";
import { items } from "@/data/jobFeatures";
import { knoledges } from "@/data/knoledges";
import { skillData } from "@/data/skills";
import { contactData } from "@/data/contactData";
import { socialMediaData } from "@/data/socials";
import { profileInfo } from "@/data/profileInfo";

const LISTS = { experiences, education, portfolioData, blogData, awards, books, items };

const overlay = (list, patch) =>
  patch ? list.map((item) => (patch[item.id] ? { ...item, ...patch[item.id] } : item)) : list;

// An overlay keyed to an id that no longer exists would silently stay in English
if (process.env.NODE_ENV !== "production") {
  Object.entries(LISTS).forEach(([name, list]) => {
    const ids = new Set(list.map((i) => i.id));
    if (ids.size !== list.length) console.warn(`[i18n] duplicate ids in ${name}`);
    Object.keys(es[name] ?? {}).forEach((id) => {
      if (!ids.has(Number(id))) console.warn(`[i18n] es.${name}[${id}] matches no item`);
    });
  });
}

export function useContent() {
  const { lang } = useLang();
  return useMemo(() => {
    const p = lang === "es" ? es : null;
    const lists = Object.fromEntries(
      Object.entries(LISTS).map(([name, list]) => [name, overlay(list, p?.[name])])
    );
    return {
      ...lists,
      bioData: p ? { ...bioData, ...p.bioData } : bioData,
      knoledges: p?.knoledges ?? knoledges,
      filterButtons,
      skillData,
      contactData,
      socialMediaData,
      profileInfo,
    };
  }, [lang]);
}
