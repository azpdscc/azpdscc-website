
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConditionalTicker } from './conditional-ticker';
import { Breadcrumbs } from './breadcrumbs';
import AdminLayout from '@/app/admin/layout';
import { Chatbot } from '@/components/chatbot/chatbot';

/**
 * This client component determines which layout to render based on the current URL path.
 * It's used within the main RootLayout to handle conditional rendering of layouts.
 */
export function RootLayoutClient({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isVerifyPage = pathname.startsWith('/verify-ticket');
    const isRootPage = pathname === '/';

    // The AdminLayout handles its own header/footer and auth logic.
    if (isAdminPage) {
        return <>{children}</>;
    }

    // The verification page is a standalone page with no shared layout.
    if (isVerifyPage) {
        return <>{children}</>;
    }
    
    // This is the default public-facing layout.
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <ConditionalTicker />
            { !isRootPage && <Breadcrumbs /> }
            <main className="flex-1">{children}</main>
            <Chatbot />
            <Footer />
        </div>
    )
}
