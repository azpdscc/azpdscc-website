'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { getEventById } from '@/services/events';
import type { Event } from '@/lib/types';
import { EventForm } from '@/components/admin/event-form';
import { updateEventAction, type EventFormState } from '../../actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initialState: EventFormState = { errors: {}, success: false, message: '' };
  const updateEventActionWithId = updateEventAction.bind(null, params.id);
  const [formState, action] = useActionState(updateEventActionWithId, initialState);
  
  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      const fetchedEvent = await getEventById(params.id);
      setEvent(fetchedEvent);
      setIsLoading(false);
    }
    fetchEvent();
  }, [params.id]);

  if (isLoading) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!event) {
    return <p className="text-center p-8">Event not found.</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Event: {event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            event={event}
            formAction={action}
            formState={formState}
          />
        </CardContent>
      </Card>
    </div>
  );
}
