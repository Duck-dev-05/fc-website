"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth/');

  // Cross-tab logout logic
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'logout') {
        signOut({ callbackUrl: '/auth/signin' });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <>
      <Providers>
        {!isAuthPage && <Navbar />}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </Providers>
      {!isAuthPage && <Footer />}
    </>
  );
} 