
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Diamond, Medal, Award, Shield } from 'lucide-react';
import { SponsorshipForm } from '@/components/sponsorship/sponsorship-form';
import { getSponsors } from '@/services/sponsors';
import { getOptimizedSponsorLogo } from '@/services/images';
import type { Sponsor } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sponsorshipTiers = [
  {
    name: 'Diamond',
    price: '$20,000+',
    icon: Diamond,
    features: [
      'Premier "Presented by" naming rights for one major festival',
      'Top logo placement on all event materials & website',
      'Exclusive stage announcements and premium booth space',
      'Dedicated social media campaigns',
      'Full-page ad in event brochures',
    ],
    isFeatured: true,
  },
  {
    name: 'Gold',
    price: '$10,000',
    icon: Medal,
    features: [
      'Prominent logo placement on event materials & website',
      'Regular stage announcements',
      'Prime booth space at all events',
      'Featured social media mentions',
    ],
  },
  {
    name: 'Silver',
    price: '$5,000',
    icon: Award,
    features: [
      'Logo placement on event banners and website',
      'Booth space at one major festival',
      'Social media mentions',
      'Acknowledgement during events',
    ],
  },
  {
    name: 'Bronze',
    price: '$2,500',
    icon: Shield,
    features: [
      'Logo on sponsor section of the website',
      'Shared logo on event banners',
      'Group social media thank you post',
    ],
  },
];

export function SponsorshipPageClient() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    getSponsors().then(setSponsors);
  }, []);

  const sponsorLevels: Array<Sponsor['level']> = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'];
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    (acc[sponsor.level] = acc[sponsor.level] || []).push(sponsor);
    return acc;
  }, {} as Record<Sponsor['level'], Sponsor[]>);


  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Partner with PDSCC
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Align your brand with the heart of the Phoenix Punjabi Indian community. Your support empowers cultural celebration and community connection.
          </p>
        </div>
      </section>

      <section id="packages" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Sponsorship Packages</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We offer several tiers of sponsorship, each with unique benefits to showcase your commitment to the community. Partnering with PDSCC provides extensive brand visibility to a diverse and engaged audience of thousands of attendees from across the Phoenix metro area.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {sponsorshipTiers.map((tier) => (
              <Card key={tier.name} className={`flex flex-col shadow-lg ${tier.isFeatured ? 'border-primary border-2 ring-4 ring-primary/20' : ''}`}>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                    <tier.icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
                  <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="font-bold text-lg text-foreground">{tier.price}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 text-muted-foreground">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" strokeWidth={1.5} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild size="lg" className="w-full" variant={tier.isFeatured ? 'default' : 'secondary'}>
                    <a href="#inquiry-form">Inquire Now</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsors" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
              Our Valued Sponsors
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              We are grateful for the generous support of our sponsors who help make our events possible.
            </p>
          </div>
          <div className="mt-12 space-y-12">
            {sponsorLevels.map(level => {
              const sponsorsForLevel = groupedSponsors[level];
              if (!sponsorsForLevel || sponsorsForLevel.length === 0) return null;

              return (
                <div key={level}>
                  <h3 className="font-headline text-2xl font-bold text-center mb-6">{level} Sponsors</h3>
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
                    {sponsorsForLevel.map((sponsor) => (
                      <Link key={sponsor.id} href={sponsor.website || '#'} target="_blank" rel="noopener noreferrer" title={sponsor.name}>
                          <Image src={getOptimizedSponsorLogo(sponsor.logo, { width: 300 })} alt={`${sponsor.name} logo`} width={150} height={75} data-ai-hint="company logo" className="h-[75px] w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="inquiry-form" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <SponsorshipForm />
            </div>
        </div>
      </section>
    </div>
  );
}
