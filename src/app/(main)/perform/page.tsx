
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, Music } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Perform at PDSCC Events | Arizona Punjabi Indian Festivals',
  description: 'Register to perform at our upcoming Arizona Punjabi Indian festivals. We are looking for talented singers, dancers, and performers from the Phoenix Punjabi Indian community.',
};

export default function PerformersPage() {
  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">Perform at Our Festivals</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Showcase your talent to the vibrant Phoenix Punjabi Indian community. We invite singers, dancers, and performers of all kinds to register for our events.
          </p>
        </div>
      </section>
      
      <main className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Performance Opportunities</h2>
          <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg flex flex-col">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <Mic className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl text-center">Register to Perform</CardTitle>
                <CardDescription className="text-center">
                  Ready to take the stage? Fill out our application form to be considered for our next big event.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/perform/register">Apply Now <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
