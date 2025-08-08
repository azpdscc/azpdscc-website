
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConditionalTicker } from './conditional-ticker';
import { Breadcrumbs } from './breadcrumbs';
import { AdminHeader } from './admin-header';

export function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isVerifyPage = pathname.startsWith('/verify-ticket');
    const isRootPage = pathname === '/';

    // Special layouts for admin and verification pages
    if (isAdminPage) {
        return (
            <div className="flex min-h-screen flex-col bg-secondary/50">
                <AdminHeader />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
        )
    }

    if (isVerifyPage) {
        return <>{children}</>;
    }
    
    // Default public layout
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <ConditionalTicker />
            { !isRootPage && <Breadcrumbs /> }
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )

}


function AdminHeader() {
  return (
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-muted-foreground">Admin</span>
          </div>
        </div>
      </header>
  )
}
