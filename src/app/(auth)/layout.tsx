import "../globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
import UnprotectedPage from "@/components/UnprotectedPage";

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
          <UnprotectedPage>{children}</UnprotectedPage>
        </Providers>
      </body>
    </html>
  );
}
