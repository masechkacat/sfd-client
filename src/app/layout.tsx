// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../components/QueryProvider";
import Navbar from "../components/Navbar";
import { AuthModalProvider } from "../context/AuthModalContext";
import AuthModal from "../components/AuthModal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative flex flex-col h-screen justify-between`}
      >
        <QueryProvider>
          <AuthModalProvider>
            <Navbar />
            {children}
          </AuthModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
