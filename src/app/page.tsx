import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EventCard } from '@/components/events/event-card';
import { events } from '@/lib/data';
import { ArrowRight, CircleDollarSign, Handshake, Sprout } from 'lucide-react';

export default function Home() {
  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Indian festival celebration"
          data-ai-hint="festival celebration"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/50 to-orange-500/30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold !text-white drop-shadow-lg">
            Connecting Arizona&apos;s Indian Community
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl !text-white/90 drop-shadow-md">
            Through Culture, Celebration, and Community Outreach.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/vendors">Become a Vendor</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="!text-white border border-white hover:bg-white/10">
              <Link href="/donate">Donate/Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Welcome to AZPDSCC
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
              We are a non-profit organization dedicated to preserving and promoting Indian culture, fostering community bonds, and celebrating our rich heritage through vibrant festivals and events across Arizona.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Handshake className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Festivals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience the color, music, and joy of traditional Indian festivals right here in Arizona.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Sprout className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Community Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Engaging with and supporting our local community through various outreach programs and initiatives.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <CircleDollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Cultural Preservation</CardTitle>
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
      
      <section id="events" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Upcoming Events</h2>
            <Button asChild variant="link" className="text-primary">
              <Link href="/events">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {upcomingEvents.map((event) => (
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

      <section id="impact" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Our Impact, By the Numbers</h2>
              <p className="mt-4 text-muted-foreground">
                We are proud of the community we've built and the positive impact we've made. Our events bring people together, support local artisans, and create lasting memories.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-8">
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">10+</p>
                  <p className="text-muted-foreground">Years of Service</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">50k+</p>
                  <p className="text-muted-foreground">Community Members Engaged</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">100+</p>
                  <p className="text-muted-foreground">Events Organized</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-headline text-4xl font-bold text-primary">1,000+</p>
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
