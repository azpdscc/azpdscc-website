
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | AZPDSCC',
  description: 'Learn how AZPDSCC collects, uses, and protects your personal information when you use our website and services.',
  robots: {
    index: false, // It's often good practice to noindex legal pages
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                  <Shield className="h-10 w-10 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline text-4xl">Privacy Policy</CardTitle>
                <p className="text-muted-foreground">Last Updated: October 18, 2024</p>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
                <Alert variant="destructive">
                  <AlertTitle>Template Document</AlertTitle>
                  <AlertDescription>
                    This is a template privacy policy and should not be considered legal advice. Please consult with a legal professional to ensure this policy meets the specific needs and legal requirements of your organization.
                  </AlertDescription>
                </Alert>

                <p>
                  AZPDSCC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.azpdscc.org, use our services, or interact with us.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">1. Information We Collect</h2>
                <p>
                  We may collect personal information that you voluntarily provide to us when you register for an event, make a donation, sign up to be a vendor, contact us, or otherwise interact with our services. This information may include your name, email address, phone number, and payment information.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                </p>
                <ul>
                  <li>Process your registrations, donations, and applications.</li>
                  <li>Communicate with you about our events and activities.</li>
                  <li>Send you administrative information, such as security alerts and support messages.</li>
                  <li>Improve our website and services.</li>
                  <li>Comply with legal obligations.</li>
                </ul>

                <h2 className="font-headline text-2xl text-foreground">3. Information Sharing</h2>
                <p>
                  We do not sell or rent your personal information to third parties. We may share your information with trusted third-party service providers who perform services for us or on our behalf, such as payment processing (e.g., Stripe, Zelle), email delivery, and hosting services.
                </p>

                <h2 className="font-headline text-2xl text-foreground">4. Data Security</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">5. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">6. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
