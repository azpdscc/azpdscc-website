
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
       <Image 
        src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/Home+Page/SIte++Logo.svg"
        alt="PDSCC Logo" 
        width={40}
        height={40}
      />
      <span className="font-headline font-bold text-2xl text-primary">
        PDSCC
      </span>
    </Link>
  );
}
