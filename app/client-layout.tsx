'use client';

import { Providers } from './providers';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </Providers>
  );
}