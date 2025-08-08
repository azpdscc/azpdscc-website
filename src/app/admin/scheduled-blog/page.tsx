
import { getScheduledBlogPosts } from '@/services/scheduled-blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertTriangle, Edit } from 'lucide-react';
import { ScheduledBlogForm } from '@/components/admin/scheduled-blog-form';
import { DeleteScheduledPostButton } from '@/components/admin/delete-buttons';
import Link from 'next/link';

export default async function ManageScheduledBlogPage() {
    const posts = await getScheduledBlogPosts();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Schedule a New Post</CardTitle>
                            <CardDescription>
                                Provide a topic. The system will auto-generate a draft for you to review, approve, and schedule.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScheduledBlogForm />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-headline text-2xl">Scheduled Posts</CardTitle>
                                <CardDescription>A list of all scheduled posts.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Publish Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">{post.title}</TableCell>
                                            <TableCell>{post.publishDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    post.status === 'Processed' ? 'default' : 
                                                    post.status === 'Error' ? 'destructive' : 'secondary'
                                                }>
                                                    {post.status === 'Processed' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                                    {post.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                                                    {post.status === 'Error' && <AlertTriangle className="mr-1 h-3 w-3" />}
                                                    {post.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {post.generatedPostId && (
                                                    <Button asChild variant="ghost" size="icon">
                                                        <Link href={`/admin/blog/edit/${post.generatedPostId}`}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">View & Approve</span>
                                                        </Link>
                                                    </Button>
                                                )}
                                               <DeleteScheduledPostButton id={post.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
