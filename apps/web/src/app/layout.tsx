import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Banner from "@webSrc/components/Banner";
import { BannerContextProvider } from "@webSrc/contexts/BannerContext";
import AuthProvider from "@webSrc/contexts/AuthContext";
import Loading from "@webSrc/components/Loading";
import { LoadingContextProvider } from "@webSrc/contexts/LoadingContext";

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
        <AuthProvider>
          <BannerContextProvider>
            <LoadingContextProvider>
              <Navbar />
              <Banner />
              <Loading />
              <main className="flex min-h-screen flex-col items-center px-24 pt-16">
                {children}
              </main>
            </LoadingContextProvider>
          </BannerContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
