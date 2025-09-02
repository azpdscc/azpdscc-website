
import type { Metadata } from 'next';
import { PerformersPageClient } from '@/components/performers/performers-page-client';

export const metadata: Metadata = {
  title: 'Perform at PDSCC Events | Arizona Punjabi Indian Festivals',
  description: 'Register to perform at our upcoming Arizona Punjabi Indian festivals. We are looking for talented singers, dancers, and performers from the Phoenix Punjabi Indian community.',
};

export default function PerformersPage() {
  return <PerformersPageClient />;
}
