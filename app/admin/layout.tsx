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

  // Calculate main content margin
  const mainContentMargin = isMobile 
    ? 'ml-0' 
    : (sidebarOpen ? 'md:ml-72' : 'md:ml-20');

  if (loading || !user || user.role !== 'admin') {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${mainContentMargin} w-full`}>
        {/* Header */}
        <div className="flex-shrink-0">
          <Header 
            user={user}
            onLogout={logout}
            notifications={3}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            isMobile={isMobile}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>

        {/* Footer */}
        <div className="flex-shrink-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}