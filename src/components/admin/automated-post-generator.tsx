
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { runAutomatedWeeklyPost } from '@/ai/flows/run-automated-weekly-post-flow';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function AutomatedPostGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<{ id: string, title: string } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedPost(null);
    try {
      const result = await runAutomatedWeeklyPost();
      if (result.success && result.postId) {
        setGeneratedPost({ id: result.postId, title: result.postTitle || 'Untitled Post' });
        toast({
          title: "Success!",
          description: `Draft post "${result.postTitle}" was created.`,
        });
      } else {
        throw new Error(result.message || 'The flow did not return a post ID.');
      }
    } catch (error) {
      console.error("Failed to generate post:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: 'destructive',
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Manually Generate a New Blog Post'
        )}
      </Button>

      {generatedPost && (
        <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 !text-green-600" />
            <AlertTitle className="text-green-800">Draft Created Successfully</AlertTitle>
            <AlertDescription className="text-green-700">
                A new draft post titled <span className="font-semibold">"{generatedPost.title}"</span> has been generated.
                <Button variant="link" asChild className="p-0 h-auto ml-1 text-green-800">
                    <Link href="/admin/blog">Review it on the blog management page.</Link>
                </Button>
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
