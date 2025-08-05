
import Image from 'next/image';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

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
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.name}
            data-ai-hint={`${event.category.toLowerCase()} event`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {isPast && (
             <Badge variant="secondary" className="absolute top-2 left-2">Past Event</Badge>
          )}
           <Badge className="absolute top-2 right-2">{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2">{event.name}</CardTitle>
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
      <CardFooter className="p-4 bg-secondary">
        <Button asChild className="w-full" disabled={isPast}>
          <Link href={`/events/${event.slug}`}>
            {isPast ? 'View Details' : 'Learn More'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
