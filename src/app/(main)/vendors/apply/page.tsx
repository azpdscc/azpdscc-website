import type { Metadata } from 'next';
import { VendorApplicationPageClient } from '@/components/vendors/vendor-application-page-client';

export const metadata: Metadata = {
  title: 'Apply for Vendor Booths at Arizona Punjabi Indian Festivals',
  description: 'Apply for a vendor booth at upcoming Arizona Punjabi Indian festivals. Showcase your products to the Phoenix Punjabi Indian community by completing our simple application.',
};

export default function VendorApplyPage() {
  return <VendorApplicationPageClient />;
}
