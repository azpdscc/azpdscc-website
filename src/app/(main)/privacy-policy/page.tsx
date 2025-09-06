
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | PDSCC',
  description: 'Learn how PDSCC collects, uses, and protects your personal information when you use our website and services.',
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
                <h1 className="font-headline text-4xl font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground">Last Updated: August 1, 2025</p>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
                <p>
                  Phoenix Desi Sports and Cultural Club ("PDSCC," "we," "us," "our") is committed to protecting the privacy of our members, donors, volunteers, and website visitors. This Privacy Policy explains what information we collect, how we use and share it, and the choices you have about your information.
                </p>
                <p>
                  This policy applies to all information collected through our website azpdscc.org, at our events, and through any other interaction with PDSCC.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">1. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul>
                  <li><strong>Personal Identification Information:</strong> Name, email address, phone number, mailing address, date of birth, and emergency contact information. We collect this when you register for membership, sign up for an event, subscribe to our newsletter, or make a donation.</li>
                  <li><strong>Donation Information:</strong> When you make a donation, we collect information necessary to process the transaction, such as your name, billing address, and donation amount. All payment transactions are processed through a secure third-party payment processor (e.g., PayPal, Stripe). We do not store your credit card details on our servers.</li>
                  <li><strong>Photographs and Videos:</strong> We frequently take photographs and record videos at our sports and cultural events. Your participation in events constitutes consent to be photographed and recorded.</li>
                  <li><strong>Technical &amp; Usage Data:</strong> When you visit our website, we may automatically collect information such as your IP address, browser type, operating system, and pages you visited. We use this data to analyze trends and improve our website experience.</li>
                </ul>
                
                <h2 className="font-headline text-2xl text-foreground">2. How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul>
                  <li><strong>To Operate Our Organization:</strong> To manage your membership, register you for events and leagues, and communicate with you about club activities.</li>
                  <li><strong>To Process Donations:</strong> To process your generous donations, send you tax-deductible receipts as a 501(c)(3) non-profit, and maintain donation records.</li>
                  <li><strong>For Communication:</strong> To send you newsletters, event announcements, and other information related to PDSCC. You may opt out of these communications at any time.</li>
                  <li><strong>For Promotion:</strong> To use photographs and videos from our events on our website, social media channels, and other promotional materials to showcase our community and activities. If you do not wish to be photographed or have your image used, please notify an event organizer.</li>
                  <li><strong>To Improve Our Services:</strong> To analyze website usage and improve our content and offerings.</li>
                  <li><strong>For Safety and Security:</strong> To have emergency contact information on hand during sports activities.</li>
                </ul>

                <h2 className="font-headline text-2xl text-foreground">3. How We Share Your Information</h2>
                <p>We do not sell, trade, or rent your personal information to others. Our Privacy Policy explicitly states that we will not share mobile information with third parties for marketing purposes. We may share your information only in the following ways:</p>
                <ul>
                    <li><strong>With Service Providers:</strong> We may share information with third-party vendors who perform services on our behalf, such as payment processors, email marketing providers, and website hosting services. These providers are obligated to protect your information and use it only for the services they provide to us.</li>
                    <li><strong>As Required by Law:</strong> We may disclose your information if required to do so by law or in response to a subpoena, court order, or other governmental request.</li>
                </ul>

                <h2 className="font-headline text-2xl text-foreground">4. Data Security</h2>
                <p>
                  We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                </p>

                <h2 className="font-headline text-2xl text-foreground">5. Children's Privacy</h2>
                <p>
                  We are committed to protecting the privacy of children. We do not knowingly collect personal information from children under the age of 13 without obtaining verifiable parental consent. If you are a parent or guardian and believe your child has provided us with information without your consent, please contact us immediately.
                </p>

                <h2 className="font-headline text-2xl text-foreground">6. Your Rights and Choices</h2>
                <p>You have the right to:</p>
                <ul>
                  <li><strong>Access and Update:</strong> Review and update your personal information by contacting us.</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from our marketing communications by clicking the "unsubscribe" link in our emails or by contacting us.</li>
                </ul>
                
                <h2 className="font-headline text-2xl text-foreground">7. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website. We encourage you to review this policy periodically.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">8. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at: Phoenix Desi Sports and Cultural Club Email: <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a> Website: azpdscc.org
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
