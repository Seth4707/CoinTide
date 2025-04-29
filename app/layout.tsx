import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Coin Tide',
  description: 'Your source for cryptocurrency data and insights.',
  icons: {
    icon: [
      { url: '/Images/identity.png', sizes: '16x16', type: 'image/png' },
      ],
    apple: [
      { url: '/Images/identity.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [{ url: '/Images/identity.png' }],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}






