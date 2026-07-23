import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";
import { ThemeSync } from "@/components/theme-sync";
import { Toaster } from "@/components/toaster";
import { THEME_STORAGE_KEY } from "@/lib/store/theme";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Padikk",
  description: "You can suggest, padikk means learn in malayalam",
};

// Sets data-theme before first paint so the persisted theme choice never flashes
// the wrong palette. Reads the same zustand-persist localStorage key as
// lib/store/theme.ts.
const NO_FLASH_THEME_SCRIPT = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var theme='dark';if(raw){var parsed=JSON.parse(raw);var t=parsed&&parsed.state&&parsed.state.theme;if(t==='light'||t==='dark')theme=t;}document.documentElement.setAttribute('data-theme',theme);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn(inter.variable, jetbrainsMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeSync />
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
