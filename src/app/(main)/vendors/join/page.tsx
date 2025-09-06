
import type { Metadata } from 'next';
import { GeneralRegistrationForm } from '@/components/vendors/general-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Join Our AZ Punjabi India Vendor Network',
  description: 'Join our AZ Punjabi India vendor network by registering your business. Get priority access to vendor booths at Arizona festivals and connect with AZ Desis.',
};

export default function VendorJoinPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Join Our AZ Punjabi India Vendor Network</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Register your business to get priority notifications for vendor booths at Arizona events. Become part of our growing community of talented vendors serving AZ Desis. By joining our network, you'll be the first to know when applications open for major festivals like Vaisakhi Mela and Teeyan Da Mela, giving you an advantage in securing a spot.
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">General Vendor Registration</CardTitle>
            <CardDescription>
              Tell us a bit about your business. This information will help us match you with the right events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GeneralRegistrationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
