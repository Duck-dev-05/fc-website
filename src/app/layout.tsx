import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'
import GoogleTranslate from '@/components/GoogleTranslate'

export const metadata: Metadata = {
  title: 'FC ESCUELA',
  description: 'Official website for FC ESCUELA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans">
        <GoogleTranslate />
        <ClientLayout>
          {/* Google Translate Widget */}
          <div id="google_translate_element" style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}></div>
          {children}
        </ClientLayout>
        {/* Google Translate Script */}
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          function googleTranslateElementInit() {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,vi',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}} />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      </body>
    </html>
  )
}
