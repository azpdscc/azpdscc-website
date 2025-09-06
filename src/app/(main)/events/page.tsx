
'use client';

import { useState, useMemo, useEffect } from 'react';
import { EventCard } from '@/components/events/event-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getEvents } from '@/services/events';
import type { Event, EventCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper, Utensils, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const categories: EventCategory[] = ['Cultural', 'Food', 'Music', 'Dance'];

function EventSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
        setIsLoading(true);
        const fetchedEvents = await getEvents();
        // Sort events: upcoming first (soonest to latest), then past (most recent to oldest)
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcoming = fetchedEvents
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const past = fetchedEvents
            .filter(e => new Date(e.date) < now)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setEvents([...upcoming, ...past]);
        setIsLoading(false);
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, events]);

  return (
    <div className="bg-background">
      <section className="relative h-auto min-h-[200px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl font-bold !text-primary-foreground drop-shadow-sm">
            Desi Events in Phoenix
          </h1>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-card shadow-md mb-12">
            <Input 
              placeholder="Search for events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            <Select
              value={selectedCategory}
              onValueChange={(value: EventCategory | 'all') => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => <EventSkeleton key={index} />)
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="md:col-span-3 text-center text-muted-foreground">No events found. Try adjusting your search or filters.</p>
            )}
          </div>
          
          <Separator className="my-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="flex flex-col items-center p-6 bg-card">
                <PartyPopper className="h-10 w-10 text-primary mb-4 shrink-0" strokeWidth={1.5}/>
                <p className="text-base text-muted-foreground">
                    PDSCC is at the forefront of celebrating Desi culture in Arizona, and our events page is your official guide to the most anticipated gatherings in the Phoenix Punjabi Indian community.
                </p>
            </Card>
            <Card className="flex flex-col items-center p-6 bg-card">
                <Utensils className="h-10 w-10 text-primary mb-4 shrink-0" strokeWidth={1.5}/>
                <p className="text-base text-muted-foreground">
                    We specialize in bringing traditional North Indian festivals to life, from the vibrant colors of Holi to the luminous celebrations of Diwali. Our events feature authentic Punjabi food, mesmerizing music, and electrifying dance performances.
                </p>
            </Card>
             <Card className="flex flex-col items-center p-6 bg-card">
                <Users className="h-10 w-10 text-primary mb-4 shrink-0" strokeWidth={1.5}/>
                <p className="text-base text-muted-foreground">
                    Whether you're looking to connect with the AZ Desi community, experience the richness of Indian heritage, or find family-friendly activities in Phoenix, you'll find it here. Explore our upcoming events and be part of a tradition that unites and inspires.
                </p>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
