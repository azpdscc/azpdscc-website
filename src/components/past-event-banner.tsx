
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { differenceInDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEvents } from '@/services/events';
import Link from 'next/link';
import { Youtube } from 'lucide-react';
import type { Event } from '@/lib/types';


export function PastEventBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [recentEvent, setRecentEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Function to get the most recent past event
    const getMostRecentPastEvent = async (): Promise<Event | null> => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const allEvents = await getEvents();

        const pastEvents = allEvents
            .map(event => ({
            ...event,
            dateObj: new Date(event.date),
            }))
            .filter(event => event.dateObj < now)
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

        return pastEvents.length > 0 ? pastEvents[0] : null;
    };

    getMostRecentPastEvent().then(event => {
        if (event) {
            const daysSinceEvent = differenceInDays(new Date(), event.dateObj);
            
            // Show banner from the day after the event up to 14 days after.
            if (daysSinceEvent >= 1 && daysSinceEvent <= 14) {
                setRecentEvent(event);
                setIsVisible(true);
            }
        }
    });
  }, []);

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
          className="container mx-auto px-4 -mt-8 mb-12 z-20 relative"
        >
          <div className="max-w-2xl mx-auto">
             <Card className="bg-gradient-to-r from-primary to-[hsl(var(--primary-darker))] border-0 shadow-2xl text-primary-foreground">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <Youtube className="h-8 w-8 text-primary-foreground flex-shrink-0" strokeWidth={1.5} />
                   <div className="flex-grow">
                     <p className="font-bold">Did you miss {recentEvent.name}?</p>
                     <p className="text-sm text-primary-foreground/90">Watch the full recording on our YouTube channel!</p>
                   </div>
                  <Button asChild size="sm" variant="secondary" className="shrink-0 bg-white text-primary hover:bg-white/90">
                    <Link href="https://www.youtube.com/@AZPDSCC" target="_blank" rel="noopener noreferrer">Watch Now</Link>
                  </Button>
                </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
