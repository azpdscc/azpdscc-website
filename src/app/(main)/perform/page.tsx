
'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, CalendarClock, Loader2 } from 'lucide-react';
import { getEvents } from '@/services/events';
import type { Event } from '@/lib/types';
import { differenceInDays, format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// export const metadata: Metadata = {
//   title: 'Perform at PDSCC Events | Arizona Punjabi Indian Festivals',
//   description: 'Register to perform at our upcoming Arizona Punjabi Indian festivals. We are looking for talented singers, dancers, and performers from the Phoenix Punjabi Indian community.',
// };

export default function PerformersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

   useEffect(() => {
    const checkRegistrationWindow = async () => {
      const allEvents = await getEvents();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now && (e.name.includes('Vaisakhi') || e.name.includes('Teeyan')))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const firstUpcomingEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
      setNextEvent(firstUpcomingEvent);

      if (firstUpcomingEvent) {
        const eventDate = new Date(firstUpcomingEvent.date);
        const days = differenceInDays(eventDate, now);
        if (days <= 90) { // Updated to 90 days
          setRegistrationOpen(true);
        }
      }
      setIsLoading(false);
    };

    checkRegistrationWindow();
  }, []);

  const getRegistrationOpenDate = () => {
    if (!nextEvent) return '';
    const eventDate = new Date(nextEvent.date);
    const openDate = subDays(eventDate, 90);
    return format(openDate, 'MMMM dd, yyyy');
  };

  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">Perform at Our Festivals</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Showcase your talent to the vibrant Phoenix Punjabi Indian community. We invite singers, dancers, and performers of all kinds to register for our events.
          </p>
        </div>
      </section>
      
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Performance Opportunities</h2>
          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg flex flex-col items-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <Mic className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl text-center">Register to Perform</CardTitle>
                <CardDescription className="text-center px-4">
                  Ready to take the stage? Apply to be considered for our next big event.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center w-full px-6 pb-6">
                {isLoading ? (
                   <Button size="lg" className="w-full sm:w-auto" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Status...
                    </Button>
                ) : registrationOpen ? (
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="/perform/register">Apply Now <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
                    </Button>
                ) : (
                  <div className="w-full text-center space-y-4">
                     <Button size="lg" className="w-full sm:w-auto" disabled>
                        Registration Closed
                      </Button>
                      <Alert variant="default" className="bg-secondary">
                        <CalendarClock className="h-4 w-4" />
                        <AlertTitle className="font-bold">Applications are not yet open.</AlertTitle>
                        <AlertDescription>
                           {nextEvent ? (
                            <>
                              Registration for {nextEvent.name} opens around <strong>{getRegistrationOpenDate()}</strong>.
                            </>
                          ) : (
                            "No upcoming performance events are scheduled."
                          )}
                        </AlertDescription>
                      </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
