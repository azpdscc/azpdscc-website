
import type { Metadata } from 'next';
import { DonatePageClient } from '@/components/donate/donate-page-client';

export const metadata: Metadata = {
  title: 'Donate or Volunteer | Support the Phoenix Punjabi Indian Community',
  description: 'Support PDSCC by making a donation or volunteering your time. Your contribution helps us host Arizona Punjabi Indian festivals and support the AZ Punjabi Indian community.',
};

export default function DonatePage() {
  return <DonatePageClient />;
}
