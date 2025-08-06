
import type { Metadata } from 'next';
import { VolunteerForm } from '@/components/volunteer-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Volunteer with AZPDSCC | Phoenix Indian Community',
  description: 'Join our team of dedicated volunteers! Help us organize and run Arizona Indian festivals and support the AZ India community. Sign up today.',
};

export default function VolunteerPage() {
  return (
    <>
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern" />
        <div className="relative z-10 p-4 container mx-auto">
          <div className="mx-auto bg-primary/20 rounded-full p-4 w-fit mb-4 border border-primary-foreground/20">
              <HandHeart className="h-12 w-12 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Become a Volunteer
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Lend your time and talent to a great cause. Volunteers are the backbone of our community events.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Volunteer Sign-Up</CardTitle>
              <CardDescription>
                Please fill out the form below to join our team of amazing volunteers. We appreciate your support!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VolunteerForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
