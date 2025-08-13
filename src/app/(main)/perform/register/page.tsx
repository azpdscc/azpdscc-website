
import type { Metadata } from 'next';
import { PerformanceRegistrationForm } from '@/components/performers/registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Performance Registration | PDSCC Events',
  description: 'Apply to perform at our next Arizona Punjabi Indian festival. Complete our registration form to be considered for a spot on our stage.',
};

export default function PerformanceRegistrationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Performance Registration</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Thank you for your interest in performing! Please complete the form below. Our cultural team will review all applications and contact selected performers.
        </p>
      </section>
      
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Application Form</CardTitle>
            <CardDescription>
              Provide as much detail as possible to help our team with the selection process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceRegistrationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
