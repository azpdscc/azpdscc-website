import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarPlus, Users } from 'lucide-react';

export default function VendorsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Partner With Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Showcase your business to a large and engaged audience. We offer opportunities for event-specific booths and a general vendor network for future events.
        </p>
      </section>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-4">
                <CalendarPlus className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="font-headline text-2xl text-center">Apply for an Event Booth</CardTitle>
            <CardDescription className="text-center">
              Have a specific upcoming event in mind? Apply for a booth to sell your products and services.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/vendors/apply">View Upcoming Events & Apply <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
             <div className="flex justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="font-headline text-2xl text-center">Join Our Vendor Network</CardTitle>
            <CardDescription className="text-center">
              Not ready for a specific event? Join our network to be notified of future vendor opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/vendors/join">Register Your Business <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-4xl mx-auto mt-12">
        <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Users className="h-10 w-10 text-primary" />
            <p className="text-lg font-semibold text-foreground text-center">
                Our community has over <span className="font-bold text-primary">1,000+</span> vendors who have successfully partnered with us!
            </p>
        </div>
      </div>
    </div>
  );
}
