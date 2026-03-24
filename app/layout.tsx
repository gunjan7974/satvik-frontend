'use client';

import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '@/styles/globals.css';
import { GlobalShell } from '@/components/GlobalShell';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/hooks/AuthContext';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const headerProps = {
    cart: {},
    isLoggedIn: false,
    onViewCart: () => router.push('/cart'),
    onNavigateToMenu: () => router.push('/menu'),
    onLoginClick: () => router.push('/login'),
    onLogoutClick: () => {
      // Handle logout logic here
      console.log('Logout clicked');
      router.push('/');
    },
    onAdminClick: () => router.push('/admin'),
    onDashboardClick: () => router.push('/dashboard'),
    onNavigateToHome: () => router.push('/'),
    onNavigateToBlog: () => router.push('/blog'),
    onNavigateToGallery: () => router.push('/gallery'),
  };

  return (
    <html lang="en">
      <head>
        <title>Sattvik Kaleva</title>
        <meta name="description" content="Pure Vegetarian Restaurant" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <GlobalShell headerProps={headerProps}>
              {children}
            </GlobalShell>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}