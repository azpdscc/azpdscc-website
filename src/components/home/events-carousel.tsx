
'use client';

import { useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EventCard } from '@/components/events/event-card';
import type { Event } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

interface EventsCarouselProps {
  events: Event[];
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-4 items-stretch">
        {events.map((event) => (
          <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <EventCard event={event} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
