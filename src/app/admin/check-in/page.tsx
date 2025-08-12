
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckInTool } from '@/components/admin/check-in-tool';

function CheckInSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}


export default function CheckInPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Event Check-In</CardTitle>
                    <CardDescription>
                        Use this tool to manage vendor check-ins. You can view the live list or use the scanner to verify QR codes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<CheckInSkeleton />}>
                        <CheckInTool />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

