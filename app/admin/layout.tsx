"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../../components/AdminSidebar';
import Header from '../../components/AdminHeader';
import Footer from '../../components/AdminFooter';
import { useAuth } from '../../hooks/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile by default
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate main content margin to avoid overlap with fixed sidebar
  const mainContentMargin = isMobile 
    ? 'ml-0' 
    : (sidebarOpen ? 'md:ml-72' : 'md:ml-20');

  if (loading || !user || user.role !== 'admin') {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      {/* Sidebar - fixed internally (fixed left-0 top-0 h-screen z-50 overflow-y-auto) */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Container - flex column with margin-left to avoid overlap */}
      <div 
        className={`flex-1 flex flex-col h-full bg-white transition-all duration-300 ${mainContentMargin} overflow-hidden font-sans`}
      >
        <Header 
          user={user}
          onLogout={logout}
          notifications={3}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          isMobile={isMobile}
        />

        {/* Independent Content Scroll Zone */}
        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-gray-50/50">
          <div className="p-4 md:p-8 min-h-full">
            <div className="flex-1">
              {children}
            </div>
            
            <div className="mt-20">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}