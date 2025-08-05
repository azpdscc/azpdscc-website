
'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateEventDescriptions } from '@/ai/flows/generate-event-descriptions-flow';
import type { Event, EventCategory } from '@/lib/types';
import { type EventFormState } from '@/app/admin/events/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CalendarIcon, Sparkles, AlertCircle } from 'lucide-react';

interface EventFormProps {
  type: 'Add' | 'Edit';
  event?: Event;
  action: (payload: FormData) => void;
  formState: EventFormState;
}

function SubmitButton({ type }: { type: 'Add' | 'Edit' }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {type} Event
        </Button>
    )
}

function FormErrors({ errors }: { errors?: string[] }) {
    if (!errors || errors.length === 0) return null;
    return <p className="text-sm font-medium text-destructive mt-1">{errors.join(', ')}</p>;
}


export function EventForm({ type, event, action, formState }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  // States for controlled components
  const [date, setDate] = useState<Date | undefined>(event?.date ? new Date(event.date) : new Date());
  const [description, setDescription] = useState(event?.description || '');
  const [fullDescription, setFullDescription] = useState(event?.fullDescription || '');

  const handleGenerateDescriptions = async () => {
    if (!aiPrompt) {
        toast({
            variant: 'destructive',
            title: "Prompt is empty",
            description: "Please enter some details about the event to generate descriptions.",
        });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateEventDescriptions({ prompt: aiPrompt });
        if (result) {
            setDescription(result.description);
            setFullDescription(result.fullDescription);
            toast({
                title: "Descriptions Generated!",
                description: "The AI has filled in the description fields for you.",
            });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: "Generation Failed",
            description: "Could not generate descriptions. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  };


  return (
    <form action={action} className="space-y-6">
        {formState.errors._form && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" name="name" defaultValue={event?.name} required />
            <FormErrors errors={formState.errors.name} />
        </div>
      
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
                {date && <input type="hidden" name="date" value={format(date, 'MMMM dd, yyyy')} />}
                 <FormErrors errors={formState.errors.date} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" placeholder="e.g., 2:00 PM - 7:00 PM" defaultValue={event?.time} required/>
                <FormErrors errors={formState.errors.time} />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="locationName">Location Name</Label>
            <Input id="locationName" name="locationName" placeholder="e.g., Goodyear Ballpark" defaultValue={event?.locationName} required/>
            <FormErrors errors={formState.errors.locationName} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="locationAddress">Location Address</Label>
            <Input id="locationAddress" name="locationAddress" placeholder="e.g., 1933 S Ballpark Way, Goodyear, AZ 85338" defaultValue={event?.locationAddress} required />
            <FormErrors errors={formState.errors.locationAddress} />
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={event?.category}>
                <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Dance">Dance</SelectItem>
                </SelectContent>
            </Select>
            <FormErrors errors={formState.errors.category} />
        </div>

        <div className="space-y-2 p-4 border rounded-lg bg-secondary/50">
            <Label htmlFor="ai-prompt">AI Description Generator</Label>
            <Textarea
                id="ai-prompt"
                placeholder="Provide a few details about the event, and let AI write the descriptions for you. e.g., A vibrant Vaisakhi Mela celebrating Punjabi culture with live Bhangra music, food stalls, and kids' activities."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescriptions} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Descriptions
            </Button>
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Short Description (for cards)</Label>
            <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <FormErrors errors={formState.errors.description} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description (for event page)</Label>
            <Textarea id="fullDescription" name="fullDescription" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={5} required />
            <FormErrors errors={formState.errors.fullDescription} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" defaultValue={event?.image || 'https://placehold.co/600x400.png'} required />
            <FormErrors errors={formState.errors.image} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            <SubmitButton type={type} />
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">Cancel</Button>
        </div>
    </form>
  );
}
