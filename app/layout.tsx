'use client';

import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import '@/styles/globals.css';
import { GlobalShell } from '@/components/GlobalShell';
import { Toaster } from "sonner";
import { AuthProvider } from '@/hooks/AuthContext';
import { CartProvider } from '@/hooks/CartContext';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

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
      <body className={`${inter.className} ${playfair.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Providers>
              <GlobalShell>
                {children}
              </GlobalShell>
              <Toaster position="top-center" richColors />
            </Providers>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}