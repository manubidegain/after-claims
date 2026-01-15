import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chris Stussy Pop Up - Key Mood",
  description: "Inscripción para el Pop Up de Chris Stussy en Luxo, La Barra",
  icons: {
    icon: '/LogoKEY_Negro.png',
    apple: '/LogoKEY_Negro.png',
  },
  openGraph: {
    title: "Chris Stussy Pop Up - Key Mood",
    description: "Registrate para el Pop Up de Chris Stussy el 17/01 en Luxo, La Barra",
    images: ['/LogoKEY_Negro.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chris Stussy Pop Up - Key Mood",
    description: "Registrate para el Pop Up de Chris Stussy el 17/01 en Luxo, La Barra",
    images: ['/LogoKEY_Negro.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
