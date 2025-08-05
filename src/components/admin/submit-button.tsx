
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isEditing: boolean;
  createText?: string;
  updateText?: string;
}

export function SubmitButton({ isEditing, createText = "Create", updateText = "Update" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditing ? updateText : createText}
    </Button>
  );
}
