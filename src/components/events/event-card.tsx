
import Image from 'next/image';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Facebook } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const today = new Date();
  // Set hours to 0 to compare dates only. An event is "past" the day after it occurs.
  today.setHours(0, 0, 0, 0); 
  const isPast = eventDate < today;

  return (
    <Card className="flex flex-col h-full shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/events/${event.slug}`} className="relative h-48 w-full block">
          <Image
            src={event.image}
            alt={event.name}
            data-ai-hint={`${event.category.toLowerCase()} event`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {isPast && (
             <Badge variant="secondary" className="absolute top-2 left-2 ring-1 ring-white">Past Event</Badge>
          )}
           <Badge variant="default" className="absolute top-2 right-2 ring-1 ring-white">{event.category}</Badge>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2">
            <Link href={`/events/${event.slug}`} className="hover:text-primary transition-colors">{event.name}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span>{event.locationName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/80 flex items-center justify-center gap-2">
        {isPast ? (
            <>
                <Button asChild className="w-full" variant="secondary">
                    <Link href={`/events/${event.slug}`}>View Details</Link>
                </Button>
                <Button asChild className="w-full">
                    <Link href="https://www.facebook.com/pdscc/photos_albums" target="_blank" rel="noopener noreferrer">
                        <Facebook className="mr-2"/> View Photos
                    </Link>
                </Button>
            </>
        ) : (
            <Button asChild className="w-full">
                <Link href={`/events/${event.slug}`}>Learn More</Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
