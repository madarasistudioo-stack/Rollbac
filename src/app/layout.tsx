import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Rollbac — Personalised photobooks, journals & planners",
  description:
    "Personalised photobooks, journals, planners and notebooks inspired by Madras — Marina mornings, Mylapore evenings, and filter kaapi rituals, bound your way.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint, so dark mode never flashes ivory. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("rollbac-theme");if(t==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
