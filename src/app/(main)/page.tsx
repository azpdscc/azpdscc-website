
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HolidayBanner } from '@/components/holiday-banner';
import { getEvents } from '@/services/events';
import { getSponsors } from '@/services/sponsors';
import { ArrowRight, Landmark, PartyPopper, Sprout } from 'lucide-react';
import { PastEventBanner } from '@/components/past-event-banner';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { EventsCarousel } from '@/components/home/events-carousel';
import { SponsorsDisplay } from '@/components/home/sponsors-display';
import type { Event, Sponsor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [eventsData, sponsorsData] = await Promise.all([
        getEvents(),
        getSponsors()
      ]);
      setAllEvents(eventsData);
      setSponsors(sponsorsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Separate and sort upcoming and past events
  const upcomingEvents = allEvents
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = allEvents
    .filter(e => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Combine lists and take the first 4 for the homepage display
  const homePageEvents = [...upcomingEvents, ...pastEvents].slice(0, 4);
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-[60vh] w-full mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroCarousel nextEvent={nextEvent} />
      
      <HolidayBanner />
      <PastEventBanner />

      <section id="about" className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Welcome to the Hub for AZ Indians
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              We are a <Link href="/about" className="text-primary hover:underline">non-profit organization</Link> dedicated to preserving and promoting Indian culture for the Phoenix Indian community. We bring AZ Indians together through vibrant festivals and events across Arizona.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg bg-card">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <PartyPopper className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline mt-4">
                  <Link href="/events" className="hover:underline">Festivals</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience the color, music, and joy of traditional Indian festivals right here in Arizona.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg bg-card">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Sprout className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline mt-4">
                  <Link href="/about" className="hover:underline">Community Outreach</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Engaging with and supporting our local community through various outreach programs and initiatives.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg bg-card">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Landmark className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline mt-4">
                  <Link href="/about" className="hover:underline">Cultural Preservation</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Passing on our rich cultural heritage to the next generation through arts, education, and events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {homePageEvents.length > 0 && (
        <section id="events" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Our Events</h2>
              <Button asChild variant="link" className="text-primary">
                <Link href="/events">View All <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
              </Button>
            </div>
            <EventsCarousel events={homePageEvents} />
          </div>
        </section>
      )}

      {sponsors.length > 0 && (
        <SponsorsDisplay sponsors={sponsors} />
      )}

      <section id="impact" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Our Impact in the Phoenix Indian Community</h2>
              <p className="mt-4 text-muted-foreground">
                We are proud of the Phoenix Indian community we've built and the positive impact we've made. Our events bring the AZ India community together, support local artisans, and create lasting memories.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/about">Learn More About Our Mission <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-8">
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">16</p>
                  <p className="text-muted-foreground">Years of Service</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">50k+</p>
                  <p className="text-muted-foreground">Community Members Engaged</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">40</p>
                  <p className="text-muted-foreground">Events Organized</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">100</p>
                  <p className="text-muted-foreground">Vendors Supported</p>
                </div>
              </div>
            </div>
            <div className="w-full h-full">
               <Image src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/Home+Page/_R1_4738.JPG" alt="A large, happy crowd at a PDSCC community gathering" data-ai-hint="PDSCC community gathering" width={600} height={400} className="rounded-lg shadow-xl w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

    

    