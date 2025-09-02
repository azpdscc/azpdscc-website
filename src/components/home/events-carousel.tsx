
'use client';

import { useRef, useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { EventCard } from '@/components/events/event-card';
import type { Event } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

interface EventsCarouselProps {
  events: Event[];
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
   const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
 
  useEffect(() => {
    if (!api) {
      return
    }
    // Note: The 'useEffect' logic for api can be expanded here if needed.
  }, [api])

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
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
