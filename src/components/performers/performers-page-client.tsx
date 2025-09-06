
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, CalendarClock, CalendarPlus, Star, Users, Handshake } from 'lucide-react';
import type { Event } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeroImage } from '@/components/layout/hero-image';
import { Separator } from '../ui/separator';

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
      <section className="relative h-auto min-h-[200px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl font-bold !text-primary-foreground drop-shadow-sm">
            Perform at Our Festivals
          </h1>
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

          <Separator className="my-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="flex flex-col items-center p-6 bg-card">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Star className="h-10 w-10 text-primary shrink-0" strokeWidth={1.5}/>
                </div>
                <p className="text-base text-muted-foreground">
                    The stage at a PDSCC festival is a celebrated platform, offering incredible exposure and a chance to connect with thousands of enthusiastic community members.
                </p>
            </Card>
            <Card className="flex flex-col items-center p-6 bg-card">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Users className="h-10 w-10 text-primary shrink-0" strokeWidth={1.5}/>
                </div>
                <p className="text-base text-muted-foreground">
                    We are committed to showcasing a diverse array of talent and preserving the artistic traditions of North India. We actively seek performers for our flagship Arizona Punjabi Indian festivals.
                </p>
            </Card>
             <Card className="flex flex-col items-center p-6 bg-card">
                 <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Handshake className="h-10 w-10 text-primary shrink-0" strokeWidth={1.5}/>
                </div>
                <p className="text-base text-muted-foreground">
                   If you are a Bhangra team, Gidda group, classical singer, or have a unique act that celebrates our culture, we encourage you to apply and share your passion.
                </p>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
