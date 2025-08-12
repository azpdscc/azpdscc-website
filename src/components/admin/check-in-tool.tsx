
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckInList } from '@/components/admin/checkin-list';
import { QrScanner } from '@/components/admin/qr-scanner';
import { QrCode, ListChecks } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

function QrScannerFallback() {
    return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg h-96">
            <Skeleton className="h-64 w-64" />
            <Skeleton className="h-4 w-48 mt-4" />
        </div>
    );
}

export function CheckInTool() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures that the component only renders on the client,
    // which is necessary for the QR scanner to access the camera.
    setIsClient(true);
  }, []);

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">
            <ListChecks className="mr-2" />
            Live List
        </TabsTrigger>
        <TabsTrigger value="scanner">
            <QrCode className="mr-2" />
            Scan QR Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="list" className="mt-4">
        <CheckInList />
      </TabsContent>
      <TabsContent value="scanner" className="mt-4">
        {isClient ? (
            <Suspense fallback={<QrScannerFallback />}>
                <QrScanner />
            </Suspense>
        ) : (
            <QrScannerFallback />
        )}
      </TabsContent>
    </Tabs>
  );
}
