
'use client';

import { useState } from 'react';
import type { Event } from '@/lib/types';
import type { EventFormState } from '@/app/admin/events/actions';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateEventDescriptions } from '@/ai/flows/generate-event-descriptions-flow';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarIcon, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { SubmitButton } from './submit-button';

interface EventFormProps {
  event?: Event;
  formAction: (payload: FormData) => void;
  formState: EventFormState;
}

export function EventForm({ event, formAction, formState }: EventFormProps) {
  const isEditing = !!event;
  const [date, setDate] = useState<Date | undefined>(
    event?.date ? parse(event.date, 'MMMM dd, yyyy', new Date()) : undefined
  );
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Use simple state for AI-populated fields to avoid complexity with react-hook-form
  const [description, setDescription] = useState(event?.description || '');
  const [fullDescription, setFullDescription] = useState(event?.fullDescription || '');


  const handleGenerateDescriptions = async () => {
    if (!aiPrompt) {
        setGenerationError("Please enter a prompt first.");
        return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    try {
        const result = await generateEventDescriptions({ prompt: aiPrompt });
        if (result.description && result.fullDescription) {
            setDescription(result.description);
            setFullDescription(result.fullDescription);
        } else {
            throw new Error("Received empty descriptions from AI.");
        }
    } catch (error) {
        console.error("AI Generation failed:", error);
        if (error instanceof Error && (error.message.includes('503') || error.message.toLowerCase().includes('overloaded'))) {
            setGenerationError("The AI model is currently overloaded. Please try again in a few moments.");
        } else {
            setGenerationError("Failed to generate descriptions. Please try again.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="name">Event Name</Label>
        <Input id="name" name="name" defaultValue={event?.name} />
        {formState.errors?.name && <p className="text-sm text-destructive mt-1">{formState.errors.name[0]}</p>}
      </div>
      
      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-4">
         <div>
            <Label htmlFor="date-popover">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-popover"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date && isValid(date) ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input type="hidden" name="date" value={date?.toISOString() ?? ''} />
            {formState.errors?.date && <p className="text-sm text-destructive mt-1">{formState.errors.date[0]}</p>}
         </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" defaultValue={event?.time} placeholder="e.g., 5:00 PM - 10:00 PM" />
          {formState.errors?.time && <p className="text-sm text-destructive mt-1">{formState.errors.time[0]}</p>}
        </div>
      </div>

       {/* Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="locationName">Location Name</Label>
          <Input id="locationName" name="locationName" defaultValue={event?.locationName} placeholder="e.g., Goodyear Ballpark" />
          {formState.errors?.locationName && <p className="text-sm text-destructive mt-1">{formState.errors.locationName[0]}</p>}
        </div>
        <div>
          <Label htmlFor="locationAddress">Location Address</Label>
          <Input id="locationAddress" name="locationAddress" defaultValue={event?.locationAddress} placeholder="e.g., 1933 S Ballpark Way, Goodyear, AZ 85338"/>
          {formState.errors?.locationAddress && <p className="text-sm text-destructive mt-1">{formState.errors.locationAddress[0]}</p>}
        </div>
      </div>

       {/* Image and Category */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" defaultValue={event?.image} placeholder="https://..." />
          {formState.errors?.image && <p className="text-sm text-destructive mt-1">{formState.errors.image[0]}</p>}
        </div>
        <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={event?.category}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Dance">Dance</SelectItem>
                </SelectContent>
            </Select>
             {formState.errors?.category && <p className="text-sm text-destructive mt-1">{formState.errors.category[0]}</p>}
        </div>
      </div>
      
       {/* AI Description Generation */}
      <div className="space-y-2 p-4 border rounded-lg bg-primary/5">
        <Label htmlFor="ai-prompt" className="flex items-center gap-2 font-semibold text-primary">
            <Sparkles className="h-5 w-5" />
            Generate Descriptions with AI
        </Label>
        <Textarea 
          id="ai-prompt" 
          placeholder="e.g., A colorful Holi celebration with music, dancing, and food trucks at Goodyear Ballpark."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
        />
        <Button type="button" variant="secondary" onClick={handleGenerateDescriptions} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate
        </Button>
        {generationError && <p className="text-sm text-destructive mt-1">{generationError}</p>}
      </div>


       {/* Descriptions */}
      <div>
        <Label htmlFor="description">Short Description (for cards)</Label>
        <Textarea 
          id="description" 
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2} />
         {formState.errors?.description && <p className="text-sm text-destructive mt-1">{formState.errors.description[0]}</p>}
      </div>
      <div>
        <Label htmlFor="fullDescription">Full Description (for event page)</Label>
        <Textarea 
          id="fullDescription" 
          name="fullDescription" 
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          rows={6} />
         {formState.errors?.fullDescription && <p className="text-sm text-destructive mt-1">{formState.errors.fullDescription[0]}</p>}
      </div>

      {formState.errors?._form && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form.join(' ')}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton isEditing={isEditing} createText="Create Event" updateText="Update Event" />
        <Button variant="outline" asChild>
          <Link href="/admin/events">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
