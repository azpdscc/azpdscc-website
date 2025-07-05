import { ApplicationForm } from '@/components/vendors/application-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Become a Vendor</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Join our vibrant festivals and showcase your products to thousands of attendees. We offer a variety of booth options to suit your needs.
        </p>
      </section>
      
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Users className="h-10 w-10 text-primary" />
            <p className="text-lg font-semibold text-foreground">
                Join our community of over <span className="font-bold text-primary">1,000+</span> successful vendors!
            </p>
        </div>
      </div>

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
