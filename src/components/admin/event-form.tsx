
'use client';

import { useState } from 'react';
import type { Event } from '@/lib/types';
import type { EventFormState } from '@/app/admin/events/actions';
import { useActionState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import { SubmitButton } from './submit-button';

interface EventFormProps {
  event?: Event;
  formAction: (prevState: EventFormState, formData: FormData) => Promise<EventFormState>;
  initialState: EventFormState;
}

export function EventForm({ event, formAction, initialState }: EventFormProps) {
  const isEditing = !!event;
  const [formState, action] = useActionState(formAction, initialState);

  // Set initial date from event or leave undefined for new events
  const initialDate = event?.date ? parse(event.date, 'MMMM dd, yyyy', new Date()) : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);

  return (
    <form action={action} className="space-y-6">
      {/* Name and Slug */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" name="name" defaultValue={event?.name} />
          {formState.errors.name && <p className="text-sm text-destructive mt-1">{formState.errors.name[0]}</p>}
        </div>
        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" name="slug" defaultValue={event?.slug} />
           {formState.errors.slug && <p className="text-sm text-destructive mt-1">{formState.errors.slug[0]}</p>}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid md:grid-cols-2 gap-4">
         <div>
            <Label htmlFor="date">Date</Label>
            {/* Hidden input to pass date to the form action */}
            <Input id="date" name="date" value={date?.toISOString() ?? ''} className="hidden" readOnly />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
            {formState.errors.date && <p className="text-sm text-destructive mt-1">{formState.errors.date[0]}</p>}
         </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" defaultValue={event?.time} placeholder="e.g., 5:00 PM - 10:00 PM" />
          {formState.errors.time && <p className="text-sm text-destructive mt-1">{formState.errors.time[0]}</p>}
        </div>
      </div>

       {/* Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="locationName">Location Name</Label>
          <Input id="locationName" name="locationName" defaultValue={event?.locationName} placeholder="e.g., Goodyear Ballpark" />
          {formState.errors.locationName && <p className="text-sm text-destructive mt-1">{formState.errors.locationName[0]}</p>}
        </div>
        <div>
          <Label htmlFor="locationAddress">Location Address</Label>
          <Input id="locationAddress" name="locationAddress" defaultValue={event?.locationAddress} placeholder="e.g., 1933 S Ballpark Way, Goodyear, AZ 85338"/>
          {formState.errors.locationAddress && <p className="text-sm text-destructive mt-1">{formState.errors.locationAddress[0]}</p>}
        </div>
      </div>

       {/* Image and Category */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" defaultValue={event?.image} placeholder="https://..." />
          {formState.errors.image && <p className="text-sm text-destructive mt-1">{formState.errors.image[0]}</p>}
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
             {formState.errors.category && <p className="text-sm text-destructive mt-1">{formState.errors.category[0]}</p>}
        </div>
      </div>

       {/* Descriptions */}
      <div>
        <Label htmlFor="description">Short Description (for cards)</Label>
        <Textarea id="description" name="description" defaultValue={event?.description} rows={2} />
         {formState.errors.description && <p className="text-sm text-destructive mt-1">{formState.errors.description[0]}</p>}
      </div>
      <div>
        <Label htmlFor="fullDescription">Full Description (for event page)</Label>
        <Textarea id="fullDescription" name="fullDescription" defaultValue={event?.fullDescription} rows={6} />
         {formState.errors.fullDescription && <p className="text-sm text-destructive mt-1">{formState.errors.fullDescription[0]}</p>}
      </div>

      {formState.errors._form && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form[0]}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton isEditing={isEditing} />
        <Button variant="outline" asChild>
          <Link href="/admin/events">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
