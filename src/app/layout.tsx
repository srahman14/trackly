import Navbar from "@/components/navbar";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "trackly",
  description:
    "trackly - your personal privacy-first job tracker",

  appleWebApp: {
    title: "trackly | privacy-first job tracker",
  },

  openGraph: {
    title: "trackly | privacy-first job tracker",
    description:
      "trackly - your personal privacy-first job tracker",
    url: "https://trackly-red.vercel.app/",
    siteName: "trackly",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`$h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
