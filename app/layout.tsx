// app/layout.tsx (Server Component)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import the client wrapper that we'll create below
import ClientWrapper from "./client-wrapper";
import { Toaster } from "@/components/ui/sonner"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
       
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}