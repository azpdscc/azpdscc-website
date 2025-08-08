
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckInList } from '@/components/admin/checkin-list';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardSkeleton() {
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

export default function CheckInDashboardPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Suspense fallback={<DashboardSkeleton />}>
                <CheckInList />
            </Suspense>
        </div>
    )
}
