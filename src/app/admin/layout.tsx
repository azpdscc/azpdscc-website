
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/layout/admin-header';
import { Footer } from '@/components/layout/footer';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/volunteer-login';
  const isVolunteerPage = pathname === '/admin/check-in';

  useEffect(() => {
    // This layout is for Firebase admin users, not volunteers.
    // Volunteers have their own session-based logic on their pages.
    if (isAuthPage || isVolunteerPage) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If not logged in, and trying to access a protected page, redirect
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]); // Re-run effect if path changes


  if (isAuthPage || isVolunteerPage) {
    return <main>{children}</main>;
  }

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }
  
  if (!user) {
      // This state is hit briefly during the redirect, show loader to prevent flicker
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
        <AdminHeader user={user} />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
  );
}
