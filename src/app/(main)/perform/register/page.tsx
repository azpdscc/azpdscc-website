
import type { Metadata } from 'next';
import { PerformanceRegistrationPageClient } from '@/components/performers/performance-registration-page-client';


export const metadata: Metadata = {
  title: 'Performance Registration | PDSCC Events',
  description: 'Apply to perform at our next Arizona Punjabi Indian festival. Complete our registration form to be considered for a spot on our stage.',
};

export default function PerformanceRegistrationPage() {
    return <PerformanceRegistrationPageClient />;
}
