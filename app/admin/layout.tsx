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

  // Remove mainContentMargin, using flex spacer instead
  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-orange-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse uppercase tracking-widest text-xs">Preparing Admin Workspace</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex overflow-hidden">
      {/* Sidebar - fixed internally (fixed left-0 top-0 h-screen z-50 overflow-y-auto) */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Spacer to push main content on desktop, since sidebar is fixed */}
      {!isMobile && (
        <div 
          className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'}`} 
        />
      )}

      {/* Main Container */}
      <div 
        className="flex-1 flex flex-col h-full bg-white overflow-hidden font-sans relative"
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
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50/50">
          <div className="p-4 md:p-8 min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            
            <div className="mt-12 pt-8">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}