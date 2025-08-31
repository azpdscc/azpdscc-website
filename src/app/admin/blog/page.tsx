
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogPosts } from '@/services/blog';
import type { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Loader2 } from 'lucide-react';
import { DeleteBlogPostButton } from '@/components/admin/delete-buttons';

export default function ManageBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getBlogPosts()
            .then(setPosts)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Manage Blog Posts</CardTitle>
                        <CardDescription>A list of all blog posts, including drafts and published articles.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/admin/blog/add">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Post
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                                                {post.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{post.author}</TableCell>
                                        <TableCell>{post.date}</TableCell>
                                        <TableCell className="text-right">
                                           <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/blog/edit/${post.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                           </Button>
                                           <DeleteBlogPostButton id={post.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
