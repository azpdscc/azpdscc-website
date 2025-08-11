
'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart, Award, Paintbrush, Users, Heart, CreditCard, Banknote, Check } from 'lucide-react';
import { DonationForm } from '@/components/donate/donation-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// export const metadata: Metadata = {
//   title: 'Donate or Volunteer | Support the Phoenix Indian Community',
//   description: 'Support PDSCC by making a donation or volunteering your time. Your contribution helps us host Arizona Indian festivals and support the AZ India community.',
// };

export default function DonatePage() {
  const [zellePaymentConfirmed, setZellePaymentConfirmed] = useState(false);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Support the Phoenix Indian Community
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Your contribution empowers us to preserve culture, celebrate heritage, and strengthen the Phoenix Indian community and AZ India connections.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Make a Donation</CardTitle>
                    <CardDescription>Choose your preferred way to give. Your generous contribution helps us continue our mission.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="zeffy">
                            <AccordionTrigger className="p-4 bg-secondary rounded-lg text-lg font-bold hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                    <span>Card, Apple/Google Pay</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Donate via Zeffy</CardTitle>
                                        <CardDescription>Use your credit card, debit card, or other methods through our secure Zeffy portal (a 100% free platform for non-profits).</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div style={{position:'relative',overflow:'hidden',height:'1200px',width:'100%'}}>
                                            <iframe 
                                            title='Donation form powered by Zeffy' 
                                            style={{position: 'absolute', border: 0, top:0, left:0, bottom:0, right:0, width:'100%', height:'100%'}} 
                                            src='https://www.zeffy.com/embed/donation-form/520c79cb-f491-4e02-bb41-fa9ef5ccca73' 
                                            allowpaymentrequest="true" 
                                            allowtransparency="true">
                                            </iframe>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="zelle">
                             <AccordionTrigger className="p-4 bg-secondary rounded-lg text-lg font-bold hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <Banknote className="h-6 w-6 text-primary" />
                                    <span>Zelle</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>Donate via Zelle</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="p-4 border-2 border-primary/50 rounded-lg bg-primary/5">
                                            <h3 className="font-headline font-bold text-lg text-primary">Instructions</h3>
                                            <p className="mt-2 text-muted-foreground">
                                                1. Please send your donation via Zelle to:
                                                <span className="block text-xl font-mono bg-background p-2 rounded-md text-center my-2">admin@azpdscc.org</span>
                                                2. After sending, check the box below and fill out the form so we can match your payment and send you a receipt.
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="zelle-sent" onCheckedChange={(checked) => setZellePaymentConfirmed(checked as boolean)} />
                                            <Label htmlFor="zelle-sent" className="font-bold text-lg">
                                                Yes, I have sent the payment via Zelle.
                                            </Label>
                                        </div>

                                        {zellePaymentConfirmed && <DonationForm />}

                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="check">
                            <AccordionTrigger className="p-4 bg-secondary rounded-lg text-lg font-bold hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <Check className="h-6 w-6 text-primary" />
                                    <span>Pay by Check</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Donate by Check</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 border-2 border-primary/50 rounded-lg bg-primary/5 space-y-4">
                                            <div>
                                                <p className="font-semibold text-foreground">Please make checks payable to:</p>
                                                <p className="text-xl font-mono bg-background p-2 rounded-md text-center my-2">PDSCC</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">Mail your check to:</p>
                                                <address className="not-italic text-xl font-mono bg-background p-2 rounded-md text-center my-2">
                                                    2259 S Hughes Drive<br />
                                                    Buckeye, AZ 85326
                                                </address>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </main>

      {/* Impact Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Where Your Donation Goes</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Every dollar you give helps us create meaningful experiences and support the community.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Award className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">
                      <Link href="/events" className="hover:underline">Vibrant Festivals</Link>
                    </h3>
                    <p className="mt-2 text-muted-foreground">Funding cultural events like Diwali and Holi.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Paintbrush className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Arts & Culture</h3>
                    <p className="mt-2 text-muted-foreground">Supporting local artists and cultural workshops.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Users className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Community Support</h3>
                    <p className="mt-2 text-muted-foreground">Providing resources and outreach programs.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Heart className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Future Generations</h3>
                    <p className="mt-2 text-muted-foreground">Ensuring our heritage thrives for years to come.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
