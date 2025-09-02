import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/providers/ReduxProvider'
import StoreInitializer from '@/components/StoreInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OntoMatch - Aplicación de Citas',
  description: 'Encuentra tu pareja ideal con OntoMatch',
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
          <StoreInitializer />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
