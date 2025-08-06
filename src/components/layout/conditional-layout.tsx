
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConditionalTicker } from './conditional-ticker';
import { Breadcrumbs } from './breadcrumbs';

export function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <ConditionalTicker />
            <Breadcrumbs />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )

}
