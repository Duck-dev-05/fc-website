import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'
// import GoogleTranslate from '@/components/GoogleTranslate'

export const metadata: Metadata = {
  title: 'FC ESCUELA',
  description: 'Official website for FC ESCUELA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
