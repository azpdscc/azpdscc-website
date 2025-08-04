
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { differenceInDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { events } from '@/lib/data';
import Link from 'next/link';
import { Youtube, X } from 'lucide-react';
import type { Event } from '@/lib/types';

// Function to get the most recent past event
const getMostRecentPastEvent = (): Event | null => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const pastEvents = events
    .map(event => ({
      ...event,
      dateObj: new Date(event.date),
    }))
    .filter(event => event.dateObj < now)
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  return pastEvents.length > 0 ? pastEvents[0] : null;
};

export function PastEventBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [recentEvent, setRecentEvent] = useState<Event | null>(null);

  useEffect(() => {
    const event = getMostRecentPastEvent();
    if (event) {
      const daysSinceEvent = differenceInDays(new Date(), event.dateObj);
      const storageKey = `hide_banner_${event.slug}`;
      const isHidden = localStorage.getItem(storageKey);

      if (daysSinceEvent >= 0 && daysSinceEvent <= 14 && !isHidden) {
        setRecentEvent(event);
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (recentEvent) {
      localStorage.setItem(`hide_banner_${recentEvent.slug}`, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible || !recentEvent) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-4 z-20 relative"
        >
          <Alert className="bg-secondary shadow-lg border-primary/20">
            <Youtube className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <div className="flex-grow ml-2">
              <AlertTitle className="font-headline font-bold">Did you miss {recentEvent.name}?</AlertTitle>
              <AlertDescription>
                Watch the full recording on our YouTube channel!
              </AlertDescription>
            </div>
            <Button asChild size="sm" className="shrink-0 ml-4">
              <Link href="https://www.youtube.com/@AZPDSCC" target="_blank" rel="noopener noreferrer">Watch Now</Link>
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={handleDismiss}>
                <X className="h-4 w-4"/>
                <span className="sr-only">Dismiss</span>
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
