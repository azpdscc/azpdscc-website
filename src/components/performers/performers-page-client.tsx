
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, CalendarClock, CalendarPlus } from 'lucide-react';
import type { Event } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeroImage } from '@/components/layout/hero-image';

interface PerformersPageClientProps {
  nextEvent: Event | null;
  registrationOpen: boolean;
}

export function PerformersPageClient({ nextEvent, registrationOpen }: PerformersPageClientProps) {

  const getRegistrationOpenDate = () => {
    if (!nextEvent) return null;
    const eventDate = new Date(nextEvent.date);
    return subDays(eventDate, 90);
  };
  
  const registrationOpenDate = getRegistrationOpenDate();

  const createCalendarLink = (openDate: Date | null, eventName: string): string => {
      if (!openDate) return '#';
      const start = format(openDate, "yyyyMMdd");
      const details = `Time to apply to perform at the upcoming ${eventName}. Apply at https://www.azpdscc.org/perform/register`;

      const params = new URLSearchParams({
          action: 'TEMPLATE',
          text: `Performer Registration Opens for ${eventName}`,
          dates: `${start}/${start}`, // All-day event
          details: details,
          trp: 'false',
      });
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground">
        <HeroImage src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/performers.jpg" alt="A person singing on a stage with colorful lights" aiHint="stage performance" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">Perform at Our Festivals</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            The stage at a PDSCC festival is a celebrated platform, offering incredible exposure and a chance to connect with thousands of enthusiastic community members. We are committed to showcasing a diverse array of talent and preserving the artistic traditions of North India. We actively seek performers for our flagship Arizona Punjabi Indian festivals, Vaisakhi Mela and Teeyan Da Mela. If you are a Bhangra team, Gidda group, classical singer, or have a unique act that celebrates our culture, we encourage you to apply. Performing with us is more than just a show; it's an opportunity to become a central part of a cherished community celebration and share your passion with an appreciative audience.
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
                {registrationOpen ? (
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
                           {nextEvent && registrationOpenDate ? (
                            <div className="flex flex-col items-center gap-2 mt-2">
                              <span>Registration for {nextEvent.name} opens around <strong>{format(registrationOpenDate, 'MMMM dd, yyyy')}</strong>.</span>
                              <Button asChild size="sm" variant="outline">
                                <Link href={createCalendarLink(registrationOpenDate, nextEvent.name)} target="_blank" rel="noopener noreferrer">
                                  <CalendarPlus className="mr-2"/>
                                  Add Reminder to Calendar
                                </Link>
                              </Button>
                            </div>
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
