"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  return (
    <>
      <Providers>
        {!isLoginPage && <Navbar />}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </Providers>
      {!isLoginPage && <Footer />}
    </>
  );
} 