import "../globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
import Sidebar from "@/components/Sidebar";
import ProtectedPage from "@/components/ProtectedPage";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Custom Instagram",
  description: "Michał Miłek",
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
          <ProtectedPage>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
              <Sidebar />
              {children}
            </main>
          </ProtectedPage>
        </Providers>
      </body>
    </html>
  );
}
