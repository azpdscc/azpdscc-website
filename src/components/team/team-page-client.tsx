
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamMembers } from '@/services/team';
import { HeartHandshake, Target, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { TeamMember } from '@/lib/types';

export function TeamPageClient() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getTeamMembers().then(setTeamMembers);
  }, []);

  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Our Mission for the Phoenix Punjabi Indian Community
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            To celebrate and share the vibrant culture of North India through sports and festivals in the Phoenix Punjabi Indian community.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">Our Story: A Home for the Desi Community in Arizona</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The Phoenix Desi Sports and Cultural Club (PDSCC) was founded in 2010 by a group of passionate individuals who wanted to create a home away from home for the growing Indian community in Arizona. They saw a need for a central organization that could bring people together, celebrate shared traditions, and pass on cultural values to the next generation.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                What started as small gatherings has grown into a vibrant non-profit organization that hosts some of the largest <Link href="/events" className="text-primary hover:underline">Punjabi festivals in Phoenix</Link>, celebrating Punjabi culture in Arizona for all to enjoy. Our success is built on the dedication of our volunteers and the enthusiastic support of the entire AZ Desi community.
              </p>
            </div>
            <div className="w-full h-full">
              <Image src="https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/About+Us/_R1_4736.JPG" data-ai-hint="team meeting" alt="Founding members of PDSCC planning an event" width={600} height={400} className="rounded-lg shadow-xl w-full" />
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-headline text-3xl md:text-4xl font-bold">Meet Our Team</h2>
          <p className="text-center mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We are a group of dedicated volunteers committed to providing community services for the AZ Indian community. Our team works tirelessly to organize events, manage logistics, and ensure that every PDSCC gathering is a success.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center shadow-lg overflow-hidden">
                <CardHeader className="p-0">
                    <Image src={member.image} data-ai-hint="person portrait" alt={`Portrait of ${member.name}, ${member.role} at PDSCC`} width={400} height={400} className="w-full h-auto" />
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
            Inspired by our story? There are many ways to support our mission and the Phoenix Punjabi Indian community. Explore our upcoming events or consider making a donation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/events">Explore Events</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/donate">Donate & Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
