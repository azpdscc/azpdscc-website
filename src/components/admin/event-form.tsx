'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import type { Event } from '@/lib/types';
import type { FormState } from '@/app/admin/events/actions';
import { createEventAction, updateEventAction } from '@/app/admin/events/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateEventDescriptions } from '@/ai/flows/generate-event-descriptions-flow';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { ActionSubmitButton } from './submit-button';
import { useAuth } from '@/hooks/use-auth.tsx';

interface EventFormProps {
  event?: Event;
}

export function EventForm({ event }: EventFormProps) {
  const isEditing = !!event;
  const { user } = useAuth();
  const tokenRef = useRef<HTMLInputElement>(null);

  const actionToUse = isEditing && event ? updateEventAction.bind(null, event.id) : createEventAction;
  const initialState: FormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(actionToUse, initialState);

  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState(event?.description || '');
  const [fullDescription, setFullDescription] = useState(event?.fullDescription || '');
  const [name, setName] = useState(event?.name || '');
  const [date, setDate] = useState<Date | undefined>(event?.date ? new Date(event.date) : undefined);
  
  useEffect(() => {
    if (isEditing && event?.date) {
        setDate(new Date(event.date));
    }
    if (!event?.date && !isEditing) {
      setDate(new Date());
    }
  }, [event?.date, isEditing]);

  useEffect(() => {
    const setToken = async () => {
        if (user && tokenRef.current) {
            const token = await user.getIdToken();
            tokenRef.current.value = token;
        }
    }
    setToken();
  }, [user]);

  const handleGenerateDescriptions = async () => {
    if (!name) {
        alert("Please enter an event name first.");
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateEventDescriptions({ prompt: name });
        if (result) {
            setDescription(result.description);
            setFullDescription(result.fullDescription);
        }
    } catch (error) {
        console.error("Failed to generate descriptions:", error);
        alert("Failed to generate descriptions. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
        <input type="hidden" name="token" ref={tokenRef} />
        <div>
            <Label htmlFor="name">Event Name</Label>
            <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            {formState.errors?.name && <p className="text-destructive text-sm mt-1">{formState.errors.name.join(', ')}</p>}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="date">Event Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
                <input type="hidden" name="date" value={date ? date.toISOString() : ''} />
                {formState.errors?.date && <p className="text-destructive text-sm mt-1">{formState.errors.date.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" defaultValue={event?.time} placeholder="e.g., 5:00 PM - 10:00 PM" required />
                {formState.errors?.time && <p className="text-destructive text-sm mt-1">{formState.errors.time.join(', ')}</p>}
            </div>
        </div>

        <div className="space-y-2">
            <Label>AI-Powered Descriptions</Label>
            <p className="text-sm text-muted-foreground">Descriptions will be generated based on the Event Name.</p>
            <Button type="button" variant="secondary" onClick={handleGenerateDescriptions} disabled={isGenerating || !name}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Descriptions
            </Button>
        </div>

        <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required />
            {formState.errors?.description && <p className="text-destructive text-sm mt-1">{formState.errors.description.join(', ')}</p>}
        </div>
        
        <div>
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea id="fullDescription" name="fullDescription" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={5} required />
            {formState.errors?.fullDescription && <p className="text-destructive text-sm mt-1">{formState.errors.fullDescription.join(', ')}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="locationName">Location Name</Label>
                <Input id="locationName" name="locationName" defaultValue={event?.locationName} required />
                {formState.errors?.locationName && <p className="text-destructive text-sm mt-1">{formState.errors.locationName.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="locationAddress">Location Address</Label>
                <Input id="locationAddress" name="locationAddress" defaultValue={event?.locationAddress} required />
                {formState.errors?.locationAddress && <p className="text-destructive text-sm mt-1">{formState.errors.locationAddress.join(', ')}</p>}
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" defaultValue={event?.image || 'https://placehold.co/600x400.png'} required />
                {formState.errors?.image && <p className="text-destructive text-sm mt-1">{formState.errors.image.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={event?.category || 'Cultural'}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Dance">Dance</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.category && <p className="text-destructive text-sm mt-1">{formState.errors.category.join(', ')}</p>}
            </div>
        </div>

        {formState.errors?._form && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
            </Alert>
        )}

        <div className="flex items-center gap-4">
            <ActionSubmitButton isEditing={isEditing} disabled={!user} />
            <Button type="button" variant="outline" asChild>
                <Link href="/admin/events">Cancel</Link>
            </Button>
        </div>
    </form>
  );
}
