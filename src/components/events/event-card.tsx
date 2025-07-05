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
  return (
    <Card className="flex flex-col h-full shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={event.image}
            alt={event.name}
            data-ai-hint={`${event.category.toLowerCase()} event`}
            layout="fill"
            objectFit="cover"
          />
           <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2">{event.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <Button asChild className="w-full">
          <Link href={`/events/${event.slug}`}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
