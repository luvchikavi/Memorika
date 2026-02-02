import type { Metadata } from "next";
import { Heebo, Poppins } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Memorika | שיטת ניקוי זכרונות מפתח",
  description: "שיטת ניקוי זכרונות מפתח - טיפול בטראומה מבוסס NLP מתקדם. קורסים והכשרות למטפלים עם קרן מלניאק.",
  keywords: ["טראומה", "NLP", "טיפול", "קורסים", "קרן מלניאק", "ניקוי זכרונות", "מטפלים"],
  authors: [{ name: "Keren Maliniak" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Memorika | שיטת ניקוי זכרונות מפתח",
    description: "טראומה היא לא גזירת גורל. שיטת ניקוי זכרונות מפתח - 14 שנות ניסיון קליני.",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${heebo.variable} ${poppins.variable} font-heebo antialiased bg-cream text-navy`}
      >
        {children}
      </body>
    </html>
  );
}
