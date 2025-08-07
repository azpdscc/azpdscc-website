
import Link from 'next/link';
import { getScheduledBlogPosts } from '@/services/scheduled-blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Info, Newspaper } from 'lucide-react';
import { DeleteScheduledBlogPostButton } from '@/components/admin/delete-buttons';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default async function ManageScheduledBlogPage() {
    const posts = await getScheduledBlogPosts();

    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="flex items-center gap-4 mb-8">
                <Button asChild>
                    <Link href="/admin/scheduled-blog/add">
                        <Newspaper className="mr-2 h-4 w-4" />
                        Generate New Blog Draft
                    </Link>
                </Button>
            </div>
            <Alert className="mb-8">
                <Info className="h-4 w-4" />
                <AlertTitle>This page is for legacy scheduled posts only.</AlertTitle>
                <AlertDescription>
                   Use the "Generate New Blog Draft" button above for the new, improved workflow. The table below shows posts from the previous automation system. This system is still functional but the new draft-based workflow is recommended.
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Legacy Automated Posts</CardTitle>
                        <CardDescription>Posts scheduled for automated cron-job based publication.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Scheduled Date</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.scheduledDate}</TableCell>
                                    <TableCell>{post.topic}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'Published' ? 'secondary' : 'default'}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <Button asChild variant="ghost" size="icon">
                                            <Link href={`/admin/scheduled-blog/edit/${post.id}`}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Link>
                                       </Button>
                                       <DeleteScheduledBlogPostButton id={post.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
