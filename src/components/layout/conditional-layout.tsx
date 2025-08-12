
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConditionalTicker } from './conditional-ticker';
import { Breadcrumbs } from './breadcrumbs';
import AdminLayout from '@/app/admin/layout';

export function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isVerifyPage = pathname.startsWith('/verify-ticket');
    const isRootPage = pathname === '/';

    // Special layouts for admin and verification pages
    if (isAdminPage) {
        return <AdminLayout>{children}</AdminLayout>;
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
