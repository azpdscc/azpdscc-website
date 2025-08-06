
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Sponsor } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface SponsorsDisplayProps {
  sponsors: Sponsor[];
}

export function SponsorsDisplay({ sponsors }: SponsorsDisplayProps) {
  const sponsorLevels: Array<Sponsor['level']> = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'];
  
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    (acc[sponsor.level] = acc[sponsor.level] || []).push(sponsor);
    return acc;
  }, {} as Record<Sponsor['level'], Sponsor[]>);

  return (
    <section id="sponsors" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
            Our Valued Sponsors
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            We are grateful for the generous support of our sponsors who help make our events possible and support the Phoenix Indian community.
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
                    <div key={sponsor.id} className="flex items-center justify-center" title={sponsor.name}>
                      <Image src={sponsor.logo} alt={sponsor.name} width={150} height={75} data-ai-hint="company logo" className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="link" className="text-lg">
            <Link href="/sponsorship">Become a Sponsor <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
