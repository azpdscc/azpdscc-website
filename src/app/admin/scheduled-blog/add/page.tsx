
import { ScheduledBlogForm } from '@/components/admin/scheduled-blog-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function AddScheduledBlogPostPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generate New Blog Post Draft</CardTitle>
          <CardDescription>Enter a topic to generate a new blog post. It will be saved as a draft in the main blog manager, where you can review, edit, and publish it.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduledBlogForm />
        </CardContent>
      </Card>
    </div>
  );
}
