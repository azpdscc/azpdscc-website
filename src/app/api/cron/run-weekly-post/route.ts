
import { NextResponse } from 'next/server';
import { runAutomatedWeeklyPost } from '@/ai/flows/run-automated-weekly-post-flow';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Simple secret key authentication
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron job triggered: Running automated weekly post...');
    const result = await runAutomatedWeeklyPost();
    console.log('Cron job finished:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
