import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Splitwise Clone",
  description: "Minimal expense sharing app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster richColors position="top-center" />
          <Navbar />
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
