
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EventCard } from '@/components/events/event-card';
import { HolidayBanner } from '@/components/holiday-banner';
import { events } from '@/lib/data';
import { ArrowRight, CircleDollarSign, Handshake, Sprout, Youtube } from 'lucide-react';
import { PastEventBanner } from '@/components/past-event-banner';

export default function Home() {
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const sponsors = [
    { name: 'Sponsor 1', logo: 'https://placehold.co/150x75.png' },
    { name: 'Sponsor 2', logo: 'https://placehold.co/150x75.png' },
    { name: 'Sponsor 3', logo: 'https://placehold.co/150x75.png' },
    { name: 'Sponsor 4', logo: 'https://placehold.co/150x75.png' },
    { name: 'Sponsor 5', logo: 'https://placehold.co/150x75.png' },
    { name: 'Sponsor 6', logo: 'https://placehold.co/150x75.png' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/IMG_2919.JPG"
          alt="Vaisakhi festival celebration"
          data-ai-hint="festival celebration"
          fill
          sizes="100vw"
          priority
          className="z-0 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
            <Button asChild size="lg" variant="outline" className="!text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/donate">Donate/Volunteer</Link>
            </Button>
          </div>
        </div>
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
            <Card className="text-center shadow-lg">
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
            <Card className="text-center shadow-lg">
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
            <Card className="text-center shadow-lg">
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

      <section id="past-events" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-secondary/50 rounded-lg p-8 text-center flex flex-col items-center">
            <Youtube className="h-12 w-12 text-primary mb-4" strokeWidth={1.5} />
            <h2 className="font-headline text-3xl font-bold text-foreground">Catch Up on Past Events</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                Missed one of our celebrations? Watch full recordings of our past festivals and community gatherings on our official YouTube channel.
            </p>
            <div className="mt-6">
                <Button asChild size="lg">
                    <Link href="https://www.youtube.com/@AZPDSCC" target="_blank" rel="noopener noreferrer">
                        Watch on YouTube
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section id="sponsors" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Our Valued Sponsors
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              We are grateful for the generous support of our sponsors who help make our events possible and support the Phoenix Indian community.
            </p>
          </div>
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="flex items-center justify-center" title={sponsor.name}>
                  <Image src={sponsor.logo} alt={sponsor.name} width={150} height={75} data-ai-hint="company logo" className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-lg">
                <Link href="/contact">Become a Sponsor <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="impact" className="py-16 md:py-24 bg-background">
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
