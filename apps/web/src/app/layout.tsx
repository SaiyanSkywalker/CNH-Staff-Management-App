/**
 * File: layout.tsx
 * Purpose: Contains template for entire application
 */
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Banner from "@webSrc/components/Banner";
import { BannerContextProvider } from "@webSrc/contexts/BannerContext";
import AuthProvider from "@webSrc/contexts/AuthContext";
import Loading from "@webSrc/components/Loading";
import { LoadingContextProvider } from "@webSrc/contexts/LoadingContext";
import { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CNH Staff Management",
  description: "Admin portal for CNH Staff Management system",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BannerContextProvider>
          <AuthProvider>
            <LoadingContextProvider>
              <Navbar />
              <Banner />
              <Loading />
              <main className="flex min-h-screen flex-col items-center px-24 pt-16">
                {children}
              </main>
            </LoadingContextProvider>
          </AuthProvider>
        </BannerContextProvider>
      </body>
    </html>
  );
};
export default RootLayout;
