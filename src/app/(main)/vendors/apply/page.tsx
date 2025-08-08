
import type { Metadata } from 'next';
import { ApplicationForm } from '@/components/vendors/application-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Apply for Vendor Booths at Arizona Indian Festivals',
  description: 'Apply for a vendor booth at upcoming Arizona Indian festivals. Showcase your products to the Phoenix Indian community by completing our simple application.',
};

export default function VendorApplyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Apply for Vendor Booths at Arizona Events</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Join our vibrant Arizona Indian festivals and showcase your products to thousands of attendees from the Phoenix Indian community. Please complete the form below to apply for a vendor booth at one of our upcoming events.
        </p>
      </section>
      
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Vendor Application</CardTitle>
            <CardDescription>
              Please complete the following steps to apply for a booth at our next event.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
