import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/ui/header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/components/react-query-provider";
import { MockProvider } from "@/components/mock-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Peer39 - eLibrary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable
        )}
      >
        <ReactQueryClientProvider>
          <MockProvider>
            <Header />
            {children}
            <Toaster />
          </MockProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
