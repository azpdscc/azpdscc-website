
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { events } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Event } from '@/lib/types';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = events.find((e) => e.slug === params.slug);
 
  if (!event) {
    return {
        title: 'Event Not Found | PDSCC Hub',
        description: 'The event you are looking for could not be found. Please check our main events page for upcoming Arizona Indian festivals.',
    }
  }

  return {
    title: `${event.name} | PDSCC Phoenix Indian Community`,
    description: `Get details for ${event.name}, a premier event for the AZ India community. Find date, time, location, and RSVP info for this top Arizona Indian festival.`,
  }
}


export async function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

const createEventSchema = (event: Event) => {
  const [startTime, endTime] = event.time.split(' - ');
  const startDate = new Date(`${event.date} ${startTime || '12:00 AM'}`);
  const endDate = new Date(`${event.date} ${endTime || '11:59 PM'}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
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
    },
    organizer: {
      '@type': 'Organization',
      name: 'PDSCC',
      url: 'https://www.azpdscc.org',
    },
  };
};

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = events.find((e) => e.slug === params.slug);

  if (!event) {
    notFound();
  }

  const eventSchema = createEventSchema(event);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.locationAddress)}`;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <section className="relative h-[50vh] min-h-[300px] w-full">
        <Image
          src={event.image}
          alt={event.name}
          data-ai-hint={`${event.category.toLowerCase()} event`}
          fill
          sizes="100vw"
          priority
          className="z-0 object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4">
          <Badge className="mb-4 bg-accent text-accent-foreground">{event.category}</Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            {event.name}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
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
              <Button size="lg" className="w-full mt-6">Register / RSVP</Button>
              <Button variant="outline" size="lg" className="w-full mt-2">Add to Calendar</Button>
               <div className="mt-6 h-48 bg-secondary rounded-lg flex items-center justify-center">
                    <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                       <Image src={`https://placehold.co/400x200.png`} data-ai-hint="map location" alt={`Map of ${event.locationName}`} width={400} height={200} className="w-full h-full object-cover rounded-lg" />
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
