import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Kevin Turnaco — Développeur web full-stack',
  description: 'Portfolio de Kevin Turnaco, développeur web full-stack autodidacte passionné de DevOps et Linux.',
  keywords: ['développeur web', 'full-stack', 'React', 'Next.js', 'TypeScript', 'DevOps'],
  authors: [{ name: 'Kevin Turnaco' }],
  openGraph: {
    title: 'Kevin Turnaco — Développeur web full-stack',
    description: 'Portfolio de Kevin Turnaco, développeur web full-stack autodidacte.',
    url: 'https://portfolio.tetardtek.com',
    siteName: 'Kevin Turnaco',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
