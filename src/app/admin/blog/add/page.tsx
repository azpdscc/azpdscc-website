
import { BlogForm } from '@/components/admin/blog-form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function AddBlogPostPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Blog Post</CardTitle>
          <CardDescription>Use the form below to create a new post. You can use the AI generator to create a draft, then review and save.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm />
        </CardContent>
      </Card>
    </div>
  );
}
