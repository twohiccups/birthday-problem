import type { Metadata } from "next";
import { Erica_One, Geist_Mono, Ultra } from "next/font/google";
import "./globals.css";


const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one"
});

const ultra = Ultra({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ultra"
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Birthday Problem",
  description: "Fun simulations and info",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ericaOne.variable} ${geistMono.variable} ${ultra.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
