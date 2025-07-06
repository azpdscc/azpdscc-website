
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Ticker } from '@/components/ticker';
import { events } from '@/lib/data';
import type { Event } from '@/lib/types';

// Helper to find the next upcoming event
const getNextEvent = (): Event | null => {
  const now = new Date();
  // Set hours to 0 to compare dates only, so the event shows on its day
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .map(event => ({
      ...event,
      // Create a date object for comparison
      dateObj: new Date(event.date),
    }))
    // Filter for events that are today or in the future
    .filter(event => event.dateObj >= now)
    // Sort by date to find the soonest one
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  // Return the first event in the sorted list, or null if none
  return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
};


export function ConditionalTicker() {
  const pathname = usePathname();
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    // This runs only on the client side to avoid hydration mismatch with `new Date()`
    setNextEvent(getNextEvent());
  }, []);

  // Don't show ticker if there is no upcoming event,
  // or if the user is already on the page the ticker links to.
  if (!nextEvent || pathname === `/events/${nextEvent.slug}`) {
    return null;
  }

  return (
    <Ticker
      text={`Don't miss out on ${nextEvent.name}! Register today!`}
      link={`/events/${nextEvent.slug}`}
    />
  );
}
