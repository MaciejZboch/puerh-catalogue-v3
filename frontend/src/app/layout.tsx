import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import { AuthProvider } from "./hooks/useAuth";
import AuthFlashMessage from "@/components/global/AuthFlashMessage";
import Footer from "@/components/global/Footer";
import { AuthModalProvider } from "@/components/global/AuthModalProvider";
import { AuthRedirectListener } from "@/components/global/AuthRedirectListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Pu-erh Catalogue",
  description: "A website for pu-erh tea",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col bg-dark min-h-screen`}
      >
        <AuthProvider>
          <AuthModalProvider>
            <Navbar />
            <AuthFlashMessage />
            <AuthRedirectListener />
            {children}
          </AuthModalProvider>
          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
