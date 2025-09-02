
import type { Metadata } from 'next';
import { VendorsPageClient } from '@/components/vendors/vendors-page-client';

export const metadata: Metadata = {
  title: 'Vendor Opportunities for AZ Punjabi India Events',
  description: 'Become a vendor at Arizona Punjabi Indian festivals. Find information on event-specific booths and join our vendor network for the Phoenix Punjabi Indian community.',
};

export default function VendorsPage() {
  return <VendorsPageClient />;
}
