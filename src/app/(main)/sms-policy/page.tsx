
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SMS Messaging Policy | PDSCC',
  description: 'Review the terms and consent for receiving SMS messages from PDSCC for event updates and raffle information.',
  robots: {
    index: false, // Often, these types of policy pages are not indexed in search engines
  }
};

export default function SmsPolicyPage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                  <MessageSquareText className="h-10 w-10 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline text-4xl">SMS Messaging Policy & Terms</CardTitle>
                <p className="text-muted-foreground">Proof of Consent Documentation</p>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
                
                <h2 className="font-headline text-2xl text-foreground">1. Program Description</h2>
                <p>
                  PDSCC offers a mobile messaging program (the "Program"), which you agree to use and participate in subject to these Mobile Messaging Terms and Conditions and Privacy Policy (the “Agreement”). By opting in to or participating in any of our Programs, you accept and agree to these terms and conditions.
                </p>
                <p>
                  The program is used to send SMS messages related to event reminders, raffle ticket information, and critical updates about PDSCC activities.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">2. User Opt-In</h2>
                <p>
                  A user provides express written consent to receive automated promotional and informational text messages from PDSCC by submitting their phone number through a form on our website. This consent is obtained via a checkbox that the user must explicitly select, which reads:
                </p>
                <blockquote>
                  "I agree to receive SMS messages from PDSCC about events and raffles. Message and data rates may apply."
                </blockquote>
                <p>
                    Consent is not a condition of any purchase or service.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">3. User Opt-Out</h2>
                <p>
                  You can cancel the SMS service at any time. To opt-out, text "STOP" to the phone number from which you are receiving messages. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.
                </p>

                <h2 className="font-headline text-2xl text-foreground">4. Help & Support</h2>
                <p>
                  If you are experiencing issues with the messaging program you can get help directly by texting "HELP" to the number you received messages from, or by emailing us at <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a>.
                </p>

                <h2 className="font-headline text-2xl text-foreground">5. Message Frequency & Cost</h2>
                <p>
                  Message frequency will vary depending on event schedules and program updates. As always, message and data rates may apply for any messages sent to you from us and to us from you. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.
                </p>

                <h2 className="font-headline text-2xl text-foreground">6. Contact Us</h2>
                <p>
                  For any questions about this policy, please contact us at: <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
