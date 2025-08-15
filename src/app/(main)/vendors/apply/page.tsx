
'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { ApplicationForm } from '@/components/vendors/application-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents } from '@/services/events';
import type { Event } from '@/lib/types';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CalendarClock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Apply for Vendor Booths at Arizona Punjabi Indian Festivals',
//   description: 'Apply for a vendor booth at upcoming Arizona Punjabi Indian festivals. Showcase your products to the Phoenix Punjabi Indian community by completing our simple application.',
// };

export default function VendorApplyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    const findNextEvent = async () => {
      const allEvents = await getEvents();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const firstUpcomingEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
      setNextEvent(firstUpcomingEvent);
      setIsLoading(false);
    };

    findNextEvent();
  }, []);


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Apply for an Event Vendor Booth</h1>
        {nextEvent ? (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Applications are open for <strong>{nextEvent.name}</strong> on {nextEvent.date}. Please complete the form below.
            </p>
        ) : (
             <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                There are currently no upcoming events accepting vendor applications. You can join our network to be notified of future opportunities.
            </p>
        )}
      </section>
      
      <div className="max-w-4xl mx-auto">
        {nextEvent ? (
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Vendor Application</CardTitle>
                    <CardDescription>
                    Please complete the following steps to apply for a booth.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicationForm />
                </CardContent>
            </Card>
        ) : (
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-center">No Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <CalendarClock className="h-4 w-4" />
                        <AlertTitle className="font-bold">
                            No upcoming events are currently scheduled for vendors.
                        </AlertTitle>
                        <AlertDescription>
                            Please check back later for information on future events.
                        </AlertDescription>
                    </Alert>

                     <Alert className="mt-6">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="font-bold">
                            Want to be notified about future opportunities?
                        </AlertTitle>
                        <AlertDescription>
                           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                            <p>Join our general vendor network to get priority notifications.</p>
                            <Button asChild>
                                <Link href="/vendors/join">Join Our Network</Link>
                            </Button>
                           </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
