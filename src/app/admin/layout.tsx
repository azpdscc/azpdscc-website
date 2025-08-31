'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/layout/admin-header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider, useAuth } from '@/hooks/use-auth.tsx';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';
  const isVendorCheckInLoginPage = pathname === '/admin/vendor-check-in-login';
  const isPerformersLoginPage = pathname === '/admin/performances-login';
  const isCheckInPage = pathname === '/admin/check-in';

  useEffect(() => {
    if (loading) return; // Wait until Firebase auth state is loaded

    let sessionAuthenticated = false;

    // Handle special session-based logins
    if (isCheckInPage) {
      sessionAuthenticated = sessionStorage.getItem('vendor-checkin-authenticated') === 'true';
      if (!sessionAuthenticated) router.push('/admin/vendor-check-in-login');
    } else if (pathname.startsWith('/admin/performances') && !isPerformersLoginPage) {
      sessionAuthenticated = sessionStorage.getItem('performance-authenticated') === 'true';
      if (!sessionAuthenticated) router.push('/admin/performances-login');
    }

    // Handle main Firebase admin login for all other admin pages
    if (!user && !isLoginPage && !isVendorCheckInLoginPage && !isPerformersLoginPage && !sessionAuthenticated) {
      router.push('/admin/login');
    }

  }, [user, loading, pathname, router, isLoginPage, isVendorCheckInLoginPage, isPerformersLoginPage, isCheckInPage]);


  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  // If on a login page, just render the content without the main layout.
  if (isLoginPage || isVendorCheckInLoginPage || isPerformersLoginPage) {
      return <main>{children}</main>;
  }

  // If the user is not authenticated for a protected route, render a loader while redirecting.
  if (!user && !pathname.startsWith('/admin/check-in') && !pathname.startsWith('/admin/performances')) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }
  
  // If authenticated, show the protected admin layout and content.
  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
        <AdminHeader />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
  );
}


export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    )
}
