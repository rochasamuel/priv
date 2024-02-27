import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import PublicProviders from "@/providers/public-providers";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Informações",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {

  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <PublicProviders>
          <ThemeProvider
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="h-[calc(100dvh-66px)] w-full overflow-y-auto flex-col flex justify-between">
              {children}
              <Footer />
            </div>
          </ThemeProvider>
        </PublicProviders>
				<Toaster />
      </body>
    </html>
  );
}
