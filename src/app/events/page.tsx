
'use client';

import { useState, useMemo } from 'react';
import { EventCard } from '@/components/events/event-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { events } from '@/lib/data';
import type { EventCategory } from '@/lib/types';

const categories: EventCategory[] = ['Cultural', 'Food', 'Music', 'Dance'];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, sortedEvents]);

  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">Arizona Indian Festivals & Events</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Discover vibrant Arizona Indian festivals, cultural celebrations, food fairs, and music nights for the entire Phoenix Indian community.
          </p>
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
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="md:col-span-3 text-center text-muted-foreground">No events found. Try adjusting your search or filters.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
