
import { getScheduledBlogPostById } from '@/services/scheduled-blog';
import { ScheduledBlogForm } from '@/components/admin/scheduled-blog-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function EditScheduledBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getScheduledBlogPostById(params.id);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Scheduled Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduledBlogForm post={post} />
        </CardContent>
      </Card>
    </div>
  );
}
