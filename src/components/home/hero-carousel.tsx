
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Calendar, Ticket } from 'lucide-react';
import type { Event } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

interface HeroCarouselProps {
  nextEvent: Event | null;
}

export function HeroCarousel({ nextEvent }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const plugin = useRef(
    Autoplay({ playOnInit: true, delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  
  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  
  return (
    <section className="relative w-full h-screen">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        opts={{
          loop: !!nextEvent,
        }}
      >
        <CarouselContent className="h-full">
          <CarouselItem className="h-full">
            <div className="relative h-full w-full">
              <Image
                src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/Home+Page/IMG_3370.jpeg"
                alt="Vaisakhi festival celebration"
                data-ai-hint="festival celebration"
                fill
                sizes="100vw"
                priority
                className="z-0 object-cover object-[center_40%]"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4">
                <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !text-primary-foreground drop-shadow-lg">
                  Connecting the Arizona Punjabi Indian Community &amp; AZ Desis
                </h1>
                <p className="mt-4 max-w-2xl text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
                  Your home for vibrant Arizona Punjabi Indian festivals, culture, and community outreach in Phoenix.
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
            <CarouselItem className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src={nextEvent.image}
                  alt={nextEvent.name}
                  data-ai-hint="upcoming event"
                  fill
                  sizes="100vw"
                  priority
                  className="z-0 object-cover object-[center_40%]"
                />
                <div className="absolute inset-0 bg-black/30" />
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
  );
}
