
'use client';

import { useEffect, useState } from 'react';
import { PerformanceRegistrationForm } from '@/components/performers/registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents } from '@/services/events';
import type { Event } from '@/lib/types';
import { differenceInDays, format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CalendarClock, Info, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export function PerformanceRegistrationPageClient() {
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
        // const eventDate = new Date(firstUpcomingEvent.date);
        // const days = differenceInDays(eventDate, now);
        // if (days <= 90) { 
        //   setRegistrationOpen(true);
        // }
        // Temporarily open for testing
        setRegistrationOpen(true);
      }
      setIsLoading(false);
    };

    checkRegistrationWindow();
  }, []);

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
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Performance Registration</h1>
        {registrationOpen && nextEvent ? (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Applications are now open for <strong>{nextEvent.name}</strong>. Please complete the form below. Our cultural team will review all applications and contact selected performers.
            </p>
        ) : (
             <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Thank you for your interest in performing! Please see registration status below.
            </p>
        )}
      </section>
      
      <div className="max-w-4xl mx-auto">
        {registrationOpen && nextEvent ? (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Application Form</CardTitle>
              <CardDescription>
                Provide as much detail as possible to help our team with the selection process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceRegistrationForm />
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl">
            <CardHeader>
              <h1 className="font-headline text-3xl text-center">Registration is Currently Closed</h1>
            </CardHeader>
            <CardContent>
              <Alert>
                <CalendarClock className="h-4 w-4" />
                <AlertTitle className="font-bold">
                  {nextEvent ? `Applications for ${nextEvent.name} are not open yet.` : `No upcoming events are currently scheduled.`}
                </AlertTitle>
                <AlertDescription>
                  {nextEvent && registrationOpenDate ? (
                     <div className="flex flex-col items-center gap-2 mt-2">
                        <span>Performance registration will open approximately 90 days before the event date, around <strong>{format(registrationOpenDate, 'MMMM dd, yyyy')}</strong>. Please check back then!</span>
                        <Button asChild size="sm" variant="outline">
                          <Link href={createCalendarLink(registrationOpenDate, nextEvent.name)} target="_blank" rel="noopener noreferrer">
                            <CalendarPlus className="mr-2"/>
                            Add Reminder to Calendar
                          </Link>
                        </Button>
                      </div>
                  ) : (
                    "Please check back later for information on future performance opportunities."
                  )}
                </AlertDescription>
              </Alert>

              <div className="text-center mt-6">
                <Button asChild variant="secondary">
                    <Link href="/contact">Contact Our Cultural Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
