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

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Events & Festivals</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Discover vibrant cultural celebrations, food fairs, music nights, and more.
        </p>
      </section>
      
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-card shadow-md">
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
      </section>
      
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="md:col-span-3 text-center text-muted-foreground">No events found. Try adjusting your search or filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
