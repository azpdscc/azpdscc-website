
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { TopBar } from '@/components/layout/top-bar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/sponsorship', label: 'Sponsorship' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopBar />
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'font-bold transition-colors hover:text-primary hover:underline underline-offset-4',
                  pathname === href
                    ? 'text-primary underline'
                    : 'text-muted-foreground'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild size="lg">
            <Link href="/donate">Donate</Link>
          </Button>
          <div className="flex items-center space-x-4">
              <Link href="https://x.com/AZPDSCC" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="https://www.facebook.com/pdscc" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="https://www.instagram.com/azpdscc/" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="https://www.youtube.com/@AZPDSCC" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </div>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" strokeWidth={1.5} />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Logo />
              <nav className="grid gap-4 mt-6">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'text-lg font-bold transition-colors hover:text-primary hover:underline underline-offset-4',
                      pathname === href
                        ? 'text-primary underline'
                        : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-4">
                <Button asChild className="w-full">
                  <Link href="/donate">Donate</Link>
                </Button>
                <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                  <Link href="https://x.com/AZPDSCC" className="text-muted-foreground hover:text-primary">
                      <Twitter className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                  <Link href="https://www.facebook.com/pdscc" className="text-muted-foreground hover:text-primary">
                      <Facebook className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                  <Link href="https://www.instagram.com/azpdscc/" className="text-muted-foreground hover:text-primary">
                      <Instagram className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                  <Link href="https://www.youtube.com/@AZPDSCC" className="text-muted-foreground hover:text-primary">
                    <Youtube className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
