'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { useRouter } from 'next/navigation';
import SalesSidebar from '../../components/SalesSidebar';
import SalesHeader from '../../components/SalesHeader';
import Footer from '../../components/AdminFooter';
import { useAuth } from '@/hooks/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'sales' && user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  if (loading || !user || (user.role !== 'sales' && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50/30">
      <SalesSidebar 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isMobile={isMobile} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SalesHeader 
          user={user} 
          onLogout={logout} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isMobile={isMobile} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}