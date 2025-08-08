
'use client';

import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getEvents, getEventBySlug } from '@/services/events';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Youtube, Facebook } from 'lucide-react';
import type { Event } from '@/lib/types';
import { format, parse, isValid } from 'date-fns';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


// type Props = {
//   params: { slug: string }
// }

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const slug = params.slug;
//   const event = await getEventBySlug(slug);
 
//   if (!event) {
//     return {
//         title: 'Event Not Found | PDSCC Hub',
//         description: 'The event you are looking for could not be found. Please check our main events page for upcoming Arizona Indian festivals.',
//     }
//   }

//   const previousImages = (await parent).openGraph?.images || [];

//   return {
//     title: `${event.name} | PDSCC Phoenix Indian Community`,
//     description: `Get details for ${event.name}, a premier event for the AZ India community. Find date, time, location, and RSVP info for this top Arizona Indian festival.`,
//     openGraph: {
//       title: event.name,
//       description: event.description,
//       images: [event.image, ...previousImages],
//       type: 'article',
//     },
//   }
// }


// export async function generateStaticParams() {
//   const events = await getEvents();
//   return events.map((event) => ({
//     slug: event.slug,
//   }));
// }

const createEventSchema = (event: Event) => {
  const eventDate = parse(event.date, 'MMMM dd, yyyy', new Date());
  if (!isValid(eventDate)) return null;

  const [startTimeStr, endTimeStr] = event.time.split(' - ');
  const startTime = parse(startTimeStr.trim(), 'h:mm a', eventDate);
  const endTime = parse(endTimeStr.trim(), 'h:mm a', eventDate);

  if (!isValid(startTime) || !isValid(endTime)) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: startTime.toISOString(),
    endDate: endTime.toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.locationName,
      address: event.locationAddress,
    },
    image: [event.image],
    description: event.fullDescription,
    offers: {
      '@type': 'Offer',
      url: `https://www.azpdscc.org/events/${event.slug}`,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    organizer: {
      '@type': 'Organization',
      name: 'PDSCC',
      url: 'https://www.azpdscc.org',
    },
  };
};

function EventPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-[50vh] w-full mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-1/3 mt-8" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="md:col-span-1">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getEventBySlug(slug).then(eventData => {
        if (!eventData) {
          notFound();
        } else {
          setEvent(eventData);
        }
        setIsLoading(false);
      });
    }
  }, [slug]);

  if (isLoading || !event) {
    return <EventPageSkeleton />;
  }

  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const isPast = eventDate < today;

  const eventSchema = createEventSchema(event);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationAddress)}`;

  const createGoogleCalendarLink = (event: Event): string => {
    try {
      const date = parse(event.date, 'MMMM dd, yyyy', new Date());
      if (!isValid(date)) return '#';

      const [startTimeStr, endTimeStr] = event.time.split(' - ');
      const startTime = parse(startTimeStr.trim(), 'h:mm a', date);
      const endTime = parse(endTimeStr.trim(), 'h:mm a', date);
      
      if (!isValid(startTime) || !isValid(endTime)) return '#';

      const startUTC = format(startTime, "yyyyMMdd'T'HHmmss'Z'");
      const endUTC = format(endTime, "yyyyMMdd'T'HHmmss'Z'");

      const details = `For more information, visit: https://www.azpdscc.org/events/${event.slug}`;

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.name,
        dates: `${startUTC}/${endUTC}`,
        details: details,
        location: event.locationAddress,
        trp: 'false',
      });

      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    } catch (error) {
      console.error("Error creating calendar link:", error);
      return `https://www.google.com/search?q=${encodeURIComponent(event.name + ' on ' + event.date)}`;
    }
  };
  
  const calendarLink = createGoogleCalendarLink(event);

  return (
    <article>
      {eventSchema && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />}
      <header className="relative h-[50vh] min-h-[300px] w-full">
        <Image
          src={event.image}
          alt={event.name}
          data-ai-hint={`${event.category.toLowerCase()} event`}
          fill
          sizes="100vw"
          priority
          className="z-0 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 bg-hero-pattern opacity-10" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4">
          <Badge className="mb-4 bg-accent text-accent-foreground">{event.category}</Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            {event.name}
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {isPast && (
          <Card className="mb-8 border-primary/20 bg-primary/5 shadow-lg">
            <div className="p-6 text-center">
              <h2 className="font-headline text-2xl font-bold text-primary">This Event Has Ended</h2>
              <p className="mt-2 text-muted-foreground text-base">
                Relive the moments! Check out the recordings and photos from {event.name}.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild>
                  <Link href="https://www.youtube.com/@AZPDSCC" target="_blank" rel="noopener noreferrer" aria-label={`Watch videos from ${event.name} on YouTube`}>
                    <Youtube className="mr-2"/> Watch on YouTube
                  </Link>
                </Button>
                 <Button asChild>
                  <Link href="https://www.facebook.com/pdscc/photos_albums" target="_blank" rel="noopener noreferrer" aria-label={`View photo albums from ${event.name} on Facebook`}>
                    <Facebook className="mr-2"/> View Photos
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-headline text-3xl font-bold mb-4">About the Event</h2>
            <p className="text-muted-foreground whitespace-pre-line">{event.fullDescription}</p>

             <h3 className="font-headline text-2xl font-bold mt-8 mb-4">Event Schedule</h3>
             <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Gates Open: 30 minutes before start time</li>
                <li>Main Performances: {event.time}</li>
                <li>Food Stalls Close: 30 minutes before end time</li>
             </ul>
          </div>
          <div className="md:col-span-1">
            <div className="p-6 border rounded-lg bg-card shadow-md sticky top-24">
              <h3 className="font-headline text-2xl font-bold mb-4">Details</h3>
              <div className="space-y-4 text-muted-foreground">
                 <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                        <p className="font-semibold text-foreground">Date</p>
                        <p>{event.date}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                        <p className="font-semibold text-foreground">Time</p>
                        <p>{event.time}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                        <p className="font-semibold text-foreground">{event.locationName}</p>
                        <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {event.locationAddress}
                        </Link>
                    </div>
                </div>
              </div>
              {!isPast && (
                <>
                  <Button asChild size="lg" className="w-full mt-6">
                      <Link href="/contact">Register / RSVP</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full mt-2">
                      <Link href={calendarLink} target="_blank" rel="noopener noreferrer">Add to Calendar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
