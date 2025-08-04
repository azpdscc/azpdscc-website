
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { TeamMember } from '@/lib/types';
import { useRouter } from 'next/navigation';

const memberSchema = z.object({
  name: z.string().min(3, "Member name is required."),
  role: z.string().min(3, "Role is required."),
  bio: z.string().min(10, "Bio must be at least 10 characters long."),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface TeamMemberFormProps {
  type: 'Add' | 'Edit';
  member?: TeamMember;
  action: (data: any) => Promise<void>;
}

export function TeamMemberForm({ type, member, action }: TeamMemberFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name || '',
      role: member?.role || '',
      bio: member?.bio || '',
      image: member?.image || 'https://placehold.co/400x400.png',
    },
    mode: 'onBlur',
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<MemberFormValues> = async (data) => {
    try {
      const dataForAction = {
        ...data,
        image: data.image || 'https://placehold.co/400x400.png',
      };
      
      await action(dataForAction);
      
      toast({
        title: `Member ${type === 'Add' ? 'Added' : 'Updated'}`,
        description: `The team member has been successfully ${type === 'Add' ? 'added' : 'updated'}. Redirecting...`,
      });
      router.push('/admin/team');

    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error && (error as any).digest?.startsWith('NEXT_REDIRECT')) {
        return;
      }
      console.error("Form submission error:", error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: `Could not ${type.toLowerCase()} the member. Please try again.`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., Director" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea placeholder="A brief description of their role or contribution." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="image" render={({ field }) => (
          <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {type} Member
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
