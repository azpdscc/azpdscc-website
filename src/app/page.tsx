
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EventCard } from '@/components/events/event-card';
import { HolidayBanner } from '@/components/holiday-banner';
import { getEvents } from '@/services/events';
import { getSponsors } from '@/services/sponsors';
import { ArrowRight, CircleDollarSign, Handshake, Sprout, Calendar, Ticket } from 'lucide-react';
import { PastEventBanner } from '@/components/past-event-banner';
import { useEffect, useState, useRef } from 'react';
import type { Event, Sponsor } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  
  const heroPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const eventsPlugin = useRef(
      Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  useEffect(() => {
    async function fetchData() {
        const [fetchedEvents, fetchedSponsors] = await Promise.all([
            getEvents(),
            getSponsors()
        ]);
        setAllEvents(fetchedEvents);
        setSponsors(fetchedSponsors);
    }
    fetchData();
  }, []);
  
  // Find upcoming events and sort them
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingEvents = allEvents
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get the next 5 for the carousel, and the very next one for the hero
  const nextFiveEvents = upcomingEvents.slice(0, 5);
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  const sponsorLevels: Array<Sponsor['level']> = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'];
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    (acc[sponsor.level] = acc[sponsor.level] || []).push(sponsor);
    return acc;
  }, {} as Record<Sponsor['level'], Sponsor[]>);

  return (
    <div className="flex flex-col">
      <section className="relative w-full">
         <Carousel
            plugins={[heroPlugin.current]}
            opts={{
              loop: true,
            }}
            className="w-full"
            onMouseEnter={heroPlugin.current.stop}
            onMouseLeave={heroPlugin.current.reset}
          >
            <CarouselContent>
              <CarouselItem>
                  <div className="relative h-[60vh] min-h-[400px] w-full">
                    <Image
                      src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/IMG_2919.JPG"
                      alt="Vaisakhi festival celebration"
                      data-ai-hint="festival celebration"
                      fill
                      sizes="100vw"
                      priority
                      className="z-0 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4">
                      <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !text-primary-foreground drop-shadow-lg">
                        Connecting the Arizona Indian Community &amp; AZ Desis
                      </h1>
                      <p className="mt-4 max-w-2xl text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
                        Your home for vibrant Arizona Indian festivals, culture, and community outreach in Phoenix.
                      </p>
                       <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg">
                          <Link href="/events">Explore Events</Link>
                        </Button>
                        <Button asChild size="lg" variant="secondary">
                          <Link href="/vendors">Become a Vendor</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
              </CarouselItem>
              {nextEvent && (
                 <CarouselItem>
                  <div className="relative h-[60vh] min-h-[400px] w-full">
                    <Image
                      src={nextEvent.image}
                      alt={nextEvent.name}
                      data-ai-hint="upcoming event"
                      fill
                      sizes="100vw"
                      priority
                      className="z-0 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4">
                      <p className="font-bold uppercase tracking-widest !text-primary-foreground drop-shadow-md">Coming Soon</p>
                      <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !text-primary-foreground drop-shadow-lg">
                        {nextEvent.name}
                      </h1>
                      <div className="mt-4 flex items-center gap-4 text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            <span>{nextEvent.date}</span>
                          </div>
                      </div>
                      <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        <Button asChild size="lg">
                          <Link href={`/events/${nextEvent.slug}`}>
                            <Ticket className="mr-2 h-5 w-5" />
                            Learn More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
              </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12" />
          </Carousel>
      </section>

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
                  <Handshake className="h-8 w-8 text-primary" strokeWidth={1.5} />
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
                  <CircleDollarSign className="h-8 w-8 text-primary" strokeWidth={1.5} />
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
      
      <section id="events" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Upcoming Arizona Indian Festivals</h2>
            <Button asChild variant="link" className="text-primary">
              <Link href="/events">View All <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
            </Button>
          </div>
          <Carousel
            plugins={[eventsPlugin.current]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
            onMouseEnter={eventsPlugin.current.stop}
            onMouseLeave={eventsPlugin.current.reset}
          >
            <CarouselContent>
              {nextFiveEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <EventCard event={event} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      <section id="sponsors" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Our Valued Sponsors
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              We are grateful for the generous support of our sponsors who help make our events possible and support the Phoenix Indian community.
            </p>
          </div>
          <div className="mt-12 space-y-12">
            {sponsorLevels.map(level => {
              const sponsorsForLevel = groupedSponsors[level];
              if (!sponsorsForLevel || sponsorsForLevel.length === 0) return null;

              return (
                <div key={level}>
                  <h3 className="font-headline text-2xl font-bold text-center mb-6">{level} Sponsors</h3>
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
                    {sponsorsForLevel.map((sponsor) => (
                      <div key={sponsor.id} className="flex items-center justify-center" title={sponsor.name}>
                        <Image src={sponsor.logo} alt={sponsor.name} width={150} height={75} data-ai-hint="company logo" className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-lg">
                <Link href="/sponsorship">Become a Sponsor <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

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
               <Image src="https://placehold.co/600x400.png" alt="Community gathering" data-ai-hint="community gathering" width={600} height={400} className="rounded-lg shadow-xl w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

    