
'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarPlus, Users, Loader2, CalendarClock } from 'lucide-react';
import { getEvents } from '@/services/events';
import type { Event } from '@/lib/types';
import { differenceInDays, format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// export const metadata: Metadata = {
//   title: 'Vendor Opportunities for AZ Punjabi India Events',
//   description: 'Become a vendor at Arizona Punjabi Indian festivals. Find information on event-specific booths and join our vendor network for the Phoenix Punjabi Indian community.',
// };

export default function VendorsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    const checkRegistrationWindow = async () => {
      const allEvents = await getEvents();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const firstUpcomingEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
      setNextEvent(firstUpcomingEvent);

      if (firstUpcomingEvent) {
          const eventDate = new Date(firstUpcomingEvent.date);
          const daysUntilEvent = differenceInDays(eventDate, now);
          if (daysUntilEvent <= 90) {
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
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">Vendor Booths for Arizona Punjabi Indian Festivals</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Showcase your business to the large and engaged Phoenix Punjabi Indian community. We offer opportunities for event-specific vendor booths in Arizona and a general network for future AZ Punjabi India events.
          </p>
        </div>
      </section>
      
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Vendor Options</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg flex flex-col">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <CalendarPlus className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl text-center">Apply for Event Vendor Booths</CardTitle>
                <CardDescription className="text-center">
                  Have a specific upcoming event in mind? Apply for a booth to sell your products and services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center w-full px-6 pb-6">
                {isLoading ? (
                  <Button size="lg" className="w-full" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Status...
                    </Button>
                ) : registrationOpen ? (
                    <Button asChild size="lg" className="w-full">
                      <Link href="/vendors/apply">View Upcoming Events & Apply <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
                    </Button>
                ) : (
                   <div className="w-full text-center space-y-4">
                     <Button size="lg" className="w-full" disabled>
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
                            "No upcoming vendor events are scheduled."
                          )}
                        </AlertDescription>
                      </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-lg flex flex-col">
              <CardHeader>
                 <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <Users className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl text-center">Join Our Arizona Vendor Network</CardTitle>
                <CardDescription className="text-center">
                  Not ready for a specific event? Join our network to be notified of future vendor opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-center">
                <Button asChild size="lg" className="w-full">
                  <Link href="/vendors/join">Register Your Business <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-4xl mx-auto mt-12">
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Users className="h-10 w-10 text-primary" strokeWidth={1.5} />
                <p className="text-lg font-semibold text-foreground text-center">
                    Our community has over <span className="font-bold text-primary">1,000+</span> vendors who have successfully partnered with us!
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
