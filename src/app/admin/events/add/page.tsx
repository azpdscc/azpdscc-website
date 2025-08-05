'use client';
import { useActionState } from 'react';
import { EventForm } from '@/components/admin/event-form';
import { createEventAction, type EventFormState } from '../actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AddEventPage() {
  const initialState: EventFormState = { errors: {}, success: false, message: '' };
  const [formState, action] = useActionState(createEventAction, initialState);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm formAction={action} formState={formState} />
        </CardContent>
      </Card>
    </div>
  );
}
