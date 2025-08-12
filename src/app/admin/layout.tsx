
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
    // The volunteer check-in page has its own session logic, so we ignore it here.
    if (isVolunteerPage) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isVolunteerPage]);


  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  // If we are on an auth-related page (login), let it render.
  // The login page itself will handle redirecting if the user is already logged in.
  if (isAuthPage) {
    return <main>{children}</main>;
  }
  
  if (isVolunteerPage) {
    return <main>{children}</main>;
  }

  // If we are not on an auth page and there is no user, redirect to login.
  if (!user) {
    router.push('/admin/login');
    return ( // Return a loader while redirecting
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }
  
  // If we have a user and are not on an auth page, show the protected content.
  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
        <AdminHeader user={user} />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
  );
}
