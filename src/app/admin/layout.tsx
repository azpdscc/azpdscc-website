
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/layout/admin-header';
import { Footer } from '@/components/layout/footer';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';
  const isVolunteerLoginPage = pathname === '/admin/volunteer-login';
  const isVolunteerCheckInPage = pathname === '/admin/check-in';

  useEffect(() => {
    // This code runs only on the client.
    // It checks for a session flag to determine auth state.
    let authenticated = false;

    if (isVolunteerCheckInPage) {
        // The check-in page has its own separate session logic.
        authenticated = sessionStorage.getItem('volunteer-authenticated') === 'true';
        if (!authenticated) router.push('/admin/volunteer-login');
    } else {
        // All other admin pages use the main admin session.
        authenticated = sessionStorage.getItem('admin-authenticated') === 'true';
        if (!authenticated && !isLoginPage && !isVolunteerLoginPage) {
            router.push('/admin/login');
        }
    }
    
    setIsAuthenticated(authenticated);
    setLoading(false);

  }, [pathname, router, isLoginPage, isVolunteerLoginPage, isVolunteerCheckInPage]);


  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  // If on a login page, just render the content without the main layout.
  if (isLoginPage || isVolunteerLoginPage) {
      return <main>{children}</main>;
  }

  // If the user is not authenticated, render a loader while redirecting.
  if (!isAuthenticated) {
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
