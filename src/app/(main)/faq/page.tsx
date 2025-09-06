
import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroImage } from '@/components/layout/hero-image';
import { Separator } from '@/components/ui/separator';
import { Handshake, HelpCircle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | PDSCC',
  description: 'Find answers to common questions about PDSCC events, vendors, volunteering, and our mission to serve the Phoenix Punjabi Indian community.',
};

const faqData = [
  {
    category: 'General Questions',
    questions: [
      {
        question: 'What is PDSCC?',
        answer: 'The Phoenix Desi Sports and Cultural Club (PDSCC) is a 501(c)(3) non-profit organization dedicated to celebrating and preserving North Indian culture through festivals, sports, and community events for the Phoenix Punjabi Indian community and AZ Desis.',
      },
      {
        question: 'How can I get involved?',
        answer: 'There are many ways to get involved! You can <Link href="/volunteer">volunteer</Link> your time, <Link href="/donate">make a donation</Link>, <Link href="/sponsorship">become a sponsor</Link>, or simply attend one of our <Link href="/events">vibrant events</Link>. We welcome everyone to join our community.',
      },
       {
        question: 'How can I stay updated on upcoming events?',
        answer: 'The best way is to visit our <Link href="/events">Events page</Link> regularly and subscribe to our newsletter at the bottom of our website. We also post updates on our social media channels.',
      },
    ],
  },
  {
    category: 'For Vendors',
    questions: [
      {
        question: 'How do I become a vendor at an event?',
        answer: 'You can apply for a booth at our upcoming festivals through our <Link href="/vendors/apply">Vendor Application page</Link>. If applications are closed, you can <Link href="/vendors/join">join our general vendor network</Link> to be notified of future opportunities.',
      },
      {
        question: 'What is the cost of a vendor booth?',
        answer: 'Booth prices vary depending on the event and the size of the booth. Our application form provides detailed options, such as a "10x10 Booth (Own Canopy)" or "10x10 Booth (Our Canopy)" with corresponding prices.',
      },
      {
        question: 'When should I arrive to set up my booth?',
        answer: 'We generally require vendors to arrive and check in at least 2 hours before the event start time to ensure a smooth setup process. Specific details will be provided in your vendor confirmation email.',
      },
    ],
  },
  {
    category: 'For Performers',
    questions: [
      {
        question: 'How can I apply to perform at a PDSCC event?',
        answer: 'We are always looking for talented individuals and groups! You can apply on our <Link href="/perform">Performers page</Link>. Applications for our major events, like Vaisakhi and Teeyan, typically open about 90 days before the event date.',
      },
      {
        question: 'What happens after I submit my performance application?',
        answer: 'Our cultural team carefully reviews all applications. You will be contacted directly if your performance is selected for the event. Thank you for your interest!',
      },
    ],
  },
  {
    category: 'For Sponsors',
    questions: [
       {
        question: 'What sponsorship opportunities are available?',
        answer: 'We offer several sponsorship packages, including Diamond, Gold, Silver, and Bronze tiers, each with unique benefits. Please visit our <Link href="/sponsorship">Sponsorship page</Link> for more details.',
      },
      {
        question: 'How can my company become a sponsor?',
        answer: 'To become a sponsor, please fill out the inquiry form on our <Link href="/sponsorship">Sponsorship page</Link>, and our partnership team will get in touch with you to discuss the opportunities.',
      },
    ]
  }
];

const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
    <AccordionItem value={question}>
        <AccordionTrigger className="text-left font-bold">{question}</AccordionTrigger>
        <AccordionContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            <p dangerouslySetInnerHTML={{ __html: answer.replace(/<Link/g, '<a').replace(/<\/Link>/g, '</a>').replace(/href/g, 'class="text-primary hover:underline" href') }} />
        </AccordionContent>
    </AccordionItem>
);

export default function FaqPage() {
  return (
    <div className="bg-background">
      <section className="relative h-auto min-h-[200px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl font-bold !text-primary-foreground drop-shadow-sm">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center font-headline text-3xl">Find Your Answer</CardTitle>
                <CardDescription className="text-center">Browse through the categories to find answers to common questions.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {faqData.map((category) => (
                    <div key={category.category} className="mb-12">
                        <h2 className="font-headline text-2xl font-bold mb-4 pb-2 border-b">{category.category}</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {category.questions.map((q) => (
                                <FaqItem key={q.question} question={q.question} answer={q.answer} />
                            ))}
                        </Accordion>
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>

           <Separator className="my-16" />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="flex flex-col items-center p-6 bg-card">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <HelpCircle className="h-10 w-10 text-primary shrink-0" strokeWidth={1.5}/>
                </div>
                <p className="text-base text-muted-foreground">
                    Our FAQ section is designed to provide quick and clear answers to your most common inquiries. We are dedicated to making your experience with PDSCC as smooth as possible.
                </p>
            </Card>
            <Card className="flex flex-col items-center p-6 bg-card">
                <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Users className="h-10 w-10 text-primary shrink-0" strokeWidth={1.5}/>
                </div>
                <p className="text-base text-muted-foreground">
                    We regularly update this page based on feedback from our community. Find information about our events, how to get involved as a vendor or volunteer, and learn more about our mission.
                </p>
            </Card>
             <Card className="flex flex-col items-center p-6 bg-card">
                 <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Handshake className="h-10 w-10 text-primary shrink-0" strokeWidth={1.5}/>
                </div>
                <p className="text-base text-muted-foreground">
                   If you can't find the answer you're looking for, please don't hesitate to reach out to our team directly through our contact page. We're here to help!
                </p>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
