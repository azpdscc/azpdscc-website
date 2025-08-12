
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

  const isUnprotectedPage = pathname === '/admin/login' || pathname === '/admin/volunteer-login';

  useEffect(() => {
    // This layout is for Firebase admin users, not volunteers.
    // Volunteers have their own session-based logic on their pages.
    if (pathname.startsWith('/admin/volunteer-login') || pathname === '/admin/check-in') {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser && !isUnprotectedPage) {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router, pathname, isUnprotectedPage]);

  if (pathname.startsWith('/admin/volunteer-login') || pathname === '/admin/check-in') {
    return <main>{children}</main>;
  }

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }
  
  if (!user && !isUnprotectedPage) {
      return null;
  }
  
  if (user && pathname === '/admin/login') {
      router.push('/admin');
      return (
         <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
        {!isUnprotectedPage && <AdminHeader user={user} />}
        <main className="flex-grow">{children}</main>
        {!isUnprotectedPage && <Footer />}
    </div>
  );
}
