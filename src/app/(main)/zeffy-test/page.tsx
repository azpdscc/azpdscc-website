
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ZeffyTestPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Zeffy Form Test Page</CardTitle>
          <CardDescription>
            This is a test page to preview the embedded Zeffy donation form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{position:'relative', overflow:'hidden', height:'1200px', width:'100%'}}>
            <iframe 
              title='Donation form powered by Zeffy' 
              style={{position: 'absolute', border: 0, top:0, left:0, bottom:0, right:0, width:'100%', height:'100%'}} 
              src='https://www.zeffy.com/embed/donation-form/520c79cb-f491-4e02-bb41-fa9ef5ccca73' 
              allowpaymentrequest="true" 
              allowtransparency="true">
            </iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
