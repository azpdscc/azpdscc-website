
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarPlus, Users, Handshake, PenSquare, UserCheck, QrCode, Mic, ShoppingCart, Clock, CheckSquare, ShieldCheck, HelpCircle } from 'lucide-react';

const GuideSection = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <section>
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 rounded-lg p-3">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-headline text-2xl font-bold">{title}</h2>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground ml-16">
            {children}
        </div>
    </section>
);


export default function AdminGuidePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Administrator's Guide</CardTitle>
          <CardDescription>
            Welcome to the PDSCC website dashboard. This guide explains each section of the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
            <GuideSection title="Manage Events" icon={CalendarPlus}>
                <p>This is where you control all public event listings.</p>
                <ul>
                    <li><strong>Create:</strong> Add new festivals, community gatherings, or other events. Use the "Generate Descriptions" button to let AI help you write compelling marketing copy.</li>
                    <li><strong>Edit:</strong> Update details for existing events, like changing dates, times, or descriptions.</li>
                    <li><strong>Delete:</strong> Permanently remove an event from the website.</li>
                </ul>
            </GuideSection>

            <Separator />

            <GuideSection title="Manage Team Members" icon={Users}>
                <p>This section controls the "Our Team" display on the <a href="/about" target="_blank">About Us</a> page.</p>
                <ul>
                    <li>Add new members or remove those who are no longer with the team.</li>
                    <li>Update roles, bios, and profile pictures.</li>
                    <li>The <strong>Order</strong> field determines the display sequence on the page (lower numbers appear first).</li>
                </ul>
            </GuideSection>

            <Separator />
            
            <GuideSection title="Manage Sponsors" icon={Handshake}>
                <p>Control the sponsor logos that appear on the <a href="/" target="_blank">Homepage</a> and the <a href="/sponsorship" target="_blank">Sponsorship</a> page.</p>
                <ul>
                    <li>Add new sponsors, including their logo URL, website, and sponsorship level.</li>
                    <li>Update or remove existing sponsors.</li>
                </ul>
            </GuideSection>

            <Separator />

            <GuideSection title="Manage Blog" icon={PenSquare}>
                <p>Create and manage content for the website's <a href="/blog" target="_blank">Blog</a>.</p>
                <ul>
                    <li><strong>AI Content Generator:</strong> Simply provide a topic and the AI will write a full blog post draft for you. Remember to review and edit it before publishing!</li>
                    <li>Set the status to <strong>"Published"</strong> to make a post visible to the public, or keep it as <strong>"Draft"</strong> to hide it.</li>
                </ul>
            </GuideSection>
            
            <Separator />

            <GuideSection title="Manage Vendors" icon={ShoppingCart}>
                 <p>This is the main hub for handling vendor applications for events.</p>
                 <ul>
                    <li>When a vendor applies, their application appears in the "Pending" list.</li>
                    <li>Your treasurer should first verify their Zelle payment in your bank account.</li>
                    <li>Once payment is confirmed, click <strong>"Verify & Send Ticket"</strong>. This marks them as paid and automatically emails them their official ticket with a QR code for check-in.</li>
                </ul>
            </GuideSection>

            <Separator />

             <GuideSection title="Manage Performances" icon={Mic}>
                 <p>Review applications from individuals or groups who want to perform at your events.</p>
                 <ul>
                    <li>View a list of all applicants, their contact info, and what they plan to perform.</li>
                    <li>If they provided an audition link (e.g., YouTube), you can watch it directly from this dashboard to help with your selection process.</li>
                </ul>
            </GuideSection>

             <Separator />

             <GuideSection title="Volunteer Hours" icon={Clock}>
                 <p>Generate and send official confirmation letters for volunteers who need proof of their service hours for school or work.</p>
                 <ul>
                    <li>Fill in the volunteer's details, the event information, and the hours they served.</li>
                    <li>The system will automatically generate a professional letter and email it directly to the volunteer, with a copy sent to the admin email for your records.</li>
                </ul>
            </GuideSection>
            
            <Separator />

             <GuideSection title="Event Check-In" icon={UserCheck}>
                 <p>This is the tool for event day staff to manage vendor check-ins efficiently.</p>
                 <ul>
                    <li><strong>Live List:</strong> View a real-time dashboard of all registered vendors and their check-in status.</li>
                    <li><strong>Scan QR Code:</strong> Use a mobile device's camera to scan the QR code from the vendor's ticket email. This instantly brings up their details and allows for one-click check-in.</li>
                 </ul>
            </GuideSection>


        </CardContent>
      </Card>
    </div>
  );
}
