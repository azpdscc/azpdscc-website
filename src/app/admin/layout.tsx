
import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'PDSCC Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="font-bold text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
