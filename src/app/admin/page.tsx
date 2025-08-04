
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Users, Calendar } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Admin Dashboard | PDSCC',
    description: 'Admin dashboard for managing website content.',
};

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Select a section below to manage your website's content.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link href="/admin/events" className="block hover:scale-[1.02] transition-transform duration-200">
                    <Card className="shadow-lg h-full">
                        <CardHeader className="items-center text-center">
                             <div className="bg-primary/10 rounded-full p-4 w-fit mb-4">
                                <Calendar className="h-10 w-10 text-primary" strokeWidth={1.5} />
                            </div>
                            <CardTitle className="font-headline text-2xl">Manage Events</CardTitle>
                            <CardDescription>Add, edit, or delete event listings.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/admin/team" className="block hover:scale-[1.02] transition-transform duration-200">
                    <Card className="shadow-lg h-full">
                        <CardHeader className="items-center text-center">
                             <div className="bg-primary/10 rounded-full p-4 w-fit mb-4">
                                <Users className="h-10 w-10 text-primary" strokeWidth={1.5} />
                            </div>
                            <CardTitle className="font-headline text-2xl">Manage Team</CardTitle>
                            <CardDescription>Add, edit, or delete team members.</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
