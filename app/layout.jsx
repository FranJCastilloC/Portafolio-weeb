import { Inter, JetBrains_Mono } from "next/font/google";
import { profileInfo } from "@/data/profileInfo";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { languageBootScript } from "@/lib/i18n/boot";
import SkipLink from "@/components/ui/SkipLink";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-face",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-face",
});

export const metadata = {
  metadataBase: new URL("https://portafolio-weeb-7uzj.vercel.app"),
  title: {
    default: `${profileInfo.name} — Machine Learning & Data Science`,
    template: `%s — ${profileInfo.name}`,
  },
  description:
    "Risk Analyst at Parallax Valores (Parval) and Industrial Engineer, currently pursuing a Master's in Artificial Intelligence Development. I build VaR models, stress tests and data pipelines in Python, SQL and Power BI.",
  keywords: [
    "Risk Analyst",
    "Data Scientist",
    "Value at Risk",
    "Monte Carlo",
    "Python",
    "SQL",
    "Power BI",
    "Industrial Engineer",
    "Santo Domingo",
  ],
  authors: [{ name: profileInfo.name }],
  openGraph: {
    type: "website",
    title: `${profileInfo.name} — Machine Learning & Data Science`,
    description:
      "VaR modelling, stress testing and data pipelines. Selected work in Python, SQL and Power BI.",
    siteName: profileInfo.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profileInfo.name} — Machine Learning & Data Science`,
    description: "VaR modelling, stress testing and data pipelines.",
  },
  icons: { icon: "/assets/img/favicon.png" },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    // The boot script sets lang/data-lang before hydration, so the attributes
    // legitimately differ from the prerendered HTML
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageBootScript }} />
      </head>
      <body>
        <LanguageProvider>
          <SkipLink />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
