'use client';

import { usePathname } from 'next/navigation';
import { Ticker } from '@/components/ticker';

export function ConditionalTicker() {
  const pathname = usePathname();
  const tickerLink = "/vendors/apply";

  if (pathname === tickerLink) {
    return null;
  }

  return (
    <Ticker 
      text="Hurry, register to become a vendor! Limited spaces available."
      link={tickerLink}
    />
  );
}
