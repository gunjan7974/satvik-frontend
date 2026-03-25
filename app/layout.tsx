'use client';

import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '@/styles/globals.css';
import { GlobalShell } from '@/components/GlobalShell';
import { AuthProvider } from '@/hooks/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sattvik Kaleva</title>
        <meta name="description" content="Pure Vegetarian Restaurant" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <GlobalShell>
              {children}
            </GlobalShell>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}