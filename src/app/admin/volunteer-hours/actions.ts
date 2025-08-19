
'use server';

import { z } from 'zod';
import { sendVolunteerLetter } from '@/ai/flows/send-volunteer-letter-flow';
import { format } from 'date-fns';

export type VolunteerHoursFormState = {
  errors?: {
    volunteerName?: string[];
    volunteerEmail?: string[];
    eventName?: string[];
    dateOfService?: string[];
    hoursVolunteered?: string[];
    dutiesDescription?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};

const formSchema = z.object({
  volunteerName: z.string().min(2, "Volunteer's name is required."),
  volunteerEmail: z.string().email("A valid email is required."),
  eventName: z.string().min(3, "Event name is required."),
  dateOfService: z.coerce.date({ required_error: 'Please select the date of service.' }),
  hoursVolunteered: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Please enter a valid number of hours." }),
  dutiesDescription: z.string().max(300, "Description cannot exceed 300 characters.").optional(),
});

export async function sendVolunteerLetterAction(
  prevState: VolunteerHoursFormState,
  formData: FormData
): Promise<VolunteerHoursFormState> {
  
  const validatedFields = formSchema.safeParse({
    volunteerName: formData.get('volunteerName'),
    volunteerEmail: formData.get('volunteerEmail'),
    eventName: formData.get('eventName'),
    dateOfService: formData.get('dateOfService'),
    hoursVolunteered: formData.get('hoursVolunteered'),
    dutiesDescription: formData.get('dutiesDescription'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    
    const result = await sendVolunteerLetter({
      volunteerName: data.volunteerName,
      volunteerEmail: data.volunteerEmail,
      eventName: data.eventName,
      dateOfService: format(data.dateOfService, 'MMMM dd, yyyy'),
      hoursVolunteered: parseFloat(data.hoursVolunteered),
      dutiesDescription: data.dutiesDescription,
    });
    
    if (result.success) {
        return { success: true, message: result.message };
    } else {
        return { errors: { _form: [result.message] } };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
    return {
      errors: {
        _form: ['Failed to send letter.', message],
      },
    };
  }
}
