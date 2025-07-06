
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart, Award, Paintbrush, Users, Heart } from 'lucide-react';
import { DonationForm } from '@/components/donate/donation-form';

export const metadata: Metadata = {
  title: 'Donate or Volunteer | Support the Phoenix Indian Community',
  description: 'Support PDSCC by making a donation or volunteering your time. Your contribution helps us host Arizona Indian festivals and support the AZ India community.',
};

export default function DonatePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Support the Phoenix Indian Community
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Your contribution empowers us to preserve culture, celebrate heritage, and strengthen the Phoenix Indian community and AZ India connections.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <DonationForm />
      </main>

      {/* Impact Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Where Your Donation Goes</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Every dollar you give helps us create meaningful experiences and support the community.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Award className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">
                      <Link href="/events" className="hover:underline">Vibrant Festivals</Link>
                    </h3>
                    <p className="mt-2 text-muted-foreground">Funding cultural events like Diwali and Holi.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Paintbrush className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Arts & Culture</h3>
                    <p className="mt-2 text-muted-foreground">Supporting local artists and cultural workshops.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Users className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Community Support</h3>
                    <p className="mt-2 text-muted-foreground">Providing resources and outreach programs.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Heart className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Future Generations</h3>
                    <p className="mt-2 text-muted-foreground">Ensuring our heritage thrives for years to come.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
