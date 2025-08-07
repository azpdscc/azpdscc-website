
import Link from 'next/link';
import { getScheduledBlogPosts } from '@/services/scheduled-blog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit } from 'lucide-react';
import { DeleteScheduledBlogPostButton } from '@/components/admin/delete-buttons';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default async function ManageScheduledBlogPage() {
    const posts = await getScheduledBlogPosts();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Alert className="mb-8">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Automation Hub</AlertTitle>
                <AlertDescription>
                   This page lists all your pre-scheduled blog posts. The system will automatically pick the next "Pending" post on its scheduled date, generate the content, and publish it. To trigger this process, you need to set up a scheduler (cron job) to run the `runAutomatedWeeklyPost` flow.
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Manage Scheduled Blog Posts</CardTitle>
                        <CardDescription>A list of all scheduled blog posts for automated publication.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/admin/scheduled-blog/add">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Schedule Post
                            </Link>
                        </Button>
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
