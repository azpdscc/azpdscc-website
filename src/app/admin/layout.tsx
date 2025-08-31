
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/layout/admin-header';
import { Footer } from '@/components/layout/footer';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';
  const isVendorCheckInLoginPage = pathname === '/admin/vendor-check-in-login';
  const isPerformersLoginPage = pathname === '/admin/performances-login';
  const isCheckInPage = pathname === '/admin/check-in';

  useEffect(() => {
    // This listener handles Firebase Auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      let sessionAuthenticated = false;

      // Handle special session-based logins
      if (isCheckInPage) {
        sessionAuthenticated = sessionStorage.getItem('vendor-checkin-authenticated') === 'true';
        if (!sessionAuthenticated) router.push('/admin/vendor-check-in-login');
      } else if (pathname.startsWith('/admin/performances') && !isPerformersLoginPage) {
        sessionAuthenticated = sessionStorage.getItem('performance-authenticated') === 'true';
        if (!sessionAuthenticated && !currentUser) router.push('/admin/performances-login');
      }

      // Handle main Firebase admin login
      if (!currentUser && !isLoginPage && !isVendorCheckInLoginPage && !isPerformersLoginPage && !sessionAuthenticated) {
        router.push('/admin/login');
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [pathname, router, isLoginPage, isVendorCheckInLoginPage, isPerformersLoginPage, isCheckInPage]);


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
