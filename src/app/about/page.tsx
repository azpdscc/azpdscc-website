
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { teamMembers } from '@/lib/data';
import { HeartHandshake, Target, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About AZPDSCC: Our Story & Mission for the Phoenix Indian Community',
  description: 'Learn about the story, values, and team behind AZPDSCC, a non-profit organization dedicated to serving the AZ India community and AZ Desis in Phoenix.',
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 bg-card text-center flex items-center min-h-[300px]">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
            Our Mission for the Phoenix Indian Community
          </h1>
          <div className="mt-8 py-8 border-y border-primary/20 max-w-3xl mx-auto">
            <p className="text-2xl font-medium text-foreground">
              &ldquo;To celebrate and share the vibrant culture of North India through sports and festivals in the Phoenix community.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Our Story: A Home for AZ Desis</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                AZPDSCC was founded in 2010 by a group of passionate individuals who wanted to create a home away from home for the Phoenix Indian community and AZ Desis.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                What started as small gatherings has grown into a vibrant non-profit organization that hosts some of the largest <Link href="/events" className="text-primary hover:underline">Arizona Indian festivals</Link> in the state.
              </p>
            </div>
            <div className="w-full h-full">
              <Image src="https://placehold.co/600x400.png" data-ai-hint="team meeting" alt="Founding members of AZPDSCC" width={600} height={400} className="rounded-lg shadow-xl w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Values</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Users className="h-10 w-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-headline text-xl font-semibold">Community</h3>
              <p className="mt-2 text-muted-foreground">Fostering a sense of unity and belonging.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <BookOpen className="h-10 w-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-headline text-xl font-semibold">Culture</h3>
              <p className="mt-2 text-muted-foreground">Preserving and promoting our rich heritage.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <HeartHandshake className="h-10 w-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-headline text-xl font-semibold">Inclusivity</h3>
              <p className="mt-2 text-muted-foreground">Welcoming everyone to celebrate with us.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Target className="h-10 w-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-headline text-xl font-semibold">Impact</h3>
              <p className="mt-2 text-muted-foreground">Making a positive difference in Arizona.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-headline text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          <p className="text-center mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We are a group of dedicated volunteers committed to serving the AZ India community.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center shadow-lg overflow-hidden">
                <CardHeader className="p-0">
                    <Image src={member.image} data-ai-hint="person portrait" alt={`Portrait of ${member.name}`} width={400} height={400} className="w-full h-auto" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="font-headline text-lg">{member.name}</CardTitle>
                  <p className="text-primary font-semibold text-sm">{member.role}</p>
                  <p className="mt-2 text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 text-center bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Get Involved</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Inspired by our story? There are many ways to support our mission and the Phoenix Indian community. Explore our upcoming events or consider making a donation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/donate">Donate or Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
