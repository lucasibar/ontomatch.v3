import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/providers/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OntoMatch - App de Citas',
  description: 'Encuentra tu pareja perfecta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
