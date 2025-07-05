import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export default function VendorDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Vendor Dashboard</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          View the status of your applications and manage your booth details here.
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-8">
          <AlertTitle className="font-bold">This is a simulated page.</AlertTitle>
          <AlertDescription>
            In a full application, this dashboard would show real-time data for a logged-in vendor.
          </AlertDescription>
        </Alert>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">My Applications</CardTitle>
            <CardDescription>
              Status of your recent vendor applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="font-headline font-semibold text-lg">Diwali Festival of Lights 2024</h3>
                  <p className="text-sm text-muted-foreground">Booth Type: Food Stall</p>
                  <p className="text-sm text-muted-foreground">Submitted on: October 1, 2024</p>
                </div>
                <Badge className="mt-4 sm:mt-0 bg-green-100 text-green-800 hover:bg-green-100 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Confirmed
                </Badge>
              </div>
            </div>
             <div className="border rounded-lg p-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h3 className="font-headline font-semibold text-lg">Holi Festival of Colors 2025</h3>
                  <p className="text-sm text-muted-foreground">Booth Type: 10x10</p>
                  <p className="text-sm text-muted-foreground">Submitted on: September 15, 2024</p>
                </div>
                <Badge variant="secondary">
                  Pending Payment
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
