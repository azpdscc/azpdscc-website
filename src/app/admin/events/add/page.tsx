
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { createEventAction } from "../actions";
import { useEffect, useState } from "react";

export default function AddEventPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Add a New Event</CardTitle>
                <CardDescription>Fill out the details for the new event.</CardDescription>
            </CardHeader>
            <CardContent>
                {isClient ? (
                    <EventForm 
                        type="Add"
                        action={createEventAction}
                    />
                ) : (
                    <p>Loading form...</p> // You can add a skeleton loader here later if you wish
                )}
            </CardContent>
        </Card>
    </div>
  );
}
