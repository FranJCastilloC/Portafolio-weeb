"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Modal({ label, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <motion.article
        className="panel relative my-auto w-full max-w-3xl overflow-hidden"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          autoFocus
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded border border-line bg-bg/80 text-ink-2 backdrop-blur transition-colors hover:border-accent/40 hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </motion.article>
    </motion.div>
  );
}
