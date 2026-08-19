import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DropEarn — Upload. Share. Earn.",
  description:
    "DropEarn is a transparent, legitimate monetized file-sharing platform. Upload files, generate secure links, and earn real revenue shares from qualified downloads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseClientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1544515292334176";

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google AdSense Meta Verification */}
        <meta name="google-adsense-account" content="ca-pub-1544515292334176" />

        {/* Google AdSense Official Script & Auto Ads */}
        {adSenseClientId && adSenseClientId.startsWith("ca-pub-") && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
