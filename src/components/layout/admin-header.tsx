
'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard } from 'lucide-react';

export function AdminHeader() {
  return (
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="outline" asChild>
                <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    View Main Site
                </Link>
            </Button>
          </nav>
        </div>
      </header>
  );
}
