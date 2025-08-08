
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { VendorApplication } from '@/lib/types';
import { getVendorApplications } from '@/services/vendorApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CircleOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

function TableSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export function CheckInList() {
    const [applications, setApplications] = useState<VendorApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApplications = () => {
        setIsLoading(true);
        getVendorApplications()
            .then(setApplications)
            .finally(() => setIsLoading(false));
    };

    // Initial fetch
    useEffect(() => {
        fetchApplications();
    }, []);

    const checkedInCount = applications.filter(app => app.checkInStatus === 'checkedIn').length;
    const pendingCount = applications.length - checkedInCount;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl">Vendor Check-In Dashboard</CardTitle>
                        <CardDescription>
                            A real-time list of all vendor check-ins. {checkedInCount} checked in, {pendingCount} pending.
                        </CardDescription>
                    </div>
                    <Button onClick={fetchApplications} disabled={isLoading} variant="outline" size="sm" className="mt-4 sm:mt-0">
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <TableSkeleton />
                 ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vendor Name</TableHead>
                                <TableHead>Booth Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Check-In Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell>{app.boothType}</TableCell>
                                    <TableCell>
                                        <Badge variant={app.checkInStatus === 'checkedIn' ? 'default' : 'secondary'} className={app.checkInStatus === 'checkedIn' ? 'bg-green-100 text-green-800' : ''}>
                                             {app.checkInStatus === 'checkedIn' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <CircleOff className="mr-1 h-3 w-3" />}
                                            {app.checkInStatus === 'checkedIn' ? 'Checked-In' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {app.checkedInAt ? format(new Date(app.checkedInAt), 'p') : '—'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 )}
            </CardContent>
        </Card>
    );
}
