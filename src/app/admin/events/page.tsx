
import { getEvents } from '@/services/events';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { deleteEventAction } from './actions';

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline text-2xl">Manage Events</CardTitle>
                <CardDescription>Add, edit, or delete your organization's events.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/events/add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Event
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.locationName}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/events/edit/${event.id}`}>
                                <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <form action={deleteEventAction}>
                                <input type="hidden" name="id" value={event.id} />
                                <Button variant="ghost" size="icon" type="submit">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </form>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
