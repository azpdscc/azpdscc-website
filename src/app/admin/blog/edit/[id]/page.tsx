
import { getBlogPostById } from '@/services/blog';
import { BlogForm } from '@/components/admin/blog-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(params.id);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm post={post} />
        </CardContent>
      </Card>
    </div>
  );
}
