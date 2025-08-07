
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Sponsor } from '@/lib/types';
import { ArrowRight, Diamond, Medal, Award, Shield, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SponsorsDisplayProps {
  sponsors: Sponsor[];
}

const levelIcons: Record<Sponsor['level'], React.ElementType> = {
  Diamond: Diamond,
  Gold: Medal,
  Silver: Award,
  Bronze: Shield,
  Other: Handshake,
};

const levelColors: Record<Sponsor['level'], string> = {
    Diamond: 'text-blue-400',
    Gold: 'text-yellow-500',
    Silver: 'text-gray-400',
    Bronze: 'text-orange-600',
    Other: 'text-muted-foreground'
}

export function SponsorsDisplay({ sponsors }: SponsorsDisplayProps) {
  const sortedSponsors = [...sponsors].sort((a, b) => {
    const levels: Array<Sponsor['level']> = ['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'];
    return levels.indexOf(a.level) - levels.indexOf(b.level);
  });

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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {sortedSponsors.map((sponsor) => {
                const Icon = levelIcons[sponsor.level] || Handshake;
                return (
                    <Link 
                        key={sponsor.id} 
                        href={sponsor.website || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={`${sponsor.name} - ${sponsor.level} Sponsor`}
                        className="group flex flex-col items-center gap-2 text-center"
                    >
                        <Image 
                            src={sponsor.logo} 
                            alt={`${sponsor.name} logo`} 
                            width={150} 
                            height={75} 
                            data-ai-hint="company logo" 
                            className="h-[75px] w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                        />
                        <div className="flex items-center gap-2">
                           <Icon className={cn("h-4 w-4", levelColors[sponsor.level])} />
                           <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">{sponsor.level}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
        <div className="text-center mt-16">
          <Button asChild variant="link" className="text-lg">
            <Link href="/sponsorship">Become a Sponsor <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
