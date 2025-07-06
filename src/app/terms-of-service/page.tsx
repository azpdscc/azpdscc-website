
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | AZPDSCC',
  description: 'Please read our Terms of Service carefully before using the AZPDSCC website and its services.',
  robots: {
    index: false, // It's often good practice to noindex legal pages
  }
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                  <FileText className="h-10 w-10 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline text-4xl">Terms of Service</CardTitle>
                <p className="text-muted-foreground">Last Updated: October 18, 2024</p>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
                 <Alert variant="destructive">
                  <AlertTitle>Template Document</AlertTitle>
                  <AlertDescription>
                    This is a template for Terms of Service and should not be considered legal advice. Please consult with a legal professional to tailor this document to your specific needs.
                  </AlertDescription>
                </Alert>

                <h2 className="font-headline text-2xl text-foreground">1. Agreement to Terms</h2>
                <p>
                  By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">2. User Responsibilities</h2>
                <p>
                  You agree to use our services responsibly and to not use them for any unlawful purpose. You are responsible for any content you post and for maintaining the confidentiality of any account information.
                </p>

                <h2 className="font-headline text-2xl text-foreground">3. Intellectual Property</h2>
                <p>
                   The service and its original content, features, and functionality are and will remain the exclusive property of AZPDSCC and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AZPDSCC.
                </p>

                <h2 className="font-headline text-2xl text-foreground">4. Termination</h2>
                <p>
                  We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2 className="font-headline text-2xl text-foreground">5. Limitation of Liability</h2>
                <p>
                  In no event shall AZPDSCC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">6. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of Arizona, United States, without regard to its conflict of law provisions.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">7. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
