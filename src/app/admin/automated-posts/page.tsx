import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Users, Handshake, PenSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="h-6 w-6" />
                Manage Events
            </CardTitle>
            <CardDescription>
                Add, edit, or remove event listings from the website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/admin/events">Go to Events</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Manage Team Members
            </CardTitle>
            <CardDescription>
                Update the team members displayed on the "About Us" page.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/team">Go to Team</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Handshake className="h-6 w-6" />
                Manage Sponsors
            </CardTitle>
            <CardDescription>
                Update the sponsors displayed on the homepage.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/sponsors">Go to Sponsors</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PenSquare className="h-6 w-6" />
                Manage Blog
            </CardTitle>
            <CardDescription>
                Create, edit, or delete blog posts for the website using the AI-powered generator.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/blog">Go to Blog</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}