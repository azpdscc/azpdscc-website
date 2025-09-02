
import type { Metadata } from 'next';
import { TeamPageClient } from '@/components/team/team-page-client';

export const metadata: Metadata = {
  title: 'About PDSCC: Our Story & Mission for the Phoenix Punjabi Indian Community',
  description: 'Learn about the story, values, and team behind the Phoenix Desi Sports and Cultural Club (PDSCC), a non-profit organization dedicated to serving the AZ Punjabi Indian community and AZ Desis in Phoenix.',
};

export default function AboutPage() {
  return <TeamPageClient />;
}
