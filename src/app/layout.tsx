import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Calibrate — Talent Diagnostic",
    template: "%s | Calibrate",
  },
  description:
    "Diagnostic tools untuk mengukur kematangan talent management organisasi Anda.",
  openGraph: {
    siteName: "Calibrate by Daya Lima",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakarta.className}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
