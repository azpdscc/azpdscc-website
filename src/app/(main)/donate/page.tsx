
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart, Award, Paintbrush, Users, Heart } from 'lucide-react';
import { DonationForm } from '@/components/donate/donation-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Banknote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Donate or Volunteer | Support the Phoenix Indian Community',
  description: 'Support PDSCC by making a donation or volunteering your time. Your contribution helps us host Arizona Indian festivals and support the AZ India community.',
};

export default function DonatePage() {
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
                    <Tabs defaultValue="zeffy" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="zeffy">
                                <CreditCard className="mr-2" />
                                Card, Apple/Google Pay
                            </TabsTrigger>
                            <TabsTrigger value="zelle">
                                <Banknote className="mr-2" />
                                Zelle
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="zeffy" className="pt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Donate via Zeffy</CardTitle>
                                    <CardDescription>Use your credit card, debit card, or other methods through our secure Zeffy portal.</CardDescription>
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
                        </TabsContent>
                        <TabsContent value="zelle" className="pt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Donate via Zelle</CardTitle>
                                    <CardDescription>Follow the instructions below to make a direct donation using Zelle.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DonationForm />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
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
