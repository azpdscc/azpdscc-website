
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConditionalTicker } from '@/components/layout/conditional-ticker';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export default function MainAppLayout({ children }: { children: ReactNode }) {
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
