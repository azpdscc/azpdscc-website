
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AutomatedPostGenerator } from '@/components/admin/automated-post-generator';

export default function AutomatedPostsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Test Automated Posts</CardTitle>
          <CardDescription>
            This page is for safely testing the automated blog post generation feature. Clicking the button below will run the AI flow to generate a single new post on a random topic and save it as a "Draft".
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">You can verify the post was created by checking the main "Manage Blog Posts" page afterward.</p>
            <AutomatedPostGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
