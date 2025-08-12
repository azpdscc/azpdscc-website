
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { isVolunteer } from '@/lib/volunteers';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard, LogOut, UserCheck } from 'lucide-react';

interface AdminHeaderProps {
    user: User | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const auth = getAuth(app);
  const userIsVolunteer = isVolunteer(user?.email);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      // In a real app, you might show an error toast here.
    }
  };

  return (
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo showText={false} />
          <nav className="flex items-center gap-4">
            {!userIsVolunteer && (
                <Button variant="outline" asChild>
                    <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
            )}
            {userIsVolunteer && (
                 <Button variant="outline" asChild>
                    <Link href="/admin/check-in">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Check-In Tool
                    </Link>
                </Button>
            )}
            <Button variant="ghost" asChild>
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    View Main Site
                </Link>
            </Button>
             <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
          </nav>
        </div>
      </header>
  );
}
