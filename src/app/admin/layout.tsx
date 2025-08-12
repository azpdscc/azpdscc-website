
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';

import { Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/layout/admin-header';
import { Footer } from '@/components/layout/footer';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        // If user is not logged in and not on the login page, redirect them.
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, router, pathname]);

  // If we are loading the auth state, show a loading spinner.
  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }
  
  // If the user is not authenticated and is trying to access a page other than login,
  // this will render null while the redirect happens.
  if (!user && pathname !== '/admin/login') {
      return null;
  }
  
  // If the user IS authenticated but tries to go to the login page, redirect to admin dashboard.
  if (user && pathname === '/admin/login') {
      router.push('/admin');
      return (
         <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  // Render the admin layout only for logged-in users or the login page itself.
  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
        {pathname !== '/admin/login' && <AdminHeader />}
        <main className="flex-grow">{children}</main>
        {pathname !== '/admin/login' && <Footer />}
    </div>
  );
}
