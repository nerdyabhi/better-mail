import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/analytics/PosthogProvider";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL("https://bettermail.tech"),

  title: {
    default: "BetterMail | The AI-First Email Client",
    template: "%s | BetterMail",
  },

  description:
    "BetterMail is a modern AI-powered email client built for speed, focus, and power users.",

  keywords: [
    "AI email client",
    "modern email client",
    "smart email app",
    "AI inbox manager",
    "Better email",
    "productivity email app",

    "Superhuman alternative",
    "Gmail alternative for power users",
    "Outlook alternative for professionals",

    "AI powered email",
    "gmail outlook all in one",
    "cheaper superhuman alternatives",

    "inbox zero app",
    "reduce email overwhelm",
    "organize email automatically",

    "best AI email client for productivity",
    "fast email client for startups",
  ],

  authors: [{ name: "BetterMail Team" }],
  creator: "BetterMail",
  publisher: "BetterMail",

  openGraph: {
    type: "website",
    url: "https://bettermail.tech",
    title: "BetterMail - Fastest Email Experience Ever Made",
    description: "A faster, smarter email experience built for modern teams.",
    siteName: "BetterMail",
    images: [
      {
        url: "/flowModeDashboard.png",
        width: 1200,
        height: 630,
        alt: "BetterMail Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BetterMail - The AI-First Email Client",
    description: "A faster, smarter email experience built for modern teams.",
    images: ["/flowModeDashboard.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/betterMailLogo.png",
    apple: "/betterMailLogo.png",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${instrumentSerif.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
