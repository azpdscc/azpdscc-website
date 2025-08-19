
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { sendVolunteerLetterAction } from '@/app/admin/volunteer-hours/actions';
import type { VolunteerHoursFormState } from '@/app/admin/volunteer-hours/actions';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertCircle, CalendarIcon, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Send Confirmation Letter
    </Button>
  );
}

export function VolunteerHoursForm() {
  const initialState: VolunteerHoursFormState = {};
  const [state, formAction] = useActionState(sendVolunteerLetterAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.errors?._form) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: state.errors._form.join(', '),
      });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="volunteerName">Volunteer's Name</Label>
          <Input id="volunteerName" name="volunteerName" required />
          {state.errors?.volunteerName && <p className="text-destructive text-sm mt-1">{state.errors.volunteerName.join(', ')}</p>}
        </div>
        <div>
          <Label htmlFor="volunteerEmail">Volunteer's Email</Label>
          <Input id="volunteerEmail" name="volunteerEmail" type="email" required />
          {state.errors?.volunteerEmail && <p className="text-destructive text-sm mt-1">{state.errors.volunteerEmail.join(', ')}</p>}
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" name="eventName" required placeholder="e.g., Vaisakhi Mela 2024" />
          {state.errors?.eventName && <p className="text-destructive text-sm mt-1">{state.errors.eventName.join(', ')}</p>}
        </div>
        <div>
          <Label htmlFor="hoursVolunteered">Total Hours</Label>
          <Input id="hoursVolunteered" name="hoursVolunteered" type="number" step="0.5" required />
          {state.errors?.hoursVolunteered && <p className="text-destructive text-sm mt-1">{state.errors.hoursVolunteered.join(', ')}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="dateOfService">Date of Service</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Input
              id="dateOfService"
              name="dateOfService"
              type="date"
              required
              className="block"
            />
          </PopoverTrigger>
        </Popover>
         {state.errors?.dateOfService && <p className="text-destructive text-sm mt-1">{state.errors.dateOfService.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="dutiesDescription">Duties Performed (Optional)</Label>
        <Textarea id="dutiesDescription" name="dutiesDescription" placeholder="e.g., Assisted with registration and guest services." />
        {state.errors?.dutiesDescription && <p className="text-destructive text-sm mt-1">{state.errors.dutiesDescription.join(', ')}</p>}
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton />
        <Button type="reset" variant="outline" onClick={() => formRef.current?.reset()}>
          Clear Form
        </Button>
      </div>
    </form>
  );
}
