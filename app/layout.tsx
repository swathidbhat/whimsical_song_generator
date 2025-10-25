import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dumb Dump Songs',
  description: 'AI-powered termination song web app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
