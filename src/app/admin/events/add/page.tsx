
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { createEventAction } from "../actions";

export default function AddEventPage() {
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
                    action={createEventAction}
                />
            </CardContent>
        </Card>
    </div>
  );
}
