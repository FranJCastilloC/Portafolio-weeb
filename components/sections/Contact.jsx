"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { contactData } from "@/data/contactData";

/* EmailJS publishable identifiers — designed to be exposed client-side. */
const EMAILJS = {
  serviceId: "service_n4mkhz9",
  templateId: "template_ugoztxr",
  publicKey: "user_vYmDSd9PwIuRXUQEDjYwN",
};

const FIELDS = [
  { name: "name", label: "name", type: "text", autoComplete: "name" },
  { name: "email", label: "email", type: "email", autoComplete: "email" },
];

export default function Contact() {
  const form = useRef(null);
  const [status, setStatus] = useState("idle");

  const send = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        form.current,
        EMAILJS.publicKey
      );
      setStatus("sent");
      form.current.reset();
    } catch {
      setStatus("error");
    }
  };

  const reachable = contactData.filter((c) =>
    ["Phone", "Email", "Location"].includes(c.text.label)
  );

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 border-t border-line bg-surface/30 py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="08" kicker="Say hello" title="Get in touch" />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div>
              <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
                Open to conversations about risk analytics, data science roles and
                collaboration on quantitative projects.
              </p>

              <ul className="mt-7 space-y-px overflow-hidden rounded border border-line bg-line">
                {reachable.map((c) => {
                  const href =
                    c.text.label === "Email"
                      ? `mailto:${c.text.value}`
                      : c.text.label === "Phone"
                        ? `tel:${c.text.value.replace(/\s/g, "")}`
                        : null;
                  const body = (
                    <>
                      <span className="tag w-[4.5rem] shrink-0">{c.text.label}</span>
                      <span className="font-mono text-[0.8rem] break-all text-ink-2 transition-colors group-hover:text-accent">
                        {c.text.value}
                      </span>
                    </>
                  );
                  return (
                    <li key={c.id} className="bg-surface">
                      {href ? (
                        <a href={href} className="group flex items-baseline gap-3 px-4 py-3.5">
                          {body}
                        </a>
                      ) : (
                        <div className="group flex items-baseline gap-3 px-4 py-3.5">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form ref={form} onSubmit={send} className="panel p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <label key={f.name} className="block">
                    <span className="tag mb-2 block">
                      {f.label} <span className="text-accent">*</span>
                    </span>
                    <input
                      required
                      type={f.type}
                      name={f.name}
                      autoComplete={f.autoComplete}
                      className="w-full rounded border border-line bg-surface-2 px-3.5 py-2.5 font-mono text-[0.85rem] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/55"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="tag mb-2 block">
                  message <span className="text-accent">*</span>
                </span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  className="w-full resize-y rounded border border-line bg-surface-2 px-3.5 py-2.5 font-mono text-[0.85rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted focus:border-accent/55"
                />
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded bg-accent px-6 py-2.5 font-mono text-[0.82rem] font-medium text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>

                <p aria-live="polite" className="font-mono text-[0.76rem]">
                  {status === "sent" && (
                    <span className="text-accent">✓ Sent — I&apos;ll reply shortly.</span>
                  )}
                  {status === "error" && (
                    <span className="text-neg">
                      ✕ Couldn&apos;t send. Email me directly instead.
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
