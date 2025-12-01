import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NSE Stock Analyzer",
  description: "Real-time NSE stock analysis and ranking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}>
        <QueryProvider>
          <Navbar />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
