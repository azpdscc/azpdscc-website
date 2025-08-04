
'use client';

import { getEventById } from '@/services/events';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { updateEventAction } from '../../actions';
import { useEffect, useState } from 'react';
import type { Event } from '@/lib/types';

export default function EditEventPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const fetchedEvent = await getEventById(id);
      if (!fetchedEvent) {
        notFound();
      }
      setEvent(fetchedEvent);
      setLoading(false);
    }
    fetchEvent();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Loading Event...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return null; // notFound() would have been called
  }

  const updateEventWithId = updateEventAction.bind(null, id);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Event</CardTitle>
                <CardDescription>Update the details for "{event.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <EventForm 
                    type="Edit"
                    event={event}
                    action={updateEventWithId}
                />
            </CardContent>
        </Card>
    </div>
  );
}
