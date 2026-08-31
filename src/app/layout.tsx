import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieConsent } from "@/components/privacy/CookieConsent";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "DropEarn — Upload. Share. Earn.",
    template: "%s | DropEarn",
  },
  description:
    "DropEarn is a transparent, legitimate monetized file-sharing platform. Upload files, generate secure links, and earn real revenue shares from qualified downloads.",
  keywords: [
    "file sharing",
    "monetized file upload",
    "earn from downloads",
    "PPD platform",
    "creator monetization",
  ],
  authors: [{ name: "DropEarn Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dropearnn.netlify.app",
    siteName: "DropEarn",
    title: "DropEarn — Upload. Share. Earn.",
    description:
      "Transparent monetized file sharing. Earn real revenue shares from every qualified download.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DropEarn Monetized File Sharing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DropEarn — Upload. Share. Earn.",
    description:
      "Transparent monetized file sharing. Earn real revenue shares from every qualified download.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://dropearnn.netlify.app"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseClientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1544515292334176";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <SkipLink />
              <ScrollProgressBar />
              <NetworkStatus />
              <Navbar />
              <ErrorBoundary>
                <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
                  {children}
                </main>
              </ErrorBoundary>
              <Footer />
              <BackToTop />
              <FeedbackModal />
              <CookieConsent />
              <KeyboardShortcutsModal />
              <OnboardingModal />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
