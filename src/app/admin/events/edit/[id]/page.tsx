
import { getEventById } from '@/services/events';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/admin/event-form";
import { updateEventAction } from '../../actions';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const event = await getEventById(id);

  if (!event) {
    notFound();
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
