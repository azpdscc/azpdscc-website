
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
    <>
        {children}
    </>
  );
}
