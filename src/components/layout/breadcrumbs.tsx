
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// A simple utility to format slug-like strings into readable titles
const formatPathSegment = (segment: string) => {
  if (!segment) return '';
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on the homepage
  if (pathname === '/') {
    return null;
  }

  // Generate breadcrumb items from the pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      return {
        label: formatPathSegment(segment),
        href,
      };
    }),
  ];

  return (
    <nav aria-label="Breadcrumb" className="bg-card border-b">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 py-3 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center space-x-2">
              {index > 0 && <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.5} />}
              <Link
                href={crumb.href}
                className={cn(
                  'font-medium hover:text-primary transition-colors',
                  index === breadcrumbs.length - 1
                    ? 'text-foreground pointer-events-none' // Style the last item as active
                    : 'text-muted-foreground'
                )}
                aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
              >
                {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
