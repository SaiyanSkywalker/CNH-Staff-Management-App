import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import AuthProvider from "@webSrc/context/Auth";

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
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
