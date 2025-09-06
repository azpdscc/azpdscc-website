
import type { Metadata } from 'next';
import { PerformersPageClient } from '@/components/performers/performers-page-client';
import { getEvents } from '@/services/events';
import type { Event } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Perform at PDSCC Events | Arizona Punjabi Indian Festivals',
  description: 'Register to perform at our upcoming Arizona Punjabi Indian festivals. We are looking for talented singers, dancers, and performers from the Phoenix Punjabi Indian community.',
};

export default async function PerformersPage() {
  const allEvents = await getEvents();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = allEvents
    .filter(e => new Date(e.date) >= now && (e.name.includes('Vaisakhi') || e.name.includes('Teeyan')))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  // For now, we will assume registration is always open for the next event if it exists
  const registrationOpen = !!nextEvent;

  return <PerformersPageClient nextEvent={nextEvent} registrationOpen={registrationOpen} />;
}
