import Header from '@/components/Header'
import SideNav from '@/components/SideNav'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import AuthSessionProvider from '@/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-full flex-col">
              <Header />

              <div className="mx-auto flex w-full max-w-full items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8 h-full">
                <aside className="sticky top-8 hidden w-80 shrink-0 lg:block h-full">
                  <SideNav />
                </aside>

                {children}
              </div>
            </div>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
