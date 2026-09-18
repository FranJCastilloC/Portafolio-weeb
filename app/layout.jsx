import { Inter, JetBrains_Mono } from "next/font/google";
import { profileInfo } from "@/data/profileInfo";
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
    default: `${profileInfo.name} — Risk Analyst & Data Scientist`,
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
    title: `${profileInfo.name} — Risk Analyst & Data Scientist`,
    description:
      "VaR modelling, stress testing and data pipelines. Selected work in Python, SQL and Power BI.",
    siteName: profileInfo.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profileInfo.name} — Risk Analyst & Data Scientist`,
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
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
