
import type { Metadata } from 'next';
import { VendorsPageClient } from '@/components/vendors/vendors-page-client';
import { getEvents } from '@/services/events';
import type { Event } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Vendor Opportunities for AZ Punjabi India Events',
  description: 'Become a vendor at Arizona Punjabi Indian festivals. Find information on event-specific booths and join our vendor network for the Phoenix Punjabi Indian community.',
};

export default async function VendorsPage() {
  const allEvents = await getEvents();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = allEvents
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  // For now, we will assume registration is always open for the next event if it exists
  const registrationOpen = !!nextEvent;

  return <VendorsPageClient nextEvent={nextEvent} registrationOpen={registrationOpen} />;
}
