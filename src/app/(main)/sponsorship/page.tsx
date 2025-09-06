
import type { Metadata } from 'next';
import { SponsorshipPageClient } from '@/components/sponsorship/sponsorship-page-client';

export const metadata: Metadata = {
  title: 'Sponsor or Partner with the Phoenix Punjabi Indian Community Hub',
  description: 'Become a sponsor of PDSCC and connect with the vibrant AZ Punjabi India community. Explore our sponsorship packages and benefits for supporting Arizona Punjabi Indian festivals.',
};

export default function SponsorshipPage() {
  return <SponsorshipPageClient />;
}
