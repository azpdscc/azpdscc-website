import type { Metadata } from 'next';
import { GeneralRegistrationForm } from '@/components/vendors/general-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Join Our AZ India Vendor Network',
  description: 'Register your business with AZPDSCC to join our network of vendors for AZ India events. Get priority notifications for vendor booths in Arizona.',
};

export default function VendorJoinPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Join Our AZ India Vendor Network</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Register your business to get priority notifications for vendor booths at Arizona events. Become part of our growing community of talented vendors serving AZ Desis.
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
