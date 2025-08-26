
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Users, Handshake, PenSquare, UserCheck, QrCode, Mic, ShoppingCart, Clock, CheckSquare, ShieldCheck } from 'lucide-react';

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
                Create, edit, or delete blog posts for the website. Use the AI generator to create drafts.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/blog">Go to Blog</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Manage Vendors
            </CardTitle>
            <CardDescription>
                Review and verify vendor applications and payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/vendors">Go to Vendors</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Mic className="h-6 w-6" />
                Manage Performances
            </CardTitle>
            <CardDescription>
                Review and manage performance applications for events.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/performances">Go to Performances</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Volunteer Hours
            </CardTitle>
            <CardDescription>
                Generate and send official confirmation letters for volunteer hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/volunteer-hours">Send Letters</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-6 w-6" />
                Event Check-In
            </CardTitle>
            <CardDescription>
                Scan vendor QR codes and view a live list of check-ins.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/check-in">Open Check-In Tool</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6" />
                Test QR Codes
            </CardTitle>
            <CardDescription>
                Test the end-to-end QR code generation and secure verification flow.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/qr-test">Test System</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" />
                Alpha Testing Plan
            </CardTitle>
            <CardDescription>
                Review the internal pre-launch checklist for developers.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/alpha-testing-plan">View Plan</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-6 w-6" />
                Beta Testing Plan
            </CardTitle>
            <CardDescription>
                Review the pre-launch checklist for all user roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/beta-testing-plan">View Plan</Link>
            </Button>
          </CardContent>
        </card>
      </div>
    </div>
  );
}
