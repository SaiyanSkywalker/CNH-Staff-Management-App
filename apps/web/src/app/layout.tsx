import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Banner from "@webSrc/components/Banner";
import { BannerContextProvider } from "@webSrc/contexts/BannerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CNH Staff Management",
  description: "Admin portal for CNH Staff Management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BannerContextProvider>
          <Navbar />
          <Banner />
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {children}
          </main>
        </BannerContextProvider>
      </body>
    </html>
  );
}
