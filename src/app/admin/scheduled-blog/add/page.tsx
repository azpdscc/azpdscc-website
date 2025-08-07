
import { ScheduledBlogForm } from '@/components/admin/scheduled-blog-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function AddScheduledBlogPostPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Schedule New Blog Post</CardTitle>
          <CardDescription>Add a topic and image to the queue for automated weekly posting.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduledBlogForm />
        </CardContent>
      </Card>
    </div>
  );
}
