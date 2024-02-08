import RedirectButton from "@/components/Button/RedirectButton";
import Header from "@/components/Header/Header";
import MobileNav from "@/components/MobileNav/MobileNav";
import SideNav from "@/components/SideNav/SideNav";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Providers from "@/providers/providers";
import { Flame, MailXIcon } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="w-dvw h-dvh">
              <Header />
              <div className="h-[calc(100dvh-129px)] lg:h-[calc(100dvh-66px)] overflow-y-auto p-4 gap-8 mx-auto flex max-w-full items-start sm:px-6 lg:py-6 lg:px-8">
                <aside className="sticky top-0 hidden min-w-80 shrink-2 lg:block h-full">
                  <SideNav />
                </aside>

                {children}
              </div>
              <MobileNav />
            </main>
            <Toaster />
            <ScrollToTop />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
