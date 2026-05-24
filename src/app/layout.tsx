import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NoticeProvider } from "@/components/plain-notice";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SJEC — Student Result Portal",
  description: "Schools Joint Exam Center Mogadishu — official exam results portal.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className={`${sans.className} min-h-screen bg-background antialiased`}>
        <NoticeProvider>{children}</NoticeProvider>
      </body>
    </html>
  );
}
