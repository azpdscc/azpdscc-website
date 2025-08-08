
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduledBlogForm } from '@/components/admin/scheduled-blog-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ManageScheduledBlogPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Schedule a New Blog Post</CardTitle>
                        <CardDescription>
                            Provide a topic and a future publish date. The system will use AI to auto-generate a draft and save it to your main blog list. You can review and edit it there. It will be published automatically on the date you set.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScheduledBlogForm />
                    </CardContent>
                </Card>
                <div className="mt-4 text-center">
                    <Button variant="link" asChild>
                        <Link href="/admin/blog">
                            View all posts (including new drafts)
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
