import Link from 'next/link';
import { getEvents } from '@/services/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { DeleteEventButton } from '@/components/admin/delete-buttons';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export default async function ManageEventsPage() {
    const events = await getEvents();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Manage Events</CardTitle>
                        <CardDescription>A list of all events in the system.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/events/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Event
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4">
                        <AlertTitle>Event Management</AlertTitle>
                        <AlertDescription>
                            Events are now managed via a data file. Use the "Add Event" button to access the code generator tool. Editing still works here, but new events should be added via the generator for consistency.
                        </AlertDescription>
                    </Alert>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell><Badge variant="secondary">{event.category}</Badge></TableCell>
                                    <TableCell className="text-right">
                                       <Button asChild variant="ghost" size="icon" disabled>
                                            <Link href={`#`}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Link>
                                       </Button>
                                       <DeleteEventButton id={event.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
