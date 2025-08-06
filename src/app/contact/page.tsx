
import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch with PDSCC',
  description: 'Have a question or want to get involved? Contact the PDSCC team. We serve the Phoenix Indian community and welcome your inquiries.',
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Get In Touch
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            We'd love to hear from you. Whether you have a question, suggestion, or just want to say hello, we're here to help.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <ContactForm />
            </div>
            <div className="lg:col-span-1">
               <div className="p-8 border rounded-lg bg-card shadow-md h-full">
                <h3 className="font-headline text-2xl font-bold mb-6">Our Contact Info</h3>
                <div className="space-y-6 text-muted-foreground">
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="font-semibold text-foreground">Email</p>
                            <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline break-all">admin@azpdscc.org</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="font-semibold text-foreground">Phone</p>
                            <a href="tel:6023172239" className="text-primary hover:underline">(602) 317-2239</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 mt-1 text-primary shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="font-semibold text-foreground">Address</p>
                            <p>AZPDSCC Community Lane<br />Buckeye, AZ 85326</p>
                        </div>
                    </div>
                </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
