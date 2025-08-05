
'use client';

import { useFormState } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { createEventAction, type EventFormState } from "../actions";

export default function AddEventPage() {
  const initialState: EventFormState = { errors: {}, success: false, message: '' };
  const [formState, action] = useFormState(createEventAction, initialState);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Add a New Event</CardTitle>
                <CardDescription>Fill out the details for the new event.</CardDescription>
            </CardHeader>
            <CardContent>
                <EventForm 
                    type="Add"
                    action={action}
                    formState={formState}
                />
            </CardContent>
        </Card>
    </div>
  );
}
