import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Heart, Users, HandHeart, Award, Paintbrush } from 'lucide-react';

export default function DonatePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-white bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-orange-500/20" />
        <div className="relative z-10 p-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-white drop-shadow-lg">
            Support Our Mission
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl !text-white/90 drop-shadow-md">
            Your contribution empowers us to preserve culture, celebrate heritage, and strengthen our community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl">
              <Tabs defaultValue="one-time" className="w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Make a Donation</CardTitle>
                    <CardDescription>Choose an amount and frequency that works for you.</CardDescription>
                    <TabsList className="grid w-full grid-cols-2 mt-4">
                        <TabsTrigger value="one-time">One-Time</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <TabsContent value="one-time">
                    <CardContent className="space-y-6">
                        <Label className="font-semibold">Select an amount (USD)</Label>
                        <ToggleGroup type="single" defaultValue="50" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ToggleGroupItem value="25" aria-label="Donate $25" className="h-16 text-xl">$25</ToggleGroupItem>
                            <ToggleGroupItem value="50" aria-label="Donate $50" className="h-16 text-xl">$50</ToggleGroupItem>
                            <ToggleGroupItem value="100" aria-label="Donate $100" className="h-16 text-xl">$100</ToggleGroupItem>
                            <ToggleGroupItem value="250" aria-label="Donate $250" className="h-16 text-xl">$250</ToggleGroupItem>
                        </ToggleGroup>
                        <div className="relative">
                            <Label htmlFor="custom-amount-one-time" className="sr-only">Custom Amount</Label>
                            <Input id="custom-amount-one-time" type="number" placeholder="Or enter a custom amount" className="pl-8" />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full">Donate Now</Button>
                    </CardFooter>
                </TabsContent>
                <TabsContent value="monthly">
                    <CardContent className="space-y-6">
                        <Label className="font-semibold">Select a monthly amount (USD)</Label>
                        <ToggleGroup type="single" defaultValue="25" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ToggleGroupItem value="10" aria-label="Donate $10 monthly" className="h-16 text-xl">$10</ToggleGroupItem>
                            <ToggleGroupItem value="25" aria-label="Donate $25 monthly" className="h-16 text-xl">$25</ToggleGroupItem>
                            <ToggleGroupItem value="50" aria-label="Donate $50 monthly" className="h-16 text-xl">$50</ToggleGroupItem>
                            <ToggleGroupItem value="100" aria-label="Donate $100 monthly" className="h-16 text-xl">$100</ToggleGroupItem>
                        </ToggleGroup>
                        <div className="relative">
                            <Label htmlFor="custom-amount-monthly" className="sr-only">Custom Amount</Label>
                            <Input id="custom-amount-monthly" type="number" placeholder="Or enter a custom amount" className="pl-8" />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full">Become a Monthly Supporter</Button>
                    </CardFooter>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Volunteer Section */}
          <div className="lg:col-span-1">
            <Card className="bg-secondary shadow-lg h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 rounded-full p-4">
                        <HandHeart className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <CardTitle className="font-headline text-center text-3xl">Give the Gift of Time</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-center text-muted-foreground">
                    Volunteers are the heart of our organization. If you'd like to help with events, outreach, or administrative tasks, we'd love to have you.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="default" size="lg" className="w-full">Sign Up to Volunteer</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Where Your Donation Goes</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Every dollar you give helps us create meaningful experiences and support the community.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Award className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Vibrant Festivals</h3>
                    <p className="mt-2 text-muted-foreground">Funding cultural events like Diwali and Holi.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Paintbrush className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Arts & Culture</h3>
                    <p className="mt-2 text-muted-foreground">Supporting local artists and cultural workshops.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-headline text-xl font-semibold">Community Support</h3>
                    <p className="mt-2 text-muted-foreground">Providing resources and outreach programs.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Heart className="h-10 w-10 text-primary" />
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
