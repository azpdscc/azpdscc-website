
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const CORRECT_PASSWORD = 'azpdscc-admin-2024';
const AUTH_KEY = 'admin-auth';

function AdminHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container flex h-20 items-center justify-between">
                <div className="flex items-center gap-6">
                <Logo />
                <nav className="hidden md:flex items-center gap-6 text-sm">
                     <Link href="/admin" className="font-bold transition-colors hover:text-primary hover:underline underline-offset-4 text-muted-foreground">Dashboard</Link>
                     <Link href="/admin/events" className="font-bold transition-colors hover:text-primary hover:underline underline-offset-4 text-muted-foreground">Events</Link>
                </nav>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/">View Public Site</Link>
                </Button>
            </div>
        </header>
    )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    try {
      const isAuthed = localStorage.getItem(AUTH_KEY);
      if (isAuthed === btoa(CORRECT_PASSWORD)) {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('localStorage not available for auth check.');
    }
  }, [pathname]); // Re-check on path change to handle direct navigation

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      try {
        localStorage.setItem(AUTH_KEY, btoa(CORRECT_PASSWORD));
      } catch (e) {
        console.warn('localStorage not available for auth persistence.');
      }
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                    <Shield className="h-10 w-10 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline text-2xl">Admin Access Required</CardTitle>
                <CardDescription>Enter the password to manage site content.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    autoFocus
                    />
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                    Unlock Admin
                </Button>
                </form>
            </CardContent>
            </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 py-8">{children}</main>
    </div>
  );
}
