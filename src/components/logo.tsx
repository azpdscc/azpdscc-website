import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
       <Image 
        src="/logo.png"
        alt="PDSCC Logo" 
        width={32}
        height={32}
      />
      <span className="font-headline font-bold text-2xl text-primary">
        PDSCC
      </span>
    </Link>
  );
}
