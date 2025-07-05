'use client';

import { useState } from 'react';
import { eventRecommendations } from '@/ai/flows/event-recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wand2, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { events } from '@/lib/data';
import { EventCard } from './event-card';

export function AiRecommendations() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const popularEvents = events.slice(0, 3).map(e => e.name);
      const userPreferences = ['Dance', 'Music', 'Food'];

      const result = await eventRecommendations({
        isLoggedIn,
        userPreferences: isLoggedIn ? userPreferences : [],
        popularEvents,
        eventsNearYou: [], // Placeholder
        locationAvailable: false,
      });

      setRecommendations(result.recommendedEvents);
    } catch (err) {
      setError('Could not fetch AI recommendations. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const recommendedEventsData = events.filter(event => recommendations.includes(event.name));

  return (
    <Card className="bg-primary/5 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Recommended Events for You</CardTitle>
        </div>
        <p className="text-muted-foreground">Let our AI find events you&apos;ll love. Toggle login status to see different recommendations.</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-background mb-6">
          <div className="flex items-center space-x-2">
            <Switch id="login-status" checked={isLoggedIn} onCheckedChange={setIsLoggedIn} />
            <Label htmlFor="login-status" className="font-medium">
              Simulate Login: <span className={isLoggedIn ? 'text-green-600' : 'text-red-600'}>{isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
            </Label>
          </div>
          <Button onClick={getRecommendations} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              'Get AI Recommendations'
            )}
          </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {recommendations.length > 0 && recommendedEventsData.length > 0 && (
          <div className="mt-4">
            <h3 className="font-headline text-lg font-semibold mb-4">Here are your personalized suggestions:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedEventsData.map(event => (
                    <div key={event.id} className="relative">
                        <EventCard event={event} />
                        <div className="absolute top-0 -right-2 -rotate-12 bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded shadow-lg transform">
                            AI Pick
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
        
        {!isLoading && recommendations.length === 0 && !error && (
            <p className="text-muted-foreground text-center py-4">Click the button to get your event recommendations!</p>
        )}
      </CardContent>
    </Card>
  );
}
