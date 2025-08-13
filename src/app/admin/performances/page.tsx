
'use client';
import { useEffect, useState } from 'react';
import type { PerformanceApplication } from '@/lib/types';
import { getPerformanceApplications } from '@/services/performance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import Link from 'next/link';

export default function ManagePerformancesPage() {
    const [applications, setApplications] = useState<PerformanceApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getPerformanceApplications()
            .then(setApplications)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Manage Performance Applications</CardTitle>
                    <CardDescription>Review and manage all submitted performance applications.</CardDescription>
                </CardHeader>
                <CardContent>
                     {isLoading ? (
                        <p>Loading applications...</p>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Group Name</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Performance Type</TableHead>
                                <TableHead className="text-center">Audition</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.groupName}</TableCell>
                                    <TableCell>{app.event}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{app.contactName}</span>
                                            <a href={`mailto:${app.email}`} className="text-xs text-muted-foreground hover:underline">{app.email}</a>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{app.performanceType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {app.auditionLink ? (
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={app.auditionLink} target="_blank" rel="noopener noreferrer">
                                                    <Video className="mr-2 h-4 w-4" />
                                                    Watch
                                                </Link>
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">N/A</span>
                                        )}
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
