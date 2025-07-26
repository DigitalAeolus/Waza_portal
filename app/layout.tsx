import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import PageTransition from '@/components/page-transition'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4f46e5',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  title: 'Waza - AI Design Partner for Hardware Engineers',
  description: 'Waza is an AI-powered design partner that helps hardware engineers check for obsolete chips, get smart recommendations, and find the best suppliers.',
  keywords: ['AI', 'hardware engineering', 'chip design', 'obsolete chips', 'supplier recommendations', 'design partner'],
  authors: [{ name: 'Waza Team' }],
  creator: 'Waza',
  publisher: 'Waza',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://waza.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Waza - AI Design Partner for Hardware Engineers',
    description: 'Waza is an AI-powered design partner that helps hardware engineers check for obsolete chips, get smart recommendations, and find the best suppliers.',
    url: 'https://waza.ai',
    siteName: 'Waza',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waza - AI Design Partner for Hardware Engineers',
    description: 'Waza is an AI-powered design partner that helps hardware engineers check for obsolete chips, get smart recommendations, and find the best suppliers.',
    creator: '@waza_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
